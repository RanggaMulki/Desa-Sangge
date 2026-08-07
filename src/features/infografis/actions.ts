"use server";

import { revalidatePath } from "next/cache";
import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { infografis, pengaturan, statistikDesa } from "@/db/schema";
import { KATEGORI_INFOGRAFIS } from "./kategori";
import {
  KUNCI_PENGATURAN_PENDUDUK,
  SUMBER_INPUT_ADMIN,
} from "./penduduk";
import {
  KATEGORI_STUNTING,
  KUNCI_KATEGORI_STUNTING,
  KUNCI_PENGATURAN_STUNTING,
  SUMBER_STUNTING_DEFAULT,
  type KategoriStunting,
} from "./stunting";
import { pastikanPengurus } from "@/features/auth/queries";

export type HasilSimpan = { ok: boolean; pesan: string };

/**
 * Menyimpan seluruh rincian kependudukan dari form tabel.
 *
 * Nama golongan TIDAK datang dari form — sudah pasti di `variabel` pada
 * kategori.ts. Form hanya mengirim angka per golongan (field `n-<kategori>-<i>`),
 * lalu labelnya disusun ulang di sini dari `variabel[i]`. Jadi mustahil ada
 * salah ketik nama, dan validasinya cukup memeriksa angka.
 *
 * Golongan yang kosong/0 tidak disimpan — barisnya memang tidak perlu ada.
 * Semua diperiksa dulu sebelum satu pun ditulis, supaya tidak ada keadaan
 * "sebagian tersimpan tapi pesannya gagal".
 */
