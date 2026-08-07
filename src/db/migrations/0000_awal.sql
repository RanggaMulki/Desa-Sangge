CREATE TYPE "public"."jenis_layanan" AS ENUM('umum', 'kesehatan', 'kppa', 'darurat');--> statement-breakpoint
CREATE TYPE "public"."kategori_artikel" AS ENUM('berita', 'pengumuman', 'kesehatan', 'perawatan-alat', 'sejarah-budaya');--> statement-breakpoint
CREATE TYPE "public"."status_artikel" AS ENUM('draf', 'terbit');--> statement-breakpoint
CREATE TYPE "public"."tipe_lampiran" AS ENUM('pdf', 'gambar');--> statement-breakpoint
CREATE TABLE "agenda" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" varchar(200) NOT NULL,
	"tanggal_mulai" date NOT NULL,
	"tanggal_selesai" date,
	"lokasi" varchar(150),
	"keterangan" text
);
--> statement-breakpoint
CREATE TABLE "artikel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"kategori" "kategori_artikel" NOT NULL,
	"ringkasan" varchar(300) NOT NULL,
	"konten" text NOT NULL,
	"gambar_sampul_url" text,
	"status" "status_artikel" DEFAULT 'draf' NOT NULL,
	"penulis_id" uuid,
	"tanggal_terbit" timestamp with time zone,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "galeri" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"judul" varchar(200) NOT NULL,
	"gambar_url" text NOT NULL,
	"keterangan" text,
	"tanggal" date
);
--> statement-breakpoint
CREATE TABLE "halaman_statis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(60) NOT NULL,
	"judul" varchar(200) NOT NULL,
	"konten" text DEFAULT '' NOT NULL,
	"diperbarui_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "halaman_statis_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "kontak_layanan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama_layanan" varchar(120) NOT NULL,
	"jenis" "jenis_layanan" DEFAULT 'umum' NOT NULL,
	"nama_petugas" varchar(100),
	"nomor_wa" varchar(20),
	"jam_layanan" varchar(100),
	"urutan" integer DEFAULT 0 NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lampiran" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artikel_id" uuid NOT NULL,
	"nama" varchar(200) NOT NULL,
	"url" text NOT NULL,
	"tipe" "tipe_lampiran" NOT NULL,
	"ukuran_byte" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"nama_berkas" varchar(255) NOT NULL,
	"ukuran_byte" integer NOT NULL,
	"tipe" varchar(100) NOT NULL,
	"diunggah_oleh_id" uuid,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "pengguna" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"kata_sandi_hash" text NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pengguna_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "perangkat_desa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(100) NOT NULL,
	"jabatan" varchar(100) NOT NULL,
	"foto_url" text,
	"periode" varchar(30),
	"urutan" integer DEFAULT 0 NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "statistik_desa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(80) NOT NULL,
	"nilai" integer NOT NULL,
	"satuan" varchar(30),
	"tahun" integer NOT NULL,
	"urutan" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artikel" ADD CONSTRAINT "artikel_penulis_id_pengguna_id_fk" FOREIGN KEY ("penulis_id") REFERENCES "public"."pengguna"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lampiran" ADD CONSTRAINT "lampiran_artikel_id_artikel_id_fk" FOREIGN KEY ("artikel_id") REFERENCES "public"."artikel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_diunggah_oleh_id_pengguna_id_fk" FOREIGN KEY ("diunggah_oleh_id") REFERENCES "public"."pengguna"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agenda_tanggal_idx" ON "agenda" USING btree ("tanggal_mulai");--> statement-breakpoint
CREATE UNIQUE INDEX "artikel_slug_idx" ON "artikel" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "artikel_daftar_idx" ON "artikel" USING btree ("kategori","status","tanggal_terbit" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "lampiran_artikel_idx" ON "lampiran" USING btree ("artikel_id");