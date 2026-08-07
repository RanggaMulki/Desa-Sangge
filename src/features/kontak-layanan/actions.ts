"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { kontakLayanan } from "@/db/schema";
import { JENIS_KONTAK, type JenisKontak } from "./jenis";
import { pastikanPengurus } from "@/features/auth/queries";

export type HasilKontak = { ok: boolean; pesan: string };

function teks(formData: FormData, nama: string): string {
  const nilai = formData.get(nama);
  return typeof nilai === "string" ? nilai.trim() : "";
}

/**
 * Merapikan nomor WA ke format simpanan 62xxx tanpa tanda baca.
 *
 * Pengurus desa boleh menulis 0812-3456-7890, +62 812..., atau 62812...;
 * semuanya jadi 62812... — format yang dipakai tautan wa.me di halaman
 * publik. Mengembalikan null untuk kosong, atau undefined kalau bentuknya
 * tidak bisa dikenali sebagai nomor telepon.
 */
function rapikanNomorWa(mentah: string): string | null | undefined {
  if (!mentah) return null;
  const digit = mentah.replace(/[^\d]/g, "");
  if (digit.length < 9 || digit.length > 15) return undefined;
  if (digit.startsWith("62")) return digit;
  if (digit.startsWith("0")) return `62${digit.slice(1)}`;
  return undefined;
}

/** Kontak tampil di footer semua halaman, jadi seluruh layout disegarkan. */
function segarkan() {
  revalidatePath("/", "layout");
}

export async function simpanKontak(
  _sebelumnya: HasilKontak | null,
  formData: FormData,
): Promise<HasilKontak> {
  await pastikanPengurus();
  const id = teks(formData, "id") || null;
  const namaLayanan = teks(formData, "namaLayanan");
  const jenis = teks(formData, "jenis") as JenisKontak;
  const namaPetugas = teks(formData, "namaPetugas") || null;
  const jamLayanan = teks(formData, "jamLayanan") || null;
  const aktif = formData.get("aktif") === "ya";

  if (namaLayanan.length < 3) {
    return { ok: false, pesan: "Nama layanan belum diisi. Tulis dulu nama layanannya." };
  }
  if (!JENIS_KONTAK.some((j) => j.kode === jenis)) {
    return { ok: false, pesan: "Pilih dulu jenis layanannya." };
  }

  const nomorWa = rapikanNomorWa(teks(formData, "nomorWa"));
  if (nomorWa === undefined) {
    return {
      ok: false,
      pesan:
        "Nomor WhatsApp tidak terbaca. Tulis seperti 0812xxxxxxx atau 62812xxxxxxx.",
    };
  }

  const nilai = { namaLayanan, jenis, namaPetugas, nomorWa, jamLayanan, aktif };

  try {
    if (id) {
      const [ada] = await db
        .update(kontakLayanan)
        .set(nilai)
        .where(eq(kontakLayanan.id, id))
        .returning({ id: kontakLayanan.id });
      if (!ada) {
        return { ok: false, pesan: "Kontak tidak ditemukan. Kembali ke daftar lalu pilih lagi." };
      }
    } else {
      await db.insert(kontakLayanan).values(nilai);
    }
  } catch (error) {
    console.error("Gagal menyimpan kontak:", error);
    return { ok: false, pesan: "Kontak belum tersimpan. Coba lagi sebentar." };
  }

  segarkan();
  redirect(`/admin/kontak?hasil=${id ? "ubah" : "tambah"}`);
}

export async function hapusKontak(id: string): Promise<HasilKontak> {
  await pastikanPengurus();
  try {
    await db.delete(kontakLayanan).where(eq(kontakLayanan.id, id));
  } catch (error) {
    console.error("Gagal menghapus kontak:", error);
    return { ok: false, pesan: "Kontak belum terhapus. Coba lagi sebentar." };
  }

  segarkan();
  return { ok: true, pesan: "Kontak dihapus." };
}
