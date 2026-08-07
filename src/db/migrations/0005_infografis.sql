CREATE TYPE "public"."kategori_infografis" AS ENUM('dusun', 'jenis-kelamin', 'kelompok-umur', 'pendidikan', 'pekerjaan', 'agama');--> statement-breakpoint
CREATE TABLE "infografis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kategori" "kategori_infografis" NOT NULL,
	"label" varchar(80) NOT NULL,
	"nilai" integer NOT NULL,
	"urutan" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "statistik_desa" ADD COLUMN "kunci" varchar(40);