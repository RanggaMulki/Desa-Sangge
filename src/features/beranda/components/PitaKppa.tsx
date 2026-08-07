import { ambilKontakKppa } from "@/features/kontak-layanan/queries";
import { tautanWhatsApp, nomorTampil } from "@/lib/format";

/**
 * Ditaruh tepat di bawah hero, bukan dikubur di menu Layanan.
 *
 * Proposal menyebut Desa Sangge belum punya kanal terbuka berisi kontak
 * pengaduan perlindungan perempuan dan anak. Kalau kontaknya cuma bisa
 * ditemukan lewat dua kali klik di submenu, tujuan itu tidak tercapai.
 *
 * Tidak memakai <Seksi> karena ini pita, bukan seksi biasa: jaraknya lebih
 * rapat supaya terbaca sebagai satu baris penting, bukan bagian tersendiri.
 */
export async function PitaKppa() {
  const kppa = await ambilKontakKppa();
  if (!kppa?.nomorWa) return null;

  return (
    <section className="bg-merah-layanan text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <h2 className="text-lg font-bold">
            Layanan Perlindungan Perempuan dan Anak
          </h2>
          <p className="mt-1 text-white/85">
            Bagi warga yang mengalami kekerasan. Kerahasiaan identitas dijaga.
          </p>
        </div>

        <div className="flex shrink-0">
          <a
            href={tautanWhatsApp(kppa.nomorWa)}
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-merah-layanan hover:opacity-90"
          >
            Hubungi {nomorTampil(kppa.nomorWa)}
          </a>
        </div>
      </div>
    </section>
  );
}
