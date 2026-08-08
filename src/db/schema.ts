import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  date,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// =============================================================
// Enum
// =============================================================

/**
 * Kategori artikel. Sengaja satu tabel artikel untuk semua jenis konten,
 * bukan tabel terpisah per anggota tim KKN, supaya mudah dirawat.
 * Label yang dilihat admin ada di src/features/artikel/kategori.ts
 */
export const kategoriArtikel = pgEnum("kategori_artikel", [
  "berita",
  "pengumuman",
  "kesehatan",
  "perawatan-alat",
  "sejarah-budaya",
]);

export const statusArtikel = pgEnum("status_artikel", ["draf", "terbit"]);

export const jenisKontenArtikel = pgEnum("jenis_konten_artikel", [
  "materi",
  "poster",
]);

export const tipeLampiran = pgEnum("tipe_lampiran", ["pdf", "gambar"]);

export const jenisLayanan = pgEnum("jenis_layanan", [
  "umum",
  "kesehatan",
  "kppa",
  "darurat",
]);

// =============================================================
// Pengguna
// =============================================================

/**
 * Satu peran saja (admin). Tidak ada RBAC: ada session berarti admin,
 * tidak ada session berarti pengunjung publik.
 *
 * Tiap anggota tim KKN tetap dapat akun sendiri supaya nama penulis
 * tercatat di artikel, bukan karena izinnya berbeda.
 */
