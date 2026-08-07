import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray } from "drizzle-orm";
import { artikel, galeri, lampiran, pengguna } from "./schema";

config({ path: ".env.local", quiet: true });

/**
 * DATA CONTOH — BUKAN DATA RESMI DESA SANGGE.
 *
 * Gunanya satu saja: mengisi website dengan beberapa artikel dan foto contoh
 * supaya tata letaknya bisa dinilai. Semua judul dan isi di bawah KARANGAN.
 *
 * Cara pakai:
 *   npm run db:dummy         pasang artikel & foto contoh
 *   npm run db:dummy:hapus   cabut lagi
 *
 * ==================================================================
 * LINGKUPNYA SENGAJA DIPERSEMPIT.
 *
 * Berkas ini HANYA menyentuh artikel, galeri, dan lampiran contoh — data
 * yang jelas-jelas karangan dan tidak bertabrakan dengan isi resmi.
 *
 * Ia TIDAK LAGI menyentuh perangkat desa, statistik, batas wilayah, misi,
 * maupun halaman statis (profil/sejarah/visi). Dulu ia mengisinya juga, tapi
 * baris-baris itu kini memuat DATA RESMI yang diketik pengurus desa. Kalau
 * dummy ikut memasang/mencabutnya, data resmi bisa tertimpa atau terhapus —
 * persis ranjau yang pernah ada di sini. Jadi urusan data struktural
 * sepenuhnya diserahkan ke halaman pengelolaan dan `npm run db:seed`.
 * ==================================================================
 *
 * Kenapa ID-nya ditulis tangan dan tidak diacak: supaya penghapusan bisa
 * menyasar baris yang persis ini saja, tanpa mengosongkan seluruh tabel dan
 * ikut menghapus data asli. Semua ID contoh diawali `ddd` supaya kelihatan
 * sekali di Neon Console.
 */

const ID = {
  artikel: [
    "ddd40000-0000-4000-8000-000000000001",
    "ddd40000-0000-4000-8000-000000000002",
    "ddd40000-0000-4000-8000-000000000003",
    "ddd40000-0000-4000-8000-000000000004",
    "ddd40000-0000-4000-8000-000000000005",
    "ddd40000-0000-4000-8000-000000000006",
  ],
  galeri: [
    "ddd60000-0000-4000-8000-000000000001",
    "ddd60000-0000-4000-8000-000000000002",
    "ddd60000-0000-4000-8000-000000000003",
  ],
  lampiran: ["ddd70000-0000-4000-8000-000000000001"],
};

/** Tanggal relatif terhadap hari ini, supaya konten tidak pernah terlihat basi. */
function hari(selisih: number) {
  const d = new Date();
  d.setDate(d.getDate() + selisih);
  return d.toISOString().slice(0, 10);
}
function waktu(selisihHari: number) {
  const d = new Date();
  d.setDate(d.getDate() + selisihHari);
  return d;
}

const db = drizzle(neon(process.env.DATABASE_URL!));

// =====================================================================
// PASANG
// =====================================================================

