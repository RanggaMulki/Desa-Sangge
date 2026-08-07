import type { Lampiran } from "@/db/schema";
import { ukuranBerkas } from "@/lib/format";

/**
 * Daftar berkas yang menyertai artikel: leaflet kesehatan (Regita) dan
 * infografis perawatan alat (Fayyadh).
 *
 * Dibuat menonjol dengan kotak berlatar sendiri, bukan sekadar tautan di
 * tengah tulisan. Untuk dua anggota tim, berkas inilah luaran utamanya —
 * artikelnya justru pengantar. Kalau tautan unduhnya tenggelam di paragraf,
 * yang paling ingin dibaca warga malah paling sulit ditemukan.
 */
export function KotakLampiran({ berkas }: { berkas: Lampiran[] }) {
  if (berkas.length === 0) return null;

  return (
    <section
      aria-labelledby="judul-lampiran"
      className="mt-10 rounded-xl border border-garis bg-permukaan p-6"
    >
      <h2 id="judul-lampiran" className="text-lg font-semibold">
        Berkas yang bisa diunduh
      </h2>

      <ul className="mt-4 space-y-3">
        {berkas.map((b) => (
          <li key={b.id}>
            <a
              href={b.url}
              // Mendorong peramban mengunduh, bukan membuka PDF di tab baru.
              download
              className="flex items-center gap-4 rounded-lg border border-garis bg-white p-4 hover:border-hijau-utama"
            >
              <span
                aria-hidden="true"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-hijau-muda font-semibold text-hijau-utama uppercase"
              >
                {b.tipe === "pdf" ? "PDF" : "JPG"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{b.nama}</span>
                <span className="block text-tinta-redup">
                  {b.tipe === "pdf" ? "Dokumen PDF" : "Gambar"} ·{" "}
                  {ukuranBerkas(b.ukuranByte)}
                </span>
              </span>
              <span className="shrink-0 font-medium text-hijau-utama">
                Unduh
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
