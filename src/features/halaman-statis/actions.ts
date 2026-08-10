"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { halamanStatis } from "@/db/schema";
import { bersihkanHtml } from "@/lib/sanitasi";
import { SLUG_HALAMAN } from "./halaman";
import { gabungkanNaskahSejarah } from "./naskah-sejarah";
import { punyaIsiHtml } from "./visi-misi-html";
import { pastikanPengurus } from "@/features/auth/queries";

export type HasilSimpan = { ok: boolean; pesan: string };

/**
 * Menyimpan dokumen HTML Visi dan Misi dari editor teks kaya.
 *
 * Keduanya dibersihkan sebelum masuk database. Nilai kosong dari Tiptap dapat
 * berbentuk <p></p>, sehingga perlu dinormalkan menjadi string kosong.
 */
export async function simpanVisiMisi(
  _sebelumnya: HasilSimpan | null,
  formData: FormData,
): Promise<HasilSimpan> {
  await pastikanPengurus();
  try {
    const visiMentah = ((formData.get("visi") as string) ?? "").trim();
    const misiMentah = ((formData.get("misi") as string) ?? "").trim();
    const visiAman = bersihkanHtml(visiMentah);
    const misiAman = bersihkanHtml(misiMentah);
    const visi = punyaIsiHtml(visiAman) ? visiAman : "";
    const isiMisi = punyaIsiHtml(misiAman) ? misiAman : "";

    const tulisVisi = db
      .insert(halamanStatis)
      .values({ slug: SLUG_HALAMAN.visi, judul: "Visi Desa", konten: visi })
      .onConflictDoUpdate({
        target: halamanStatis.slug,
        set: { konten: visi, diperbaruiPada: new Date() },
      });

    const tulisMisi = db
      .insert(halamanStatis)
      .values({
        slug: SLUG_HALAMAN.misi,
        judul: "Misi Desa",
        konten: isiMisi,
      })
      .onConflictDoUpdate({
        target: halamanStatis.slug,
        set: { konten: isiMisi, diperbaruiPada: new Date() },
      });

    // Batch memastikan Visi dan Misi selalu tersimpan sebagai satu perubahan.
    await db.batch([tulisVisi, tulisMisi]);

    revalidatePath("/profil");
    revalidatePath("/admin/visi-misi");
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

