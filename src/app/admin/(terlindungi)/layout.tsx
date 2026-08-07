import { redirect } from "next/navigation";
import { KerangkaAdmin } from "@/features/admin/components/KerangkaAdmin";
import { ambilPenggunaSaatIni } from "@/features/auth/queries";
import { WAJIB_LOGIN } from "@/features/auth/konfigurasi";

/**
 * Route hanya mengurus satu hal: boleh masuk atau tidak.
 *
 * Ini lapisan pemeriksaan kedua setelah proxy. Proxy cuma memeriksa tanda
 * tangan token dan tidak bisa menyentuh database, jadi di sini akunnya
 * diperiksa ulang supaya akun yang dinonaktifkan langsung kehilangan akses
 * tanpa menunggu cookie kedaluwarsa.
 *
 * Tampilannya ada di features/admin/components/KerangkaAdmin.tsx
 */

/**
 * Seluruh halaman pengelolaan dirender segar tiap dibuka, tidak pernah
 * disajikan dari hasil build.
 *
 * Tanpa ini, Next.js memprarender halaman admin saat build — sehingga form
 * menampilkan data lama dan pengurus desa mengira perubahannya tidak
 * tersimpan. Halaman publik memang sengaja statis demi hemat compute Neon,
 * tapi halaman pengelolaan justru wajib menampilkan keadaan terkini.
 */
export const dynamic = "force-dynamic";

export default async function TataLetakAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  if (WAJIB_LOGIN) {
    const akun = await ambilPenggunaSaatIni();
    if (!akun) redirect("/admin/masuk");
  }

  return <KerangkaAdmin>{children}</KerangkaAdmin>;
}
