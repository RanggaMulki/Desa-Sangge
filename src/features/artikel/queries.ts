import { cache } from "react";
import { and, desc, eq, ilike, inArray, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { artikel, lampiran, pengguna } from "@/db/schema";
import {
  KATEGORI_PER_KANAL,
  type KanalKelola,
  type KodeKategori,
} from "./kategori";
import { jenisKontenSah, type JenisKonten } from "./jenis";

/**
 * Jumlah artikel terbit per kategori.
 *
 * Beranda memakainya untuk dua hal sekaligus: menampilkan "8 artikel" di
 * kartu kanal, dan menyembunyikan kanal yang belum punya isi. Menyebut
 * sebuah kanal lalu membawa pengunjung ke halaman kosong lebih buruk
 * daripada tidak menyebutnya sama sekali.
 */
export async function hitungArtikelPerKategori(): Promise<
  Record<string, number>
> {
  const baris = await db
    .select({
      kategori: artikel.kategori,
      jenisKonten: artikel.jenisKonten,
      jumlah: sql<number>`count(*)::int`,
    })
    .from(artikel)
    .where(eq(artikel.status, "terbit"))
    .groupBy(artikel.kategori, artikel.jenisKonten);

  return baris.reduce<Record<string, number>>((jumlah, barisKategori) => {
    if (
      jenisKontenSah(
        barisKategori.kategori,
        barisKategori.jenisKonten,
      )
    ) {
      jumlah[barisKategori.kategori] =
        (jumlah[barisKategori.kategori] ?? 0) + barisKategori.jumlah;
    }
    return jumlah;
  }, {});
}

/**
 * Jumlah tulisan yang sudah tayang dan yang masih draf.
 * Dipakai ringkasan di beranda halaman pengelolaan.
 */
export async function hitungArtikelPerStatus() {
  const [hasil] = await db
    .select({
      terbit: sql<number>`count(*) filter (where ${artikel.status} = 'terbit')::int`,
      draf: sql<number>`count(*) filter (where ${artikel.status} = 'draf')::int`,
    })
    .from(artikel);

  return hasil ?? { terbit: 0, draf: 0 };
}

/**
 * Jumlah terbit/draf per kategori dalam satu kanal pengelolaan.
 * Mengisi kartu kategori di atas daftar artikel admin, supaya pengurus
 * langsung melihat isi tiap jenis tanpa menyaring dulu.
 */
export async function hitungArtikelPerKategoriKanal(kanal: KanalKelola) {
  const baris = await db
    .select({
      kategori: artikel.kategori,
      terbit: sql<number>`count(*) filter (where ${artikel.status} = 'terbit')::int`,
      draf: sql<number>`count(*) filter (where ${artikel.status} = 'draf')::int`,
      materi: sql<number>`count(*) filter (where ${artikel.jenisKonten} = 'materi')::int`,
      poster: sql<number>`count(*) filter (where ${artikel.jenisKonten} = 'poster')::int`,
    })
    .from(artikel)
    .where(inArray(artikel.kategori, KATEGORI_PER_KANAL[kanal]))
    .groupBy(artikel.kategori);

  const perKategori = new Map(baris.map((b) => [b.kategori, b]));
  return KATEGORI_PER_KANAL[kanal].map((kode) => ({
    kode,
    terbit: perKategori.get(kode)?.terbit ?? 0,
    draf: perKategori.get(kode)?.draf ?? 0,
    materi: perKategori.get(kode)?.materi ?? 0,
    poster: perKategori.get(kode)?.poster ?? 0,
  }));
}

/** Daftar artikel terbit pada satu kategori. */
export async function ambilArtikelPerKategori(
  kategori: KodeKategori,
  batas = 20,
) {
  return db
    .select({
      id: artikel.id,
      judul: artikel.judul,
      slug: artikel.slug,
      kategori: artikel.kategori,
      jenisKonten: artikel.jenisKonten,
      ringkasan: artikel.ringkasan,
      gambarSampulUrl: artikel.gambarSampulUrl,
      tanggalTerbit: artikel.tanggalTerbit,
    })
    .from(artikel)
    .where(and(eq(artikel.status, "terbit"), eq(artikel.kategori, kategori)))
    .orderBy(desc(artikel.tanggalTerbit))
    .limit(batas);
}

/**
 * Satu artikel lengkap beserta lampirannya.
 *
 * Hanya mengambil yang berstatus terbit. Artikel draf harus tetap tidak bisa
 * dibuka dari alamat publik meskipun slug-nya ditebak orang — kalau tidak,
 * konsep draf jadi tidak ada artinya bagi tim yang sedang menyiapkan tulisan.
 *
 * Dibungkus `cache()` karena setiap halaman artikel memanggilnya dua kali:
 * sekali oleh generateMetadata untuk judul tab dan Open Graph, sekali lagi
 * oleh komponen halamannya. Tanpa ini, tiap kunjungan jadi dua kueri ke Neon.
 */
export const ambilArtikelBySlug = cache(async function (slug: string) {
  const [hasil] = await db
    .select({
      id: artikel.id,
      judul: artikel.judul,
      slug: artikel.slug,
      kategori: artikel.kategori,
      jenisKonten: artikel.jenisKonten,
      ringkasan: artikel.ringkasan,
      konten: artikel.konten,
      gambarSampulUrl: artikel.gambarSampulUrl,
      tanggalTerbit: artikel.tanggalTerbit,
      diperbaruiPada: artikel.diperbaruiPada,
      namaPenulis: pengguna.nama,
    })
    .from(artikel)
    .leftJoin(pengguna, eq(artikel.penulisId, pengguna.id))
    .where(and(eq(artikel.slug, slug), eq(artikel.status, "terbit")))
    .limit(1);

  if (!hasil) return null;

  const berkas = await db
    .select()
    .from(lampiran)
    .where(eq(lampiran.artikelId, hasil.id));

  return { ...hasil, lampiran: berkas };
});

/** Tulisan lain di kategori yang sama, untuk panel samping halaman artikel. */
export async function ambilArtikelSerupa(
  kategori: KodeKategori,
  kecualiId: string,
  batas = 4,
) {
  return db
    .select({
      id: artikel.id,
      judul: artikel.judul,
      slug: artikel.slug,
      tanggalTerbit: artikel.tanggalTerbit,
    })
    .from(artikel)
    .where(
      and(
        eq(artikel.status, "terbit"),
        eq(artikel.kategori, kategori),
        eq(artikel.jenisKonten, "materi"),
        ne(artikel.id, kecualiId),
      ),
    )
    .orderBy(desc(artikel.tanggalTerbit))
    .limit(batas);
}

/**
 * Slug semua artikel terbit, untuk generateStaticParams.
 *
 * Halaman artikel jadi dibangun sekali saat deploy, bukan tiap ada pengunjung.
 * Ini yang menjaga compute Neon tetap mendekati nol di free tier.
 */
export async function ambilSlugArtikelTerbit() {
  return db
    .select({
      slug: artikel.slug,
      kategori: artikel.kategori,
      jenisKonten: artikel.jenisKonten,
    })
    .from(artikel)
    .where(eq(artikel.status, "terbit"));
}

export type SaringanArtikelAdmin = {
  /** Pintu pengelolaan yang sedang dibuka. Bawaannya Informasi. */
  kanal?: KanalKelola;
  cari?: string;
  kategori?: KodeKategori;
  jenisKonten?: JenisKonten;
  status?: "draf" | "terbit";
};

/**
 * Daftar artikel untuk halaman pengelolaan Informasi.
 *
 * Hanya dua kanal yang masih aktif yang diambil. Berita dan record lama
 * Sejarah & Budaya tetap berada di tabel yang sama, tetapi tidak tercampur
 * dengan pekerjaan pengurus saat mengelola Informasi.
 */
export async function ambilArtikelAdmin(saringan: SaringanArtikelAdmin = {}) {
  const kanal = saringan.kanal ?? "informasi";
  const kondisi = [inArray(artikel.kategori, KATEGORI_PER_KANAL[kanal])];

  if (saringan.cari?.trim()) {
    kondisi.push(ilike(artikel.judul, `%${saringan.cari.trim()}%`));
  }
  if (saringan.kategori) {
    kondisi.push(eq(artikel.kategori, saringan.kategori));
  }
  if (saringan.jenisKonten) {
    kondisi.push(eq(artikel.jenisKonten, saringan.jenisKonten));
  }
  if (saringan.status) {
    kondisi.push(eq(artikel.status, saringan.status));
  }

  return db
    .select({
      id: artikel.id,
      judul: artikel.judul,
      slug: artikel.slug,
      kategori: artikel.kategori,
      jenisKonten: artikel.jenisKonten,
      ringkasan: artikel.ringkasan,
      status: artikel.status,
      tanggalTerbit: artikel.tanggalTerbit,
      diperbaruiPada: artikel.diperbaruiPada,
    })
    .from(artikel)
    .where(and(...kondisi))
    .orderBy(desc(artikel.diperbaruiPada))
    .limit(200);
}

/** Satu artikel lengkap untuk form ubah dan halaman pratinjau admin. */
export async function ambilArtikelAdminById(id: string) {
  const [hasil] = await db
    .select({
      id: artikel.id,
      judul: artikel.judul,
      slug: artikel.slug,
      kategori: artikel.kategori,
      jenisKonten: artikel.jenisKonten,
      ringkasan: artikel.ringkasan,
      konten: artikel.konten,
      gambarSampulUrl: artikel.gambarSampulUrl,
      status: artikel.status,
      tanggalTerbit: artikel.tanggalTerbit,
      diperbaruiPada: artikel.diperbaruiPada,
      namaPenulis: pengguna.nama,
    })
    .from(artikel)
    .leftJoin(pengguna, eq(artikel.penulisId, pengguna.id))
    .where(
      and(
        eq(artikel.id, id),
        inArray(artikel.kategori, [
          ...KATEGORI_PER_KANAL.informasi,
          ...KATEGORI_PER_KANAL.berita,
        ]),
      ),
    )
    .limit(1);

  if (!hasil) return null;

  const berkas = await db
    .select()
    .from(lampiran)
    .where(eq(lampiran.artikelId, hasil.id));

  return { ...hasil, lampiran: berkas };
}
