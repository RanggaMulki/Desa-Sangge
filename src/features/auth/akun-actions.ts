"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { pengguna } from "@/db/schema";
import { pastikanPengurus } from "./queries";
import { skemaGantiKataSandi, skemaTambahAkun } from "./validasi";

export type HasilAkun = { ok: boolean; pesan: string };

const RONDE_HASH = 12;

/**
 * Menambah akun pengurus baru.
 *
 * Nama pengguna diseragamkan ke huruf kecil (login juga lowercase) dan wajib
 * unik. Keunikan dijaga dua lapis: cek dulu + tangkap galat constraint unik
 * database bila ada dua penambahan bersamaan (balapan).
 */
export async function tambahAkun(
  _sebelumnya: HasilAkun | null,
  formData: FormData,
): Promise<HasilAkun> {
  await pastikanPengurus();

  const hasil = skemaTambahAkun.safeParse({
    nama: formData.get("nama"),
    namaPengguna: formData.get("namaPengguna"),
    kataSandi: formData.get("kataSandi"),
  });
  if (!hasil.success) {
    return { ok: false, pesan: hasil.error.issues[0]?.message ?? "Data belum lengkap." };
  }

  const namaPengguna = hasil.data.namaPengguna.toLowerCase();

  const [ada] = await db
    .select({ id: pengguna.id })
    .from(pengguna)
    .where(eq(pengguna.email, namaPengguna))
    .limit(1);
  if (ada) {
    return {
      ok: false,
      pesan: `Nama pengguna "${namaPengguna}" sudah dipakai. Pilih yang lain.`,
    };
  }

  try {
    const kataSandiHash = await bcrypt.hash(hasil.data.kataSandi, RONDE_HASH);
    await db.insert(pengguna).values({
      nama: hasil.data.nama,
      email: namaPengguna,
      kataSandiHash,
    });
  } catch (e) {
    console.error("Gagal menambah akun:", e);
    return {
      ok: false,
      pesan: "Gagal membuat akun. Nama pengguna mungkin sudah dipakai.",
    };
  }

  revalidatePath("/admin/akun");
  return {
    ok: true,
    pesan: `Akun "${namaPengguna}" dibuat. Bisa langsung dipakai masuk.`,
  };
}

/**
 * Reset kata sandi akun LAIN (admin mereset admin) — inti pemulihan "lupa
 * password" tanpa email: masuk dengan akun cadangan, lalu reset yang lupa.
 */
export async function resetKataSandi(
  _sebelumnya: HasilAkun | null,
  formData: FormData,
): Promise<HasilAkun> {
  await pastikanPengurus();

  const id = String(formData.get("id") ?? "").trim();
  const kataSandiBaru = String(formData.get("kataSandiBaru") ?? "");

  if (!id) return { ok: false, pesan: "Akun tidak dikenali. Muat ulang halaman." };
  if (kataSandiBaru.length < 8) {
    return { ok: false, pesan: "Kata sandi baru minimal 8 huruf atau angka." };
  }

  const [target] = await db
    .select({ id: pengguna.id, namaPengguna: pengguna.email })
    .from(pengguna)
    .where(eq(pengguna.id, id))
    .limit(1);
  if (!target) return { ok: false, pesan: "Akun tidak ditemukan." };

  try {
    const kataSandiHash = await bcrypt.hash(kataSandiBaru, RONDE_HASH);
    await db
      .update(pengguna)
      .set({ kataSandiHash })
      .where(eq(pengguna.id, id));
  } catch (e) {
    console.error("Gagal reset kata sandi:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }

  revalidatePath("/admin/akun");
  return {
    ok: true,
    pesan: `Kata sandi "${target.namaPengguna}" berhasil direset.`,
  };
}

/**
 * Mengganti kata sandi AKUN SENDIRI. Wajib memasukkan kata sandi lama yang
 * dicocokkan dengan hash tersimpan supaya orang yang menumpang sesi tidak bisa
 * mengambil alih akun tanpa tahu sandi lamanya.
 */
export async function gantiKataSandiSendiri(
  _sebelumnya: HasilAkun | null,
  formData: FormData,
): Promise<HasilAkun> {
  const akun = await pastikanPengurus();

  const hasil = skemaGantiKataSandi.safeParse({
    kataSandiLama: formData.get("kataSandiLama"),
    kataSandiBaru: formData.get("kataSandiBaru"),
    ulangiKataSandi: formData.get("ulangiKataSandi"),
  });
  if (!hasil.success) {
    return { ok: false, pesan: hasil.error.issues[0]?.message ?? "Data belum lengkap." };
  }

  const [baris] = await db
    .select({ hash: pengguna.kataSandiHash })
    .from(pengguna)
    .where(eq(pengguna.id, akun.id))
    .limit(1);
  if (!baris) return { ok: false, pesan: "Akun tidak ditemukan." };

  const cocok = await bcrypt.compare(hasil.data.kataSandiLama, baris.hash);
  if (!cocok) return { ok: false, pesan: "Kata sandi lama salah. Coba lagi." };

  try {
    const kataSandiHash = await bcrypt.hash(hasil.data.kataSandiBaru, RONDE_HASH);
    await db
      .update(pengguna)
      .set({ kataSandiHash })
      .where(eq(pengguna.id, akun.id));
  } catch (e) {
    console.error("Gagal ganti kata sandi sendiri:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }

  return { ok: true, pesan: "Kata sandi kamu berhasil diganti." };
}

/**
 * Mengaktifkan/menonaktifkan akun.
 *
 * Akun nonaktif langsung kehilangan akses (login menolak + layout mengusir).
 * Dua pengaman: tidak boleh menonaktifkan akun sendiri (agar tidak mengunci
 * diri di tengah sesi), dan akun yang sedang login selalu aktif — jadi selalu
 * tersisa minimal satu akun aktif.
 */
export async function ubahAktifAkun(
  _sebelumnya: HasilAkun | null,
  formData: FormData,
): Promise<HasilAkun> {
  const akun = await pastikanPengurus();

  const id = String(formData.get("id") ?? "").trim();
  const jadikanAktif = String(formData.get("aktif") ?? "") === "true";

  if (!id) return { ok: false, pesan: "Akun tidak dikenali. Muat ulang halaman." };
  if (!jadikanAktif && id === akun.id) {
    return { ok: false, pesan: "Tidak bisa menonaktifkan akun sendiri." };
  }

  const [target] = await db
    .select({ id: pengguna.id, namaPengguna: pengguna.email })
    .from(pengguna)
    .where(eq(pengguna.id, id))
    .limit(1);
  if (!target) return { ok: false, pesan: "Akun tidak ditemukan." };

  try {
    await db
      .update(pengguna)
      .set({ aktif: jadikanAktif })
      .where(eq(pengguna.id, id));
  } catch (e) {
    console.error("Gagal mengubah status akun:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }

  revalidatePath("/admin/akun");
  return {
    ok: true,
    pesan: jadikanAktif
      ? `Akun "${target.namaPengguna}" diaktifkan.`
      : `Akun "${target.namaPengguna}" dinonaktifkan.`,
  };
}