async function pasang() {
  const [penulis] = await db
    .select({ id: pengguna.id })
    .from(pengguna)
    .limit(1);

  if (!penulis) {
    throw new Error(
      "Belum ada akun pengguna. Jalankan `npm run db:seed` lebih dulu.",
    );
  }

  // --- Artikel ---------------------------------------------------------
  await db.insert(artikel).values([
    {
      id: ID.artikel[0],
      judul: "Musyawarah Desa Bahas Rencana Pembangunan Tahun Depan",
      slug: "musyawarah-desa-rencana-pembangunan",
      kategori: "berita",
      ringkasan:
        "Perangkat desa bersama BPD dan perwakilan warga membahas prioritas pembangunan desa untuk tahun anggaran berikutnya.",
      konten:
        "<p>Balai Desa Sangge menjadi tempat berlangsungnya musyawarah desa yang dihadiri perangkat desa, Badan Permusyawaratan Desa, ketua RT dan RW, serta perwakilan kelompok tani dan PKK.</p>" +
        "<h2>Usulan Warga</h2>" +
        "<p>Beberapa usulan yang mengemuka antara lain perbaikan jalan penghubung antar dusun, penambahan lampu penerangan jalan, dan penguatan kegiatan posyandu.</p>" +
        "<h2>Tindak Lanjut</h2>" +
        "<p>Seluruh usulan dicatat dan akan dituangkan dalam dokumen perencanaan desa.</p>" +
        "<p><em>(Berita contoh untuk menguji tampilan.)</em></p>",
      status: "terbit",
      penulisId: penulis.id,
      tanggalTerbit: waktu(-3),
    },
    {
      id: ID.artikel[1],
      judul: "Jadwal Posyandu Balita Bulan Ini",
      slug: "jadwal-posyandu-balita-bulan-ini",
      kategori: "pengumuman",
      ringkasan:
        "Posyandu balita dilaksanakan serentak di enam dusun. Ibu diminta membawa buku KIA.",
      konten:
        "<p>Pemerintah Desa Sangge bersama kader posyandu mengumumkan jadwal penimbangan dan pemeriksaan balita bulan ini.</p>" +
        "<ul><li>Dusun I dan II: pekan pertama</li><li>Dusun III dan IV: pekan kedua</li><li>Dusun V dan VI: pekan ketiga</li></ul>" +
        "<p>Ibu dimohon membawa buku KIA dan datang tepat waktu.</p>" +
        "<p><em>(Pengumuman contoh untuk menguji tampilan.)</em></p>",
      status: "terbit",
      penulisId: penulis.id,
      tanggalTerbit: waktu(-8),
    },
    {
      id: ID.artikel[2],
      judul: "Mencegah Stunting Sejak Masa Kehamilan",
      slug: "mencegah-stunting-sejak-masa-kehamilan",
      kategori: "kesehatan",
      ringkasan:
        "Pencegahan stunting dimulai jauh sebelum anak lahir. Berikut hal yang bisa dilakukan ibu hamil di rumah.",
      konten:
        "<p>Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi dalam waktu lama, terutama pada seribu hari pertama kehidupan.</p>" +
        "<h2>Selama Kehamilan</h2>" +
        "<ul><li>Periksa kehamilan minimal enam kali ke bidan atau puskesmas.</li><li>Minum tablet tambah darah setiap hari sesuai anjuran.</li><li>Makan beragam: nasi, lauk hewani, sayur, dan buah.</li></ul>" +
        "<h2>Setelah Bayi Lahir</h2>" +
        "<ul><li>Beri ASI saja sampai usia enam bulan.</li><li>Mulai MPASI pada usia enam bulan dengan lauk hewani setiap hari.</li><li>Timbang anak setiap bulan di posyandu.</li></ul>" +
        "<blockquote>Segera hubungi bidan desa bila berat badan anak tidak naik dua bulan berturut-turut.</blockquote>" +
        "<p><em>(Artikel contoh untuk menguji tampilan. Isi asli akan disusun Regita.)</em></p>",
      status: "terbit",
      penulisId: penulis.id,
      tanggalTerbit: waktu(-5),
    },
    {
      id: ID.artikel[3],
      judul: "Merawat Mesin Pompa Air Agar Awet",
      slug: "merawat-mesin-pompa-air-agar-awet",
      kategori: "perawatan-alat",
      ringkasan:
        "Perawatan rutin yang sederhana bisa memperpanjang umur pompa air dan menghemat biaya perbaikan.",
      konten:
        "<p>Mesin pompa air banyak dipakai warga untuk mengairi sawah dan kebutuhan rumah tangga. Perawatan yang tepat membuatnya bertahan jauh lebih lama.</p>" +
        "<h2>Setiap Selesai Dipakai</h2>" +
        "<ul><li>Matikan mesin dan tunggu dingin sebelum ditutup.</li><li>Bersihkan sisa lumpur pada saringan.</li></ul>" +
        "<h2>Setiap Bulan</h2>" +
        "<ul><li>Periksa ketinggian oli.</li><li>Periksa selang dari retak dan kebocoran.</li><li>Pastikan baut dudukan tidak kendur.</li></ul>" +
        "<h2>Tanda Perlu Diperiksa Montir</h2>" +
        "<ul><li>Suara mesin berubah kasar.</li><li>Air keluar tersendat padahal sumber air cukup.</li></ul>" +
        "<p><em>(Artikel contoh untuk menguji tampilan. Isi asli akan disusun Fayyadh.)</em></p>",
      status: "terbit",
      penulisId: penulis.id,
      tanggalTerbit: waktu(-11),
    },
    {
      id: ID.artikel[4],
      judul: "Tradisi Bersih Desa dan Maknanya bagi Warga",
      slug: "tradisi-bersih-desa-dan-maknanya",
      kategori: "sejarah-budaya",
      ringkasan:
        "Bersih desa bukan sekadar kerja bakti. Ada nilai kebersamaan dan rasa syukur yang diwariskan turun-temurun.",
      konten:
        "<p>Bersih desa merupakan tradisi tahunan yang dilaksanakan warga sebagai ungkapan syukur atas hasil panen dan keselamatan desa.</p>" +
        "<h2>Rangkaian Kegiatan</h2>" +
        "<p>Kegiatan diawali kerja bakti membersihkan jalan, makam, dan saluran air, lalu dilanjutkan dengan doa bersama dan kenduri.</p>" +
        "<h2>Nilai yang Dirawat</h2>" +
        "<p>Bagi warga, tradisi ini menjadi sarana mempererat kebersamaan antar dusun dan mengenalkan nilai gotong royong kepada generasi muda.</p>" +
        "<p><em>(Artikel contoh untuk menguji tampilan. Isi asli akan disusun Cheryl.)</em></p>",
      status: "terbit",
      penulisId: penulis.id,
      tanggalTerbit: waktu(-16),
    },
    {
      id: ID.artikel[5],
      judul: "Draf: Persiapan Lomba Desa",
      slug: "draf-persiapan-lomba-desa",
      kategori: "berita",
      ringkasan:
        "Tulisan ini sengaja dibiarkan berstatus draf untuk menguji bahwa draf tidak tampil di halaman publik.",
      konten:
        "<p>Kalau tulisan ini terlihat oleh pengunjung website, berarti ada yang salah pada penyaringan status artikel.</p>",
      status: "draf",
      penulisId: penulis.id,
    },
  ]);

  await db.insert(lampiran).values([
    {
      id: ID.lampiran[0],
      artikelId: ID.artikel[2],
      nama: "Leaflet Pencegahan Stunting (contoh).pdf",
      url: "/gambar/sawah-sangge.jpg",
      tipe: "pdf",
      ukuranByte: 503_808,
    },
  ]);

  // --- Galeri ----------------------------------------------------------
  // Memakai foto sawah yang sudah ada di public/gambar sebagai penampung,
  // supaya galeri contoh tidak menarik foto stok dari internet.
  await db.insert(galeri).values([
    { id: ID.galeri[0], judul: "Hamparan Sawah Desa Sangge", gambarUrl: "/gambar/sawah-sangge.jpg", keterangan: "Lahan pertanian yang menjadi mata pencaharian utama warga.", tanggal: hari(-20) },
    { id: ID.galeri[1], judul: "Suasana Pagi di Persawahan", gambarUrl: "/gambar/sawah-sangge.jpg", keterangan: "Foto contoh, menunggu dokumentasi kegiatan yang sesungguhnya.", tanggal: hari(-34) },
    { id: ID.galeri[2], judul: "Lahan Pertanian Dusun IV", gambarUrl: "/gambar/sawah-sangge.jpg", tanggal: hari(-52) },
  ]);

  console.log("Data contoh (artikel & galeri) terpasang.");
  console.log("Hapus lagi dengan: npm run db:dummy:hapus");
}

// =====================================================================
// HAPUS
// =====================================================================

async function hapus() {
  // Lampiran lebih dulu, walaupun ON DELETE CASCADE sudah mengurusnya.
  // Ditulis eksplisit supaya urutannya tetap benar kalau suatu saat
  // aturan cascade-nya berubah.
  await db.delete(lampiran).where(inArray(lampiran.id, ID.lampiran));
  await db.delete(artikel).where(inArray(artikel.id, ID.artikel));
  await db.delete(galeri).where(inArray(galeri.id, ID.galeri));

  console.log("Data contoh dihapus. Data resmi tidak tersentuh.");
}

// =====================================================================

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL belum diatur di .env.local");
}

const perintah = process.argv[2];
const jalankan = perintah === "hapus" ? hapus : pasang;

jalankan().catch((e) => {
  console.error("GAGAL:", e.message);
  process.exit(1);
});
