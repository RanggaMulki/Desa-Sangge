import Image from "next/image";
import Link from "next/link";
import { IDENTITAS } from "@/features/tata-letak/navigasi";

export function IdentitasAdmin({ href = "/admin" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex min-w-0 items-center gap-3 rounded-lg text-white focus-visible:outline-white"
      aria-label={`${IDENTITAS.nama}, Pengelolaan Website`}
    >
      <span className="relative size-11 shrink-0 overflow-hidden rounded-full sm:size-12">
        <Image
          src="/gambar/lambang-boyolali.png"
          alt=""
          fill
          sizes="48px"
          priority
          className="object-cover"
        />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-bold sm:text-lg">
          {IDENTITAS.nama}
        </span>
        <span className="mt-0.5 block truncate text-xs text-white/75 sm:text-sm">
          Pengelolaan Website
        </span>
      </span>
    </Link>
  );
}
