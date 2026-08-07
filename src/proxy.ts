import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESI, verifikasiToken } from "@/features/auth/token";
import { WAJIB_LOGIN } from "@/features/auth/konfigurasi";

/**
 * Penjaga pertama untuk /admin/*.
 *
 * Middleware hanya memeriksa tanda tangan token, tidak menyentuh database
 * (Edge runtime tidak bisa, dan setiap kunjungan halaman akan membebani
 * compute Neon). Pemeriksaan bahwa akunnya masih aktif dilakukan di
 * `ambilPenggunaSaatIni()` pada layout admin.
 */
export default async function proxy(request: NextRequest) {
  // Saklar ada di features/auth/konfigurasi.ts, lengkap dengan catatannya.
  if (!WAJIB_LOGIN) return NextResponse.next();

  const { pathname } = request.nextUrl;

  const token = request.cookies.get(COOKIE_SESI)?.value;
  const sesi = token ? await verifikasiToken(token) : null;

  // Sudah masuk tapi membuka halaman masuk: langsung ke beranda admin.
  if (pathname === "/admin/masuk") {
    if (sesi) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!sesi) {
    const tujuan = new URL("/admin/masuk", request.url);
    // Supaya setelah masuk, pengguna kembali ke halaman yang tadi dituju.
    if (pathname !== "/admin") tujuan.searchParams.set("lanjut", pathname);
    return NextResponse.redirect(tujuan);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
