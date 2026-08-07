"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { artikel, lampiran, media } from "@/db/schema";
import { bersihkanHtml } from "@/lib/sanitasi";
import { ambilPenggunaSaatIni, pastikanPengurus } from "@/features/auth/queries";
import { hapusMedia } from "@/features/media/actions";
import {
  bacaDaftarId,
  formulirArtikelSchema,
  tujuanSimpanSchema,
  type NilaiFormulirArtikel,
} from "./validasi";
import {
  KATEGORI_BISA_KELOLA,
  kanalDariKategori,
  urlAdminKanal,
  urlPublikArtikel,
} from "./kategori";
import { namaKonten, type JenisKonten } from "./jenis";

/**
 * Kategori yang boleh dikelola dari admin: dua kanal Informasi ditambah
 * berita dan pengumuman. Nama tipenya tetap deskriptif walau isinya kini
 * lebih luas daripada sekadar kanal Informasi.
 */
type KategoriKelola = (typeof KATEGORI_BISA_KELOLA)[number];
type StatusArtikel = "draf" | "terbit";

function awalanBesar(teks: string) {
  return `${teks.charAt(0).toUpperCase()}${teks.slice(1)}`;
}

export type HasilSimpanArtikel =
  | {
      ok: true;
      pesan: string;
      id: string;
      slug: string;
      kategori: KategoriKelola;
      status: StatusArtikel;
      urlPublik: string;
    }
  | {
      ok: false;
      pesan: string;
      kesalahan?: Partial<Record<keyof NilaiFormulirArtikel, string>>;
    };

export type HasilAksiArtikel =
  | { ok: true; pesan: string; urlPublik?: string }
  | { ok: false; pesan: string };

function teksForm(formData: FormData, nama: string): string {
  const nilai = formData.get(nama);
  return typeof nilai === "string" ? nilai : "";
}

function buatSlugDasar(judul: string): string {
  const slug = judul
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);

  return slug || "artikel";
}

async function buatSlugUnik(judul: string): Promise<string> {
  const dasar = buatSlugDasar(judul);

  for (let nomor = 1; nomor <= 999; nomor += 1) {
    const calon = nomor === 1 ? dasar : `${dasar}-${nomor}`;
    const [sudahAda] = await db
      .select({ id: artikel.id })
      .from(artikel)
      .where(eq(artikel.slug, calon))
      .limit(1);
    if (!sudahAda) return calon;
  }

  return `${dasar}-${Date.now()}`;
}

function urlArtikel(kategori: KategoriKelola, slug: string) {
  return urlPublikArtikel(kategori, slug);
}

/**
 * Menyegarkan halaman publik dan admin yang menampilkan artikel ini.
 * Kanal Berita dan Informasi punya alamat publik berbeda, jadi daftar
 * halaman yang disegarkan mengikuti kanalnya.
 */
function segarkanHalaman(
  kategori: KategoriKelola,
  slug: string,
  kategoriLama?: KategoriKelola,
) {
  revalidatePath("/");
  revalidatePath(urlArtikel(kategori, slug));

  if (kanalDariKategori(kategori) === "berita") {
    revalidatePath("/berita");
  } else {
    revalidatePath("/informasi");
    revalidatePath(`/informasi/${kategori}`);
  }
  if (kategoriLama && kategoriLama !== kategori) {
    if (kanalDariKategori(kategoriLama) === "berita") {
      revalidatePath("/berita");
    } else {
      revalidatePath(`/informasi/${kategoriLama}`);
    }
  }

  revalidatePath("/admin");
  revalidatePath(urlAdminKanal(kanalDariKategori(kategori)));
}

async function ambilMediaTerunggah(
  ids: string[],
  folder: "artikel" | "lampiran",
) {
  const unik = [...new Set(ids)];
  if (unik.length === 0) return [];

  const baris = await db
    .select()
    .from(media)
    .where(inArray(media.id, unik));
  const perId = new Map(baris.map((item) => [item.id, item]));
  const terurut = unik.map((id) => perId.get(id)).filter(Boolean);

  if (
    terurut.length !== unik.length ||
    terurut.some((item) => !item!.kunciObjek.startsWith(`${folder}/`))
  ) {
    return null;
  }

  return terurut.map((item) => item!);
}

