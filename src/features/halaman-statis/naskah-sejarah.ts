export type BagianNaskahSejarah = {
  sejarah: string;
  legenda: string;
};

const PEMBUKA_SEJARAH = "<h2>Sejarah Desa</h2>";
const PEMBUKA_LEGENDA = "<hr><h2>Legenda Desa</h2>";

/**
 * Satu record halaman statis tetap dipakai, tetapi isinya diberi penanda
 * stabil supaya form admin dan halaman publik dapat memperlakukan sejarah
 * serta legenda sebagai dua naskah yang berbeda.
 */
export function gabungkanNaskahSejarah({
  sejarah,
  legenda,
}: BagianNaskahSejarah): string {
  return `${PEMBUKA_SEJARAH}${sejarah.trim()}${PEMBUKA_LEGENDA}${legenda.trim()}`;
}

/**
 * Record lama belum memiliki penanda. Dalam kondisi itu seluruh naskah
 * diperlakukan sebagai sejarah agar isi yang sudah ada tidak hilang.
 */
export function pisahkanNaskahSejarah(konten: string): BagianNaskahSejarah {
  const isi = konten.trim();
  if (!isi) return { sejarah: "", legenda: "" };

  const posisiLegenda = isi.indexOf(PEMBUKA_LEGENDA);
  if (posisiLegenda === -1) {
    return {
      sejarah: isi.startsWith(PEMBUKA_SEJARAH)
        ? isi.slice(PEMBUKA_SEJARAH.length).trim()
        : isi,
      legenda: "",
    };
  }

  const bagianSejarah = isi.slice(0, posisiLegenda);
  return {
    sejarah: bagianSejarah.startsWith(PEMBUKA_SEJARAH)
      ? bagianSejarah.slice(PEMBUKA_SEJARAH.length).trim()
      : bagianSejarah.trim(),
    legenda: isi.slice(posisiLegenda + PEMBUKA_LEGENDA.length).trim(),
  };
}
