/**
 * Pengaturan titik peta desa.
 *
 * Disimpan di tabel `pengaturan` sebagai teks, bukan ditanam di kode, supaya
 * pengurus desa bisa memindahkan titik petanya sendiri tanpa developer.
 */
export const KUNCI_PETA = {
  lat: "peta.lat",
  lng: "peta.lng",
  zoom: "peta.zoom",
  catatan: "peta.catatan",
} as const;

/** Perbesaran bawaan: cukup rapat untuk menunjuk satu kantor desa. */
export const ZOOM_BAWAAN = 16;

export type Titik = { lat: number; lng: number };

/**
 * Membaca titik dari apa pun yang ditempel pengurus desa.
 *
 * Sengaja menerima dua bentuk, karena keduanya sama-sama wajar dilakukan orang:
 *
 * 1. Koordinat langsung — hasil klik kanan di Google Maps lalu menyalin
 *    angkanya, mis. `-7.456789, 110.789012`
 * 2. Tautan Google Maps lengkap — yang mengandung `@lat,lng,zoom`, mis.
 *    `https://www.google.com/maps/place/.../@-7.456789,110.789012,17z/...`
 *
 * 3. Tautan pendek hasil tombol "Bagikan" (maps.app.goo.gl) — koordinatnya
 *    tidak ada di dalam teksnya, jadi tautannya ditelusuri dulu di server
 *    (lihat `bukaTautanPendek` di actions.ts) sebelum dibaca fungsi ini.
 */
export function bacaTitik(masukan: string): Titik | null {
  const teks = masukan.trim();
  if (!teks) return null;

  /**
   * Urutannya penting.
   *
   * `!3d<lat>!4d<lng>` adalah titik TEMPAT-nya — inilah yang benar. Sedangkan
   * `@<lat>,<lng>` cuma posisi kamera saat tautan dibuat, yang bisa melenceng
   * jauh dari tempatnya. Persis itu yang pernah terjadi pada titik Desa Sangge:
   * memakai `@` membuat petanya menunjuk lokasi yang salah.
   */
  const tempat = teks.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  const kamera = teks.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  const langsung = teks.match(
    /^(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)$/,
  );
  const cocok = tempat ?? kamera ?? langsung;
  if (!cocok) return null;

  const lat = Number(cocok[1]);
  const lng = Number(cocok[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return { lat, lng };
}

/**
 * Alamat sematan peta untuk <iframe>.
 *
 * Memakai koordinat, bukan pencarian teks nama desa: pencarian teks hanya
 * memusatkan peta ke wilayah secara umum, sedangkan koordinat menaruh penanda
 * tepat di titik yang dipilih.
 */
export function alamatSematan(titik: Titik, zoom: number): string {
  return `https://maps.google.com/maps?q=${titik.lat},${titik.lng}&z=${zoom}&output=embed`;
}

/** Tautan Google Maps yang menunjuk titik aktif yang sama dengan sematan. */
export function alamatTautanPeta(titik: Titik): string {
  return `https://www.google.com/maps/search/?api=1&query=${titik.lat},${titik.lng}`;
}

/**
 * Apakah teks ini tautan pendek Google Maps?
 *
 * Daftar host-nya dibatasi dengan sengaja. Server akan menelusuri tautan ini
 * (mengikuti pengalihannya), jadi hanya alamat Google Maps yang boleh — bukan
 * alamat apa pun yang ditempel orang.
 */
const HOST_PENDEK = ["maps.app.goo.gl", "goo.gl"];

export function tautanPendekMaps(teks: string): boolean {
  try {
    const alamat = new URL(teks.trim());
    return (
      alamat.protocol === "https:" && HOST_PENDEK.includes(alamat.hostname)
    );
  } catch {
    return false;
  }
}
