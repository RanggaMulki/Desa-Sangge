import type { ReactNode, SVGProps } from "react";

/**
 * Kumpulan ikon garis untuk kartu statistik.
 *
 * Semuanya digambar langsung sebagai SVG di sini — BUKAN diambil dari CDN luar
 * seperti situs desa lain. Ikon dari CDN tidak akan tampil di website ini
 * karena aturan keamanan hanya mengizinkan berkas dari server sendiri, dan
 * lagi pula menautkan gambar ke server orang lain membuat website bergantung
 * pada layanan yang bisa mati kapan saja.
 *
 * Ikonnya sengaja bergaya garis sederhana dan seragam, mewarnai diri dari
 * `currentColor` supaya bisa diwarnai lewat kelas teks. Ukurannya diatur oleh
 * wadahnya, jadi glyph di sini tidak memasang lebar/tinggi sendiri.
 */
function Svg({ children, ...sisa }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...sisa}
    >
      {children}
    </svg>
  );
}

// --- Ikon umum kependudukan -------------------------------------------------

/** Sekelompok orang — untuk jumlah penduduk. */
export function IkonOrang(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20v-1a5.5 5.5 0 0 1 11 0v1" />
      <path d="M16 3.4a3 3 0 0 1 0 5.8" />
      <path d="M18 14.2a5.5 5.5 0 0 1 2.5 4.6V20" />
    </Svg>
  );
}

/** Rumah — untuk kepala keluarga / KK. */
export function IkonRumah(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.3V20h14V9.3" />
      <path d="M9.5 20v-5h5v5" />
    </Svg>
  );
}

/** Peta terlipat — untuk luas wilayah. */
export function IkonPeta(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </Svg>
  );
}

/** Penanda lokasi — untuk jumlah dusun. */
export function IkonPin(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  );
}

/** Kisi empat kotak — untuk jumlah RT/RW. */
export function IkonKisi(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

/** Angka umum — cadangan kalau tak ada ikon yang cocok. */
export function IkonUmum(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v9M7.5 12h9" />
    </Svg>
  );
}

// --- Ikon tab kategori infografis -------------------------------------------

/** Batang menaik — data kesehatan/stunting. */
export function IkonGrafikBatang(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <rect x="3" y="13.5" width="4.5" height="6.5" rx="1" />
      <rect x="9.75" y="9" width="4.5" height="11" rx="1" />
      <rect x="16.5" y="4.5" width="4.5" height="15.5" rx="1" />
    </Svg>
  );
}

// --- Jenis kelamin ----------------------------------------------------------

/** Lambang Mars — laki-laki. */
export function IkonLaki(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <circle cx="10" cy="14" r="5" />
      <path d="M14.5 9.5 20 4" />
      <path d="M15 4h5v5" />
    </Svg>
  );
}

/** Lambang Venus — perempuan. */
export function IkonPerempuan(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="8.5" r="5" />
      <path d="M12 13.5V21" />
      <path d="M8.5 18h7" />
    </Svg>
  );
}

// --- Agama ------------------------------------------------------------------

/** Bulan sabit & bintang — Islam. */
export function IkonBulanBintang(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M15.5 4.5a7.5 7.5 0 1 0 0 15 6 6 0 0 1 0-15Z" />
      <path d="m19.5 8 .8 1.7 1.9.2-1.4 1.3.4 1.8-1.7-.9-1.7.9.4-1.8-1.4-1.3 1.9-.2Z" />
    </Svg>
  );
}

/** Salib Latin — Kristen. */
export function IkonSalib(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M12 3v18" />
      <path d="M7 8.5h10" />
    </Svg>
  );
}

/** Bangunan gereja bersalib — Katolik. */
export function IkonGereja(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M12 2v3.5M10.3 3.7h3.4" />
      <path d="M5 21V10.5l7-4 7 4V21" />
      <path d="M9.8 21v-3.8a2.2 2.2 0 0 1 4.4 0V21" />
    </Svg>
  );
}

/** Pura berundak — Hindu. */
export function IkonPura(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M4 21h16" />
      <path d="M6.5 21v-6h11v6" />
      <path d="m4.5 15 7.5-4 7.5 4" />
      <path d="m7.5 11 4.5-2.6 4.5 2.6" />
      <path d="M12 4.5V8" />
    </Svg>
  );
}

/** Roda dharma — Buddha. */
export function IkonRoda(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 3.5v6M12 14.5v6M3.5 12h6M14.5 12h6" />
      <path d="m6 6 4.2 4.2M13.8 13.8 18 18M18 6l-4.2 4.2M10.2 13.8 6 18" />
    </Svg>
  );
}

/** Lampion — Konghucu. */
export function IkonLampion(p: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...p}>
      <path d="M12 2.5v2M8.5 5h7" />
      <ellipse cx="12" cy="12" rx="5" ry="6.5" />
      <path d="M8 12h8" />
      <path d="M12 18.5V21" />
    </Svg>
  );
}

// --- Pemeta ikon ------------------------------------------------------------
//
// Ikon dipilih dari TEKS label, jadi bila pengurus desa mengganti nama label
// (mis. "Islam" jadi "Muslim"), ikonnya cuma turun ke ikon cadangan — angkanya
// tetap tampil utuh. Ini penurunan yang aman, bukan data yang hilang.

/** Ikon untuk baris agama. */
export function ikonAgama(label: string): ReactNode {
  const t = label.toLowerCase();
  if (t.includes("islam")) return <IkonBulanBintang />;
  if (t.includes("katolik")) return <IkonGereja />;
  if (t.includes("kristen") || t.includes("protestan")) return <IkonSalib />;
  if (t.includes("hindu")) return <IkonPura />;
  if (t.includes("buddha") || t.includes("budha")) return <IkonRoda />;
  if (t.includes("konghucu") || t.includes("khonghucu") || t.includes("kong hu cu"))
    return <IkonLampion />;
  return <IkonUmum />;
}

/** Ikon untuk baris jenis kelamin. */
export function ikonGender(label: string): ReactNode {
  const t = label.toLowerCase();
  if (t.includes("perempuan") || t.includes("wanita")) return <IkonPerempuan />;
  if (t.includes("laki") || t.includes("pria")) return <IkonLaki />;
  return <IkonOrang />;
}

/** Ikon untuk kartu angka pokok desa (statistik_desa). */
export function ikonAngka(kunci: string | null, label: string): ReactNode {
  const t = label.toLowerCase();
  if (kunci === "penduduk" || t.includes("penduduk") || t.includes("jiwa"))
    return <IkonOrang />;
  if (kunci === "luas" || t.includes("luas")) return <IkonPeta />;
  if (t.includes("keluarga") || t.includes("kk")) return <IkonRumah />;
  if (t.includes("dusun")) return <IkonPin />;
  if (t.includes(" rt") || t.startsWith("rt") || t.includes(" rw") || t.includes("rukun"))
    return <IkonKisi />;
  return <IkonUmum />;
}
