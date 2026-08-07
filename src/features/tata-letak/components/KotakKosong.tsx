/**
 * Tampilan saat sebuah halaman belum ada isinya.
 *
 * Di beranda, seksi yang kosong disembunyikan sepenuhnya. Halaman utuh tidak
 * bisa diperlakukan begitu: pengunjung yang mengklik "Agenda" harus mendarat
 * di suatu tempat. Jadi aturannya berubah — bukan disembunyikan, melainkan
 * dijelaskan.
 *
 * Situs desa rujukan menulis "Belum Ada Data" dan berhenti di situ. Kalimat
 * itu benar tapi tidak menolong siapa pun. Di sini kalimatnya diarahkan ke
 * pengunjung: apa yang nanti akan ada di halaman ini, dan ke mana ia bisa
 * pergi sementara ini.
 */
export function KotakKosong({
  judul,
  pesan,
  children,
}: {
  judul: string;
  pesan: string;
  /** Tempat menaruh tautan alternatif, mis. kembali ke beranda. */
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-garis bg-permukaan px-6 py-14 text-center">
      <p className="text-lg font-semibold">{judul}</p>
      <p className="mx-auto mt-2 max-w-md text-tinta-redup">{pesan}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
