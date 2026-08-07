import type { Metadata } from "next";
import {
  HalamanKelolaArtikel,
  type ParameterKelolaArtikel,
} from "@/features/artikel/components/HalamanKelolaArtikel";

export const metadata: Metadata = {
  title: "Informasi",
  robots: { index: false, follow: false },
};

export default async function KelolaArtikel({
  searchParams,
}: {
  searchParams: Promise<ParameterKelolaArtikel>;
}) {
  return <HalamanKelolaArtikel parameter={await searchParams} />;
}
