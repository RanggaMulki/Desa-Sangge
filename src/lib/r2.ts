import "server-only";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

/**
 * Koneksi ke Cloudflare R2, tempat semua foto dan berkas disimpan.
 *
 * R2 dipakai, bukan menaruh gambar di database: Neon hanya menampung teks dan
 * link, sementara byte gambarnya tinggal di sini. R2 gratisnya 10 GB dan tidak
 * menagih biaya keluar data (egress), jadi cocok untuk situs desa yang padat
 * foto dan jalan bertahun-tahun tanpa dipantau.
 *
 * R2 berbicara dengan protokol yang sama seperti Amazon S3, jadi memakai SDK
 * S3 resmi. Yang khas R2 hanya dua: `region: "auto"` dan `endpoint` yang
 * menunjuk ke akun R2, bukan ke AWS.
 *
 * Berkas ini diawali `import "server-only"` supaya kunci rahasia R2 tidak
 * mungkin ikut terbawa ke peramban: kalau tidak sengaja diimpor dari komponen
 * klien, build langsung gagal. Pola yang sama dipakai features/auth/session.ts.
 */

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_URL,
} = process.env;

// Diperiksa sekali saat modul dimuat, bukan saat unggahan pertama, supaya
// kesalahan konfigurasi ketahuan sedini mungkin dan pesannya jelas.
if (
  !R2_ACCOUNT_ID ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_BUCKET ||
  !R2_PUBLIC_URL
) {
  throw new Error(
    "Konfigurasi Cloudflare R2 belum lengkap. Isi R2_ACCOUNT_ID, " +
      "R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, dan R2_PUBLIC_URL " +
      "di .env.local. Lihat langkahnya di docs/SETUP.md.",
  );
}

// Tanpa garis miring di ujung, supaya penggabungan URL di bawah tidak dobel.
const ALAMAT_PUBLIK = R2_PUBLIC_URL.replace(/\/+$/, "");

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Unggah satu berkas ke R2.
 *
 * `kunci` adalah nama objek di dalam bucket, mis. "galeri/uuid.jpg". Kembalian
 * `url` adalah alamat publik yang disimpan ke database dan dipakai <img>/next
 * image; `kunci` dikembalikan juga supaya pemanggil bisa mencatatnya untuk
 * penghapusan nanti tanpa perlu mengurai ulang URL-nya.
 */
export async function unggahKeR2(
  kunci: string,
  data: Buffer | Uint8Array,
  tipe: string,
): Promise<{ url: string; kunci: string }> {
  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: kunci,
      Body: data,
      ContentType: tipe,
    }),
  );

  return { url: `${ALAMAT_PUBLIK}/${kunci}`, kunci };
}

/**
 * Hapus satu objek dari R2 berdasarkan kuncinya.
 *
 * Dipanggil saat sebuah media dihapus dari pustaka, dan sebagai pembersih
 * kalau pencatatan ke database gagal setelah unggah berhasil (lihat
 * features/media/actions.ts) supaya tidak ada objek yatim yang diam-diam
 * memakan kuota.
 */
export async function hapusDariR2(kunci: string): Promise<void> {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: kunci,
    }),
  );
}

/**
 * Ambil satu objek dari R2 untuk disajikan ulang oleh server sendiri.
 *
 * Inilah yang membuat foto tampil tanpa bergantung pada URL publik r2.dev:
 * peramban memuat foto dari alamat website ini (`/media/...`, sertifikat valid,
 * sama-origin), sementara server mengambil byte-nya dari R2 lewat API S3 yang
 * andal. r2.dev publik sempat kali gagal dengan error sertifikat, baik di
 * server maupun di peramban, jadi jalur ini menghindarinya sama sekali.
 *
 * Foto berukuran kecil (sudah dikompresi saat unggah), jadi byte-nya dimuat
 * sekaligus, bukan dialirkan bertahap — lebih sederhana dan cukup.
 */
export async function ambilDariR2(
  kunci: string,
): Promise<{ bytes: Uint8Array; tipe?: string } | null> {
  try {
    const hasil = await r2.send(
      new GetObjectCommand({ Bucket: R2_BUCKET, Key: kunci }),
    );
    if (!hasil.Body) return null;
    const bytes = await hasil.Body.transformToByteArray();
    return { bytes, tipe: hasil.ContentType };
  } catch (e) {
    // Objek tidak ada atau gagal diambil — pemanggil membalas 404.
    console.error("Gagal ambil objek R2:", kunci, e);
    return null;
  }
}
