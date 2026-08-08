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
