export type LatarSeksi = "terang" | "permukaan" | "hijau";

/**
 * Nama kelas tetap, sedangkan warna dan jenis gradiennya hidup di globals.css.
 * Dengan begitu seluruh halaman dapat mengikuti satu perubahan token tema.
 */
export const KELAS_LATAR_SEKSI: Record<LatarSeksi, string> = {
  terang: "latar-seksi-terang",
  permukaan: "latar-seksi-permukaan",
  hijau: "latar-seksi-hijau",
};
