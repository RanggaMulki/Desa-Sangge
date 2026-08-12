/**
 * Alamat dasar situs — dipakai metadata, sitemap, robots, dan data terstruktur.
 *
 * Urutan: SITUS_URL (diisi manual saat sudah punya domain, mis. desasangge.com)
 * → domain produksi Vercel (otomatis) → localhost (pengembangan).
 */
export const alamatSitus =
  process.env.SITUS_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
