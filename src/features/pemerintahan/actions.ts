"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { media, perangkatDesa } from "@/db/schema";
import { hapusDariR2 } from "@/lib/r2";
import { unggahMedia } from "@/features/media/actions";
import { slotTerurut } from "./struktur";
import { pastikanPengurus } from "@/features/auth/queries";

export type HasilSimpan = { ok: boolean; pesan: string };
export type HasilFoto = { ok: boolean; url?: string; pesan: string };

/**
 * Menyimpan nama perangkat untuk tiap slot tetap di bagan.
 *
 * Struktur/jabatan tidak diubah dari sini — hanya nama pengisi tiap `posisi`.
 * Baris dicocokkan lewat `posisi`: kalau sudah ada, namanya diperbarui; kalau
 * belum (mis. database baru tanpa data contoh), barisnya dibuat. Nama kosong
 * dibiarkan kosong, berarti jabatan itu sedang tidak terisi — di bagan tampil
 * sebagai tanda hubung.
 *
 * `revalidatePath` dipanggil untuk halaman yang menampilkan bagan supaya
 * perubahan langsung terlihat, bukan menunggu ISR satu jam.
 */
export async function simpanNamaPerangkat(
  _sebelumnya: HasilSimpan | null,
  formData: FormData,
): Promise<HasilSimpan> {
  await pastikanPengurus();
  try {
    for (const slot of slotTerurut()) {
      const nama = ((formData.get(`nama-${slot.kunci}`) as string) ?? "").trim();

      const [ada] = await db
        .select({ id: perangkatDesa.id })
        .from(perangkatDesa)
        .where(
          and(
            eq(perangkatDesa.posisi, slot.kunci),
            eq(perangkatDesa.aktif, true),
          ),
        )
        .limit(1);

      if (ada) {
        await db
          .update(perangkatDesa)
          .set({ nama })
          .where(eq(perangkatDesa.id, ada.id));
      } else if (nama) {
        // Hanya buat baris baru kalau namanya diisi — jangan menaburi baris
        // kosong untuk jabatan yang memang belum ada orangnya.
        await db.insert(perangkatDesa).values({
          posisi: slot.kunci,
          jabatan: slot.jabatan,
          nama,
          urutan: slot.urutan,
        });
      }
    }

    revalidatePath("/profil");
    revalidatePath("/profil/pemerintahan");
    return { ok: true, pesan: "Perubahan tersimpan." };
  } catch (e) {
    console.error("Gagal menyimpan nama perangkat:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }
}

/**
 * Menyimpan foto satu jabatan: foto naik ke R2, hanya link-nya yang masuk Neon.
 *
 * Alurnya: peramban mengecilkan foto → dikirim ke sini → `unggahMedia` menaruh
 * berkasnya di R2 dan mencatat di tabel media → link R2-nya disimpan ke kolom
 * `fotoUrl` perangkat. Byte fotonya tidak pernah masuk database.
 *
 * Saat mengganti foto, foto lama dihapus dari R2 supaya tidak menumpuk jadi
 * berkas yatim yang memakan kuota. Foto baru diunggah lebih dulu; kalau itu
 * gagal, foto lama dibiarkan utuh.
 */
export async function simpanFotoPerangkat(
  formData: FormData,
): Promise<HasilFoto> {
  await pastikanPengurus();
  const posisi = ((formData.get("posisi") as string) ?? "").trim();
  const berkas = formData.get("foto");

  if (!posisi || !(berkas instanceof File) || berkas.size === 0) {
    return { ok: false, pesan: "Foto tidak terbaca. Coba pilih ulang." };
  }

  // 1. Naikkan foto baru ke R2 (+ catat di tabel media).
  const unggah = await unggahMedia(berkas, "perangkat");
  if (!unggah.ok) return { ok: false, pesan: unggah.pesan };

  try {
    const [ada] = await db
      .select({ id: perangkatDesa.id, fotoLama: perangkatDesa.fotoUrl })
      .from(perangkatDesa)
      .where(
        and(eq(perangkatDesa.posisi, posisi), eq(perangkatDesa.aktif, true)),
      )
      .limit(1);

    if (ada) {
      await db
        .update(perangkatDesa)
        .set({ fotoUrl: unggah.url })
        .where(eq(perangkatDesa.id, ada.id));
    } else {
      // Belum ada baris untuk jabatan ini (mis. database baru): buat dengan
      // foto terpasang, namanya menyusul lewat form nama.
      const slot = slotTerurut().find((s) => s.kunci === posisi);
      await db.insert(perangkatDesa).values({
        posisi,
        jabatan: slot?.jabatan ?? posisi,
        nama: "",
        fotoUrl: unggah.url,
        urutan: slot?.urutan ?? 0,
      });
    }

    // 2. Bersihkan foto lama dari R2 & pustaka media (kalau ada dan berbeda).
    const fotoLama = ada?.fotoLama;
    if (fotoLama && fotoLama !== unggah.url) {
      const [lama] = await db
        .select({ id: media.id, kunci: media.kunciObjek })
        .from(media)
        .where(eq(media.url, fotoLama))
        .limit(1);
      if (lama) {
        await hapusDariR2(lama.kunci).catch((e) =>
          console.error("Foto lama gagal dihapus dari R2:", lama.kunci, e),
        );
        await db.delete(media).where(eq(media.id, lama.id));
      }
    }

    revalidatePath("/profil");
    revalidatePath("/profil/pemerintahan");
    return { ok: true, url: unggah.url, pesan: "Foto tersimpan." };
  } catch (e) {
    console.error("Gagal menyimpan foto perangkat:", e);
    return { ok: false, pesan: "Foto terunggah tapi gagal disimpan. Coba lagi." };
  }
}

/**
 * Mengosongkan foto satu jabatan tanpa menghapus nama maupun susunan bagan.
 * Tautan dilepas dari perangkat lebih dulu agar halaman publik segera kembali
 * ke keadaan tanpa foto. Berkas R2 lama lalu dibersihkan bila tercatat di
 * pustaka media; kegagalan pembersihan tidak memasang kembali foto yang sudah
 * sengaja dihapus pengurus.
 */
export async function hapusFotoPerangkat(posisi: string): Promise<HasilFoto> {
  await pastikanPengurus();
  const posisiBersih = posisi.trim();
  const slotValid = slotTerurut().some((slot) => slot.kunci === posisiBersih);
  if (!slotValid) {
    return { ok: false, pesan: "Jabatan tidak dikenali. Muat ulang halaman." };
  }

  let fotoLama: string;
  try {
    const [ada] = await db
      .select({ id: perangkatDesa.id, fotoLama: perangkatDesa.fotoUrl })
      .from(perangkatDesa)
      .where(
        and(
          eq(perangkatDesa.posisi, posisiBersih),
          eq(perangkatDesa.aktif, true),
        ),
      )
      .limit(1);

    if (!ada?.fotoLama) {
      return { ok: true, pesan: "Foto sudah kosong." };
    }
    fotoLama = ada.fotoLama;

    await db
      .update(perangkatDesa)
      .set({ fotoUrl: null })
      .where(eq(perangkatDesa.id, ada.id));
  } catch (e) {
    console.error("Gagal menghapus foto perangkat:", e);
    return { ok: false, pesan: "Foto gagal dihapus. Coba lagi sebentar." };
  }

  try {
    const [lama] = await db
      .select({ id: media.id, kunci: media.kunciObjek })
      .from(media)
      .where(eq(media.url, fotoLama))
      .limit(1);
    if (lama) {
      await hapusDariR2(lama.kunci);
      await db.delete(media).where(eq(media.id, lama.id));
    }
  } catch (e) {
    console.error(
      "Foto perangkat sudah dilepas, tetapi berkas lama gagal dibersihkan:",
      fotoLama,
      e,
    );
  }

  revalidatePath("/profil");
  revalidatePath("/profil/pemerintahan");
  return { ok: true, pesan: "Foto dihapus." };
}