export const pengguna = pgTable("pengguna", {
  id: uuid("id").primaryKey().defaultRandom(),
  nama: varchar("nama", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  kataSandiHash: text("kata_sandi_hash").notNull(),
  aktif: boolean("aktif").notNull().default(true),
  dibuatPada: timestamp("dibuat_pada", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// =============================================================
// Artikel
// =============================================================

export const artikel = pgTable(
  "artikel",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    judul: varchar("judul", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    kategori: kategoriArtikel("kategori").notNull(),
    jenisKonten: jenisKontenArtikel("jenis_konten")
      .notNull()
      .default("materi"),
    ringkasan: varchar("ringkasan", { length: 300 }).notNull(),
    konten: text("konten").notNull(),
    gambarSampulUrl: text("gambar_sampul_url"),
    status: statusArtikel("status").notNull().default("draf"),
    penulisId: uuid("penulis_id").references(() => pengguna.id, {
      onDelete: "set null",
    }),
    tanggalTerbit: timestamp("tanggal_terbit", { withTimezone: true }),
    dibuatPada: timestamp("dibuat_pada", { withTimezone: true })
      .notNull()
      .defaultNow(),
    diperbaruiPada: timestamp("diperbarui_pada", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("artikel_slug_idx").on(t.slug),
    // Kueri paling sering: daftar artikel terbit per kategori, terbaru dulu.
    index("artikel_daftar_idx").on(t.kategori, t.status, t.tanggalTerbit.desc()),
  ],
);

/** Leaflet digital (Regita) dan infografis perawatan alat (Fayyadh). */
export const lampiran = pgTable(
  "lampiran",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    artikelId: uuid("artikel_id")
      .notNull()
      .references(() => artikel.id, { onDelete: "cascade" }),
    nama: varchar("nama", { length: 200 }).notNull(),
    url: text("url").notNull(),
    tipe: tipeLampiran("tipe").notNull(),
    ukuranByte: integer("ukuran_byte").notNull(),
  },
  (t) => [index("lampiran_artikel_idx").on(t.artikelId)],
);

// =============================================================
// Halaman statis
// =============================================================

/**
 * Halaman yang selalu ada dan hanya diubah isinya, tidak pernah
 * dibuat atau dihapus lewat UI. Di-seed di awal.
 * slug: profil-desa | sejarah | visi-misi | kppa
 */
export const halamanStatis = pgTable("halaman_statis", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  judul: varchar("judul", { length: 200 }).notNull(),
  konten: text("konten").notNull().default(""),
  diperbaruiPada: timestamp("diperbarui_pada", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// =============================================================
// Profil desa
// =============================================================

export const perangkatDesa = pgTable("perangkat_desa", {
  id: uuid("id").primaryKey().defaultRandom(),
  nama: varchar("nama", { length: 100 }).notNull(),
  jabatan: varchar("jabatan", { length: 100 }).notNull(),
  fotoUrl: text("foto_url"),
  periode: varchar("periode", { length: 30 }),
  urutan: integer("urutan").notNull().default(0),
  aktif: boolean("aktif").notNull().default(true),
  /**
   * Slot tetap di bagan struktur, mis. "kepala-desa" atau "kadus-1".
   *
   * Inti dari "struktur tetap, nama bisa diubah": susunan jabatan dan garisnya
   * dikunci di kode (features/pemerintahan/struktur.ts), sedangkan siapa yang
   * mengisinya diambil dari baris ini lewat `posisi`. Pengurus desa mengganti
   * nama/foto, bukan strukturnya.
   *
   * Boleh null untuk perangkat yang tampil di katalog tapi bukan bagian bagan
   * resmi (mis. staf). Baris tanpa posisi hanya muncul di katalog.
   */
  posisi: varchar("posisi", { length: 40 }),
});

/** Termasuk kontak KPPA. Nomor WA disimpan format 62xxx tanpa tanda baca. */
export const kontakLayanan = pgTable("kontak_layanan", {
  id: uuid("id").primaryKey().defaultRandom(),
  namaLayanan: varchar("nama_layanan", { length: 120 }).notNull(),
  jenis: jenisLayanan("jenis").notNull().default("umum"),
  namaPetugas: varchar("nama_petugas", { length: 100 }),
  nomorWa: varchar("nomor_wa", { length: 20 }),
  jamLayanan: varchar("jam_layanan", { length: 100 }),
  urutan: integer("urutan").notNull().default(0),
  aktif: boolean("aktif").notNull().default(true),
});

/**
 * Batas wilayah desa: sebelah utara, timur, selatan, barat.
 *
 * Empat baris tetap, di-seed sekali dan hanya diubah isinya — sama seperti
 * halamanStatis. Tidak dibuat sebagai empat kolom pada satu baris supaya
 * form pengelolaannya nanti cukup satu daftar berulang, bukan empat kolom
 * yang harus ditulis satu per satu di kode.
 */
export const arahMataAngin = pgEnum("arah_mata_angin", [
  "utara",
  "timur",
  "selatan",
  "barat",
]);

export const batasWilayah = pgTable("batas_wilayah", {
  id: uuid("id").primaryKey().defaultRandom(),
  arah: arahMataAngin("arah").notNull().unique(),
  /** Nama desa/kecamatan yang berbatasan, mis. "Desa Klego". */
  keterangan: varchar("keterangan", { length: 150 }).notNull(),
});

/**
 * Butir misi desa versi lama, satu baris per poin.
 *
 * Data ini tetap dipertahankan sebagai cadangan untuk instalasi yang belum
 * pernah menyimpan melalui editor teks kaya. Setelah disimpan, dokumen Misi
 * utama berada di `halamanStatis` dengan slug "misi".
 */
export const misi = pgTable("misi", {
  id: uuid("id").primaryKey().defaultRandom(),
  teks: text("teks").notNull(),
  urutan: integer("urutan").notNull().default(0),
});

/**
 * Angka diisi manual dan tidak diperbarui otomatis.
 * Kolom `tahun` wajib supaya pembaca tahu kapan data ini berlaku.
 */
export const statistikDesa = pgTable("statistik_desa", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label", { length: 80 }).notNull(),
  nilai: integer("nilai").notNull(),
  satuan: varchar("satuan", { length: 30 }),
  tahun: integer("tahun").notNull(),
  urutan: integer("urutan").notNull().default(0),
  /**
   * Penanda tetap untuk angka yang dirujuk halaman lain, mis. "luas" dan
   * "penduduk" yang tampil di bagian Peta Lokasi.
   *
   * Tanpa ini, halaman harus menebak lewat teks label (`label.includes("luas")`)
   * — dan begitu pengurus desa mengganti nama labelnya, angkanya hilang
   * diam-diam. Kolom ini boleh null untuk angka yang tidak dirujuk siapa pun.
   * Pola yang sama dengan `posisi` pada perangkatDesa.
   */
  kunci: varchar("kunci", { length: 40 }),
});

/**
 * Pengaturan sederhana berpasangan kunci-nilai.
 *
 * Untuk hal-hal yang perlu bisa diubah pengurus desa tapi terlalu sedikit
 * untuk dibuatkan tabelnya sendiri — mulai dari titik koordinat peta. Nilainya
 * disimpan sebagai teks; pemanggil yang mengubahnya jadi angka bila perlu,
 * sehingga menambah pengaturan baru tidak butuh migrasi database lagi.
 */
export const pengaturan = pgTable("pengaturan", {
  kunci: varchar("kunci", { length: 60 }).primaryKey(),
  nilai: text("nilai").notNull(),
});

// =============================================================
// Infografis kependudukan
// =============================================================

/** Kelompok data kependudukan yang ditampilkan di halaman Infografis. */
export const kategoriInfografis = pgEnum("kategori_infografis", [
  "dusun",
  "jenis-kelamin",
  "kelompok-umur",
  "umur-laki-laki",
  "umur-perempuan",
  "status-perkawinan",
  "pendidikan",
  "pekerjaan",
  "agama",
  // Risiko stunting balita — tabel yang sama, dibedakan lewat kategori.
  // Rincian variabelnya di src/features/infografis/stunting.ts
  "stunting-tbu",
  "stunting-bbu",
  "stunting-dusun",
  "stunting-jenis-kelamin",
  "stunting-umur",
]);

/**
 * Rincian kependudukan: satu baris = satu butir dalam sebuah kelompok.
 *
 * Contoh: (kategori "pendidikan", label "SD/Sederajat", nilai 820). Dipisah
 * dari statistikDesa karena bentuknya memang beda: statistikDesa menyimpan
 * angka tunggal bertahun dan bersatuan, sedangkan ini rincian berkelompok
 * yang selalu dibaca bersama satu kelompoknya.
 */
export const infografis = pgTable("infografis", {
  id: uuid("id").primaryKey().defaultRandom(),
  kategori: kategoriInfografis("kategori").notNull(),
  label: varchar("label", { length: 80 }).notNull(),
  nilai: integer("nilai").notNull(),
  urutan: integer("urutan").notNull().default(0),
});


// =============================================================
// Agenda & galeri
// =============================================================

export const agenda = pgTable(
  "agenda",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    judul: varchar("judul", { length: 200 }).notNull(),
    tanggalMulai: date("tanggal_mulai").notNull(),
    tanggalSelesai: date("tanggal_selesai"),
    lokasi: varchar("lokasi", { length: 150 }),
    keterangan: text("keterangan"),
  },
  (t) => [index("agenda_tanggal_idx").on(t.tanggalMulai)],
);

export const galeri = pgTable("galeri", {
  id: uuid("id").primaryKey().defaultRandom(),
  judul: varchar("judul", { length: 200 }).notNull(),
  gambarUrl: text("gambar_url").notNull(),
  keterangan: text("keterangan"),
  tanggal: date("tanggal"),
});

// =============================================================
// Pustaka media
// =============================================================

/**
 * Catatan semua berkas yang diunggah ke Vercel Blob.
 * Tanpa tabel ini, berkas yatim menumpuk diam-diam dan menghabiskan
 * kuota free tier tanpa ada yang menyadari.
 */
export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull().unique(),
  /**
   * Kunci objek di Cloudflare R2, mis. "galeri/uuid.jpg".
   *
   * Disimpan terpisah dari `url` supaya penghapusan bisa menyasar objek yang
   * persis, tanpa mengurai kembali URL-nya. Alasan yang sama dengan ID data
   * dummy yang ditulis tangan di src/db/dummy.ts: yang mau dihapus harus bisa
   * ditunjuk pasti.
   */
  kunciObjek: varchar("kunci_objek", { length: 400 }).notNull(),
  namaBerkas: varchar("nama_berkas", { length: 255 }).notNull(),
  ukuranByte: integer("ukuran_byte").notNull(),
  tipe: varchar("tipe", { length: 100 }).notNull(),
  diunggahOlehId: uuid("diunggah_oleh_id").references(() => pengguna.id, {
    onDelete: "set null",
  }),
  dibuatPada: timestamp("dibuat_pada", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// =============================================================
// Relasi
// =============================================================

export const penggunaRelations = relations(pengguna, ({ many }) => ({
  artikel: many(artikel),
}));

export const artikelRelations = relations(artikel, ({ one, many }) => ({
  penulis: one(pengguna, {
    fields: [artikel.penulisId],
    references: [pengguna.id],
  }),
  lampiran: many(lampiran),
}));

export const lampiranRelations = relations(lampiran, ({ one }) => ({
  artikel: one(artikel, {
    fields: [lampiran.artikelId],
    references: [artikel.id],
  }),
}));

// =============================================================
// Tipe bantu
// =============================================================

export type Pengguna = typeof pengguna.$inferSelect;
export type Artikel = typeof artikel.$inferSelect;
export type ArtikelBaru = typeof artikel.$inferInsert;
export type Lampiran = typeof lampiran.$inferSelect;
export type PerangkatDesa = typeof perangkatDesa.$inferSelect;
export type KontakLayanan = typeof kontakLayanan.$inferSelect;
export type BatasWilayah = typeof batasWilayah.$inferSelect;
export type Misi = typeof misi.$inferSelect;
export type Infografis = typeof infografis.$inferSelect;
export type Agenda = typeof agenda.$inferSelect;
export type Galeri = typeof galeri.$inferSelect;
export type StatistikDesa = typeof statistikDesa.$inferSelect;
export type Media = typeof media.$inferSelect;
