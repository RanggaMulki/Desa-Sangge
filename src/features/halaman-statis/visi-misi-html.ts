import { bersihkanHtml } from "@/lib/sanitasi";

function loloskanHtml(teks: string) {
  return teks
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** Mengubah data lama berbentuk teks biasa menjadi HTML yang sah untuk editor. */
export function normalkanHtml(teks: string): string {
  const nilai = teks.trim();
  if (!nilai) return "";
  const memilikiTagEditor =
    /<\/?(?:p|br|strong|em|u|s|h[2-4]|ul|ol|li|blockquote|a|img|figure|figcaption|table|thead|tbody|tr|th|td|hr|code|pre)\b[^>]*>/i.test(
      nilai,
    );
  if (memilikiTagEditor) return bersihkanHtml(nilai);
  return `<p>${loloskanHtml(nilai).replaceAll("\n", "<br>")}</p>`;
}

/** HTML daftar awal untuk editor Misi, termasuk kompatibilitas data lama. */
export function gabungkanMisiHtml(
  butir: Array<{ teks: string }> | string[],
): string {
  if (butir.length === 0) return "";
  const isi = butir
    .map((item) => (typeof item === "string" ? item : item.teks))
    .map((teks) => `<li>${normalkanHtml(teks)}</li>`)
    .join("");
  return `<ol>${isi}</ol>`;
}

/** Editor kosong mengirim elemen kosong seperti <p></p> atau <ol><li></li></ol>. */
export function punyaIsiHtml(html: string): boolean {
  const teks = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return teks.length > 0 || /<img\b/i.test(html);
}

/**
 * Mengambil isi setiap <li> tingkat terluar tanpa memecahkan daftar bersarang.
 * Bila editor tidak memakai daftar, setiap blok paragraf/judul/kutipan dianggap
 * satu butir agar kesalahan format tidak menghilangkan tulisan pengurus.
 */
export function ambilButirMisiHtml(html: string): string[] {
  const aman = bersihkanHtml(html).trim();
  if (!aman) return [];

  const hasil: string[] = [];
  const tokenLi = /<\/?li\b[^>]*>/gi;
  let kedalaman = 0;
  let awalIsi = -1;
  let cocok: RegExpExecArray | null;

  while ((cocok = tokenLi.exec(aman))) {
    const penutup = /^<\//.test(cocok[0]);
    if (!penutup) {
      if (kedalaman === 0) awalIsi = cocok.index + cocok[0].length;
      kedalaman += 1;
      continue;
    }

    if (kedalaman === 0) continue;
    kedalaman -= 1;
    if (kedalaman === 0 && awalIsi >= 0) {
      const isi = aman.slice(awalIsi, cocok.index).trim();
      if (punyaIsiHtml(isi)) hasil.push(isi);
      awalIsi = -1;
    }
  }

  if (hasil.length > 0) return hasil;

  const blok = Array.from(
    aman.matchAll(/<(p|h2|h3|h4|blockquote)\b[^>]*>[\s\S]*?<\/\1>/gi),
    (item) => item[0].trim(),
  ).filter(punyaIsiHtml);

  if (blok.length > 0) return blok;
  return punyaIsiHtml(aman) ? [aman] : [];
}
