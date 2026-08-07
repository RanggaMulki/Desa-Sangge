"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { agenda } from "@/db/schema";
import { pastikanPengurus } from "@/features/auth/queries";

export type HasilAgenda = { ok: boolean; pesan: string };

function teks(formData: FormData, nama: string): string {
  const nilai = formData.get(nama);
  return typeof nilai === "string" ? nilai.trim() : "";
}

/** Tanggal dari <input type="date"> selalu YYYY-MM-DD; selain itu tolak. */
function tanggalSah(nilai: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(nilai) && !Number.isNaN(Date.parse(nilai));
}

function segarkan() {
  revalidatePath("/");
  revalidatePath("/agenda");
  revalidatePath("/admin");
  revalidatePath("/admin/agenda");
}

/**
 * Tambah atau ubah satu kegiatan. Ada `id` berarti mengubah.
 *
 * Berhasil = redirect ke daftar dengan penanda ?hasil, supaya URL form
 * yang lama (?ubah=...) tidak tertinggal dan tombol muat-ulang aman.
 * Gagal = kembalikan pesan untuk ditampilkan di dekat form.
 */
export async function simpanAgenda(
  _sebelumnya: HasilAgenda | null,
  formData: FormData,
): Promise<HasilAgenda> {
  await pastikanPengurus();
  const id = teks(formData, "id") || null;
  const judul = teks(formData, "judul");
  const tanggalMulai = teks(formData, "tanggalMulai");
  const tanggalSelesai = teks(formData, "tanggalSelesai") || null;
  const lokasi = teks(formData, "lokasi") || null;
  const keterangan = teks(formData, "keterangan") || null;

  if (judul.length < 3) {
    return { ok: false, pesan: "Nama kegiatan belum diisi. Tulis dulu nama kegiatannya." };
  }
  if (judul.length > 200) {
    return { ok: false, pesan: "Nama kegiatan terlalu panjang (paling banyak 200 huruf)." };
  }
  if (!tanggalSah(tanggalMulai)) {
    return { ok: false, pesan: "Tanggal kegiatan belum dipilih." };
  }
  if (tanggalSelesai && !tanggalSah(tanggalSelesai)) {
    return { ok: false, pesan: "Tanggal selesai tidak terbaca. Pilih ulang tanggalnya." };
  }
  if (tanggalSelesai && tanggalSelesai < tanggalMulai) {
    return {
      ok: false,
      pesan: "Tanggal selesai lebih awal dari tanggal mulai. Tukar atau perbaiki dulu.",
    };
  }

  const nilai = { judul, tanggalMulai, tanggalSelesai, lokasi, keterangan };

  try {
    if (id) {
      const [ada] = await db
        .update(agenda)
        .set(nilai)
        .where(eq(agenda.id, id))
        .returning({ id: agenda.id });
      if (!ada) {
        return { ok: false, pesan: "Kegiatan tidak ditemukan. Kembali ke daftar lalu pilih lagi." };
      }
    } else {
      await db.insert(agenda).values(nilai);
    }
  } catch (error) {
    console.error("Gagal menyimpan agenda:", error);
    return { ok: false, pesan: "Kegiatan belum tersimpan. Coba lagi sebentar." };
  }

  segarkan();
  redirect(`/admin/agenda?hasil=${id ? "ubah" : "tambah"}`);
}

export async function hapusAgenda(id: string): Promise<HasilAgenda> {
  await pastikanPengurus();
  try {
    await db.delete(agenda).where(eq(agenda.id, id));
  } catch (error) {
    console.error("Gagal menghapus agenda:", error);
    return { ok: false, pesan: "Kegiatan belum terhapus. Coba lagi sebentar." };
  }

  segarkan();
  return { ok: true, pesan: "Kegiatan dihapus." };
}
