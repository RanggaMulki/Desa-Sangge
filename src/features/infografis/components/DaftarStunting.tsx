import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { ambilStunting } from "../queries";
import { GrafikKolom } from "./GrafikKolom";
import { GrafikPai } from "./GrafikPai";
import { PanelGrafik } from "./PanelGrafik";
import type { Butir } from "../kategori";

/**
 * Semua grafik Risiko Stunting, meniru pola DaftarInfografis kependudukan.
 * Setiap panel hilang sendiri bila datanya masih kosong; kalau semuanya kosong,
 * ditampilkan keadaan kosong yang jujur.
 */
export async function DaftarStunting() {
  const kelompok = await ambilStunting();
  const cari = (kunci: string) => kelompok.find((item) => item.kunci === kunci);
  const adaData = (butir: Butir[] | undefined) =>
    butir?.some((item) => item.nilai > 0) ?? false;

  const tbu = cari("stunting-tbu");
  const bbu = cari("stunting-bbu");
  const dusun = cari("stunting-dusun");
  const jenisKelamin = cari("stunting-jenis-kelamin");
  const umur = cari("stunting-umur");

  const adaTbu = adaData(tbu?.butir);
  const adaBbu = adaData(bbu?.butir);
  const adaDusun = adaData(dusun?.butir);
  const adaJk = adaData(jenisKelamin?.butir);
  const adaUmur = adaData(umur?.butir);

  if (!adaTbu && !adaBbu && !adaDusun && !adaJk && !adaUmur) {
    return (
      <KotakKosong
        judul="Data risiko stunting belum diisi"
        pesan="Status TB/U, BB/U, sebaran per dusun, jenis kelamin, dan kelompok umur balita akan tampil setelah datanya dimasukkan lewat halaman pengelolaan."
      />
    );
  }

  return (
    <div className="space-y-8">
      {tbu && adaTbu && (
        <PanelGrafik
          id="stunting-tbu"
          judul={tbu.judul}
          keterangan={tbu.keterangan}
          butir={tbu.butir}
          labelJumlah="Balita diukur"
          satuan="balita"
          anak={<GrafikPai butir={tbu.butir} satuan="balita" />}
        />
      )}

      {(adaBbu || adaDusun) && (
        <div
          className={`grid items-start gap-8 ${
            adaBbu && adaDusun ? "lg:grid-cols-2" : ""
          }`}
        >
          {bbu && adaBbu && (
            <PanelGrafik
              id="stunting-bbu"
              judul={bbu.judul}
              keterangan={bbu.keterangan}
              butir={bbu.butir}
              labelJumlah="Balita diukur"
              satuan="balita"
              anak={<GrafikKolom butir={bbu.butir} satuan="balita" />}
            />
          )}
          {dusun && adaDusun && (
            <PanelGrafik
              id="stunting-dusun"
              judul={dusun.judul}
              keterangan={dusun.keterangan}
              butir={dusun.butir}
              labelJumlah="Total balita stunting"
              satuan="balita"
              anak={<GrafikKolom butir={dusun.butir} satuan="balita" />}
            />
          )}
        </div>
      )}

      {(adaJk || adaUmur) && (
        <div
          className={`grid items-start gap-8 ${
            adaJk && adaUmur ? "lg:grid-cols-2" : ""
          }`}
        >
          {jenisKelamin && adaJk && (
            <PanelGrafik
              id="stunting-jenis-kelamin"
              judul={jenisKelamin.judul}
              keterangan={jenisKelamin.keterangan}
              butir={jenisKelamin.butir}
              labelJumlah="Total balita"
              satuan="balita"
              anak={<GrafikPai butir={jenisKelamin.butir} satuan="balita" />}
            />
          )}
          {umur && adaUmur && (
            <PanelGrafik
              id="stunting-umur"
              judul={umur.judul}
              keterangan={umur.keterangan}
              butir={umur.butir}
              labelJumlah="Total balita"
              satuan="balita"
              anak={<GrafikKolom butir={umur.butir} satuan="balita" />}
            />
          )}
        </div>
      )}
    </div>
  );
}
