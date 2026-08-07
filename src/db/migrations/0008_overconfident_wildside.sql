CREATE TYPE "public"."jenis_apb_desa" AS ENUM('pendapatan', 'belanja', 'penerimaan-pembiayaan', 'pengeluaran-pembiayaan');--> statement-breakpoint
CREATE TABLE "apb_desa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tahun" integer NOT NULL,
	"jenis" "jenis_apb_desa" NOT NULL,
	"kunci" varchar(60) NOT NULL,
	"label" varchar(180) NOT NULL,
	"nilai" bigint NOT NULL,
	"urutan" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "apb_desa_tahun_kunci_idx" ON "apb_desa" USING btree ("tahun","kunci");--> statement-breakpoint
CREATE INDEX "apb_desa_tahun_idx" ON "apb_desa" USING btree ("tahun");