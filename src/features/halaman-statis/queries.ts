import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { halamanStatis, misi, pengaturan } from "@/db/schema";
import {
  KUNCI_FOTO_SAMBUTAN,
  SLUG_HALAMAN,
  type SlugHalaman,
} from "./halaman";

/**
 * Ambil satu halaman statis.
 *
 * Mengembalikan null kalau slug-nya belum pernah di-seed. Halaman pemanggil
 * wajib menangani null, bukan mengasumsikan datanya pasti ada: seed bisa saja
 * belum dijalankan di database yang baru dibuat.
 */
export async function ambilHalaman(slug: SlugHalaman) {
  const [halaman] = await db
    .select()
    .from(halamanStatis)
    .where(eq(halamanStatis.slug, slug))
    .limit(1);
  return halaman ?? null;
}

/**
 * URL foto khusus seksi Sambutan, atau null kalau pengurus belum mengunggahnya.
 *
 * Null berarti beranda memakai foto Kepala Desa dari data Perangkat sebagai
 * cadangan — jadi seksi Sambutan tidak pernah tanpa foto selama Kepala Desa
 * punya foto.
 */
export async function ambilFotoSambutan(): Promise<string | null> {
  const [baris] = await db
    .select({ nilai: pengaturan.nilai })
    .from(pengaturan)
    .where(eq(pengaturan.kunci, KUNCI_FOTO_SAMBUTAN))
    .limit(1);
  const nilai = baris?.nilai?.trim();
  return nilai ? nilai : null;
}

/**
 * Visi (satu pernyataan) dan misi (daftar) untuk bagian Profil.
 *
 * Diambil bersama dalam satu fungsi karena selalu ditampilkan berdampingan.
 * Visi bisa berupa string kosong dan misi bisa berupa array kosong; komponen
 * penampil yang memutuskan menampilkan keadaan kosong, bukan query ini.
 */
export async function ambilVisiMisi() {
  const halamanVisi = await ambilHalaman(SLUG_HALAMAN.visi);
  const daftarMisi = await db
    .select({ id: misi.id, teks: misi.teks })
    .from(misi)
    .orderBy(asc(misi.urutan));

  return {
    visi: halamanVisi?.konten?.trim() ?? "",
    misi: daftarMisi,
  };
}
