import { ambilDariR2 } from "@/lib/r2";

/**
 * Penyaji foto & berkas dari R2, lewat alamat website sendiri.
 *
 * Foto disimpan di R2, tapi peramban memuatnya dari sini (`/media/<kunci>`) —
 * sama-origin, sertifikat valid — bukan dari r2.dev yang sertifikatnya ditolak
 * peramban. Server yang mengambil byte-nya dari R2 lewat API S3.
 *
 * Kunci objek berupa UUID acak, jadi alamatnya tidak bisa ditebak. Isinya pun
 * memang konten publik (foto perangkat, galeri). Header cache dibuat panjang
 * dan `immutable` karena tiap kunci unik dan tidak pernah berubah isi — setelah
 * termuat sekali, peramban tidak memintanya lagi.
 */
export async function GET(
  _permintaan: Request,
  { params }: { params: Promise<{ kunci: string[] }> },
) {
  const { kunci } = await params;

  // Jaga-jaga terhadap penjelajahan jalur, walau kunci S3 tidak mengenalnya.
  if (kunci.some((bagian) => bagian === "..")) {
    return new Response("Tidak ditemukan", { status: 404 });
  }

  const objek = await ambilDariR2(kunci.join("/"));
  if (!objek) return new Response("Tidak ditemukan", { status: 404 });

  return new Response(objek.bytes as BodyInit, {
    headers: {
      "Content-Type": objek.tipe ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
