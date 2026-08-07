"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { halamanStatis, media, misi, pengaturan } from "@/db/schema";
import { bersihkanHtml } from "@/lib/sanitasi";
import { KUNCI_FOTO_SAMBUTAN, SLUG_HALAMAN } from "./halaman";
import { gabungkanNaskahSejarah } from "./naskah-sejarah";
import { pastikanPengurus } from "@/features/auth/queries";
import { hapusMedia, unggahMedia } from "@/features/media/actions";

export type HasilSimpan = { ok: boolean; pesan: string };

/**
 * Menyimpan visi (satu pernyataan) dan misi (satu baris = satu butir).
 *
 * Misi ditulis di satu kotak, satu butir per baris — cara paling ringan bagi
 * pengurus desa, tanpa tombol tambah/hapus baris yang membingungkan. Saat
 * disimpan, seluruh butir misi lama diganti dengan daftar baru; misi tidak
 * dirujuk tabel lain sehingga aman menghapus dan menulis ulang.
 */
export async function simpanVisiMisi(
  _sebelumnya: HasilSimpan | null,
  formData: FormData,
): Promise<HasilSimpan> {
  await pastikanPengurus();
  try {
    const visi = ((formData.get("visi") as string) ?? "").trim();
    const butir = ((formData.get("misi") as string) ?? "")
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    // Visi: satu baris, ditulis sebagai upsert. Slug "visi" unik, jadi tak
    // perlu cek-dulu-baru-tulis (yang rawan: dua penyimpanan bersamaan bisa
    // sama-sama melihat "belum ada" lalu dua-duanya insert → bentrok unik).
    const tulisVisi = db
      .insert(halamanStatis)
      .values({ slug: SLUG_HALAMAN.visi, judul: "Visi Desa", konten: visi })
      .onConflictDoUpdate({
        target: halamanStatis.slug,
        set: { konten: visi, diperbaruiPada: new Date() },
      });

    // Misi: ganti seluruh daftar. Hapus + tulis dibungkus batch bersama upsert
    // visi supaya SEMUANYA satu transaksi — kalau gagal di tengah, daftar misi
    // lama tidak akan hilang tanpa pengganti (neon-http tak punya transaksi
    // biasa; db.batch yang menyediakannya).
    if (butir.length > 0) {
      await db.batch([
        tulisVisi,
        db.delete(misi),
        db.insert(misi).values(
          butir.map((teks, i) => ({ teks, urutan: i + 1 })),
        ),
      ]);
    } else {
      await db.batch([tulisVisi, db.delete(misi)]);
    }

    revalidatePath("/profil");
    return { ok: true, pesan: "Visi & misi tersimpan." };
  } catch (e) {
    console.error("Gagal menyimpan visi & misi:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }
}

/**
 * Menyimpan naskah Sejarah dan Legenda Desa.
 *
 * HTML dari editor disaring dulu dengan penyaring yang sama dengan yang
 * dipakai saat menampilkan (bersihkanHtml) — lapisan kedua, bukan satu-satunya,
 * supaya yang tersimpan di database pun sudah bersih.
 */
export async function simpanSejarah(
  _sebelumnya: HasilSimpan | null,
  formData: FormData,
): Promise<HasilSimpan> {
  await pastikanPengurus();
  const sejarahMentah = ((formData.get("sejarah") as string) ?? "").trim();
  const legendaMentah = ((formData.get("legenda") as string) ?? "").trim();
  const sejarah = bersihkanHtml(sejarahMentah);
  const legenda = bersihkanHtml(legendaMentah);
  const teksSejarah = sejarah
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (teksSejarah.length < 20) {
    return {
      ok: false,
      pesan:
        "Naskah sejarah masih kosong atau terlalu pendek. Tulis dulu ceritanya.",
    };
  }

  const konten = gabungkanNaskahSejarah({ sejarah, legenda });

  try {
    // Upsert, bukan cek-dulu-baru-tulis: slug "sejarah" unik, jadi satu
    // perintah ini aman dari balapan dua penyimpanan bersamaan (yang bisa
    // bikin dua insert bentrok) sekaligus menghemat satu perjalanan ke Neon.
    await db
      .insert(halamanStatis)
      .values({
        slug: SLUG_HALAMAN.sejarah,
        judul: "Sejarah dan Legenda Desa Sangge",
        konten,
      })
      .onConflictDoUpdate({
        target: halamanStatis.slug,
        set: { konten, diperbaruiPada: new Date() },
      });

    revalidatePath("/profil");
    revalidatePath("/admin/sejarah");
    return {
      ok: true,
      pesan: "Sejarah dan legenda tersimpan dan tampil di halaman Profil.",
    };
  } catch (e) {
    console.error("Gagal menyimpan sejarah:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }
}

/**
 * Menyimpan naskah Sambutan Kepala Desa yang tampil di beranda.
 *
 * BOLEH dikosongkan — dan itu disengaja: naskah kosong menyembunyikan kutipan
 * sambutan di beranda (kartu Kepala Desa tetap tampil), jadi pengurus bisa
 * menurunkan sambutan cukup dengan mengosongkan isinya, tanpa perlu tombol
 * hapus tersendiri.
 */
export async function simpanSambutan(
  _sebelumnya: HasilSimpan | null,
  formData: FormData,
): Promise<HasilSimpan> {
  await pastikanPengurus();
  const mentah = ((formData.get("konten") as string) ?? "").trim();
  const teksSaja = mentah
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  // Editor kosong mengirim "<p></p>"; perlakukan sebagai kosong betulan.
  const konten = teksSaja.length === 0 ? "" : bersihkanHtml(mentah);

  try {
    // Upsert: slug "sambutan" unik, jadi satu perintah ini aman dari balapan
    // dua penyimpanan bersamaan sekaligus menghemat satu perjalanan ke Neon.
    await db
      .insert(halamanStatis)
      .values({
        slug: SLUG_HALAMAN.sambutan,
        judul: "Sambutan Kepala Desa",
        konten,
      })
      .onConflictDoUpdate({
        target: halamanStatis.slug,
        set: { konten, diperbaruiPada: new Date() },
      });

    revalidatePath("/");
    revalidatePath("/admin/sambutan");
    return {
      ok: true,
      pesan:
        konten === ""
          ? "Sambutan dikosongkan. Kutipannya disembunyikan dari beranda."
          : "Sambutan tersimpan dan tampil di beranda.",
    };
  } catch (e) {
    console.error("Gagal menyimpan sambutan:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }
}

export type HasilFotoSambutan =
  | { ok: true; url: string | null; pesan: string }
  | { ok: false; pesan: string };

/**
 * Menghapus satu berkas media berdasarkan link-nya (kolom url).
 *
 * Foto lama yang diganti/dihapus dibersihkan dari R2 + registri media supaya
 * tidak jadi berkas yatim yang diam-diam memakan kuota. Foto bawaan yang bukan
 * hasil unggahan (link-nya bukan /media/…) tidak punya catatan media dan
 * dilewati — pola yang sama dengan hapusFotoGaleri.
 */
async function bersihkanFotoLama(url: string | null) {
  if (!url || !url.startsWith("/media/")) return;
  const [rekam] = await db
    .select({ id: media.id })
    .from(media)
    .where(eq(media.url, url))
    .limit(1);
  if (!rekam) return;
  const hasil = await hapusMedia(rekam.id);
  if (!hasil.ok) {
    console.error("Foto sambutan lama gagal dibersihkan:", rekam.id, hasil.pesan);
  }
}

/**
 * Mengunggah foto khusus seksi Sambutan.
 *
 * Foto disimpan di R2 (lewat unggahMedia) dan link-nya dicatat di tabel
 * `pengaturan` (kunci "sambutan.foto"), bukan kolom baru di halaman_statis —
 * jadi tidak perlu migrasi. Byte fotonya sudah dikecilkan di peramban sebelum
 * sampai ke sini. Foto lama, kalau ada, dibersihkan setelah yang baru tercatat.
 */
export async function simpanFotoSambutan(
  formData: FormData,
): Promise<HasilFotoSambutan> {
  await pastikanPengurus();
  const berkas = formData.get("foto");
  if (!(berkas instanceof File) || berkas.size === 0) {
    return { ok: false, pesan: "Foto tidak terbaca. Coba pilih ulang." };
  }

  const unggah = await unggahMedia(berkas, "sambutan");
  if (!unggah.ok) return { ok: false, pesan: unggah.pesan };

  const [lama] = await db
    .select({ nilai: pengaturan.nilai })
    .from(pengaturan)
    .where(eq(pengaturan.kunci, KUNCI_FOTO_SAMBUTAN))
    .limit(1);

  try {
    await db
      .insert(pengaturan)
      .values({ kunci: KUNCI_FOTO_SAMBUTAN, nilai: unggah.url })
      .onConflictDoUpdate({
        target: pengaturan.kunci,
        set: { nilai: unggah.url },
      });
  } catch (e) {
    console.error("Gagal mencatat foto sambutan:", e);
    // Foto telanjur di R2 tapi gagal dicatat — hapus lagi supaya tidak yatim.
    await bersihkanFotoLama(unggah.url);
    return { ok: false, pesan: "Foto gagal disimpan. Coba lagi sebentar." };
  }

  if (lama?.nilai && lama.nilai !== unggah.url) {
    await bersihkanFotoLama(lama.nilai);
  }

  revalidatePath("/");
  revalidatePath("/admin/sambutan");
  return { ok: true, url: unggah.url, pesan: "Foto sambutan tersimpan." };
}

/**
 * Menghapus foto khusus sambutan; beranda kembali memakai foto Kepala Desa.
 */
export async function hapusFotoSambutan(): Promise<HasilFotoSambutan> {
  await pastikanPengurus();
  const [lama] = await db
    .select({ nilai: pengaturan.nilai })
    .from(pengaturan)
    .where(eq(pengaturan.kunci, KUNCI_FOTO_SAMBUTAN))
    .limit(1);

  await db.delete(pengaturan).where(eq(pengaturan.kunci, KUNCI_FOTO_SAMBUTAN));
  if (lama?.nilai) await bersihkanFotoLama(lama.nilai);

  revalidatePath("/");
  revalidatePath("/admin/sambutan");
  return {
    ok: true,
    url: null,
    pesan: "Foto khusus dihapus. Beranda kembali memakai foto Kepala Desa.",
  };
}
