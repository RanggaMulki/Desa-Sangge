import { SignJWT, jwtVerify } from "jose";

/**
 * Urusan tanda tangan token saja, tanpa menyentuh cookie.
 *
 * Dipisah dari session.ts karena middleware jalan di runtime Edge dan tidak
 * bisa mengimpor `next/headers` maupun paket bertanda `server-only`.
 * Berkas ini aman dipakai di kedua tempat.
 */

export const COOKIE_SESI = "sesi_desa";
export const MASA_BERLAKU_HARI = 7;

export type IsiSesi = {
  penggunaId: string;
  nama: string;
};

function kunci(): Uint8Array {
  const rahasia = process.env.AUTH_SECRET;
  if (!rahasia) {
    throw new Error(
      "AUTH_SECRET belum diatur. Buat dengan: openssl rand -base64 32",
    );
  }
  return new TextEncoder().encode(rahasia);
}

export async function tandaTanganToken(
  isi: IsiSesi,
  kedaluwarsa: Date,
): Promise<string> {
  return new SignJWT({ ...isi })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(kedaluwarsa)
    .sign(kunci());
}

/** Mengembalikan null kalau token rusak, palsu, atau sudah kedaluwarsa. */
export async function verifikasiToken(token: string): Promise<IsiSesi | null> {
  try {
    const { payload } = await jwtVerify(token, kunci(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.penggunaId !== "string") return null;
    return {
      penggunaId: payload.penggunaId,
      nama: typeof payload.nama === "string" ? payload.nama : "",
    };
  } catch {
    return null;
  }
}
