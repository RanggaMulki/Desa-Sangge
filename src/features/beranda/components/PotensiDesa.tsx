import Image from "next/image";
import { Seksi } from "@/features/tata-letak/components/Seksi";
import { ScrollReveal } from "./ScrollReveal";

/**
 * Potensi utama Desa Sangge adalah pertanian.
 *
 * Bagian ini sengaja lengkap di beranda karena tidak memiliki halaman
 * tersendiri. Foto yang dipakai merupakan dokumentasi persawahan Desa Sangge,
 * bukan gambar stok.
 */
export function PotensiDesa() {
  return (
    <Seksi latar="terang" aria-labelledby="judul-potensi-pertanian">
      <ScrollReveal>
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-10 lg:gap-14">
          <figure className="overflow-hidden rounded-lg bg-hijau-muda">
            <div className="relative aspect-[4/3]">
              <Image
                src="/gambar/sawah-sangge.jpg"
                alt="Petani bekerja di hamparan persawahan Desa Sangge"
                fill
                sizes="(min-width: 768px) 52vw, 100vw"
                quality={82}
                className="object-cover object-center"
              />
            </div>
            <figcaption className="bg-hijau-pekat px-5 py-3 text-sm font-medium text-white/85">
              Hamparan persawahan Desa Sangge
            </figcaption>
          </figure>

          <div className="min-w-0">
            <h2
              id="judul-potensi-pertanian"
              className="judul-seksi-beranda text-balance text-hijau-pekat"
            >
              Potensi <span className="text-oker">Pertanian</span>
            </h2>

            <div className="mt-5 max-w-[65ch] space-y-4 leading-relaxed text-tinta-redup">
              <p>
                Hamparan sawah dan tegalan dimanfaatkan warga untuk menanam
                padi serta palawija. Kegiatan pertanian ini menjadi kekuatan
                desa yang terus dijaga dan dikembangkan.
              </p>
              <p>
                Pengembangan pertanian diarahkan pada pemanfaatan pupuk
                organik dan penguatan swadaya beras warga untuk mendukung
                kemandirian pangan Desa Sangge.
              </p>
            </div>

            <dl className="mt-8 grid gap-5 border-y border-garis py-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-oker">
                  Hasil Pertanian
                </dt>
                <dd className="mt-1 font-bold text-hijau-pekat">
                  Padi dan palawija
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-oker">
                  Arah Pengembangan
                </dt>
                <dd className="mt-1 font-bold text-hijau-pekat">
                  Pupuk organik dan swadaya beras
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </ScrollReveal>
    </Seksi>
  );
}
