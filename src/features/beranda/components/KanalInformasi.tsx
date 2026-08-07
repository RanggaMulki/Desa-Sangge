import Link from "next/link";
import { Seksi } from "@/features/tata-letak/components/Seksi";
import { JudulSeksi } from "@/features/tata-letak/components/JudulSeksi";
import { KATEGORI_INFORMASI } from "@/features/artikel/kategori";
import { hitungArtikelPerKategori } from "@/features/artikel/queries";
import { ScrollReveal } from "./ScrollReveal";

/**
 * Tiga kanal edukasi hasil kerja anggota tim KKN.
 *
 * Kanal yang belum punya satu pun tulisan tidak ditampilkan. Menyebut sebuah
 * kanal lalu membawa pengunjung ke halaman kosong lebih buruk daripada tidak
 * menyebutnya sama sekali.
 */
export async function KanalInformasi() {
  const jumlah = await hitungArtikelPerKategori();
  const kanalTerisi = KATEGORI_INFORMASI.filter(
    (k) => (jumlah[k.kode] ?? 0) > 0,
  );

  if (kanalTerisi.length === 0) return null;

  return (
    <Seksi latar="permukaan">
      <JudulSeksi
        judul="Informasi untuk"
        aksen="Warga"
        keterangan="Bacaan praktis yang disusun bersama bidan desa, kader posyandu, dan kelompok tani."
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kanalTerisi.map((k, i) => (
          <li key={k.kode} className="h-full">
            <ScrollReveal delay={i * 120} className="h-full">
              <Link
                href={`/informasi/${k.kode}`}
                className="kartu-interaktif group flex h-full flex-col rounded-lg border border-garis bg-[#fbfcf8] p-6 hover:border-hijau-utama"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-hijau-muda text-hijau-pekat">
                  <IkonKanal kode={k.kode} />
                </span>
                <h3 className="mt-3 text-lg font-bold text-hijau-pekat group-hover:text-oker">
                  {k.label}
                </h3>
                <p className="mt-2 flex-1 text-tinta-redup">{k.deskripsi}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-hijau-muda px-3 py-0.5 text-xs font-semibold text-hijau-pekat">
                    {jumlah[k.kode]} tulisan
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-hijau-utama transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                </div>
              </Link>
            </ScrollReveal>
          </li>
        ))}
      </ul>
    </Seksi>
  );
}

function IkonKanal({ kode }: { kode: string }) {
  const umum = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (kode === "kesehatan") {
    return (
      <svg {...umum}>
        <path d="M12 21s-7 -4.4 -7 -11a4 4 0 0 1 7 -2.6a4 4 0 0 1 7 2.6c0 6.6 -7 11 -7 11z" />
        <path d="M9 12h6M12 9v6" />
      </svg>
    );
  }

  if (kode === "perawatan-alat") {
    return (
      <svg {...umum}>
        <path d="M14.7 6.3a4 4 0 0 0 -5 -5l2.1 2.1l-2.4 2.4l-2.1 -2.1a4 4 0 0 0 5 5l7.4 7.4a2.1 2.1 0 0 1 -3 3l-7.4 -7.4" />
        <path d="M5 19l4.5 -4.5" />
      </svg>
    );
  }

  return (
    <svg {...umum}>
      <path d="M4 5.5a3.5 3.5 0 0 1 3.5 -1.5c2 0 3.5 1 4.5 2.5c1 -1.5 2.5 -2.5 4.5 -2.5a3.5 3.5 0 0 1 3.5 1.5v13a3.5 3.5 0 0 0 -3.5 -1.5c-2 0 -3.5 1 -4.5 2.5c-1 -1.5 -2.5 -2.5 -4.5 -2.5a3.5 3.5 0 0 0 -3.5 1.5z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}