async function hapusMediaDariUrl(url: string | null) {
  if (!url?.startsWith("/media/")) return;

  const [rekam] = await db
    .select({ id: media.id })
    .from(media)
    .where(eq(media.url, url))
    .limit(1);
  if (!rekam) return;

  const hasil = await hapusMedia(rekam.id);
  if (!hasil.ok) {
    console.error("Media artikel gagal dibersihkan:", rekam.id, hasil.pesan);
  }
}

/**
 * Membuat atau memperbarui artikel Informasi.
 *
 * Foto dan lampiran diunggah lebih dulu oleh form, lalu action ini menerima
 * ID catatan medianya. Server tetap mengecek folder dan tipe berkas sebelum
 * memasang URL ke artikel, jadi URL bebas tidak pernah dipercaya.
 */
export async function simpanArtikel(
  formData: FormData,
): Promise<HasilSimpanArtikel> {
  await pastikanPengurus();
  const hasilValidasi = formulirArtikelSchema.safeParse({
    judul: teksForm(formData, "judul"),
    kategori: teksForm(formData, "kategori"),
    jenisKonten: teksForm(formData, "jenisKonten"),
    ringkasan: teksForm(formData, "ringkasan"),
    konten: teksForm(formData, "konten"),
  });

  if (!hasilValidasi.success) {
    const perBidang = hasilValidasi.error.flatten().fieldErrors;
    return {
      ok: false,
      pesan: "Ada isian yang belum sesuai. Periksa bagian yang ditandai.",
      kesalahan: Object.fromEntries(
        Object.entries(perBidang)
          .filter(([, pesan]) => pesan?.[0])
          .map(([nama, pesan]) => [nama, pesan?.[0]]),
      ),
    };
  }

  const tujuan = tujuanSimpanSchema.safeParse(
    teksForm(formData, "tujuan"),
  );
  if (!tujuan.success) {
    return {
      ok: false,
      pesan: "Pilihan penyimpanan tidak dikenali. Muat ulang halaman lalu coba lagi.",
    };
  }

  const id = teksForm(formData, "id") || null;
  const [lama] = id
    ? await db
        .select()
        .from(artikel)
        .where(
          and(
            eq(artikel.id, id),
            inArray(artikel.kategori, KATEGORI_BISA_KELOLA),
          ),
        )
        .limit(1)
    : [];

  if (id && !lama) {
    return {
      ok: false,
      pesan:
        "Informasi tidak ditemukan. Kembali ke daftar lalu pilih informasi lagi.",
    };
  }

  const data = hasilValidasi.data;
  const jenisKonten = data.jenisKonten as JenisKonten;
  if (lama && lama.jenisKonten !== jenisKonten) {
    return {
      ok: false,
      pesan:
        "Bentuk informasi tidak dapat diganti setelah dibuat. Buat informasi baru bila ingin memakai bentuk lain.",
    };
  }

  const mediaSampulId = teksForm(formData, "mediaSampulId");
  const mediaLampiranIds = bacaDaftarId(formData.get("mediaLampiranIds"));
  const lampiranHapusIds = bacaDaftarId(formData.get("lampiranHapusIds"));
  const hapusSampul = teksForm(formData, "hapusSampul") === "ya";

  if (
    jenisKonten === "poster" &&
    (mediaLampiranIds.length > 0 || lampiranHapusIds.length > 0)
  ) {
    return {
      ok: false,
      pesan: "Poster tidak memakai berkas lampiran. Muat ulang form lalu coba lagi.",
    };
  }

  const sampul = mediaSampulId
    ? await ambilMediaTerunggah([mediaSampulId], "artikel")
    : [];
  if (
    sampul === null ||
    sampul.some((item) => !item.tipe.startsWith("image/"))
  ) {
    return {
      ok: false,
      pesan: "Foto sampul tidak dapat digunakan. Pilih ulang fotonya.",
    };
  }

  const mediaLampiran = await ambilMediaTerunggah(
    mediaLampiranIds,
    "lampiran",
  );
  if (
    mediaLampiran === null ||
    mediaLampiran.some(
      (item) =>
        item.tipe !== "application/pdf" && !item.tipe.startsWith("image/"),
    )
  ) {
    return {
      ok: false,
      pesan: "Ada lampiran yang tidak dapat digunakan. Pilih ulang berkasnya.",
    };
  }

  const kategori = data.kategori as KategoriKelola;
  const akun = await ambilPenggunaSaatIni();
  const slug = lama?.slug ?? (await buatSlugUnik(data.judul));

  let status: StatusArtikel = (lama?.status as StatusArtikel) ?? "draf";
  if (tujuan.data === "draf") status = "draf";
  if (tujuan.data === "terbit") status = "terbit";
  if (!lama && tujuan.data === "pratinjau") status = "draf";

  const gambarSampulUrl = sampul[0]
    ? sampul[0].url
    : hapusSampul
      ? null
      : (lama?.gambarSampulUrl ?? null);
  if (jenisKonten === "poster" && !gambarSampulUrl) {
    return {
      ok: false,
      pesan: "Gambar poster belum dipilih. Pilih gambar poster terlebih dahulu.",
    };
  }

  const sekarang = new Date();
  const tanggalTerbit =
    status === "terbit" ? (lama?.tanggalTerbit ?? sekarang) : null;
  const nilaiLampiran = mediaLampiran.map((item) => ({
    nama: item.namaBerkas,
    url: item.url,
    tipe: item.tipe === "application/pdf" ? ("pdf" as const) : ("gambar" as const),
    ukuranByte: item.ukuranByte,
  }));
  const ringkasan = jenisKonten === "poster" ? "" : data.ringkasan;
  const konten =
    jenisKonten === "poster" ? "<p></p>" : bersihkanHtml(data.konten);
  const sebutanKonten = namaKonten(jenisKonten, kategori);
  const labelKonten = awalanBesar(sebutanKonten);

  if (!lama) {
    let artikelBaruId: string | null = null;
    try {
      const [artikelBaru] = await db
        .insert(artikel)
        .values({
          judul: data.judul,
          slug,
          kategori,
          jenisKonten,
          ringkasan,
          konten,
          gambarSampulUrl,
          status,
          penulisId: akun?.id ?? null,
          tanggalTerbit,
        })
        .returning({ id: artikel.id });
      artikelBaruId = artikelBaru.id;

      if (nilaiLampiran.length > 0) {
        await db.insert(lampiran).values(
          nilaiLampiran.map((item) => ({
            ...item,
            artikelId: artikelBaru.id,
          })),
        );
      }
    } catch (error) {
      console.error("Gagal membuat artikel:", error);
      if (artikelBaruId) {
        await db
          .delete(artikel)
          .where(eq(artikel.id, artikelBaruId))
          .catch((errorHapus) =>
            console.error("Gagal membatalkan artikel:", errorHapus),
          );
      }
      return {
        ok: false,
        pesan: `${labelKonten} belum berhasil disimpan. Coba lagi sebentar.`,
      };
    }

    segarkanHalaman(kategori, slug);
    return {
      ok: true,
      pesan:
        status === "terbit"
          ? `${labelKonten} berhasil diterbitkan.`
          : `${labelKonten} berhasil disimpan sebagai draf.`,
      id: artikelBaruId!,
      slug,
      kategori,
      status,
      urlPublik: urlArtikel(kategori, slug),
    };
  }

  const lampiranYangDihapus =
    lampiranHapusIds.length > 0
      ? await db
          .select()
          .from(lampiran)
          .where(
            and(
              eq(lampiran.artikelId, lama.id),
              inArray(lampiran.id, lampiranHapusIds),
            ),
          )
      : [];
  let lampiranBaruIds: string[] = [];

  try {
    if (nilaiLampiran.length > 0) {
      const baru = await db
        .insert(lampiran)
        .values(
          nilaiLampiran.map((item) => ({
            ...item,
            artikelId: lama.id,
          })),
        )
        .returning({ id: lampiran.id });
      lampiranBaruIds = baru.map((item) => item.id);
    }

    await db
      .update(artikel)
      .set({
        judul: data.judul,
        kategori,
        jenisKonten,
        ringkasan,
        konten,
        gambarSampulUrl,
        status,
        tanggalTerbit,
        diperbaruiPada: sekarang,
      })
      .where(eq(artikel.id, lama.id));

    if (lampiranYangDihapus.length > 0) {
      await db
        .delete(lampiran)
        .where(inArray(lampiran.id, lampiranYangDihapus.map((item) => item.id)));
    }
  } catch (error) {
    console.error("Gagal memperbarui artikel:", error);
    if (lampiranBaruIds.length > 0) {
      await db
        .delete(lampiran)
        .where(inArray(lampiran.id, lampiranBaruIds))
        .catch((errorHapus) =>
          console.error("Gagal membatalkan lampiran:", errorHapus),
        );
    }
    return {
      ok: false,
      pesan: "Perubahan belum berhasil disimpan. Coba lagi sebentar.",
    };
  }

  if (
    lama.gambarSampulUrl &&
    lama.gambarSampulUrl !== gambarSampulUrl
  ) {
    await hapusMediaDariUrl(lama.gambarSampulUrl);
  }
  await Promise.all(
    lampiranYangDihapus.map((item) => hapusMediaDariUrl(item.url)),
  );

  segarkanHalaman(
    kategori,
    slug,
    lama.kategori as KategoriKelola,
  );
  return {
    ok: true,
    pesan:
      status === "terbit"
        ? `Perubahan ${sebutanKonten} berhasil diterbitkan.`
        : `${labelKonten} berhasil disimpan sebagai draf.`,
    id: lama.id,
    slug,
    kategori,
    status,
    urlPublik: urlArtikel(kategori, slug),
  };
}

