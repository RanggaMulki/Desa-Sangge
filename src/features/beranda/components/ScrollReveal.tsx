import type { CSSProperties } from "react";

/**
 * Pembungkus animasi masuk ringan yang tidak membutuhkan JavaScript.
 *
 * Cukup bungkus elemen apa pun:
 *   <ScrollReveal>...</ScrollReveal>
 *   <ScrollReveal delay={200}>...</ScrollReveal>
 *
 * Konten selalu sudah terlihat pada HTML awal. Animasi hanya memperhalus
 * kemunculannya dan otomatis dimatikan oleh preferensi reduced motion.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`masuk-halus ${className}`}
      style={{ "--jeda-masuk": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
