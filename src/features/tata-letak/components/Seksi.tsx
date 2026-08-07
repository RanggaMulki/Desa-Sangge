import {
  KELAS_LATAR_SEKSI,
  type LatarSeksi,
} from "@/features/tata-letak/latar";

export function Seksi({
  latar = "terang",
  children,
  ...sisa
}: {
  latar?: LatarSeksi;
  children: React.ReactNode;
} & React.ComponentProps<"section">) {
  return (
    <section className={KELAS_LATAR_SEKSI[latar]} {...sisa}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
        {children}
      </div>
    </section>
  );
}
