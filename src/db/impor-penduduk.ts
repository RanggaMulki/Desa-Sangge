import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray } from "drizzle-orm";
import * as schema from "./schema";
import { infografis, pengaturan, statistikDesa } from "./schema";
import { KATEGORI_INFOGRAFIS } from "../features/infografis/kategori";
import {
  barisInfografisPenduduk,
  DATA_PADUKAN_SANGGE_2026,
  KUNCI_PENGATURAN_PENDUDUK,
  SUMBER_PADUKAN_SANGGE,
} from "../features/infografis/penduduk";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum diatur di .env.local");
  }

  const db = drizzle(neon(process.env.DATABASE_URL), { schema });
  const data = DATA_PADUKAN_SANGGE_2026;
  const baris = barisInfografisPenduduk();

  const jumlah = (kategori: (typeof baris)[number]["kategori"]) =>
    baris
      .filter((item) => item.kategori === kategori)
      .reduce((total, item) => total + item.nilai, 0);

  const pemeriksaan = [
    jumlah("jenis-kelamin") === data.ringkasan.penduduk,
    jumlah("umur-laki-laki") === data.ringkasan.laki,
    jumlah("umur-perempuan") === data.ringkasan.perempuan,
    jumlah("status-perkawinan") === data.ringkasan.penduduk,
    jumlah("pendidikan") === data.ringkasan.penduduk,
    jumlah("pekerjaan") <= data.ringkasan.penduduk,
  ];
  if (pemeriksaan.some((hasil) => !hasil)) {
    throw new Error("Agregat PADUKAN Sangge tidak konsisten. Impor dibatalkan.");
  }

  // Hanya kategori KEPENDUDUKAN yang dihapus-tulis ulang. Kategori stunting
  // ada di tabel yang sama tapi dikelola terpisah — JANGAN ikut terhapus.
  const kategoriPenduduk = KATEGORI_INFOGRAFIS.map((k) => k.kunci);
  const kunciStatistik = ["penduduk", "laki", "perempuan", "kk"];
  const kunciPengaturan = Object.values(KUNCI_PENGATURAN_PENDUDUK);

  await db.batch([
    db.delete(infografis).where(inArray(infografis.kategori, kategoriPenduduk)),
    db.insert(infografis).values(baris),
    db
      .delete(statistikDesa)
      .where(inArray(statistikDesa.kunci, kunciStatistik)),
    db.insert(statistikDesa).values([
      {
        kunci: "penduduk",
        label: "Jumlah Penduduk",
        nilai: data.ringkasan.penduduk,
        satuan: "jiwa",
        tahun: data.tahun,
        urutan: 1,
      },
      {
        kunci: "laki",
        label: "Laki-laki",
        nilai: data.ringkasan.laki,
        satuan: "jiwa",
        tahun: data.tahun,
        urutan: 2,
      },
      {
        kunci: "perempuan",
        label: "Perempuan",
        nilai: data.ringkasan.perempuan,
        satuan: "jiwa",
        tahun: data.tahun,
        urutan: 3,
      },
      {
        kunci: "kk",
        label: "Kepala Keluarga",
        nilai: data.ringkasan.kk,
        satuan: "KK",
        tahun: data.tahun,
        urutan: 4,
      },
    ]),
    db
      .delete(pengaturan)
      .where(inArray(pengaturan.kunci, kunciPengaturan)),
    db.insert(pengaturan).values([
      {
        kunci: KUNCI_PENGATURAN_PENDUDUK.periode,
        nilai: data.periode,
      },
      {
        kunci: KUNCI_PENGATURAN_PENDUDUK.sumberNama,
        nilai: SUMBER_PADUKAN_SANGGE.nama,
      },
      {
        kunci: KUNCI_PENGATURAN_PENDUDUK.sumberUrl,
        nilai: SUMBER_PADUKAN_SANGGE.url,
      },
    ]),
  ]);

  console.log(
    `Data PADUKAN ${data.desa}, periode ${data.periode}, berhasil diimpor.`,
  );
  console.log(
    `${data.ringkasan.penduduk.toLocaleString("id-ID")} penduduk, ` +
      `${data.ringkasan.kk.toLocaleString("id-ID")} KK, ` +
      `${baris.length} baris agregat (stunting tidak tersentuh).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
