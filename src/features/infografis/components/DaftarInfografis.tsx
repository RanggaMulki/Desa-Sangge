import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { ambilInfografis } from "../queries";
import { GrafikKolom } from "./GrafikKolom";
import { GrafikPai } from "./GrafikPai";
import { GrafikPiramida } from "./GrafikPiramida";
import { PanelGrafik } from "./PanelGrafik";
import type { Butir } from "../kategori";

export async function DaftarInfografis() {
  const kelompok = await ambilInfografis();
  const cari = (kunci: string) =>
    kelompok.find((item) => item.kunci === kunci);

  const umurLaki = cari("umur-laki-laki");
  const umurPerempuan = cari("umur-perempuan");
  const agama = cari("agama");
  const statusPerkawinan = cari("status-perkawinan");
  const pendidikan = cari("pendidikan");
  const pekerjaan = cari("pekerjaan");
  const adaData = (butir: Butir[] | undefined) =>
    butir?.some((item) => item.nilai > 0) ?? false;

  const adaPiramida =
    adaData(umurLaki?.butir) && adaData(umurPerempuan?.butir);
  const adaAgama = adaData(agama?.butir);
  const adaStatusPerkawinan = adaData(statusPerkawinan?.butir);
  const adaPendidikan = adaData(pendidikan?.butir);
  const adaPekerjaan = adaData(pekerjaan?.butir);
  const adaKomposisi = adaAgama || adaStatusPerkawinan;
  const adaRincian = adaPendidikan || adaPekerjaan;

  if (!adaPiramida && !adaKomposisi && !adaRincian) {
    return (
      <KotakKosong
        judul="Data kependudukan belum diisi"
        pesan="Piramida penduduk, agama, status perkawinan, pendidikan, dan pekerjaan akan tampil setelah datanya dimasukkan lewat halaman pengelolaan."
      />
    );
  }

  return (
    <div className="space-y-8">
      {adaPiramida && umurLaki && umurPerempuan && (
        <PanelGrafik
          id="piramida-penduduk"
          judul="Piramida Penduduk"
          keterangan="Sebaran penduduk laki-laki dan perempuan pada setiap kelompok umur."
          butir={[...umurLaki.butir, ...umurPerempuan.butir]}
          labelJumlah="Total penduduk"
          anak={
            <GrafikPiramida
              laki={umurLaki.butir}
              perempuan={umurPerempuan.butir}
            />
          }
        />
      )}

      {adaKomposisi && (
        <div
          className={`grid items-start gap-8 ${
            adaAgama && adaStatusPerkawinan ? "lg:grid-cols-2" : ""
          }`}
        >
          {agama && adaAgama && (
            <PanelGrafik
              id="agama"
              judul={agama.judul}
              keterangan={agama.keterangan}
              butir={agama.butir}
              anak={<GrafikPai butir={agama.butir} />}
            />
          )}
          {statusPerkawinan && adaStatusPerkawinan && (
            <PanelGrafik
              id="status-perkawinan"
              judul={statusPerkawinan.judul}
              keterangan={statusPerkawinan.keterangan}
              butir={statusPerkawinan.butir}
              anak={<GrafikPai butir={statusPerkawinan.butir} />}
            />
          )}
        </div>
      )}

      {adaRincian && (
        <div className="grid items-start gap-8 lg:grid-cols-2">
          {pendidikan && adaPendidikan && (
            <PanelGrafik
              id="pendidikan"
              judul={pendidikan.judul}
              keterangan={pendidikan.keterangan}
              butir={pendidikan.butir}
              anak={<GrafikKolom butir={pendidikan.butir} />}
            />
          )}
          {pekerjaan && adaPekerjaan && (
            <PanelGrafik
              id="pekerjaan"
              judul={pekerjaan.judul}
              keterangan={pekerjaan.keterangan}
              butir={pekerjaan.butir}
              labelJumlah="Cakupan 10 kategori"
              anak={<GrafikKolom butir={pekerjaan.butir} />}
            />
          )}
        </div>
      )}
    </div>
  );
}
