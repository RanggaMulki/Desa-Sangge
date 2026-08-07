CREATE TYPE "public"."jenis_konten_artikel" AS ENUM('materi', 'poster');--> statement-breakpoint
ALTER TABLE "artikel" ADD COLUMN "jenis_konten" "jenis_konten_artikel" DEFAULT 'materi' NOT NULL;