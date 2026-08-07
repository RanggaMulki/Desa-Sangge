import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IdentitasAdmin } from "@/features/admin/components/IdentitasAdmin";
import { FormMasuk } from "@/features/auth/components/FormMasuk";
import { IDENTITAS } from "@/features/tata-letak/navigasi";

export const metadata: Metadata = {
  title: "Masuk Admin Desa Sangge",
  robots: { index: false, follow: false },
};

export default async function HalamanMasuk({
  searchParams,
}: {
  searchParams: Promise<{ lanjut?: string }>;
}) {
  const { lanjut } = await searchParams;
  return (
    <div className="min-h-dvh bg-latar">
      <header className="border-b border-white/15 [background:var(--gradien-header)] text-white">
        <div className="mx-auto flex min-h-[var(--tinggi-header)] max-w-[90rem] items-center px-5 sm:px-8">
          <IdentitasAdmin href="/" />
        </div>
      </header>

      <main className="flex min-h-[calc(100dvh-var(--tinggi-header))] items-center justify-center px-5 py-8 sm:px-8 sm:py-12">
        <section className="w-full max-w-lg" aria-labelledby="judul-masuk-admin">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-hijau-utama hover:text-hijau-pekat"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            Kembali ke website
          </Link>

          <div className="masuk-halus mt-5 rounded-lg border border-garis bg-white p-5 shadow-[0_4px_8px_rgba(46,48,62,0.08)] sm:p-8">
            <div>
              <h1
                id="judul-masuk-admin"
                className="text-3xl font-extrabold leading-tight text-tinta sm:text-4xl"
              >
                Masuk ke Admin
              </h1>
            </div>

            <p className="mt-3 leading-relaxed text-tinta-redup">
              Gunakan nama pengguna dan kata sandi akun pengurus desa.
            </p>

            <div className="mt-7">
              <FormMasuk lanjut={lanjut} />
            </div>

            <div className="mt-7 border-t border-garis pt-5">
              <p className="font-semibold text-tinta">Lupa kata sandi?</p>
              <p className="mt-1 text-sm leading-relaxed text-tinta-redup">
                Hubungi pengurus lain yang memiliki akses untuk membantu
                mengatur ulang kata sandi.
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-tinta-redup">
            Sistem informasi resmi Pemerintah {IDENTITAS.nama}
          </p>
        </section>
      </main>
    </div>
  );
}
