import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "./schema";
import { pengguna } from "./schema";

/**
 * Mengatur (atau mengganti) kata sandi satu akun pengurus.
 *
 * Dipakai saat akun sudah ada tapi kata sandinya lupa/perlu diganti — beda
 * dengan `db:seed` yang hanya MEMBUAT akun pertama dan dilewati bila akun sudah
 * ada. Kata sandi tidak pernah ditulis di kode: diberikan lewat variabel
 * lingkungan supaya tidak tersimpan di riwayat perintah repo.
 *
 * Pemakaian:
 *   SANDI_ADMIN='katasandibaru' npm run db:sandi
 *   SANDI_ADMIN='...' EMAIL_ADMIN='pengurus2@sangge.desa.id' npm run db:sandi
 */
const EMAIL_BAWAAN = "sangge";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL belum diatur di .env.local");
  }

  const email = (process.env.EMAIL_ADMIN ?? EMAIL_BAWAAN).trim().toLowerCase();
  const sandi = process.env.SANDI_ADMIN;

  if (!sandi) {
    throw new Error(
      "Isi SANDI_ADMIN dulu. Contoh:\n" +
        "  SANDI_ADMIN='katasandiAnda' npm run db:sandi",
    );
  }
  if (sandi.length < 8) {
    throw new Error("SANDI_ADMIN minimal 8 karakter.");
  }

  const db = drizzle(neon(process.env.DATABASE_URL), { schema });

  const hash = await bcrypt.hash(sandi, 12);
  const [diubah] = await db
    .update(pengguna)
    .set({ kataSandiHash: hash, aktif: true })
    .where(eq(pengguna.email, email))
    .returning({ email: pengguna.email, nama: pengguna.nama });

  if (!diubah) {
    throw new Error(
      `Tidak ada akun dengan email "${email}". ` +
        "Buat akun pertama dulu dengan `npm run db:seed`, atau setel " +
        "EMAIL_ADMIN ke email akun yang benar.",
    );
  }

  console.log(
    `✓ Kata sandi untuk ${diubah.email} (${diubah.nama}) berhasil diatur. ` +
      "Akun juga dipastikan aktif.",
  );
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Gagal mengatur kata sandi:", e instanceof Error ? e.message : e);
    process.exit(1);
  });