export async function ubahStatusArtikel(
  id: string,
  status: StatusArtikel,
): Promise<HasilAksiArtikel> {
  await pastikanPengurus();
  const [baris] = await db
    .select({
      id: artikel.id,
      slug: artikel.slug,
      kategori: artikel.kategori,
      jenisKonten: artikel.jenisKonten,
      tanggalTerbit: artikel.tanggalTerbit,
    })
    .from(artikel)
    .where(
      and(
        eq(artikel.id, id),
        inArray(artikel.kategori, KATEGORI_BISA_KELOLA),
      ),
    )
    .limit(1);

  if (!baris) return { ok: false, pesan: "Informasi tidak ditemukan." };

  try {
    await db
      .update(artikel)
      .set({
        status,
        tanggalTerbit:
          status === "terbit" ? (baris.tanggalTerbit ?? new Date()) : null,
        diperbaruiPada: new Date(),
      })
      .where(eq(artikel.id, baris.id));
  } catch (error) {
    console.error("Gagal mengubah status artikel:", error);
    return {
      ok: false,
      pesan: "Status informasi belum berhasil diubah. Coba lagi sebentar.",
    };
  }

  const kategori = baris.kategori as KategoriKelola;
  const sebutanKonten = namaKonten(
    baris.jenisKonten,
    baris.kategori as KategoriKelola,
  );
  const labelKonten = awalanBesar(sebutanKonten);
  segarkanHalaman(kategori, baris.slug);
  return {
    ok: true,
    pesan:
      status === "terbit"
        ? `${labelKonten} berhasil diterbitkan.`
        : `${labelKonten} dipindahkan kembali ke draf.`,
    urlPublik:
      status === "terbit" ? urlArtikel(kategori, baris.slug) : undefined,
  };
}

