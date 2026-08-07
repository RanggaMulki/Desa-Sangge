CREATE TYPE "public"."arah_mata_angin" AS ENUM('utara', 'timur', 'selatan', 'barat');--> statement-breakpoint
CREATE TABLE "batas_wilayah" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"arah" "arah_mata_angin" NOT NULL,
	"keterangan" varchar(150) NOT NULL,
	CONSTRAINT "batas_wilayah_arah_unique" UNIQUE("arah")
);
