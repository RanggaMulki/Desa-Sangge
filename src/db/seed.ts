import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import {
  batasWilayah,
  halamanStatis,
  kontakLayanan,
  pengguna,
  perangkatDesa,
  statistikDesa,
} from "./schema";
import {
  BATAS_WILAYAH_RESMI,
  KONTEN_SEJARAH_DESA,
  PERANGKAT_DESA_RESMI,
  STATISTIK_MANUAL_RESMI,
} from "./konten-resmi";

/**
 * Mengisi data awal. Aman dijalankan berkali-kali: setiap bagian memeriksa
 * dulu apakah datanya sudah ada, jadi tidak akan menimpa perubahan yang
 * sudah dibuat pengurus desa lewat website.
 */

/**
 * Nama pengguna untuk masuk ke /admin. Disimpan di kolom `email` (nama kolom
 * historis), tetapi berupa nama pengguna biasa, bukan alamat email.
 */
const EMAIL_ADMIN = "sangge";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum diatur di .env.local");
  }
  const db = drizzle(neon(process.env.DATABASE_URL), { schema });

  // --- Akun admin pertama -------------------------------------------
  const kataSandiAwal = process.env.SEED_KATA_SANDI;
  if (!kataSandiAwal) {
    throw new Error(
      "Isi SEED_KATA_SANDI dulu. Contoh:\n" +
        "  SEED_KATA_SANDI='katasandiSementara123' npm run db:seed",
    );
  }
  if (kataSandiAwal.length < 8) {
    throw new Error("SEED_KATA_SANDI minimal 8 karakter.");
  }

  const [adaAdmin] = await db
    .select({ id: pengguna.id })
    .from(pengguna)
    .where(eq(pengguna.email, EMAIL_ADMIN))
    .limit(1);

  if (adaAdmin) {
    console.log("• Akun admin sudah ada, dilewati");
  } else {
    await db.insert(pengguna).values({
      nama: "Admin Desa Sangge",
      email: EMAIL_ADMIN,
      kataSandiHash: await bcrypt.hash(kataSandiAwal, 12),
    });
    console.log(`• Akun admin dibuat: ${EMAIL_ADMIN}`);
  }

  // --- Halaman statis -----------------------------------------------
  // Selalu ada, hanya diubah isinya lewat website, tidak pernah dihapus.
  const halaman = [
    {
      slug: "profil-desa",
      judul: "Profil Desa Sangge",
      konten:
        "<p>Isi halaman ini lewat menu Pengelolaan. Tuliskan gambaran umum " +
        "Desa Sangge, letak wilayah, dan jumlah dusun.</p>",
    },
    {
      slug: "sejarah",
      judul: "Sejarah Desa Sangge",
      konten: KONTEN_SEJARAH_DESA,
    },
    {
      // Hanya pernyataan visi. Butir misi ada di tabel `misi` sendiri.
      slug: "visi",
      judul: "Visi Desa",
      konten: "",
    },
    {
      slug: "kppa",
      judul: "Layanan Perlindungan Perempuan dan Anak",
      konten:
        "<p>Desa Sangge menyediakan kanal pendampingan bagi warga yang " +
        "mengalami kekerasan. Kerahasiaan identitas pelapor dijaga.</p>",
    },
    {
      // Naskah sambutan Kepala Desa untuk seksi di beranda. Dibuat kosong:
      // seksinya disembunyikan sampai naskah asli diisi lewat pengelolaan,
      // jadi beranda tidak pernah menampilkan sambutan karangan.
      slug: "sambutan",
      judul: "Sambutan Kepala Desa",
      konten: "",
    },
  ];

  for (const h of halaman) {
    const [ada] = await db
      .select({ id: halamanStatis.id })
      .from(halamanStatis)
      .where(eq(halamanStatis.slug, h.slug))
      .limit(1);
    if (ada) {
      console.log(`• Halaman "${h.slug}" sudah ada, dilewati`);
      continue;
    }
    await db.insert(halamanStatis).values(h);
    console.log(`• Halaman "${h.slug}" dibuat`);
  }

  // --- Kontak layanan contoh ----------------------------------------
  // Nomor di bawah masih contoh dan WAJIB diganti sebelum website tayang.
  const [adaKontak] = await db
    .select({ id: kontakLayanan.id })
    .from(kontakLayanan)
    .limit(1);

  if (adaKontak) {
    console.log("• Kontak layanan sudah ada, dilewati");
  } else {
    await db.insert(kontakLayanan).values([
      {
        namaLayanan: "Kantor Desa Sangge",
        jenis: "umum",
        jamLayanan: "Senin-Jumat, 08.00-15.00",
        urutan: 1,
      },
      {
        namaLayanan: "Perlindungan Perempuan dan Anak",
        jenis: "kppa",
        namaPetugas: "GANTI DENGAN NAMA PENGURUS KPPA",
        nomorWa: "6281234567890",
        jamLayanan: "Setiap hari, 07.00-21.00",
        urutan: 2,
      },
    ]);
    console.log("• Kontak layanan contoh dibuat (nomor WAJIB diganti)");
  }

  // --- Perangkat desa (data resmi) ----------------------------------
  // Idempoten per `posisi`: hanya mengisi slot yang belum ada, jadi nama/foto
  // yang sudah diubah admin tidak tertimpa.
  const posisiAda = new Set(
    (
      await db
        .select({ posisi: perangkatDesa.posisi })
        .from(perangkatDesa)
    ).map((r) => r.posisi),
  );
  const perangkatBaru = PERANGKAT_DESA_RESMI.filter(
    (p) => !posisiAda.has(p.posisi),
  );
  if (perangkatBaru.length === 0) {
    console.log("• Perangkat desa sudah ada, dilewati");
  } else {
    await db.insert(perangkatDesa).values(perangkatBaru);
    console.log(`• Perangkat desa: ${perangkatBaru.length} baris dibuat`);
  }

  // --- Angka desa manual: luas wilayah & jumlah dusun ---------------
  // Idempoten per `kunci`. Angka kependudukan (penduduk/KK/jenis kelamin)
  // sengaja TIDAK di sini — itu datang dari `npm run db:penduduk`.
  const kunciAda = new Set(
    (
      await db
        .select({ kunci: statistikDesa.kunci })
        .from(statistikDesa)
    ).map((r) => r.kunci),
  );
  const statistikBaru = STATISTIK_MANUAL_RESMI.filter(
    (s) => !kunciAda.has(s.kunci),
  );
  if (statistikBaru.length === 0) {
    console.log("• Statistik manual (luas & dusun) sudah ada, dilewati");
  } else {
    await db.insert(statistikDesa).values(statistikBaru);
    console.log(`• Statistik manual: ${statistikBaru.length} baris dibuat`);
  }

  // --- Batas wilayah ------------------------------------------------
  // Idempoten per `arah` (kolomnya unik).
  const arahAda = new Set(
    (await db.select({ arah: batasWilayah.arah }).from(batasWilayah)).map(
      (r) => r.arah,
    ),
  );
  const batasBaru = BATAS_WILAYAH_RESMI.filter((b) => !arahAda.has(b.arah));
  if (batasBaru.length === 0) {
    console.log("• Batas wilayah sudah ada, dilewati");
  } else {
    await db.insert(batasWilayah).values(batasBaru);
    console.log(`• Batas wilayah: ${batasBaru.length} baris dibuat`);
  }

  console.log("\nSelesai.");
}

main().catch((e) => {
  console.error("GAGAL:", e.message);
  process.exit(1);
});
