"use client";

import imageCompression from "browser-image-compression";

/** Menyiapkan foto HP menjadi JPEG kecil yang aman ditampilkan di web. */
export async function siapkanGambarUntukUnggah(
  berkas: File,
  {
    batasMb = 0.4,
    sisiMaksimal = 1600,
  }: { batasMb?: number; sisiMaksimal?: number } = {},
): Promise<File> {
  const nama = berkas.name.toLowerCase();
  const heic =
    berkas.type === "image/heic" ||
    berkas.type === "image/heif" ||
    nama.endsWith(".heic") ||
    nama.endsWith(".heif");

  let gambar = berkas;
  if (heic) {
    const { default: heic2any } = await import("heic2any");
    const hasil = await heic2any({
      blob: berkas,
      toType: "image/jpeg",
      quality: 0.9,
    });
    const blob = Array.isArray(hasil) ? hasil[0] : hasil;
    gambar = new File(
      [blob],
      berkas.name.replace(/\.(heic|heif)$/i, ".jpg"),
      { type: "image/jpeg" },
    );
  }

  const kecil = await imageCompression(gambar, {
    maxSizeMB: batasMb,
    maxWidthOrHeight: sisiMaksimal,
    useWebWorker: true,
    fileType: "image/jpeg",
  });
  const namaJpeg = berkas.name.replace(/\.[^.]+$/, "") + ".jpg";

  return new File([kecil], namaJpeg, { type: "image/jpeg" });
}
