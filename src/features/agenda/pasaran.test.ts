import assert from "node:assert/strict";
import test from "node:test";
import { pasaranUntukTanggal } from "./pasaran";

test("siklus Pancawara cocok dengan kalender JavaSense Agustus 2026", () => {
  const contoh = [
    ["2026-07-27", "Kliwon"],
    ["2026-07-28", "Legi"],
    ["2026-07-29", "Pahing"],
    ["2026-07-30", "Pon"],
    ["2026-07-31", "Wage"],
    ["2026-08-01", "Kliwon"],
    ["2026-08-02", "Legi"],
    ["2026-08-03", "Pahing"],
    ["2026-08-04", "Pon"],
    ["2026-08-05", "Wage"],
    ["2026-08-06", "Kliwon"],
  ] as const;

  for (const [tanggal, pasaran] of contoh) {
    assert.equal(pasaranUntukTanggal(tanggal), pasaran);
  }
});
