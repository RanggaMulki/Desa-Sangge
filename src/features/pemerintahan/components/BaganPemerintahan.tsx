import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { ambilPengisiStruktur } from "../queries";
import { labelJabatan, semuaKunci } from "../struktur";

/**
 * Satu kotak jabatan: kepala hijau berisi jabatan (struktur tetap), badan putih
 * berisi nama (dari database, bisa diubah pengurus). Nama kosong jadi tanda
 * hubung, bukan disembunyikan, supaya bentuk bagan tetap utuh.
 */
function Kotak({
  jabatan,
  nama,
  utama = false,
}: {
  jabatan: string;
  nama: string | null;
  utama?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-hijau-utama bg-white ${
        utama ? "shadow-[0_4px_10px_rgba(0,0,0,0.1)]" : ""
      }`}
    >
      <p
        className={`bg-hijau-utama px-3 text-center font-bold uppercase leading-tight text-white ${
          utama ? "py-2.5 text-base" : "py-2 text-sm"
        }`}
      >
        {jabatan}
      </p>
      <p
        className={`px-3 text-center font-semibold leading-tight text-tinta ${
          utama ? "py-3 text-lg" : "py-2.5 text-base"
        }`}
      >
        {nama ?? "—"}
      </p>
    </div>
  );
}

/** Ruas garis penghubung. Semua garis hijau tua 2px, seperti bagan cetak. */
const GARIS = "bg-hijau-utama";

/**
 * Bagan struktur pemerintahan desa, ditata persis bagan resmi:
 *
 *              Kepala Desa
 *                   │
 *      ┌────────────┴──────────────┐
 *      │                     Sekretaris Desa
 *      │                           │
 *      │                   ┌───────┴───────┐
 *      │                Kaur Umum      Kaur Keuangan
 *      │
 *   ┌──┼────┬────┬────┬────┐
 *  Kasi  Kasi  Kadus Kadus Kadus
 *
 * Susunannya tetap (struktur.ts); nama tiap kotak diambil dari database lewat
 * `posisi`. Kotak diletakkan pada kisi 5 kolom supaya benar-benar sejajar, dan
 * garis komandonya digambar sebagai ruas-ruas di sela baris. Di layar kecil
 * seluruh bagan bisa digeser mendatar agar bentuknya tidak rusak.
 */
export async function BaganPemerintahan() {
  const peta = await ambilPengisiStruktur();
  const label = labelJabatan();
  const nama = (k: string) => peta.get(k)?.nama ?? null;
  const jab = (k: string) => label.get(k) ?? k;

  if (!semuaKunci().some((k) => nama(k))) {
    return (
      <KotakKosong
        judul="Struktur pemerintahan belum diisi"
        pesan="Nama perangkat Desa Sangge akan tampil pada bagan ini setelah dimasukkan lewat halaman pengelolaan."
      />
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="mx-auto grid min-w-[64rem] grid-cols-5 items-stretch">
          {/* Baris 1 — Kepala Desa, di tengah seluruh kisi (50%). */}
          <div
            style={{ gridColumn: "1 / -1", gridRow: 1 }}
            className="flex justify-center"
          >
            <div className="w-72">
              <Kotak jabatan={jab("kepala-desa")} nama={nama("kepala-desa")} utama />
            </div>
          </div>

          {/* Baris 2 — garis tegak dari Kepala Desa turun, lalu di titik simpang
              bercabang mendatar ke kanan menuju Sekretaris. Garis tegaknya
              menembus penuh baris ini supaya menyambung ke garis di bawahnya. */}
          <div
            style={{ gridColumn: "1 / -1", gridRow: 2 }}
            className="relative h-10"
          >
            {/* garis tegak utama di 50%, dari Kepala Desa menembus ke bawah */}
            <div
              className={`absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 ${GARIS}`}
            />
            {/* cabang mendatar di simpang (1.25rem) menuju 80% */}
            <div className={`absolute left-1/2 right-[20%] top-5 h-0.5 ${GARIS}`} />
            {/* turun ke Sekretaris di 80% */}
            <div
              className={`absolute right-[20%] top-5 bottom-0 w-0.5 translate-x-1/2 ${GARIS}`}
            />
          </div>

          {/* Baris 3-5, kolom tengah — penyambung garis tegak utama supaya tidak
              putus saat melewati blok Sekretaris/Kaur di sisi kanan. */}
          <div
            style={{ gridColumn: 3, gridRow: 3 }}
            className={`w-0.5 justify-self-center self-stretch ${GARIS}`}
          />
          <div
            style={{ gridColumn: 3, gridRow: 4 }}
            className={`w-0.5 justify-self-center self-stretch ${GARIS}`}
          />
          <div
            style={{ gridColumn: 3, gridRow: 5 }}
            className={`w-0.5 justify-self-center self-stretch ${GARIS}`}
          />

          {/* Baris 3 — Sekretaris Desa, di tengah kolom 4-5 (80%). */}
          <div
            style={{ gridColumn: "4 / 6", gridRow: 3 }}
            className="flex justify-center px-1.5"
          >
            <div className="w-64">
              <Kotak jabatan={jab("sekretaris")} nama={nama("sekretaris")} />
            </div>
          </div>

          {/* Baris 4 — turun dari Sekretaris, palang ke dua Kaur. */}
          <div
            style={{ gridColumn: "4 / 6", gridRow: 4 }}
            className="relative h-6"
          >
            <div
              className={`absolute left-1/2 top-0 h-3 w-0.5 -translate-x-1/2 ${GARIS}`}
            />
            <div className={`absolute left-1/4 right-1/4 top-3 h-0.5 ${GARIS}`} />
            <div className={`absolute left-1/4 top-3 h-3 w-0.5 ${GARIS}`} />
            <div className={`absolute right-1/4 top-3 h-3 w-0.5 ${GARIS}`} />
          </div>

          {/* Baris 5 — Kaur Umum (kolom 4) dan Kaur Keuangan (kolom 5). */}
          <div style={{ gridColumn: 4, gridRow: 5 }} className="px-1.5">
            <Kotak jabatan={jab("kaur-umum")} nama={nama("kaur-umum")} />
          </div>
          <div style={{ gridColumn: 5, gridRow: 5 }} className="px-1.5">
            <Kotak jabatan={jab("kaur-keuangan")} nama={nama("kaur-keuangan")} />
          </div>

          {/* Baris 6 — palang bawah: dari garis utama (50%) menyebar ke 5 kotak. */}
          <div
            style={{ gridColumn: "1 / -1", gridRow: 6 }}
            className="relative h-8"
          >
            <div
              className={`absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 ${GARIS}`}
            />
            <div className={`absolute left-[10%] right-[10%] top-4 h-0.5 ${GARIS}`} />
            {[10, 30, 50, 70, 90].map((p) => (
              <div
                key={p}
                style={{ left: `${p}%` }}
                className={`absolute top-4 h-4 w-0.5 -translate-x-1/2 ${GARIS}`}
              />
            ))}
          </div>

          {/* Baris 7 — lima pelaksana, satu per kolom, urut seperti bagan resmi. */}
          {[
            "kasi-pemerintahan",
            "kasi-kesra",
            "kadus-1",
            "kadus-2",
            "kadus-3",
          ].map((k, i) => (
            <div
              key={k}
              style={{ gridColumn: i + 1, gridRow: 7 }}
              className="px-1.5"
            >
              <Kotak jabatan={jab(k)} nama={nama(k)} />
            </div>
          ))}
      </div>
    </div>
  );
}
