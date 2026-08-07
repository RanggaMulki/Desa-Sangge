import assert from "node:assert/strict";
import test from "node:test";
import {
  DAFTAR_LIBUR_2026,
  labelJenisLibur,
  liburUntukTanggal,
} from "./libur-nasional";

test("daftar resmi 2026 berisi 17 libur nasional dan 8 cuti bersama", () => {
  assert.equal(
    DAFTAR_LIBUR_2026.filter((item) => item.jenis === "libur-nasional").length,
    17,
  );
  assert.equal(
    DAFTAR_LIBUR_2026.filter((item) => item.jenis === "cuti-bersama").length,
    8,
  );
});

test("tanggal penting cocok dengan SKB 3 Menteri tahun 2026", () => {
  assert.deepEqual(liburUntukTanggal("2026-08-17"), {
    tanggal: "2026-08-17",
    nama: "Proklamasi Kemerdekaan",
    jenis: "libur-nasional",
  });
  assert.equal(
    labelJenisLibur(liburUntukTanggal("2026-12-24")!.jenis),
    "Cuti Bersama",
  );
  assert.equal(liburUntukTanggal("2026-08-02"), null);
});
