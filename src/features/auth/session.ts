import "server-only";
import { cookies } from "next/headers";
import {
  COOKIE_SESI,
  MASA_BERLAKU_HARI,
  tandaTanganToken,
  verifikasiToken,
  type IsiSesi,
} from "./token";

/**
 * Session sederhana berbasis cookie bertanda tangan.
 *
 * Sengaja tidak memakai NextAuth: website ini hanya punya satu peran (admin)
 * dan sekitar lima akun, tanpa OAuth. NextAuth v5 masih beta dan v4 tidak
 * dirancang untuk App Router. Makin sedikit dependensi, makin sedikit yang
 * bisa rusak setelah website diserahkan dan tidak ada developer yang memantau.
 */

export async function buatSesi(isi: IsiSesi): Promise<void> {
  const kedaluwarsa = new Date(
    Date.now() + MASA_BERLAKU_HARI * 24 * 60 * 60 * 1000,
  );
  const token = await tandaTanganToken(isi, kedaluwarsa);

  const toples = await cookies();
  toples.set(COOKIE_SESI, token, {
    httpOnly: true, // tidak bisa dibaca JavaScript di browser
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: kedaluwarsa,
    path: "/",
  });
}

export async function hapusSesi(): Promise<void> {
  const toples = await cookies();
  toples.delete(COOKIE_SESI);
}

/** Null kalau belum masuk, token rusak, atau sudah kedaluwarsa. */
export async function bacaSesi(): Promise<IsiSesi | null> {
  const toples = await cookies();
  const token = toples.get(COOKIE_SESI)?.value;
  if (!token) return null;
  return verifikasiToken(token);
}

export type { IsiSesi };
