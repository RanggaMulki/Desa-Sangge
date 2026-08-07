import { Seksi } from "@/features/tata-letak/components/Seksi";
import { JudulSeksi } from "@/features/tata-letak/components/JudulSeksi";
import { ambilVideoProfil } from "@/features/pengaturan/queries";
import { urlSematanYouTube } from "@/features/pengaturan/video";
import { ScrollReveal } from "./ScrollReveal";

/**
 * Video profil desa di beranda, diletakkan tepat di bawah Sambutan Kepala
 * Desa. Kepala seksinya memakai komponen yang sama dengan bagian beranda lain
 * agar ukuran, warna, dan jaraknya tetap konsisten.
 *
 * Video disematkan dari YouTube; situs tidak menyimpan berkasnya (lihat alasan
 * kuota di features/pengaturan/video.ts). Seksinya disembunyikan bila tautannya
 * belum diisi atau tidak sah — mengikuti aturan beranda "seksi kosong tidak
 * dirender".
 */
export async function VideoProfil() {
  const tautan = await ambilVideoProfil();
  const embed = urlSematanYouTube(tautan);
  if (!embed) return null;

  return (
    <Seksi latar="permukaan" aria-label="Video profil Desa Sangge">
      <JudulSeksi
        judul="Video Profil"
        aksen="Desa Sangge"
        keterangan="Mengenal Desa Sangge lebih dekat melalui tayangan profil desa."
      />

      <ScrollReveal>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-garis bg-black shadow-sm">
          <div className="relative aspect-video">
            <iframe
              src={embed}
              title="Video Profil Desa Sangge"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </ScrollReveal>
    </Seksi>
  );
}
