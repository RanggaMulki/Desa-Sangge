CREATE TABLE "misi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teks" text NOT NULL,
	"urutan" integer DEFAULT 0 NOT NULL
);
