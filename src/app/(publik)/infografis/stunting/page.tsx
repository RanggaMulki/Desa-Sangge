import type { Metadata } from "next";
import { AngkaStunting } from "@/features/infografis/components/AngkaStunting";
import { DaftarStunting } from "@/features/infografis/components/DaftarStunting";
import { tab } from "@/features/infografis/tab";

const INI = tab("stunting");

export const metadata: Metadata = {
  title: INI.judul,
  description: INI.keterangan,
};

export const revalidate = 3600;

export default function InfografisStunting() {
  return (
    <>
      <AngkaStunting />
      <div className="mt-10">
        <DaftarStunting />
      </div>
    </>
  );
}
