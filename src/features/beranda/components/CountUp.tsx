"use client";

import { useEffect, useRef } from "react";
import { angka } from "@/lib/format";

/**
 * Peningkatan progresif untuk angka statistik.
 *
 * Nilai akhir tetap dirender pada HTML awal. Animasi baru dimulai saat angka
 * masuk ke layar, sehingga tidak ada ruang kosong ketika JavaScript lambat
 * atau dimatikan. Pengguna yang memilih reduced motion langsung melihat nilai
 * akhir tanpa animasi.
 */
export function CountUp({
  nilai,
  sufiks = "",
  className,
  jeda = 0,
}: {
  nilai: number;
  sufiks?: string;
  className?: string;
  jeda?: number;
}) {
  const elemen = useRef<HTMLSpanElement>(null);
  const teksAkhir = `${angka(nilai)}${sufiks}`;

  useEffect(() => {
    const target = elemen.current;
    if (
      !target ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let bingkai: number | null = null;

    const pengamat = new IntersectionObserver(
      ([entri]) => {
        if (!entri?.isIntersecting) return;
        pengamat.disconnect();

        let waktuMulai: number | null = null;
        target.textContent = `0${sufiks}`;

        const perbarui = (waktu: number) => {
          if (waktuMulai === null) waktuMulai = waktu + jeda;

          if (waktu < waktuMulai) {
            bingkai = window.requestAnimationFrame(perbarui);
            return;
          }

          const kemajuan = Math.min((waktu - waktuMulai) / 1200, 1);
          const melambatHalus = 1 - Math.pow(1 - kemajuan, 3);
          target.textContent = `${angka(
            Math.round(nilai * melambatHalus),
          )}${sufiks}`;

          if (kemajuan < 1) {
            bingkai = window.requestAnimationFrame(perbarui);
          } else {
            target.textContent = teksAkhir;
          }
        };

        bingkai = window.requestAnimationFrame(perbarui);
      },
      { threshold: 0.35 },
    );

    pengamat.observe(target);

    return () => {
      pengamat.disconnect();
      if (bingkai !== null) window.cancelAnimationFrame(bingkai);
    };
  }, [jeda, nilai, sufiks, teksAkhir]);

  return (
    <span className={className}>
      <span className="sr-only">{teksAkhir}</span>
      <span
        ref={elemen}
        aria-hidden="true"
        data-countup={nilai}
        data-suffix={sufiks}
      >
        {teksAkhir}
      </span>
    </span>
  );
}
