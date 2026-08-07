import { JudulPengelolaan } from "@/features/admin/components/SedangDisiapkan";
import { FormGaleri } from "@/features/galeri/components/FormGaleri";
import { ambilSemuaGaleri } from "@/features/galeri/queries";

export const metadata = { title: "Galeri" };

export default async function KelolaGaleri() {
  const foto = await ambilSemuaGaleri();

  return (
    <>
      <JudulPengelolaan
        judul="Galeri"
        keterangan="Foto kegiatan desa yang tampil di halaman Galeri. Cukup isi nama kegiatan dan pilih foto — fotonya disimpan di Cloudflare, database hanya menyimpan tautannya."
      />
      <FormGaleri
        awal={foto.map((f) => ({
          id: f.id,
          judul: f.judul,
          gambarUrl: f.gambarUrl,
        }))}
      />
    </>
  );
}
