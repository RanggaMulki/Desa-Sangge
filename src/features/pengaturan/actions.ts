"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { pengaturan } from "@/db/schema";
import { KUNCI_PETA, bacaTitik, tautanPendekMaps } from "./peta";
import { KUNCI_VIDEO_PROFIL, idYouTube, urlKanonikYouTube } from "./video";
import { pastikanPengurus } from "@/features/auth/queries";

export type HasilSimpan = { ok: boolean; pesan: string };

/**
 * Menelusuri tautan pendek Google Maps sampai alamat lengkapnya.
 *
 * Tautan hasil tombol "Bagikan" (maps.app.goo.gl/xxxx) tidak memuat koordinat
 * di dalam teksnya — koordinatnya baru muncul setelah pengalihannya diikuti.
 * Padahal tautan pendek itulah yang paling wajar disalin pengurus desa, jadi
 * penelusuran ini yang membuat form-nya benar-benar mudah dipakai.
 *
 * Hanya alamat Google Maps yang ditelusuri; teks lain dikembalikan apa adanya
 * supaya server tidak bisa dipancing menghubungi alamat sembarangan.
 */
async function bukaTautanPendek(teks: string): Promise<string> {
  if (!tautanPendekMaps(teks)) return teks;
  try {
    const balasan = await fetch(teks.trim(), { redirect: "follow" });
    return balasan.url || teks;
  } catch (e) {
    console.error("Gagal menelusuri tautan pendek Maps:", e);
    return teks;
  }
}

/** Simpan satu pengaturan; dibuat kalau belum ada, ditimpa kalau sudah. */
async function tulis(kunci: string, nilai: string) {
  await db
    .insert(pengaturan)
    .values({ kunci, nilai })
    .onConflictDoUpdate({ target: pengaturan.kunci, set: { nilai } });
}

/**
 * Menyimpan titik peta desa.
 *
 * Pengurus cukup menempel koordinat atau tautan Google Maps — tidak perlu tahu
 * apa itu iframe, embed, atau kunci API. Pembacaannya ditangani `bacaTitik`.
 *
 * Semua masukan diperiksa lebih dulu sebelum satu pun disimpan, seperti form
 * lain di proyek ini, supaya tidak ada keadaan "sebagian tersimpan tapi
 * pesannya gagal".
 */
export async function simpanPeta(
  _sebelumnya: HasilSimpan | null,
  formData: FormData,
): Promise<HasilSimpan> {
  await pastikanPengurus();
  const masukan = ((formData.get("titik") as string) ?? "").trim();
  const zoomMentah = ((formData.get("zoom") as string) ?? "").trim();
  const catatan = ((formData.get("catatan") as string) ?? "").trim();

  const teksTitik = await bukaTautanPendek(masukan);
  const titik = bacaTitik(teksTitik);
  if (!titik) {
    return {
      ok: false,
      pesan:
        "Titik lokasi belum terbaca. Tempel tautan dari tombol Bagikan di " +
        "Google Maps, atau koordinat seperti -7.382053, 110.709267 " +
        "(klik kanan di peta, lalu klik angka koordinat yang muncul).",
    };
  }

  const zoom = parseInt(zoomMentah, 10);
  if (Number.isNaN(zoom) || zoom < 1 || zoom > 20) {
    return { ok: false, pesan: "Tingkat perbesaran harus angka 1 sampai 20." };
  }

  try {
    await tulis(KUNCI_PETA.lat, String(titik.lat));
    await tulis(KUNCI_PETA.lng, String(titik.lng));
    await tulis(KUNCI_PETA.zoom, String(zoom));
    await tulis(KUNCI_PETA.catatan, catatan);

    revalidatePath("/profil");
    return {
      ok: true,
      pesan: `Titik peta tersimpan (${titik.lat}, ${titik.lng}).`,
    };
  } catch (e) {
    console.error("Gagal menyimpan pengaturan peta:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }
}

/**
 * Menyimpan tautan video profil YouTube yang tampil di beranda.
 *
 * BOLEH dikosongkan: kosong menyembunyikan seksi video dari beranda (aturan
 * "seksi kosong tidak dirender"). Yang tersimpan adalah bentuk kanonik
 * (watch?v=ID), bukan mentahnya, supaya rapi dan bebas parameter pelacak.
 */
export async function simpanVideoProfil(
  _sebelumnya: HasilSimpan | null,
  formData: FormData,
): Promise<HasilSimpan> {
  await pastikanPengurus();
  const masukan = ((formData.get("video") as string) ?? "").trim();

  if (masukan === "") {
    try {
      await tulis(KUNCI_VIDEO_PROFIL, "");
      revalidatePath("/");
      return {
        ok: true,
        pesan: "Video dikosongkan. Seksi video disembunyikan dari beranda.",
      };
    } catch (e) {
      console.error("Gagal mengosongkan video profil:", e);
      return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
    }
  }

  const id = idYouTube(masukan);
  if (!id) {
    return {
      ok: false,
      pesan:
        "Tautan YouTube tidak dikenali. Tempel tautan seperti " +
        "https://youtu.be/xxxxxxxxxxx atau " +
        "https://www.youtube.com/watch?v=xxxxxxxxxxx.",
    };
  }

  try {
    await tulis(KUNCI_VIDEO_PROFIL, urlKanonikYouTube(id));
    revalidatePath("/");
    return { ok: true, pesan: "Video profil tersimpan dan tampil di beranda." };
  } catch (e) {
    console.error("Gagal menyimpan video profil:", e);
    return { ok: false, pesan: "Gagal menyimpan. Coba lagi sebentar." };
  }
}
