import { KontenAman } from "@/features/tata-letak/components/KontenAman";
import { ambilHalaman } from "@/features/halaman-statis/queries";
import { SLUG_HALAMAN } from "@/features/halaman-statis/halaman";
import { ambilKontakKppa } from "../queries";
import { nomorTampil, tautanWhatsApp } from "@/lib/format";

/**
 * BELUM DIVERIFIKASI ULANG — CEK SEBELUM WEBSITE TAYANG.
 *
 * SAPA 129 adalah layanan pengaduan nasional Kementerian PPPA. Nomor ini
 * ditulis di sini supaya halaman tetap berguna walaupun kontak desa belum
 * diisi, tapi WAJIB dipastikan masih aktif dengan cara menelepon langsung
 * sebelum website dipakai warga.
 *
 * Nomor darurat yang salah pada halaman kekerasan bukan sekadar tautan mati:
 * orang yang sedang dalam bahaya mencoba menghubunginya dan tidak mendapat
 * jawaban. Jangan biarkan baris ini lolos tanpa dicek.
 */
const SAPA_NASIONAL = {
  nama: "SAPA 129 — Kementerian PPPA",
  telepon: "129",
  whatsapp: "08111129129",
};

/**
 * Halaman layanan perlindungan perempuan dan anak.
 *
 * Sengaja TIDAK ada formulir pengaduan, dan ini keputusan sadar. Formulir
 * berarti cerita korban tersimpan di database yang dikelola perangkat desa
 * tanpa pelatihan penanganan data sensitif, dan halaman pengelolaannya
 * sendiri sedang berjalan tanpa login. Nomor kontak langsung memindahkan
 * percakapan ke kanal pribadi antara korban dan pendamping — tempatnya
 * memang seharusnya di situ.
 */
export async function HalamanKppa() {
  const kppa = await ambilKontakKppa();
  const halaman = await ambilHalaman(SLUG_HALAMAN.kppa);

  return (
    <>
      {/* Kontak diletakkan paling atas, sebelum penjelasan apa pun.
          Orang yang membuka halaman ini dalam keadaan mendesak tidak akan
          membaca dulu; ia mencari nomor. */}
      {kppa?.nomorWa ? (
        <section
          aria-labelledby="judul-kontak"
          className="rounded-xl border-2 border-merah-layanan bg-white p-7"
        >
          <h2 id="judul-kontak" className="text-xl font-bold">
            Hubungi pendamping desa
          </h2>
          {kppa.namaPetugas && (
            <p className="mt-1 text-tinta-redup">{kppa.namaPetugas}</p>
          )}
          {kppa.jamLayanan && (
            <p className="text-tinta-redup">{kppa.jamLayanan}</p>
          )}

          <p className="mt-5 text-3xl font-bold">
            {nomorTampil(kppa.nomorWa)}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={tautanWhatsApp(kppa.nomorWa)}
              className="inline-flex items-center rounded-lg bg-merah-layanan px-5 py-3 font-semibold text-white hover:opacity-90"
            >
              Kirim pesan WhatsApp
            </a>
            <a
              href={`tel:${kppa.nomorWa}`}
              className="inline-flex items-center rounded-lg border border-garis px-5 py-3 font-semibold hover:border-merah-layanan"
            >
              Telepon
            </a>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-garis bg-permukaan p-7">
          <p className="font-semibold">
            Kontak pendamping desa belum dicantumkan
          </p>
          <p className="mt-1 text-tinta-redup">
            Sementara ini, gunakan layanan pengaduan nasional di bawah.
          </p>
        </section>
      )}

      {/* Layanan nasional selalu ditampilkan, bahkan ketika kontak desa ada.
          Tidak semua orang siap melapor ke tetangganya sendiri, dan di desa
          pendamping desa sering kali memang orang yang dikenal korban. */}
      <section
        aria-labelledby="judul-nasional"
        className="mt-6 rounded-xl border border-garis bg-white p-7"
      >
        <h2 id="judul-nasional" className="text-lg font-semibold">
          Layanan pengaduan nasional
        </h2>
        <p className="mt-1 text-tinta-redup">
          Bisa dihubungi tanpa melalui perangkat desa.
        </p>
        <p className="mt-4 font-medium">{SAPA_NASIONAL.nama}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href={`tel:${SAPA_NASIONAL.telepon}`}
            className="inline-flex items-center rounded-lg border border-garis px-4 py-2.5 font-medium hover:border-hijau-utama"
          >
            Telepon {SAPA_NASIONAL.telepon}
          </a>
          <a
            href={tautanWhatsApp(SAPA_NASIONAL.whatsapp)}
            className="inline-flex items-center rounded-lg border border-garis px-4 py-2.5 font-medium hover:border-hijau-utama"
          >
            WhatsApp {nomorTampil(SAPA_NASIONAL.whatsapp)}
          </a>
        </div>
      </section>

      {halaman && halaman.konten.trim() !== "" && (
        <div className="mt-12">
          <KontenAman html={halaman.konten} />
        </div>
      )}

      <section
        aria-labelledby="judul-catatan"
        className="mt-12 border-t border-garis pt-8"
      >
        <h2 id="judul-catatan" className="text-lg font-semibold">
          Yang perlu diketahui sebelum menghubungi
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-tinta-redup">
          <li>
            Laporan disampaikan langsung lewat telepon atau WhatsApp.
            Website ini tidak menyediakan formulir pengaduan, dan tidak
            menyimpan cerita maupun identitas pelapor.
          </li>
          <li>
            Anda boleh melapor untuk diri sendiri maupun untuk orang lain
            yang Anda ketahui sedang mengalami kekerasan.
          </li>
          <li>
            Bila keadaan sedang membahayakan keselamatan jiwa, hubungi
            Polisi di 110 lebih dulu.
          </li>
        </ul>
      </section>
    </>
  );
}
