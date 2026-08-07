import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { ambilKontakPerJenis } from "../queries";
import { JENIS_KONTAK } from "../jenis";
import { nomorTampil, tautanWhatsApp } from "@/lib/format";

/**
 * Seluruh kontak layanan desa, dikelompokkan per jenis.
 *
 * Tiap nomor punya dua tombol: WhatsApp dan telepon biasa. Bukan berlebihan —
 * sebagian warga (terutama lansia) tidak memakai WhatsApp sama sekali, dan
 * situs desa yang hanya menyediakan tautan WA menutup akses bagi mereka.
 */
export async function DaftarKontak() {
  const semua = await ambilKontakPerJenis();

  if (semua.length === 0) {
    return (
      <KotakKosong
        judul="Kontak belum diisi"
        pesan="Nomor yang bisa dihubungi warga akan tampil di sini setelah dimasukkan lewat halaman pengelolaan."
      />
    );
  }

  const kelompok = JENIS_KONTAK.map((j) => ({
    ...j,
    isi: semua.filter((k) => k.jenis === j.kode),
  })).filter((j) => j.isi.length > 0);

  return (
    <div className="space-y-12">
      {kelompok.map((j) => (
        <section key={j.kode} aria-labelledby={`kontak-${j.kode}`}>
          <h2 id={`kontak-${j.kode}`} className="text-xl font-bold">
            {j.label}
          </h2>
          {j.keterangan && (
            <p className="mt-1 text-tinta-redup">{j.keterangan}</p>
          )}

          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {j.isi.map((k) => (
              <li
                key={k.id}
                className={`rounded-xl border bg-white p-6 ${
                  // Merah hanya untuk KPPA dan darurat. Kalau semua kartu
                  // diberi warna penanda, tidak ada lagi yang menonjol.
                  k.jenis === "kppa" || k.jenis === "darurat"
                    ? "border-merah-layanan"
                    : "border-garis"
                }`}
              >
                <p className="font-semibold">{k.namaLayanan}</p>
                {k.namaPetugas && (
                  <p className="text-tinta-redup">{k.namaPetugas}</p>
                )}
                {k.jamLayanan && (
                  <p className="text-tinta-redup">{k.jamLayanan}</p>
                )}

                {k.nomorWa && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={tautanWhatsApp(k.nomorWa)}
                      className="inline-flex items-center rounded-lg bg-hijau-utama px-4 py-2.5 font-medium text-white hover:opacity-90"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${k.nomorWa}`}
                      className="inline-flex items-center rounded-lg border border-garis px-4 py-2.5 font-medium hover:border-hijau-utama"
                    >
                      Telepon {nomorTampil(k.nomorWa)}
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
