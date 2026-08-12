import sanitizeHtml from "sanitize-html";

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
 *
 * Memakai `sanitize-html`, BUKAN DOMPurify + jsdom. DOMPurify butuh DOM, dan di
 * server ia menyeret jsdom — yang salah satu dependensinya (@exodus/bytes)
 * pindah ke ESM murni dan bikin build produksi Vercel gagal dimuat
 * (ERR_REQUIRE_ESM). `sanitize-html` mengurai HTML dengan parser murni tanpa
 * DOM, jadi tidak ada jsdom sama sekali dan aman dijalankan di server.
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
  return sanitizeHtml(html, {
    allowedTags: TAG_DIIZINKAN,
    // Atribut yang sama diizinkan untuk semua tag ("*"), meniru daftar tunggal
    // ALLOWED_ATTR pada konfigurasi lama.
    allowedAttributes: { "*": ATRIBUT_DIIZINKAN },
    // Hanya skema ini yang boleh muncul di href/src. Skema lain — termasuk
    // javascript:, data:, dan vbscript: — dibuang. URL relatif (diawali "/"
    // atau "#") tetap lolos karena tidak memuat skema.
    allowedSchemes: ["http", "https", "mailto", "tel"],
    // Tag terlarang dibuang seluruhnya beserta isinya yang berbahaya, bukan
    // disisakan sebagai teks mentah.
    disallowedTagsMode: "discard",
  });
}
