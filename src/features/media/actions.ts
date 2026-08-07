"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { media } from "@/db/schema";
import { unggahKeR2, hapusDariR2 } from "@/lib/r2";
import { pastikanPengurus } from "@/features/auth/queries";
import { periksaBerkas, type FolderMedia } from "./validasi";

/**
 * Unggah satu berkas ke Cloudflare R2 dan catat di tabel media.
 *
 * Alur yang dijalankan setiap ada foto/PDF baru masuk:
 *   peramban (kompresi) → server action ini → R2 → catat link ke Neon.
 *
 * Kembaliannya bertipe hasil, bukan melempar error, supaya form pemanggil
 * (Fase 2) bisa menampilkan pesannya langsung ke pengurus desa.
 */
export type HasilUnggah =
  | { ok: true; url: string; id: string }
  | { ok: false; pesan: string };

export async function unggahMedia(
  berkas: File,
  folder: FolderMedia,
): Promise<HasilUnggah> {
  const akun = await pastikanPengurus();
  const periksa = periksaBerkas(berkas.type, berkas.size);
  if (!periksa.ok) return { ok: false, pesan: periksa.pesan };

  // Nama objek dibuat acak, bukan memakai nama asli berkas. Nama dari HP sering
  // mengandung spasi dan huruf yang menyulitkan di URL, dan dua orang bisa
  // mengunggah "foto.jpg" yang berbeda. Nama asli tetap disimpan di kolom
  // namaBerkas untuk ditampilkan di pustaka media.
  const kunci = `${folder}/${randomUUID()}.${periksa.ekstensi}`;
  const data = Buffer.from(await berkas.arrayBuffer());

  try {
    await unggahKeR2(kunci, data, berkas.type);
  } catch (e) {
    console.error("Gagal unggah ke R2:", e);
    return {
      ok: false,
      pesan: "Berkas gagal diunggah. Coba lagi sebentar.",
    };
  }

  // Alamat yang disimpan adalah jalur di website ini (disajikan oleh
  // app/media/[...kunci]/route.ts), BUKAN URL publik r2.dev — supaya peramban
  // memuatnya dari origin yang sertifikatnya valid. Byte fotonya tetap di R2.
  const url = `/media/${kunci}`;

  // Catat ke Neon SETELAH objek benar-benar ada di R2. Kalau pencatatan ini
  // gagal, objeknya sudah telanjur naik — hapus lagi supaya tidak jadi berkas
  // yatim yang diam-diam memakan kuota. Driver neon-http tidak punya transaksi
  // (lihat src/lib/db.ts), jadi urutan dan pembersihan ini ditangani manual.
  try {
    const [baris] = await db
      .insert(media)
      .values({
        url,
        kunciObjek: kunci,
        namaBerkas: berkas.name || kunci,
        ukuranByte: berkas.size,
        tipe: berkas.type,
        diunggahOlehId: akun?.id ?? null,
      })
      .returning({ id: media.id });

    return { ok: true, url, id: baris.id };
  } catch (e) {
    console.error("Gagal mencatat media, membatalkan unggahan:", e);
    await hapusDariR2(kunci).catch((e2) =>
      // Kalau pembersihan pun gagal, catat supaya bisa dibereskan manual.
      // Tidak dilempar ulang: pemanggil sudah menerima kegagalan.
      console.error("Objek yatim tertinggal di R2:", kunci, e2),
    );
    return { ok: false, pesan: "Berkas gagal disimpan. Coba lagi sebentar." };
  }
}

/**
 * Hapus satu media: objeknya dari R2, catatannya dari Neon.
 *
 * R2 dihapus lebih dulu. Kalau ini gagal, catatan Neon sengaja dibiarkan
 * supaya media tidak "hilang" dari pustaka padahal objeknya masih memakan
 * kuota — pengurus desa harus tetap melihatnya untuk mencoba menghapus lagi.
 */
export async function hapusMedia(id: string): Promise<HasilUnggah> {
  await pastikanPengurus();
  const [baris] = await db
    .select({ kunci: media.kunciObjek, url: media.url })
    .from(media)
    .where(eq(media.id, id))
    .limit(1);

  if (!baris) return { ok: false, pesan: "Berkas tidak ditemukan." };

  try {
    await hapusDariR2(baris.kunci);
  } catch (e) {
    console.error("Gagal menghapus objek R2:", baris.kunci, e);
    return { ok: false, pesan: "Berkas gagal dihapus. Coba lagi sebentar." };
  }

  await db.delete(media).where(eq(media.id, id));
  return { ok: true, url: baris.url, id };
}
