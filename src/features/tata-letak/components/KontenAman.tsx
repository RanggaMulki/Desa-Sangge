import { bersihkanHtml } from "@/lib/sanitasi";

/**
 * SATU-SATUNYA tempat HTML dari database boleh dirender.
 *
 * Kalau nanti ada tempat lain yang memanggil `dangerouslySetInnerHTML`
 * langsung, itu tanda ada yang salah: pindahkan ke sini supaya penyaringannya
 * tidak bisa terlewat.
 *
 * Gaya tulisannya diatur di sini juga, bukan di tiap halaman, supaya artikel
 * kesehatan, panduan alat, dan sejarah desa punya tipografi yang sama persis
 * walau ditulis tiga orang berbeda.
 */
export function KontenAman({ html }: { html: string }) {
  return (
    <div
      className="
        [&_p]:mb-4
        [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold
        [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold
        [&_h4]:mb-2 [&_h4]:mt-5 [&_h4]:text-lg [&_h4]:font-semibold
        [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6
        [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6
        [&_li]:mb-1
        [&_a]:text-hijau-utama [&_a]:underline [&_a]:underline-offset-4
        [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-hijau-muda [&_blockquote]:pl-5 [&_blockquote]:text-tinta-redup
        [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl
        [&_figcaption]:mt-2 [&_figcaption]:text-tinta-redup
        [&_hr]:my-8 [&_hr]:border-garis
        [&_table]:my-5 [&_table]:w-full [&_table]:border-collapse
        [&_th]:border [&_th]:border-garis [&_th]:bg-permukaan [&_th]:p-2.5 [&_th]:text-left
        [&_td]:border [&_td]:border-garis [&_td]:p-2.5
        [&_code]:rounded [&_code]:bg-permukaan [&_code]:px-1.5 [&_code]:py-0.5
        last:[&>*]:mb-0
      "
      dangerouslySetInnerHTML={{ __html: bersihkanHtml(html) }}
    />
  );
}
