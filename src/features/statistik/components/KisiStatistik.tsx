import { ambilStatistik } from "../queries";
import { angka } from "@/lib/format";

/**
 * Kisi angka desa, tanpa pembungkus seksi.
 *
 * Dipisah dari seksi beranda karena dipakai dua tempat dengan bingkai yang
 * berbeda: di beranda ia berada dalam seksi berlatar hijau muda, di halaman
 * profil ia berdiri di dalam kolom teks biasa. Yang sama hanya isinya.
 *
 * Mengembalikan null kalau belum ada data. Pemanggil wajib menanganinya —
 * di beranda seksinya hilang sama sekali, di halaman profil digantikan
 * keterangan bahwa datanya belum diisi.
 */
export async function KisiStatistik({ terang = false }: { terang?: boolean }) {
  const data = await ambilStatistik();
  if (data.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {data.map((d) => (
        <div
          key={d.id}
          className={`rounded-xl p-6 ${
            terang ? "border border-garis bg-white" : "bg-white"
          }`}
        >
          <dt className="text-tinta-redup">{d.label}</dt>
          <dd className="mt-1 text-3xl font-bold">
            {angka(d.nilai)}
            {d.satuan && (
              <span className="ml-1.5 text-base font-medium text-tinta-redup">
                {d.satuan}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Tahun data terbaru, untuk keterangan "Data tahun 2026". Null kalau kosong. */
export async function tahunStatistikTerbaru() {
  const data = await ambilStatistik();
  if (data.length === 0) return null;
  return Math.max(...data.map((d) => d.tahun));
}
