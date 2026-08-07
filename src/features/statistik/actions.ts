"use server";

import { eq, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { statistikDesa } from "@/db/schema";
import { ANGKA_DESA, KUNCI_ANGKA } from "./angka";
import { pastikanPengurus } from "@/features/auth/queries";

export type HasilSimpan = { ok: boolean; pesan: string };

/**
 * Menyimpan angka pokok desa.
 *
 * Nama metriknya TIDAK datang dari form — sudah pasti di `angka.ts`. Form hanya
 * mengirim angkanya (`n-<kunci>`) plus satu tahun untuk semuanya. Jadi mustahil
 * ada baris karangan atau salah ketik nama, dan halaman lain yang mencari angka
 * lewat `kunci` (mis. Peta Lokasi) tidak pernah kehilangan rujukannya.
 *
 * Semua angka diperiksa DULU sebelum satu pun ditulis, supaya tidak ada keadaan
 * "sebagian tersimpan tapi pesannya gagal".
 */
export async function simpanStatistik(
  _sebelumnya: HasilSimpan | null,
  formData: FormData,
): Promise<HasilSimpan> {
  await pastikanPengurus();
  // --- Tahap 1: baca & periksa, belum menulis apa pun ---
  const tahun = parseInt(
    ((formData.get("tahun") as string) ?? "").trim(),
    10,
  );
  if (Number.isNaN(tahun) || tahun < 1900 || tahun > 2100) {
    return { ok: false, pesan: "Tahun data tidak valid. Isi antara 1900–2100." };
  }

  const siap: {
    kunci: string;
    label: string;
    satuan: string;
    nilai: number;
    urutan: number;
  }[] = [];

  for (const [i, a] of ANGKA_DESA.entries()) {
    const mentah = ((formData.get(`n-${a.kunci}`) as string) ?? "")
      .replace(/\./g, "")
      .trim();
    if (mentah === "") continue; // dikosongkan = belum diisi

    const nilai = Number(mentah);
    if (!Number.isFinite(nilai) || !Number.isInteger(nilai) || nilai < 0) {
      return {
        ok: false,
        pesan: `Angka "${a.label}" tidak valid. Isi bilangan bulat 0 atau lebih.`,
      };
    }
    siap.push({
      kunci: a.kunci,
      label: a.label,
      satuan: a.satuan,
      nilai,
      urutan: i + 1,
    });
  }

  // --- Tahap 2: semua sah, baru ditulis ---
  try {
    for (const s of siap) {
      const [ada] = await db
        .select({ id: statistikDesa.id })
        .from(statistikDesa)
        .where(eq(statistikDesa.kunci, s.kunci))
        .limit(1);

      if (ada) {
        await db
          .update(statistikDesa)
          .set({
            label: s.label,
            satuan: s.satuan,
            nilai: s.nilai,
            tahun,
            urutan: s.urutan,
          })
          .where(eq(statistikDesa.id, ada.id));
      } else {
        await db.insert(statistikDesa).values({ ...s, tahun });
      }
    }

    // Bersihkan sisa baris lama dari masa ketika nama metrik masih diketik
    // bebas (mis. "Jumlah RT" yang salah isi). Hanya variabel tetap yang boleh.
    await db
      .delete(statistikDesa)
      .where(notInArray(statistikDesa.kunci, KUNCI_ANGKA));

    revalidatePath("/");
    revalidatePath("/infografis");
    revalidatePath("/profil");
    return { ok: true, pesan: "Angka desa tersimpan." };
  } catch (e) {
    console.error("Gagal menyimpan angka desa:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }
}
