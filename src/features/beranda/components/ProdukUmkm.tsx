import { Seksi } from "@/features/tata-letak/components/Seksi";
import { JudulSeksi } from "@/features/tata-letak/components/JudulSeksi";
import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";

/**
 * Beli dari Desa — etalase produk UMKM warga.
 *
 * Belum ada data produk, jadi seksi menampilkan keadaan kosong yang jujur, BUKAN
 * produk atau harga karangan. Setelah warga punya produk untuk dipromosikan,
 * daftarnya diisi lewat pengelolaan.
 */
export function ProdukUmkm() {
  return (
    <Seksi latar="permukaan">
      <JudulSeksi judul="Beli dari Desa" />
      <KotakKosong
        judul="Produk UMKM segera hadir"
        pesan="Produk-produk buatan warga Desa Sangge akan ditampilkan di sini setelah didaftarkan lewat pengelolaan website."
      />
    </Seksi>
  );
}
