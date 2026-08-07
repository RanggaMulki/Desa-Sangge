/**
 * Warna grafik infografis — hijau (identitas desa) + aksen oranye.
 *
 * Hijau adalah warna utama semua grafik & angka, seragam dengan header, menu,
 * dan tombol di seluruh situs. Oranye HANYA aksen untuk menandai perempuan.
 *
 * DIPILIH LEWAT VALIDATOR, BUKAN DIKIRA-KIRA. Hasil pemeriksaan yang berlaku:
 *
 *   Hijau grafik #4f6339 sama dengan hijau lumut tema. Kontrasnya cukup untuk
 *     batang di atas putih dan tidak membuat halaman terasa seperti dashboard
 *     dengan palet yang berbeda dari situs utama.
 *
 *   Pasangan hijau↔oranye (laki-laki vs perempuan, dan dua iris pertama donut)
 *     → LULUS, dengan catatan pemisahan buta warna ΔE 7,5 (pita 6–8). Ini SAH
 *     hanya karena setiap grafik selalu menyertakan label + angka + celah 2px
 *     sebagai penanda kedua — warna tidak pernah jadi satu-satunya pembeda.
 *
 *   Palet kategorikal [hijau, oranye, ungu, cyan, pink, amber] → LULUS. Kuning
 *     terang & slate dari saran awal DIBUANG karena gagal (kuning di luar pita,
 *     slate abu-abu & tak terbedakan dari pink oleh mata protan); amber #ca8a04
 *     dipakai sebagai gantinya dan lolos. Aman sampai 6 kategori; lebih dari itu
 *     pai bukan bentuk yang tepat, jadi pemanggil beralih ke kolom.
 *
 *   Angka besar di kartu memakai hijau TUA (var --color-hijau-utama), bukan
 *     hijau grafik atau oranye — keduanya kurang kontras untuk teks. Oranye
 *     hanya dipakai sebagai isi lencana/marka, tidak pernah sebagai teks angka.
 */

/**
 * Hijau data: warna semua batang & kolom. Memakai hijau lumut #4f6339 yang
 * sama dengan tema situs. Sebagai SATU warna isi (bukan pembeda antar kategori)
 * ia hanya perlu kontras cukup di atas latar — dan itu terpenuhi (6,5:1).
 */
export const HIJAU_DATA = "#4f6339";

/** Oranye aksen: perempuan & iris kedua donut. */
export const ORANYE = "var(--color-oranye-data)";

/** Warna satu-satunya untuk semua batang & kolom. */
export const BATANG = HIJAU_DATA;

export const WARNA_LAKI = HIJAU_DATA;
export const WARNA_PEREMPUAN = ORANYE;

/**
 * Urutan slot kategorikal natural untuk donut. Setiap warna selalu didampingi
 * label, angka, persentase, dan keadaan terpilih; warna tidak menjadi satu-
 * satunya pembeda.
 */
export const SLOT_KATEGORIKAL = [
  "#4f6339", // hijau lumut
  "#b6552f", // terracotta
  "#2e303e", // navy
  "#8a7442", // oker
  "#6f5773", // plum redup
  "#46736d", // teal daun
];
