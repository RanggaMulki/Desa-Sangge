import Image from "next/image";
import { IDENTITAS } from "@/features/tata-letak/navigasi";

/**
 * Hero dengan foto persawahan Desa Sangge.
 *
 * Fotonya milik desa sendiri, bukan foto stok. Ini yang membuat halaman
 * terasa benar-benar milik Sangge, bukan template yang bisa dipakai desa
 * mana pun.
 *
 * Lapisan gelap di atas foto bukan hiasan: teks putih di atas foto langit
 * yang terang tidak akan terbaca tanpa itu, terutama di layar HP di bawah
 * sinar matahari.
 *
 * Statistik tidak lagi di dalam hero — ia menjadi strip gelap tersendiri
 * di bawah hero (lihat StripStatistik), sehingga foto tampil penuh tanpa
 * terpotong oleh kartu putih.
 */
export function Hero() {
  return (
    <section className="relative isolate -mt-[var(--tinggi-header)] flex min-h-[100svh] flex-col overflow-hidden">
      <Image
        src="/gambar/sawah-sangge.jpg"
        alt="Hamparan sawah Desa Sangge dengan gubuk dan petani yang sedang bekerja"
        fill
        priority
        sizes="100vw"
        quality={80}
        /**
         * Titik fokus digeser ke bawah, bukan tengah.
         *
         * Hero jauh lebih lebar daripada tinggi, jadi foto 4:3 ini terpotong
         * berat dan hanya sekitar sepertiga tingginya yang terlihat. Dengan
         * titik tengah, yang tampil justru langit berkabut dan pepohonan.
         * Digeser ke 85% supaya hamparan sawah, gubuk, dan petaninya yang
         * terlihat, karena itu isi foto yang sebenarnya bercerita.
         */
        className="-z-10 object-cover object-[center_85%]"
      />

      {/**
       * Lapisan hitam netral, bukan hijau.
       *
       * Hitam hanya menurunkan kecerahan tanpa menggeser rona, jadi hijau
       * sawah tetap hijau dan genteng tetap cokelat. Lapisan berwarna
       * sebelumnya membuat seluruh foto tampak tercelup hijau.
       *
       * Gradien dibuat paling pekat di tengah, tempat teks berada, dan
       * paling tipis di tepi atas-bawah supaya bagian foto yang tidak
       * tertimpa teks tampil sedekat mungkin dengan warna aslinya.
       *
       * Tidak bisa dihilangkan sama sekali: diukur dari foto ini, teks putih
       * tanpa lapisan hanya mencapai 2,85:1, di bawah ambang 3:1 untuk judul
       * besar sekalipun.
       */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/15 via-black/40 to-black/25"
      />

      {/* Gradien bawah — transisi mulus ke strip statistik gelap berikutnya */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#2e303e]/60 to-transparent"
      />

      {/* Bayangan tipis pada teks. Tidak dihitung WCAG, tapi sangat membantu
          keterbacaan di bagian foto yang ramai seperti dedaunan, sehingga
          lapisan gelapnya bisa ditahan setipis mungkin. */}
      {/* Teks mengisi seluruh ruang hero dan terpusat secara vertikal. */}
      <div className="flex flex-1 flex-col justify-center px-5 pt-[var(--tinggi-header)] text-center text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.45)]">
        <div className="mx-auto max-w-4xl py-10 sm:py-12">
          {/* Lencana pemerintah — penanda resmi di atas judul */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/15 px-4 py-1.5 text-sm font-medium">
            <span className="inline-block size-2 rounded-full bg-hijau-muda" />
            Website Resmi Pemerintah Desa
          </span>

          <h1 className="judul-hero-beranda text-balance text-white">
            <span className="block">Selamat Datang</span>
            <span className="mt-2 block">
              di <span className="text-hijau-muda">{IDENTITAS.nama}</span>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-[65ch] text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
            Sumber informasi terbaru tentang pemerintahan dan pelayanan publik
            di{" "}
            <strong className="font-bold text-hijau-muda">
              {IDENTITAS.nama}
            </strong>
            , Kecamatan Klego, Kabupaten Boyolali.
          </p>
        </div>
      </div>
    </section>
  );
}

