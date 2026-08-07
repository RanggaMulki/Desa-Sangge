import type { Metadata } from "next";
import { RingkasanAdmin } from "@/features/admin/components/RingkasanAdmin";

export const metadata: Metadata = {
  title: "Pengelolaan",
  robots: { index: false, follow: false },
};

export default function BerandaAdmin() {
  return <RingkasanAdmin />;
}
