"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { pengaturan } from "@/db/schema";
import { KUNCI_VIDEO_PROFIL, idYouTube, urlKanonikYouTube } from "./video";
import { pastikanPengurus } from "@/features/auth/queries";

export type HasilSimpan = { ok: boolean; pesan: string };

/** Simpan satu pengaturan; dibuat kalau belum ada, ditimpa kalau sudah. */
async function tulis(kunci: string, nilai: string) {
  await db
    .insert(pengaturan)
    .values({ kunci, nilai })
    .onConflictDoUpdate({ target: pengaturan.kunci, set: { nilai } });
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
