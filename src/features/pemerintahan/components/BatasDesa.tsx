import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { ambilBatasWilayah } from "../queries";

const LABEL_ARAH: Record<string, string> = {
  utara: "Sebelah Utara",
  timur: "Sebelah Timur",
  selatan: "Sebelah Selatan",
  barat: "Sebelah Barat",
};

/**
 * Batas wilayah desa dalam empat kartu.
 *
 * Situs desa rujukan menampilkan keempatnya dengan isi "-" karena datanya
 * tidak pernah diisi. Di sini baris yang kosong tidak dibuat sama sekali,
 * jadi kalau baru dua arah yang diketahui, yang tampil dua — bukan dua data
 * dan dua tanda hubung yang membuat halaman terlihat setengah jadi.
 */
export async function BatasDesa() {
  const batas = await ambilBatasWilayah();

  if (batas.length === 0) {
    return (
      <KotakKosong
        judul="Batas wilayah belum diisi"
        pesan="Desa dan kecamatan yang berbatasan dengan Desa Sangge akan tampil di sini setelah dimasukkan lewat halaman pengelolaan."
      />
    );
  }

  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {batas.map((b) => (
        <div
          key={b.arah}
          className="rounded-xl border border-garis bg-white p-6"
        >
          <dt className="text-tinta-redup">{LABEL_ARAH[b.arah]}</dt>
          <dd className="mt-1 text-lg font-semibold">{b.keterangan}</dd>
        </div>
      ))}
    </dl>
  );
}
