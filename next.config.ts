import type { NextConfig } from "next";

const hostTunnelDariEnv = (process.env.TUNNEL_HOST ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

/**
 * Quick Tunnel Cloudflare selalu membuat subdomain acak baru. Wildcard hanya
 * aktif saat development agar pengujian dari HP tidak perlu mengubah .env
 * setiap kali cloudflared dijalankan, tanpa memperluas izin di produksi.
 */
const hostTunnelDevelopment =
  process.env.NODE_ENV === "development" ? ["*.trycloudflare.com"] : [];
const hostTunnelDiizinkan = [
  ...new Set([...hostTunnelDariEnv, ...hostTunnelDevelopment]),
];

const nextConfig: NextConfig = {
  /**
   * Folder hasil build bisa dipindah lewat env.
   *
   * Gunanya supaya build pengujian tidak menimpa folder yang sedang dipakai
   * `npm run dev`. Tanpa ini, menjalankan build saat dev server hidup akan
   * menghapus cache-nya dan mematikan server yang sedang Anda buka.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  /**
   * Mengizinkan asset development, navigasi RSC, dan koneksi hot reload saat
   * halaman dibuka lewat domain tunnel. Tanpa ini Next.js membalas 403 walau
   * halaman HTML awal dari tunnel berhasil dimuat.
   */
  allowedDevOrigins: hostTunnelDiizinkan,

  images: {
    remotePatterns: [
      /**
       * Foto & berkas diunggah ke Cloudflare R2 dan disajikan dari URL publik
       * bucket-nya (pub-xxxx.r2.dev). Pola ini yang mengizinkan next/image
       * mengoptimasi gambar dari sana.
       *
       * Kalau nanti dipasang custom domain untuk R2 (mis. media.sangge.desa.id),
       * tambahkan host itu di sini sebagai baris kedua.
       */
      { protocol: "https", hostname: "*.r2.dev" },
    ],

    /**
     * Dibatasi sampai 1920 dengan sengaja.
     *
     * Bawaan Next menambah varian 2048 dan 3840, padahal foto desa berasal
     * dari kamera HP dan sudah dikompresi, jadi varian di atas 1920 cuma
     * memperbesar paksa tanpa menambah ketajaman. Tiap lebar yang berbeda
     * dihitung sebagai satu transformasi gambar di Vercel, dan kuota free
     * tier itu terbatas sementara website ini jalan tanpa dipantau.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    /**
     * Next 16 menolak nilai quality yang tidak terdaftar di sini.
     *
     * Empat nilai ini yang benar-benar dipakai komponen:
     *   80 = bawaan (kartu, galeri, hero)
     *   82 = foto dokumentasi (sejarah, potensi desa)
     *   85 = grid poster kesehatan
     *   90 = halaman detail poster — teks di dalam poster harus tetap terbaca
     * Menambah nilai quality baru di komponen WAJIB menambahkannya di sini,
     * kalau tidak Next menolak gambarnya.
     */
    qualities: [80, 82, 85, 90],
  },
  /**
   * Alamat lama sub-halaman profil.
   *
   * Keempatnya digabung menjadi satu halaman /profil. Pengalihan ini dipasang
   * supaya tautan yang sudah terlanjur disimpan anggota tim tidak berakhir di
   * halaman 404, dan langsung mendarat di bagian yang benar. Aman dihapus
   * setelah beberapa bulan, kalau memang sudah tidak ada yang memakainya.
   */
  async redirects() {
    return [
      { source: "/profil/sejarah", destination: "/profil#sejarah", permanent: true },
      { source: "/profil/visi-misi", destination: "/profil#visi-misi", permanent: true },
      // Catatan: /profil/pemerintahan TIDAK dialihkan lagi — sekarang halaman
      // nyata berisi bagan lengkap + katalog perangkat.
    ];
  },

  experimental: {
    serverActions: {
      // Perangkat desa mengunggah foto langsung dari kamera HP.
      // Default 1 MB terlalu kecil walau foto sudah dikompresi di browser.
      bodySizeLimit: "6mb",

      /**
       * Server Action Next.js menolak permintaan yang header Origin-nya
       * berbeda dari Host (proteksi CSRF bawaan). Saat website di-tunnel
       * (mis. cloudflared) supaya teman bisa membukanya dari internet lain,
       * domain tunnel dianggap "asing" sehingga SEMUA form (login, simpan,
       * unggah) ditolak — halaman publiknya tetap bisa dilihat, tapi apa pun
       * yang menekan tombol simpan gagal.
       *
       * Quick Tunnel `*.trycloudflare.com` otomatis diizinkan hanya saat
       * development. Untuk provider atau domain tunnel lain, isi TUNNEL_HOST
       * dengan host-nya (tanpa https://) saat menjalankan dev, mis:
       *   TUNNEL_HOST=abc-def.trycloudflare.com npm run dev
       * Beberapa host dipisah koma. Wildcard development tidak ikut masuk ke
       * build produksi.
       */
      allowedOrigins: hostTunnelDiizinkan,
    },
  },
};

export default nextConfig;
