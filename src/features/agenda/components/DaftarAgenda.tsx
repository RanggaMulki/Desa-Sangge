import type { Agenda } from "@/db/schema";
import { tanggalPanjang, tanggalRingkas } from "@/lib/format";

/**
 * Satu kelompok agenda, dipakai untuk "akan datang" maupun "sudah lewat".
 *
 * Tanggal ditulis di kolom kiri yang lebarnya tetap, bukan menyatu dengan
 * judul. Kolom yang rata membuat mata bisa memindai daftar tanggal saja
 * untuk menemukan kegiatan bulan ini, tanpa membaca seluruh judulnya.
 */
export function DaftarAgenda({
  daftar,
  redup = false,
}: {
  daftar: Agenda[];
  /** Untuk kegiatan yang sudah lewat: warnanya ditahan supaya tidak
      bersaing perhatian dengan jadwal yang masih akan datang. */
  redup?: boolean;
}) {
  return (
    <ul className="divide-y divide-garis border-y border-garis">
      {daftar.map((a) => (
        <li key={a.id} className="flex flex-col gap-1 py-5 sm:flex-row sm:gap-6">
          <div
            className={`shrink-0 font-semibold sm:w-40 ${
              redup ? "text-tinta-redup" : "text-hijau-utama"
            }`}
          >
            <time dateTime={a.tanggalMulai}>{tanggalPanjang(a.tanggalMulai)}</time>
            {a.tanggalSelesai && a.tanggalSelesai !== a.tanggalMulai && (
              <>
                {" – "}
                <time dateTime={a.tanggalSelesai}>
                  {tanggalRingkas(a.tanggalSelesai)}
                </time>
              </>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className={`font-medium ${redup ? "text-tinta-redup" : ""}`}>
              {a.judul}
            </p>
            {a.lokasi && <p className="text-tinta-redup">{a.lokasi}</p>}
            {a.keterangan && (
              <p className="mt-1 text-tinta-redup">{a.keterangan}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
