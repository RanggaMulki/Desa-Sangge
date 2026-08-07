import { keluar } from "@/features/auth/actions";
import { WAJIB_LOGIN } from "@/features/auth/konfigurasi";
import { ambilPenggunaSaatIni } from "@/features/auth/queries";
import { LogOut, Menu } from "lucide-react";
import { IdentitasAdmin } from "./IdentitasAdmin";
import { SidebarAdmin } from "./SidebarAdmin";

/**
 * Bingkai halaman pengelolaan: bilah atas + pembungkus isi.
 *
 * Dipisah dari berkas layout route supaya route hanya mengurus proteksi
 * akses, sementara tampilannya tinggal di folder fitur.
 *
 * CATATAN: pengingat "terbuka tanpa login" dan "data masih contoh" dilepas
 * dari sini atas permintaan, supaya tampilan admin bersih. Keduanya tinggal
 * dipasang kembali di atas <div> sidebar bila diperlukan — logikanya masih ada
 * (WAJIB_LOGIN dan adaDataContoh() di features/admin/queries.ts).
 */
export async function KerangkaAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const akun = await ambilPenggunaSaatIni();

  return (
    <div className="min-h-screen bg-permukaan">
      <header className="border-b border-white/15 [background:var(--gradien-header)] text-white">
        <div className="mx-auto flex min-h-[var(--tinggi-header)] max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6">
          <IdentitasAdmin />
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {akun && (
              <span className="hidden font-medium text-white/85 md:inline">
                {akun.nama}
              </span>
            )}
            {WAJIB_LOGIN && (
              <form action={keluar}>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/40 px-3 py-2 font-semibold hover:bg-white/10"
                >
                  <LogOut size={18} aria-hidden="true" />
                  Keluar
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar + isi. Di HP daftar menu dilipat supaya form langsung terlihat. */}
      <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:py-8">
        <aside className="shrink-0 lg:w-60">
          <details className="rounded-lg border border-garis bg-white lg:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-3 font-semibold text-hijau-utama">
              <Menu size={21} aria-hidden="true" />
              Menu pengelolaan
            </summary>
            <div className="border-t border-garis p-3">
              <SidebarAdmin />
            </div>
          </details>
          <div className="hidden rounded-lg border border-garis bg-white p-3 lg:sticky lg:top-6 lg:block">
            <SidebarAdmin />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
