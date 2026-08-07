import { angka } from "@/lib/format";
import type { Butir } from "../kategori";

const FORMAT_PERSEN = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 1,
});

/** Tabel tiga kolom yang tetap muat tanpa gulir horizontal pada layar kecil. */
export function TabelData({
  butir,
  satuan = "jiwa",
}: {
  butir: Butir[];
  satuan?: string;
}) {
  const total = butir.reduce((jumlah, item) => jumlah + item.nilai, 0);

  return (
    <table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm">
      <caption className="sr-only">
        Data kategori, jumlah, dan persentase
      </caption>
      <thead>
        <tr className="border-b border-garis text-tinta-redup">
          <th className="w-1/2 pb-3 pr-3 font-semibold sm:w-auto">
            Kategori
          </th>
          <th className="w-1/4 px-2 pb-3 text-right font-semibold">
            Jumlah
          </th>
          <th className="w-1/4 pb-3 pl-2 text-right font-semibold">
            Persentase
          </th>
        </tr>
      </thead>
      <tbody>
        {butir.map((item) => {
          const persen = total > 0 ? (item.nilai / total) * 100 : 0;

          return (
            <tr key={item.id} className="border-b border-garis/70">
              <th className="break-words py-3 pr-3 font-medium text-tinta">
                {item.label}
              </th>
              <td className="px-2 py-3 text-right tabular-nums text-tinta">
                {angka(item.nilai)}
                <span className="sr-only"> {satuan}</span>
              </td>
              <td className="py-3 pl-2 text-right tabular-nums text-tinta-redup">
                {FORMAT_PERSEN.format(persen)}%
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr className="font-bold text-tinta">
          <th className="pt-3 pr-3">Total</th>
          <td className="px-2 pt-3 text-right tabular-nums">
            {angka(total)}
            <span className="sr-only"> {satuan}</span>
          </td>
          <td className="pt-3 pl-2 text-right tabular-nums">
            {total > 0 ? "100%" : "0%"}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
