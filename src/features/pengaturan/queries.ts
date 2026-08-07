import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pengaturan } from "@/db/schema";
import { KUNCI_PETA, ZOOM_BAWAAN, type Titik } from "./peta";
import { KUNCI_VIDEO_PROFIL } from "./video";

/**
 * Titik peta desa yang tersimpan, atau null kalau pengurus belum mengaturnya.
 *
 * Mengembalikan null (bukan titik asal-asalan) supaya pemanggil bisa memilih
 * menampilkan peta bawaan atau tidak sama sekali — menaruh penanda di lokasi
 * yang salah lebih buruk daripada tidak menaruhnya.
 */
export async function ambilPengaturanPeta(): Promise<{
  titik: Titik | null;
  zoom: number;
  catatan: string;
}> {
  const baris = await db.select().from(pengaturan);
  const nilai = new Map(baris.map((b) => [b.kunci, b.nilai]));

  const lat = Number(nilai.get(KUNCI_PETA.lat));
  const lng = Number(nilai.get(KUNCI_PETA.lng));
  const zoom = Number(nilai.get(KUNCI_PETA.zoom));

  return {
    titik:
      Number.isFinite(lat) && Number.isFinite(lng) && nilai.has(KUNCI_PETA.lat)
        ? { lat, lng }
        : null,
    zoom: Number.isFinite(zoom) && zoom > 0 ? zoom : ZOOM_BAWAAN,
    catatan: nilai.get(KUNCI_PETA.catatan) ?? "",
  };
}

/**
 * Tautan video profil yang tersimpan (kosong bila belum diisi).
 *
 * Mengembalikan teksnya apa adanya; komponen beranda yang mengubahnya jadi
 * alamat sematan dan menyembunyikan seksinya bila kosong/tidak sah.
 */
export async function ambilVideoProfil(): Promise<string> {
  const [baris] = await db
    .select({ nilai: pengaturan.nilai })
    .from(pengaturan)
    .where(eq(pengaturan.kunci, KUNCI_VIDEO_PROFIL))
    .limit(1);
  return baris?.nilai?.trim() ?? "";
}
