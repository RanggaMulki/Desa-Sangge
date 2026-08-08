import assert from "node:assert/strict";
import test from "node:test";
import {
  DATA_STUNTING_JUNI_2026,
  KUNCI_DATA_STUNTING,
  hitungPersentase,
  susunRingkasanStunting,
  validasiRingkasanStunting,
} from "./stunting";

test("menggunakan rekap Juni 2026 ketika pengaturan baru belum tersedia", () => {
  const hanyaPeriodeLama = new Map([
    [KUNCI_DATA_STUNTING.periode, "Agustus 2026 (contoh)"],
  ]);

  assert.deepEqual(
    susunRingkasanStunting(hanyaPeriodeLama),
    DATA_STUNTING_JUNI_2026,
  );
});

test("membaca seluruh angka rekap dari pengaturan", () => {
  const nilai = new Map([
    [KUNCI_DATA_STUNTING.periode, "Juli 2026"],
    [KUNCI_DATA_STUNTING.jumlahIbuHamil, "20"],
    [KUNCI_DATA_STUNTING.ibuHamilKek, "0"],
    [KUNCI_DATA_STUNTING.jumlahBalita, "200"],
    [KUNCI_DATA_STUNTING.balitaPendek, "25"],
    [KUNCI_DATA_STUNTING.balitaGiziKurang, "8"],
    [KUNCI_DATA_STUNTING.balitaBeratBadanKurang, "19"],
  ]);

  assert.deepEqual(susunRingkasanStunting(nilai), {
    periode: "Juli 2026",
    jumlahIbuHamil: 20,
    ibuHamilKek: 0,
    jumlahBalita: 200,
    balitaPendek: 25,
    balitaGiziKurang: 8,
    balitaBeratBadanKurang: 19,
  });
});

test("menghitung persentase indikator dari total kelompok", () => {
  const satuDesimal = (nilai: number) => Math.round(nilai * 10) / 10;

  assert.equal(satuDesimal(hitungPersentase(2, 17)), 11.8);
  assert.equal(satuDesimal(hitungPersentase(29, 185)), 15.7);
  assert.equal(satuDesimal(hitungPersentase(10, 185)), 5.4);
  assert.equal(satuDesimal(hitungPersentase(28, 185)), 15.1);
  assert.equal(hitungPersentase(3, 0), 0);
});

test("menolak jumlah risiko yang melampaui total kelompok", () => {
  assert.equal(
    validasiRingkasanStunting({
      ...DATA_STUNTING_JUNI_2026,
      ibuHamilKek: 18,
    }),
    "Ibu hamil berisiko KEK tidak boleh melebihi total ibu hamil.",
  );
  assert.equal(
    validasiRingkasanStunting({
      ...DATA_STUNTING_JUNI_2026,
      balitaGiziKurang: 186,
    }),
    "Balita gizi kurang tidak boleh melebihi total balita.",
  );
  assert.equal(validasiRingkasanStunting(DATA_STUNTING_JUNI_2026), null);
});
