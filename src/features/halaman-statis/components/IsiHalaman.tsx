import { KontenAman } from "@/features/tata-letak/components/KontenAman";
import { KotakKosong } from "@/features/tata-letak/components/KotakKosong";
import { ambilHalaman } from "../queries";
import type { SlugHalaman } from "../halaman";

/**
 * Isi satu halaman statis, dibaca dari database.
 *
 * Halaman profil, sejarah, dan visi-misi semuanya memakai komponen ini.
 * Isinya diubah pengurus desa lewat halaman pengelolaan, tidak lewat kode —
 * itu syarat utama proyek ini, karena setelah KKN selesai tidak ada lagi
 * yang bisa menyunting berkas dan men-deploy ulang.
 *
 * Lebar bacanya dibatasi maks-2xl. Baris teks yang membentang selebar layar
 * laptop membuat mata kehilangan jejak saat pindah ke baris berikutnya.
 */
export async function IsiHalaman({ slug }: { slug: SlugHalaman }) {
  const halaman = await ambilHalaman(slug);

  if (!halaman || halaman.konten.trim() === "") {
    return (
      <KotakKosong
        judul="Isi halaman ini belum ditulis"
        pesan="Pengurus desa dapat mengisinya lewat halaman pengelolaan. Bagian ini akan langsung tampil begitu disimpan."
      />
    );
  }

  return (
    <div className="max-w-2xl">
      <KontenAman html={halaman.konten} />
    </div>
  );
}