export async function hapusArtikelAdmin(
  id: string,
): Promise<HasilAksiArtikel> {
  await pastikanPengurus();
  const [baris] = await db
    .select()
    .from(artikel)
    .where(
      and(
        eq(artikel.id, id),
        inArray(artikel.kategori, KATEGORI_BISA_KELOLA),
      ),
    )
    .limit(1);

  if (!baris) return { ok: false, pesan: "Informasi tidak ditemukan." };

  const berkas = await db
    .select({ url: lampiran.url })
    .from(lampiran)
    .where(eq(lampiran.artikelId, baris.id));

  try {
    await db.delete(artikel).where(eq(artikel.id, baris.id));
  } catch (error) {
    console.error("Gagal menghapus artikel:", error);
    return {
      ok: false,
      pesan: "Artikel belum berhasil dihapus. Coba lagi sebentar.",
    };
  }

  await Promise.all([
    hapusMediaDariUrl(baris.gambarSampulUrl),
    ...berkas.map((item) => hapusMediaDariUrl(item.url)),
  ]);
  segarkanHalaman(
    baris.kategori as KategoriKelola,
    baris.slug,
  );

  const sebutanKonten = namaKonten(
    baris.jenisKonten,
    baris.kategori as KategoriKelola,
  );
  return {
    ok: true,
    pesan: `${awalanBesar(sebutanKonten)} “${baris.judul}” berhasil dihapus.`,
  };
}
