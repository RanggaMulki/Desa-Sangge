import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { kontakLayanan } from "@/db/schema";

/** Semua kontak yang aktif, sudah urut sesuai kolom urutan. */
export async function ambilKontakPerJenis() {
  return db
    .select()
    .from(kontakLayanan)
    .where(eq(kontakLayanan.aktif, true))
    .orderBy(asc(kontakLayanan.urutan));
}

/** Semua kontak untuk halaman pengelolaan, termasuk yang dinonaktifkan. */
export async function ambilKontakAdmin() {
  return db
    .select()
    .from(kontakLayanan)
    .orderBy(asc(kontakLayanan.urutan), asc(kontakLayanan.namaLayanan));
}

/** Satu kontak untuk mengisi form ubah. */
export async function ambilKontakById(id: string) {
  const [baris] = await db
    .select()
    .from(kontakLayanan)
    .where(eq(kontakLayanan.id, id))
    .limit(1);
  return baris ?? null;
}

/** Kontak KPPA saja. Null kalau belum diisi. */
export async function ambilKontakKppa() {
  const [kppa] = await db
    .select()
    .from(kontakLayanan)
    .where(eq(kontakLayanan.jenis, "kppa"))
    .limit(1);
  return kppa ?? null;
}
