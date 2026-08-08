import { Seksi } from "@/features/tata-letak/components/Seksi";
import { JudulSeksi } from "@/features/tata-letak/components/JudulSeksi";
import { ambilAgendaTerdekat } from "@/features/agenda/queries";
import { tanggalRingkas } from "@/lib/format";
import { ScrollReveal } from "./ScrollReveal";

/**
 * Daftar sederhana, bukan kalender bulanan.
 *
 * Desa hanya punya beberapa kegiatan per bulan, jadi kalender penuh justru
 * menampilkan lebih banyak kotak kosong daripada isi, dan berat dibuka di HP.
 */
export async function AgendaTerdekat() {
  const daftar = await ambilAgendaTerdekat(4);
  if (daftar.length === 0) return null;

  return (
    <Seksi>
      <JudulSeksi
        judul="Agenda"
        aksen="Terdekat"
        tautan={{ label: "Lihat semua agenda", href: "/agenda" }}
      />

      <ScrollReveal>
        <ul className="divide-y divide-garis border-y border-garis">
          {daftar.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-5 px-1 py-5 sm:px-3"
            >
              <span className="flex shrink-0 flex-col items-center rounded-lg bg-hijau-muda px-3 py-2 text-center">
                <span className="text-xs font-bold uppercase text-oker">
                  {tanggalRingkas(a.tanggalMulai).split(" ")[1]}
                </span>
                <span className="text-2xl font-bold text-hijau-utama">
                  {tanggalRingkas(a.tanggalMulai).split(" ")[0]}
                </span>
              </span>
              <span className="flex-1">
                <span className="block font-bold leading-snug text-hijau-pekat">
                  {a.judul}
                </span>
                {a.lokasi && (
                  <span className="mt-0.5 flex items-center gap-1 text-sm text-tinta-redup">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="shrink-0 text-hijau-utama"
                    >
                      <path d="M12 21s6 -5.3 6 -11a6 6 0 1 0 -12 0c0 5.7 6 11 6 11z" />
                      <circle cx="12" cy="10" r="2" />
                    </svg>
                    {a.lokasi}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </Seksi>
  );
}
