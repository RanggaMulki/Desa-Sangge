import { KepalaInfografis } from "@/features/infografis/components/KepalaInfografis";

/** Kerangka dan kepala bersama semua kategori infografis publik. */
export default function TataLetakInfografis({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:py-14 lg:px-8">
      <KepalaInfografis />
      <div className="mt-8">{children}</div>
    </div>
  );
}
