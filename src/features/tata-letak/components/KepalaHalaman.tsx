/**
 * Judul halaman, ditulis biasa di atas isi.
 *
 * Sebelumnya ini berupa pita berlatar hijau muda lengkap dengan remah roti,
 * meniru situs desa rujukan. Dilepas karena di layar nyata hasilnya dua pita
 * bertumpuk tepat di bawah satu sama lain — header hijau tua, lalu pita hijau
 * muda — dan keduanya terbaca sebagai dua header. Judul halaman tidak butuh
 * latar sendiri untuk terlihat sebagai judul; ukurannya sudah cukup.
 *
 * Yang sengaja DIPERTAHANKAN adalah <h1>-nya. Satu halaman tanpa <h1> tidak
 * terlihat cacat di layar, tapi pembaca layar kehilangan penanda "halaman ini
 * tentang apa", dan mesin pencari kehilangan judul utamanya.
 */
export function KepalaHalaman({
  judul,
  keterangan,
}: {
  judul: string;
  keterangan?: string;
}) {
  return (
    <div className="mb-10 sm:mb-12">
      <h1 className="text-balance text-4xl font-bold text-hijau-utama sm:text-5xl">
        {judul}
      </h1>
      {keterangan && (
        <p className="mt-3 max-w-3xl text-tinta-redup">{keterangan}</p>
      )}
    </div>
  );
}
