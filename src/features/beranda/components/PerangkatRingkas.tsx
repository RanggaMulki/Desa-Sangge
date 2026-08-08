import { Seksi } from "@/features/tata-letak/components/Seksi";
import { JudulSeksi } from "@/features/tata-letak/components/JudulSeksi";
import { KatalogPerangkat } from "@/features/pemerintahan/components/KatalogPerangkat";

/**
 * Cuplikan aparat desa di beranda: foto + nama empat pejabat inti.
 *
 * Hanya EMPAT teratas (Kepala Desa, Sekretaris, dua Kepala Urusan), bukan
 * bagan pohon dan bukan seluruh perangkat — beranda cukup memperkenalkan
 * pimpinannya. Bagan lengkap dan seluruh wajah ada satu klik jauhnya lewat
 * tautan "Lihat struktur lengkap".
 *
 * Kartunya sama persis dengan yang di halaman pemerintahan (KatalogPerangkat),
 * cuma dibatasi jumlahnya — jadi tidak ada gaya kartu kedua yang harus dijaga
 * agar tetap seragam.
 */
export function PerangkatRingkas() {
  return (
    <Seksi latar="permukaan">
      <JudulSeksi
        judul="Struktur Pemerintahan"
        aksen="Desa"
        tautan={{
          label: "Lihat struktur lengkap",
          href: "/profil/pemerintahan",
        }}
      />
      <KatalogPerangkat batas={4} />
    </Seksi>
  );
}
