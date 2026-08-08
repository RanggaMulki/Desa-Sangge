/**
 * Satu bagian bernomor tautan di dalam halaman panjang.
 *
 * `id`-nya dipakai dua hal sekaligus: sasaran daftar isi di atas halaman,
 * dan penanda judul bagi pembaca layar lewat `aria-labelledby`.
 *
 * `scroll-mt` wajib ada. Header website ini menempel di atas layar, jadi
 * tanpa jarak itu bagian yang dituju akan berhenti tepat di balik header dan
 * judulnya tertutup — pengunjung mengira tautannya tidak berfungsi.
 */
export function SeksiBerjudul({
  id,
  judul,
  keterangan,
  children,
}: {
  id: string;
  judul: string;
  keterangan?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`judul-${id}`}
      className="scroll-mt-[calc(var(--tinggi-header)+1.5rem)]"
    >
      <h2
        id={`judul-${id}`}
        className="judul-seksi-beranda text-balance text-hijau-pekat"
      >
        {judul}
      </h2>
      {keterangan && <p className="mt-1 text-tinta-redup">{keterangan}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
