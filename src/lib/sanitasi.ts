import DOMPurify from "isomorphic-dompurify";

/**
 * Membersihkan HTML sebelum dirender ke halaman.
 *
 * Isi artikel dan halaman statis disimpan sebagai HTML, lalu dirender lewat
 * `dangerouslySetInnerHTML`. Tanpa penyaringan ini, siapa pun yang bisa
 * menulis artikel juga bisa menitipkan <script> yang berjalan di peramban
 * setiap pengunjung.
 *
 * Ini bukan pengaman teoretis di sini: halaman pengelolaan sedang berjalan
 * tanpa login (lihat features/auth/konfigurasi.ts), jadi "siapa pun yang bisa
 * menulis artikel" secara harfiah berarti siapa pun yang membuka alamatnya.
 *
 * Daftar tagnya dibatasi, bukan diblokir satu per satu. Memblokir daftar tag
 * berbahaya selalu ketinggalan dari cara baru yang ditemukan orang; mengizinkan
 * daftar pendek yang memang dipakai editor jauh lebih mudah dijaga benar.
 */
const TAG_DIIZINKAN = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "hr",
  "code",
  "pre",
];

const ATRIBUT_DIIZINKAN = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "title",
  "width",
  "height",
];

export function bersihkanHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: TAG_DIIZINKAN,
    ALLOWED_ATTR: ATRIBUT_DIIZINKAN,
    // Menutup javascript:, data:, dan vbscript: pada href maupun src.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
  });
}
