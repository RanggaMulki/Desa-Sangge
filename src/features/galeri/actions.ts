"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { galeri, media } from "@/db/schema";
import { unggahMedia, hapusMedia } from "@/features/media/actions";
import { pastikanPengurus } from "@/features/auth/queries";

export type FotoGaleri = { id: string; judul: string; gambarUrl: string };

export type HasilGaleri =
  | { ok: true; pesan: string; foto?: FotoGaleri }
  | { ok: false; pesan: string };

/**
 * Tambah satu foto galeri.
 *
 * Alurnya sama dengan foto perangkat: byte fotonya naik ke Cloudflare R2 lewat
 * `unggahMedia`, dan yang disimpan ke Neon hanya LINK-nya (`/media/<kunci>`) —
 * bukan fotonya. Galeri sengaja cuma menyimpan nama kegiatan + link foto;
 * tanggal & deskripsi tidak diminta ke pengurus desa.
 *
 * `tanggal` diisi otomatis dengan tanggal unggah — tidak ditampilkan di mana
 * pun, hanya dipakai sebagai kunci urut supaya foto terbaru muncul paling atas.
 *
 * Nama kegiatan BOLEH kosong: pengurus desa sering ingin cepat mengunggah
 * dokumentasi dan menamainya belakangan. Yang kosong disimpan sebagai teks
 * kosong, dan halaman galeri tidak menampilkan bilah nama untuk foto itu.
 */
export async function tambahFotoGaleri(
  formData: FormData,
): Promise<HasilGaleri> {
  await pastikanPengurus();
  const nama = ((formData.get("nama") as string) ?? "").trim();
  const berkas = formData.get("foto");

  if (!(berkas instanceof File) || berkas.size === 0) {
    return { ok: false, pesan: "Foto tidak terbaca. Coba pilih ulang." };
  }

  // 1. Naikkan foto ke R2 (+ catat di tabel media).
  const unggah = await unggahMedia(berkas, "galeri");
  if (!unggah.ok) return { ok: false, pesan: unggah.pesan };

  // 2. Catat baris galeri (nama + link foto).
  try {
    const hariIni = new Date().toISOString().slice(0, 10);
    const [baris] = await db
      .insert(galeri)
      .values({ judul: nama, gambarUrl: unggah.url, tanggal: hariIni })
      .returning({ id: galeri.id });

    revalidatePath("/galeri");
    revalidatePath("/admin/galeri");
    return {
      ok: true,
      pesan: "Foto tersimpan.",
      foto: { id: baris.id, judul: nama, gambarUrl: unggah.url },
    };
  } catch (e) {
    // Baris galeri gagal dicatat padahal foto sudah telanjur di R2 — hapus lagi
    // supaya tidak jadi objek yatim yang memakan kuota.
    console.error("Gagal mencatat galeri, membatalkan unggahan:", e);
    await hapusMedia(unggah.id).catch((e2) =>
      console.error("Objek galeri yatim tertinggal:", unggah.id, e2),
    );
    return { ok: false, pesan: "Foto gagal disimpan. Coba lagi sebentar." };
  }
}

/**
 * Hapus satu foto galeri: barisnya dari Neon, dan objek + catatan medianya
 * dari R2 (dicari lewat link). Foto contoh bawaan yang bukan hasil unggahan
 * (link-nya bukan /media/…) tidak punya catatan media — barisnya saja yang
 * dihapus, dan itu memang benar.
 */
export async function hapusFotoGaleri(id: string): Promise<HasilGaleri> {
  await pastikanPengurus();
  const [baris] = await db
    .select({ gambarUrl: galeri.gambarUrl })
    .from(galeri)
    .where(eq(galeri.id, id))
    .limit(1);

  if (!baris) return { ok: false, pesan: "Foto tidak ditemukan." };

  const [rekam] = await db
    .select({ id: media.id })
    .from(media)
    .where(eq(media.url, baris.gambarUrl))
    .limit(1);
  if (rekam) {
    await hapusMedia(rekam.id).catch((e) =>
      console.error("Gagal menghapus objek galeri di R2:", rekam.id, e),
    );
  }

  await db.delete(galeri).where(eq(galeri.id, id));
  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
  return { ok: true, pesan: "Foto dihapus." };
}

/**
 * Ubah nama kegiatan sebuah foto galeri.
 *
 * Hanya menyentuh kolom `judul` — fotonya di R2 tidak diapa-apakan. Nama BOLEH
 * dikosongkan (disimpan sebagai teks kosong), sama seperti saat mengunggah;
 * halaman galeri tidak menampilkan bilah nama untuk foto tanpa judul.
 */
export async function ubahNamaGaleri(
  id: string,
  nama: string,
): Promise<HasilGaleri> {
  await pastikanPengurus();
  const bersih = nama.trim().slice(0, 200);

  const [baris] = await db
    .update(galeri)
    .set({ judul: bersih })
    .where(eq(galeri.id, id))
    .returning({
      id: galeri.id,
      judul: galeri.judul,
      gambarUrl: galeri.gambarUrl,
    });

  if (!baris) return { ok: false, pesan: "Foto tidak ditemukan." };

  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
  return { ok: true, pesan: "Nama foto diperbarui.", foto: baris };
}
