import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { ambilSemuaGaleri } from "../queries";
import { GaleriInteraktif } from "./GaleriInteraktif";

/**
 * Galeri foto kegiatan desa.
 *
 * Bagian ini hanya mengambil data (server) lalu menyerahkannya ke lapisan
 * interaktif (GaleriInteraktif) yang menampilkan kisi foto + pratinjau
 * lightbox. Datanya tetap diambil di server supaya cepat dan terindeks.
 */
export async function GridGaleri() {
  const foto = await ambilSemuaGaleri();

  if (foto.length === 0) {
    return (
      <KotakKosong
        judul="Belum ada foto"
        pesan="Dokumentasi kegiatan Desa Sangge akan tampil di sini setelah diunggah lewat halaman pengelolaan."
      />
    );
  }

  return (
    <GaleriInteraktif
      foto={foto.map((f) => ({
        id: f.id,
        judul: f.judul,
        gambarUrl: f.gambarUrl,
        keterangan: f.keterangan,
        tanggal: f.tanggal,
      }))}
    />
  );
}