export async function simpanInfografis(
  _sebelumnya: HasilSimpan | null,
  formData: FormData,
): Promise<HasilSimpan> {
  await pastikanPengurus();
  const tahun = Number(String(formData.get("tahun") ?? "").trim());
  const semester = String(formData.get("semester") ?? "").trim();
  const totalPenduduk = bacaBilanganBulat(
    formData.get("total-penduduk"),
    "Total penduduk",
  );
  const jumlahKk = bacaBilanganBulat(formData.get("jumlah-kk"), "Jumlah KK");

  if (!Number.isInteger(tahun) || tahun < 2000 || tahun > 2100) {
    return {
      ok: false,
      pesan: "Tahun data tidak valid. Isi antara 2000-2100.",
    };
  }
  if (semester !== "Gasal" && semester !== "Genap") {
    return { ok: false, pesan: "Pilih semester Gasal atau Genap." };
  }
  if (typeof totalPenduduk === "string") {
    return { ok: false, pesan: totalPenduduk };
  }
  if (typeof jumlahKk === "string") {
    return { ok: false, pesan: jumlahKk };
  }

  const semua: {
    kategori: (typeof KATEGORI_INFOGRAFIS)[number]["kunci"];
    label: string;
    nilai: number;
    urutan: number;
  }[] = [];

  // --- Tahap 1: baca & periksa semua angka, belum menulis apa pun ---
  for (const k of KATEGORI_INFOGRAFIS) {
    for (const [i, label] of k.variabel.entries()) {
      const mentah = ((formData.get(`n-${k.kunci}-${i}`) as string) ?? "")
        .replace(/\./g, "")
        .trim();
      if (mentah === "") {
        return {
          ok: false,
          pesan: `Jumlah untuk "${label}" pada ${k.judul} belum diisi.`,
        };
      }

      const nilai = Number(mentah);
      if (!Number.isFinite(nilai) || nilai < 0 || !Number.isInteger(nilai)) {
        return {
          ok: false,
          pesan: `Angka untuk "${label}" pada ${k.judul} tidak valid. Isi dengan bilangan bulat 0 atau lebih.`,
        };
      }
      semua.push({ kategori: k.kunci, label, nilai, urutan: i + 1 });
    }
  }

  const totalKategori = (kategori: (typeof semua)[number]["kategori"]) =>
    semua
      .filter((item) => item.kategori === kategori)
      .reduce((total, item) => total + item.nilai, 0);

  const pemeriksaan = [
    {
      label: "jenis kelamin",
      nilai: totalKategori("jenis-kelamin"),
      harapan: totalPenduduk,
    },
    {
      label: "piramida umur laki-laki",
      nilai: totalKategori("umur-laki-laki"),
      harapan: semua.find(
        (item) =>
          item.kategori === "jenis-kelamin" &&
          item.label.toLowerCase().includes("laki"),
      )?.nilai,
    },
    {
      label: "piramida umur perempuan",
      nilai: totalKategori("umur-perempuan"),
      harapan: semua.find(
        (item) =>
          item.kategori === "jenis-kelamin" &&
          item.label.toLowerCase().includes("perempuan"),
      )?.nilai,
    },
    {
      label: "agama",
      nilai: totalKategori("agama"),
      harapan: totalPenduduk,
      opsional: true,
    },
    {
      label: "status perkawinan",
      nilai: totalKategori("status-perkawinan"),
      harapan: totalPenduduk,
    },
    {
      label: "pendidikan",
      nilai: totalKategori("pendidikan"),
      harapan: totalPenduduk,
    },
  ];

  const tidakSama = pemeriksaan.find(
    (item) =>
      item.harapan === undefined ||
      (!("opsional" in item) || item.nilai > 0) &&
        item.nilai !== item.harapan,
  );
  if (tidakSama) {
    return {
      ok: false,
      pesan: `Jumlah ${tidakSama.label} adalah ${tidakSama.nilai.toLocaleString("id-ID")}, seharusnya ${Number(tidakSama.harapan ?? 0).toLocaleString("id-ID")}. Periksa kembali angkanya.`,
    };
  }

  if (totalKategori("pekerjaan") > totalPenduduk) {
    return {
      ok: false,
      pesan:
        "Jumlah 10 pekerjaan terbanyak tidak boleh melebihi total penduduk.",
    };
  }

  const laki = totalKategori("umur-laki-laki");
  const perempuan = totalKategori("umur-perempuan");
  const periode = `${tahun} ${semester}`;
  const kunciStatistik = ["penduduk", "laki", "perempuan", "kk"];
  const kunciPengaturan = Object.values(KUNCI_PENGATURAN_PENDUDUK);

  // --- Tahap 2: semua sah, baru ditulis sebagai satu transaksi ---
  try {
    await db.batch([
      db.delete(infografis),
      db.insert(infografis).values(
        semua.filter(
          (item) => item.kategori !== "agama" || item.nilai > 0,
        ),
      ),
      db
        .delete(statistikDesa)
        .where(inArray(statistikDesa.kunci, kunciStatistik)),
      db.insert(statistikDesa).values([
        {
          kunci: "penduduk",
          label: "Jumlah Penduduk",
          nilai: totalPenduduk,
          satuan: "jiwa",
          tahun,
          urutan: 1,
        },
        {
          kunci: "laki",
          label: "Laki-laki",
          nilai: laki,
          satuan: "jiwa",
          tahun,
          urutan: 2,
        },
        {
          kunci: "perempuan",
          label: "Perempuan",
          nilai: perempuan,
          satuan: "jiwa",
          tahun,
          urutan: 3,
        },
        {
          kunci: "kk",
          label: "Kepala Keluarga",
          nilai: jumlahKk,
          satuan: "KK",
          tahun,
          urutan: 4,
        },
      ]),
      db
        .delete(pengaturan)
        .where(inArray(pengaturan.kunci, kunciPengaturan)),
      db.insert(pengaturan).values([
        {
          kunci: KUNCI_PENGATURAN_PENDUDUK.periode,
          nilai: periode,
        },
        {
          kunci: KUNCI_PENGATURAN_PENDUDUK.sumberNama,
          nilai: SUMBER_INPUT_ADMIN.nama,
        },
        {
          kunci: KUNCI_PENGATURAN_PENDUDUK.sumberUrl,
          nilai: SUMBER_INPUT_ADMIN.url,
        },
      ]),
    ]);

    revalidatePath("/");
    revalidatePath("/infografis");
    revalidatePath("/admin/infografis");
    return {
      ok: true,
      pesan: `Data kependudukan periode ${periode} berhasil disimpan.`,
    };
  } catch (e) {
    console.error("Gagal menyimpan infografis:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }
}

/**
 * Menyimpan seluruh angka Risiko Stunting dari form.
 *
 * Lebih longgar daripada penduduk: indikator stunting (TB/U, BB/U, dusun, dst.)
 * TIDAK harus berjumlah sama, karena tidak semua balita terukur untuk semua
 * indikator. Yang diperiksa hanya tiap angka berupa bilangan bulat ≥ 0, dan
 * minimal satu angka terisi. Golongan bernilai 0 tidak disimpan barisnya.
 *
 * Hanya baris berkategori stunting yang dihapus-tulis ulang; data kependudukan
 * di tabel yang sama tidak tersentuh.
 */
export async function simpanStunting(
  _sebelumnya: HasilSimpan | null,
  formData: FormData,
): Promise<HasilSimpan> {
  await pastikanPengurus();
  const periode = String(formData.get("periode") ?? "").trim();
  const sumberNama =
    String(formData.get("sumber-nama") ?? "").trim() ||
    SUMBER_STUNTING_DEFAULT.nama;
  const sumberUrl = String(formData.get("sumber-url") ?? "").trim();

  if (periode === "") {
    return {
      ok: false,
      pesan: "Periode data belum diisi. Contoh: Bulan Timbang Agustus 2026.",
    };
  }
  if (sumberUrl !== "" && !/^https?:\/\//i.test(sumberUrl)) {
    return {
      ok: false,
      pesan:
        "Tautan sumber harus diawali http:// atau https://, atau dikosongkan saja.",
    };
  }

  const semua: {
    kategori: KategoriStunting;
    label: string;
    nilai: number;
    urutan: number;
  }[] = [];
  for (const k of KATEGORI_STUNTING) {
    for (const [i, label] of k.variabel.entries()) {
      const hasil = bacaBilanganBulat(
        formData.get(`n-${k.kunci}-${i}`),
        `Angka "${label}" pada ${k.judul}`,
      );
      if (typeof hasil === "string") return { ok: false, pesan: hasil };
      semua.push({ kategori: k.kunci, label, nilai: hasil, urutan: i + 1 });
    }
  }

  const barisSimpan = semua.filter((item) => item.nilai > 0);
  if (barisSimpan.length === 0) {
    return {
      ok: false,
      pesan: "Semua angka masih 0. Isi minimal satu angka sebelum menyimpan.",
    };
  }

  try {
    await db.batch([
      db
        .delete(infografis)
        .where(inArray(infografis.kategori, KUNCI_KATEGORI_STUNTING)),
      db.insert(infografis).values(barisSimpan),
      db
        .delete(pengaturan)
        .where(
          inArray(pengaturan.kunci, Object.values(KUNCI_PENGATURAN_STUNTING)),
        ),
      db.insert(pengaturan).values([
        { kunci: KUNCI_PENGATURAN_STUNTING.periode, nilai: periode },
        { kunci: KUNCI_PENGATURAN_STUNTING.sumberNama, nilai: sumberNama },
        { kunci: KUNCI_PENGATURAN_STUNTING.sumberUrl, nilai: sumberUrl },
      ]),
    ]);

    revalidatePath("/infografis/stunting");
    revalidatePath("/admin/infografis");
    return {
      ok: true,
      pesan: `Data risiko stunting periode ${periode} berhasil disimpan.`,
    };
  } catch (e) {
    console.error("Gagal menyimpan stunting:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }
}

function bacaBilanganBulat(
  nilai: FormDataEntryValue | null,
  label: string,
): number | string {
  const mentah = String(nilai ?? "").replace(/\./g, "").trim();
  const angka = Number(mentah);
  if (
    mentah === "" ||
    !Number.isFinite(angka) ||
    angka < 0 ||
    !Number.isInteger(angka)
  ) {
    return `${label} tidak valid. Isi dengan bilangan bulat 0 atau lebih.`;
  }
  return angka;
}
