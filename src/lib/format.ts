/**
 * Format tanggal ke bahasa Indonesia.
 *
 * Semua tanggal yang dilihat pengunjung dan admin lewat sini, supaya
 * tidak ada campuran "12 Jul 2026" dan "2026-07-12" di layar yang sama.
 */

const ZONA = "Asia/Jakarta";

/** Tanggal hari ini di Desa Sangge dalam bentuk YYYY-MM-DD. */
export function tanggalHariIni(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: ZONA,
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${value.year}-${value.month}-${value.day}`;
}

/** 12 Juli 2026 */
export function tanggalPanjang(nilai: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONA,
  }).format(keDate(nilai));
}

/** 12 Jul 2026 */
export function tanggalPendek(nilai: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: ZONA,
  }).format(keDate(nilai));
}

/** 12 Jul, untuk daftar agenda yang tahunnya sudah jelas */
export function tanggalRingkas(nilai: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: ZONA,
  }).format(keDate(nilai));
}

/** 1.234 */
export function angka(nilai: number): string {
  return new Intl.NumberFormat("id-ID").format(nilai);
}

/** Rp1.234.567 tanpa angka desimal. */
export function rupiah(nilai: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

/**
 * 850 KB / 2,4 MB
 *
 * Ditampilkan di samping tombol unduh lampiran. Warga desa banyak yang
 * memakai paket data terbatas, jadi ukuran berkas adalah informasi yang
 * dipakai untuk mengambil keputusan, bukan sekadar keterangan teknis.
 */
export function ukuranBerkas(byte: number): string {
  if (byte < 1024) return `${byte} B`;
  const kb = byte / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(mb)} MB`;
}

/**
 * Ubah nomor WA jadi tautan wa.me.
 * Menerima berbagai bentuk yang biasa ditulis orang: 0812..., +62812...,
 * 62812..., atau dengan spasi dan tanda hubung.
 */
export function tautanWhatsApp(nomor: string): string {
  let bersih = nomor.replace(/\D/g, "");
  if (bersih.startsWith("0")) bersih = "62" + bersih.slice(1);
  return `https://wa.me/${bersih}`;
}

/** 0812-3456-7890, lebih mudah dibaca daripada deretan angka panjang. */
export function nomorTampil(nomor: string): string {
  let bersih = nomor.replace(/\D/g, "");
  if (bersih.startsWith("62")) bersih = "0" + bersih.slice(2);
  return bersih.replace(/(\d{4})(?=\d)/g, "$1-");
}

function keDate(nilai: Date | string): Date {
  return nilai instanceof Date ? nilai : new Date(nilai);
}
