import assert from "node:assert/strict";
import test from "node:test";
import { jenisKontenSah } from "./jenis";
import { formulirArtikelSchema } from "./validasi";

test("bentuk konten mengikuti aturan tiap kategori", () => {
  assert.equal(jenisKontenSah("kesehatan", "materi"), true);
  assert.equal(jenisKontenSah("kesehatan", "poster"), true);
  assert.equal(jenisKontenSah("perawatan-alat", "poster"), true);
  assert.equal(jenisKontenSah("perawatan-alat", "materi"), false);
  assert.equal(jenisKontenSah("berita", "materi"), true);
  assert.equal(jenisKontenSah("berita", "poster"), false);
});

test("poster perawatan alat tidak memerlukan ringkasan dan isi artikel", () => {
  const hasil = formulirArtikelSchema.safeParse({
    judul: "Cara Merawat Mesin Potong Rumput",
    kategori: "perawatan-alat",
    jenisKonten: "poster",
    ringkasan: "",
    konten: "",
  });

  assert.equal(hasil.success, true);
});

test("materi perawatan alat ditolak", () => {
  const hasil = formulirArtikelSchema.safeParse({
    judul: "Cara Merawat Mesin Potong Rumput",
    kategori: "perawatan-alat",
    jenisKonten: "materi",
    ringkasan: "Panduan singkat merawat mesin potong rumput.",
    konten: "<p>Bersihkan mesin setelah dipakai dan simpan di tempat kering.</p>",
  });

  assert.equal(hasil.success, false);
});
