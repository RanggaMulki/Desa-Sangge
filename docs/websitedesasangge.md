# Plan: Website Resmi Desa Sangge

## Context

Desa Sangge (Kec. Klego, Kab. Boyolali) berstatus Desa Mandiri tapi informasinya masih terpencar di dokumen cetak dan penyampaian lisan. Kanal digital sebelumnya berupa subdomain platform pihak ketiga yang sudah tidak diperbarui dan **tidak berada dalam kendali penuh pemerintah desa** — baik domain, akses peladen, maupun datanya.

Program KKN Multidisiplin 3 membangun website resmi desa yang menampung konten dari 4 anggota tim, lalu **diserahterimakan sepenuhnya ke pemerintah desa**. Ini membentuk dua batasan utama yang mengarahkan seluruh keputusan teknis:

1. **Website harus tetap hidup tanpa developer.** Tidak boleh bergantung pada home server mahasiswa. Hosting, database, dan storage semuanya managed/serverless tier gratis yang tidak butuh dipantau.
2. **Admin adalah orang awam teknologi** (perangkat desa, pendamping Karang Taruna). Semua UI, label, dan pesan error ditulis dengan bahasa sehari-hari. Konten harus bisa ditambah/diubah lewat form web tanpa menyentuh kode.

Kontrol penuh desa juga berarti akun (Vercel, Neon, domain) harus atas nama/email desa sejak awal, bukan dipindahkan belakangan.

### Ruang lingkup

Website desa saja. Monev Bank Sampah adalah program kerja terpisah dan **tidak** termasuk di sini.

### Keputusan yang sudah diambil

| Hal | Keputusan |
|---|---|
| Model konten | Seluruhnya CMS database — desa bisa update sendiri pasca-KKN |
| Layanan KPPA | Halaman kontak saja, **tanpa** form pengaduan (hindari menyimpan data korban) |
| Domain | `*.vercel.app` dulu; migrasi `sangge.desa.id` jadi checklist terpisah |
| Cakupan fitur | Konten proposal + fitur esensial situs desa (termasuk agenda kegiatan) |
| Gaya visual | Resmi tapi hangat |

---

## Pemetaan konten anggota tim

Wawasan desain utama: konten dari 3 anggota tim non-teknis dikelola dalam **satu sistem konten**, dengan kategori untuk topik dan `jenisKonten` untuk bentuknya. Jangan buat tabel terpisah per anggota tim; satu sistem jauh lebih mudah dirawat dan dipahami developer berikutnya.

| Anggota | Konten | Bentuk di sistem |
|---|---|---|
| Rangga (Informatika) | Platform, arsitektur, panduan pengelolaan | Seluruh sistem + halaman `/panduan` |
| Cheryl (Sejarah) | Profil desa, sejarah, potensi & tokoh lokal | Halaman statis `sejarah` |
| Regita (Keperawatan) | Materi edukasi kesehatan + poster/leaflet digital | Konten kategori `kesehatan`, dibedakan dengan `jenisKonten` (`materi` atau `poster`) |
| Fayyadh (Teknik Mesin) | Panduan perawatan alat + infografis | Artikel kategori `perawatan-alat` + lampiran gambar |

Konsekuensi: **lampiran file (PDF leaflet, infografis) adalah kebutuhan nyata**, bukan nice-to-have — dua anggota tim luarannya berbentuk itu.

### Bentuk konten Informasi Kesehatan

Topik dan bentuk konten adalah dua hal berbeda:

- `kategori = kesehatan` menentukan bahwa informasi berada di kanal Kesehatan.
- `jenisKonten = materi` berarti konten memiliki judul, ringkasan, isi panjang, foto sampul opsional, dan lampiran opsional.
- `jenisKonten = poster` berarti konten hanya memiliki nama untuk kebutuhan admin/aksesibilitas dan satu gambar poster wajib. Poster tidak memakai ringkasan, editor teks, atau lampiran.

Record lama otomatis memakai `jenisKonten = materi`. Keberadaan foto sampul **tidak boleh** dipakai untuk menebak bahwa sebuah konten adalah poster.

---

## Referensi Situs Desa Lain

Dua referensi yang ditinjau: [tamang.digitaldesa.id](https://tamang.digitaldesa.id/) dan [biyawak.desaa.id](https://biyawak.desaa.id/). Keduanya memakai platform SaaS desa.

### Yang diadopsi (konvensi = keakraban)

Struktur navigasi situs desa di Indonesia sudah punya pola mapan. Mengikutinya berarti perangkat desa dan warga tidak perlu belajar apa pun:

- Menu **Beranda / Profil Desa / Pemerintahan / Berita / Galeri / Kontak**
- Submenu Profil: **Sejarah, Visi & Misi, Kondisi Geografis, Struktur Organisasi**
- Widget **statistik penduduk** di beranda
- **Jam layanan kantor desa** di footer (Biyawak menampilkan tabel Senin-Jumat 08:00-15:00)
- Direktori **perangkat desa dengan foto**
- Label "Website Resmi Desa ..." di header sebagai penanda keresmian

### Yang ditolak (dan alasannya)

Temuan paling berharga justru dari kegagalan referensinya. **Desa Tamang menampilkan statistik penduduk bernilai `0` dan Berita Desa bertuliskan "Belum Ada Data".** Template memaksa semua widget tampil meski belum diisi, dan hasilnya website terlihat terbengkalai — masalah yang sama persis dengan kanal digital lama Sangge.

| Ditolak | Alasan |
|---|---|
| Widget yang tetap tampil saat kosong | **Aturan wajib: seksi tanpa isi tidak dirender sama sekali.** Ketiadaan lebih baik daripada "Belum Ada Data". |
| Menu bertingkat sangat banyak (Biyawak: Statistik 16 kategori, APBDes 5, Layanan 6) | Tidak ada yang mengisi setelah KKN. Menu panjang di HP tidak terpakai. |
| Penghitung kunjungan ("Visitor Statistics") | Butuh tulis DB tiap kunjungan → merusak ISR dan membakar compute Neon. Rasio manfaat terhadap biaya buruk. Pakai Vercel Analytics kalau memang perlu. |
| SDGS, Bansos, Lapak Warga | Di luar cakupan KKN dan butuh komitmen pengisian jangka panjang dari desa. |
| Menu ALL CAPS | Sulit dibaca, terutama bagi lansia. |

---

## Arah Visual

**Catatan jujur soal warna:** "desa agraris → hijau" adalah asosiasi paling otomatis dan berisiko menghasilkan tampilan generik. Tapi untuk situs pemerintah yang melayani warga sungguhan, konvensi punya nilai guna nyata: warga mengenali ini situs resmi. Jadi hijau dipertahankan, tapi dieksekusi dengan komitmen — hijau tua pekat sebagai identitas, bukan hijau muda dekoratif, dan **latar putih bersih, bukan krem/beige** yang sudah jadi klise.

### Prinsip pengarah: pembacanya termasuk lansia

Sasaran proker Regita mencakup **lansia dan ibu balita**. Ini bukan detail sepele, ini menentukan tipografi:

- Ukuran teks dasar **17px**, bukan 14-16px seperti kebanyakan situs
- Kontras teks isi minimal **4.5:1**, tidak ada abu-abu muda "biar elegan"
- Area sentuh minimal **44×44px**
- Tidak ada teks di atas foto tanpa lapisan gelap

### Token warna (OKLCH)

```css
--hijau-utama:   oklch(0.38 0.075 155);  /* identitas, header, tautan */
--hijau-pekat:   oklch(0.30 0.065 155);  /* hover, footer */
--hijau-muda:    oklch(0.94 0.020 155);  /* latar seksi bergantian */
--oker:          oklch(0.62 0.130 55);   /* aksen hangat, tombol utama */
--merah-layanan: oklch(0.52 0.170 25);   /* KPPA & kontak darurat saja */

--latar:         oklch(0.99 0.003 155);  /* putih, sedikit condong hijau */
--permukaan:     oklch(0.97 0.006 155);  /* kartu, panel */
--tinta:         oklch(0.22 0.015 155);  /* teks isi */
--tinta-redup:   oklch(0.45 0.015 155);  /* teks sekunder, tetap ≥4.5:1 */
--garis:         oklch(0.90 0.008 155);
```

`--merah-layanan` **hanya** dipakai untuk KPPA dan kontak darurat. Kalau dipakai untuk hal lain, sinyal daruratnya hilang.

### Tipografi

Satu famili saja: **Plus Jakarta Sans** (buatan Indonesia, dipakai lewat `next/font` sehingga di-host sendiri, tanpa permintaan ke Google). Hierarki dibangun lewat ukuran dan bobot, bukan lewat tambahan jenis huruf.

| Elemen | Ukuran | Bobot |
|---|---|---|
| Judul halaman (h1) | 32px HP / 44px desktop | 700 |
| Judul seksi (h2) | 24px / 30px | 700 |
| Judul artikel di kartu (h3) | 19px | 600 |
| Teks isi | 17px, tinggi baris 1.7 | 400 |
| Keterangan / label | 15px | 500 |

Lebar kolom teks artikel dibatasi 68ch.

---

## Daftar Fitur

### Publik

| # | Fitur | Isi | Sumber konten |
|---|---|---|---|
| 1 | **Beranda** | Sambutan, statistik, berita terbaru, pintasan edukasi, kontak KPPA | Agregat |
| 2 | **Profil Desa** | Gambaran umum, kondisi geografis, peta lokasi | Halaman statis |
| 3 | **Sejarah Desa** | Asal-usul, tokoh, tradisi | Cheryl |
| 4 | **Visi & Misi** | Visi, misi, program prioritas | Halaman statis |
| 5 | **Struktur Pemerintahan** | Perangkat desa: foto, nama, jabatan | Tabel `perangkatDesa` |
| 6 | **Infografis Desa** | Kependudukan, APB Desa per tahun, risiko stunting, dan IDM | Tabel `statistikDesa`, `infografis`, dan `apbDesa` (isi manual) |
| 7 | **Berita & Pengumuman** | Kegiatan dan informasi desa | Artikel |
| 8 | **Agenda Kegiatan** | Jadwal posyandu, musdes, kerja bakti | Tabel `agenda` |
| 9 | **Informasi Kesehatan** | Materi bacaan + galeri poster kesehatan | Regita |
| 10 | **Perawatan Alat** | Panduan + infografis | Fayyadh |
| 11 | **Layanan Perlindungan Perempuan & Anak** | Kontak KPPA, jam layanan, alur pelaporan | Tabel `kontakLayanan` |
| 12 | **Galeri** | Dokumentasi kegiatan | Tabel `galeri` |
| 13 | **Kontak** | Alamat, jam layanan, peta, WhatsApp | Halaman statis |
| 14 | **Panduan Pemakaian Website** | Tutorial admin, langkah demi langkah | MDX |
| 15 | **Pencarian** | Cari artikel lintas kategori | Postgres full-text |
| 16 | **Aksesibilitas** | Tombol perbesar teks, kontras aman, navigasi keyboard | Sistem |

Fitur 6, 8, 13 **tidak ditampilkan sama sekali** bila datanya kosong. Tidak ada "Belum Ada Data".

### Admin

| # | Fitur | Kemampuan |
|---|---|---|
| 1 | **Masuk** | Email + kata sandi, "Ingat saya", pesan error ramah |
| 2 | **Beranda Admin** | Ringkasan jumlah konten, daftar draf belum terbit, tombol "Tulis artikel baru" |
| 3 | **Kelola Informasi** | CRUD materi dan poster dengan form berbeda; cari dan saring per topik, bentuk, serta status |
| 4 | **Editor Teks** | Tebal, miring, judul, daftar, tautan, gambar, kutipan. Sengaja terbatas. |
| 5 | **Draf & Terbit** | Simpan sebagai draf, pratinjau, lalu terbitkan |
| 6 | **Unggah Lampiran** | PDF leaflet & infografis per artikel |
| 7 | **Pustaka Media** | Semua foto & berkas, kompresi otomatis, indikator pemakaian kuota |
| 8 | **Kelola Halaman** | Ubah profil, sejarah, visi-misi, KPPA (hanya ubah, tidak bisa hapus) |
| 9 | **Kelola Perangkat Desa** | Tambah/ubah nama, jabatan, foto, urutan tampil |
| 10 | **Kelola Kontak Layanan** | Nomor WA, jam layanan, termasuk kontak KPPA |
| 11 | **Kelola Agenda** | Tambah jadwal kegiatan, tanggal, lokasi |
| 12 | **Kelola Galeri** | Unggah foto kegiatan + keterangan |
| 13 | **Kelola Statistik** | Ubah angka penduduk, KK, luas wilayah |
| 14 | **Kelola Pengguna** | Tambah akun, nonaktifkan, atur ulang kata sandi |
| 15 | **Ganti Kata Sandi** | Untuk akun sendiri |
| 16 | **Unduh Cadangan Data** | Ekspor seluruh isi database ke JSON |

### Aturan UX admin (mengikat)

Ini yang membedakan CMS yang dipakai dari CMS yang ditinggalkan:

- **Tidak ada istilah teknis di layar.** Bukan "publish" tapi "Terbitkan". Bukan "upload" tapi "Unggah foto". Bukan "slug" — dibuat otomatis dan tidak ditampilkan.
- **Label tombol = kata kerja + objek.** "Simpan perubahan", "Terbitkan artikel", "Hapus foto". Bukan "OK" atau "Submit".
- **Konfirmasi hapus menyebut nama item.** "Hapus artikel *Cara Merawat Mesin Diesel*? Tindakan ini tidak bisa dibatalkan."
- **Pesan sukses menawarkan langkah berikutnya.** "Artikel berhasil diterbitkan. [Lihat hasilnya]"
- **Peringatan bila meninggalkan form yang belum disimpan.**
- **Empty state mengajari, bukan sekadar memberi tahu.** Bukan "Tidak ada artikel", tapi "Belum ada artikel kesehatan. [Tulis artikel pertama]"
- **Pesan error menjelaskan cara memperbaiki.** Bukan "Validation failed", tapi "Judul belum diisi. Isi dulu judulnya, ya."
- **Kartu di HP, tabel di desktop.** Tabel yang digeser horizontal di HP tidak terpakai.

---

## Layout Halaman

Dirancang mobile-first: perangkat desa hampir pasti mengakses dari HP.

### Beranda

```
┌─────────────────────────────────┐
│ [Logo] Desa Sangge         [≡]  │  header lengket, hijau tua
├─────────────────────────────────┤
│                                 │
│   Desa Sangge                   │  hero: foto desa asli,
│   Kecamatan Klego, Boyolali     │  lapisan gelap, teks putih
│   [Berita Terbaru] [Layanan]    │  tinggi 60vh di HP
│                                 │
├─────────────────────────────────┤
│ ⚠ Layanan Perlindungan          │  pita --merah-layanan
│   Perempuan & Anak              │  DI ATAS lipatan, disengaja
│   [Hubungi via WhatsApp]        │
├─────────────────────────────────┤
│  Sambutan Kepala Desa           │  foto + kutipan singkat
│  [foto]  "..."                  │
├─────────────────────────────────┤
│  Desa Sangge dalam Angka        │  latar --hijau-muda
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │  2 kolom di HP, 4 di desktop
│  │Jiwa│ │ KK │ │Dusun│ │Luas│   │  sembunyi bila kosong
│  └────┘ └────┘ └────┘ └────┘    │
├─────────────────────────────────┤
│  Berita Terbaru      [Semua →]  │  3 kartu, gambar 16:9
│  ┌───────────────────────────┐  │
│  │ [gambar]                  │  │
│  │ Kategori · 12 Jul 2026    │  │
│  │ Judul berita di sini      │  │
│  └───────────────────────────┘  │
├─────────────────────────────────┤
│  Informasi untuk Warga          │  3 kanal edukasi tim KKN
│  ┌──────────┐ ┌──────────┐      │  ikon + nama + jumlah artikel
│  │Kesehatan │ │ Perawatan│      │
│  │ 8 artikel│ │ 5 artikel│      │
│  └──────────┘ └──────────┘      │
├─────────────────────────────────┤
│  Agenda Terdekat                │  daftar, bukan kalender penuh
│  ● 20 Jul · Posyandu Balita     │
│  ● 25 Jul · Musyawarah Desa     │
├─────────────────────────────────┤
│  Galeri Kegiatan     [Semua →]  │  grid foto masonry
├─────────────────────────────────┤
│  FOOTER (hijau pekat)           │
│  Alamat · Jam Layanan           │
│  Senin-Jumat 08.00-15.00        │
│  Kontak · Tautan · Media Sosial │
└─────────────────────────────────┘
```

Keputusan yang disengaja: **pita KPPA ditaruh di atas lipatan**, bukan dikubur di menu Layanan. Proposal menyebut desa belum punya kanal terbuka untuk kontak pengaduan perlindungan perempuan dan anak. Kalau ditaruh di submenu, tujuan itu tidak tercapai.

### Detail Artikel

```
┌─────────────────────────────────┐
│ Beranda › Kesehatan › Judul     │  remah roti
├─────────────────────────────────┤
│ ┌─Kesehatan─┐                   │  lencana kategori
│                                 │
│ Judul Artikel yang Cukup        │  h1, text-wrap: balance
│ Panjang di Sini                 │
│                                 │
│ Oleh Regita · 12 Juli 2026      │  atribusi penulis
├─────────────────────────────────┤
│ [gambar sampul 16:9]            │
├─────────────────────────────────┤
│                                 │
│ Isi artikel, lebar maks 68ch,   │  17px, tinggi baris 1.7
│ ukuran 17px supaya nyaman       │
│ dibaca lansia...                │
│                                 │
├─────────────────────────────────┤
│ 📎 Berkas Lampiran              │  kotak --hijau-muda
│ ┌─────────────────────────────┐ │  hanya tampil bila ada
│ │ 📄 Leaflet Cegah Stunting   │ │
│ │    PDF · 1,2 MB   [Unduh]   │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Artikel Lain di Kategori Ini    │  2 kartu
└─────────────────────────────────┘
```

### Halaman KPPA

Halaman paling penting sekaligus paling sederhana. Yang dibaca orang dalam keadaan tertekan harus bisa dipindai dalam hitungan detik.

```
┌─────────────────────────────────┐
│ Layanan Perlindungan            │  h1
│ Perempuan dan Anak              │
│                                 │
│ Desa Sangge menyediakan kanal   │  kalimat pembuka singkat
│ pendampingan bagi warga yang    │
│ mengalami kekerasan.            │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │  kartu kontak, border merah
│ │ Ibu Sri Wahyuni             │ │  nama besar
│ │ Ketua KPPA Desa Sangge      │ │
│ │                             │ │
│ │  0812-xxxx-xxxx             │ │  nomor 24px, bisa ditekan
│ │                             │ │
│ │ [ Hubungi via WhatsApp ]    │ │  tombol penuh, tinggi 52px
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Kapan Bisa Dihubungi            │
│ Setiap hari, 07.00-21.00        │
├─────────────────────────────────┤
│ Alur Pelaporan                  │  4 langkah bernomor
│ 1. Hubungi nomor di atas        │
│ 2. Ceritakan yang dialami       │
│ 3. Pendamping menemui Anda      │
│ 4. Diteruskan bila perlu        │
├─────────────────────────────────┤
│ Kontak Darurat Lain             │
│ Polsek Klego · Puskesmas ·      │
│ SAPA 129                        │
├─────────────────────────────────┤
│ ℹ Kerahasiaan identitas         │  catatan penutup
│   pelapor dijaga.               │
└─────────────────────────────────┘
```

Halaman ini **tidak** memuat form. Alasannya sudah diputuskan: menyimpan data korban kekerasan di database yang dikelola admin awam menimbulkan risiko yang tidak sebanding dengan manfaatnya.

### Admin: Daftar Artikel

```
┌─────────────────────────────────┐
│ [≡] Kelola Artikel        [👤]  │
├─────────────────────────────────┤
│ [ + Tulis Artikel Baru ]        │  tombol utama, oker, paling menonjol
├─────────────────────────────────┤
│ [🔍 Cari judul...            ]  │
│ [Semua Kategori ▾] [Status ▾]   │  dropdown, bukan teks bebas
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │  kartu di HP
│ │ ● Draf                      │ │  titik status berwarna
│ │ Cara Merawat Mesin Diesel   │ │
│ │ Perawatan Alat · 12 Jul     │ │
│ │ [Ubah]  [Terbitkan]  [⋯]    │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ● Terbit                    │ │
│ │ Cegah Stunting Sejak Dini   │ │
│ │ Kesehatan · 10 Jul          │ │
│ │ [Ubah]  [Lihat]      [⋯]    │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Admin: Form Artikel

Urutan field mengikuti cara orang berpikir saat menulis, bukan urutan kolom database.

```
┌─────────────────────────────────┐
│ ← Kembali        Tulis Artikel  │
├─────────────────────────────────┤
│ Judul Artikel                   │
│ [_____________________________] │
│                                 │
│ Jenis Isi                       │  DROPDOWN, bukan teks bebas
│ [Kesehatan                   ▾] │
│                                 │
│ Ringkasan Singkat               │
│ [_____________________________] │  bantuan: "1-2 kalimat,
│ Muncul di daftar artikel        │  tampil di halaman daftar"
│                                 │
│ Foto Sampul                     │
│ ┌─────────────────────────────┐ │
│ │   [+] Pilih atau Ambil Foto │ │  langsung buka kamera di HP
│ └─────────────────────────────┘ │
│                                 │
│ Isi Artikel                     │
│ ┌─────────────────────────────┐ │
│ │ B  I  H  •  🔗  🖼  ❝       │ │  toolbar sengaja terbatas
│ ├─────────────────────────────┤ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Berkas Lampiran (opsional)      │
│ [+ Tambah PDF atau Gambar]      │
├─────────────────────────────────┤
│ [Simpan Draf]  [Pratinjau]      │  bilah lengket di bawah
│ [    Terbitkan Sekarang     ]   │
└─────────────────────────────────┘
```

### Navigasi

Desktop: bilah atas dengan menu turun. HP: tombol hamburger membuka panel geser.

```
Beranda
Profil Desa ▾   → Tentang Desa · Sejarah · Visi & Misi · Struktur Pemerintahan
Informasi ▾     → Kesehatan · Perawatan Alat
Berita
Agenda
Galeri
Layanan ▾       → Perlindungan Perempuan & Anak · Panduan Website
Kontak
```

Delapan butir menu utama, maksimal satu tingkat submenu. Bandingkan dengan Biyawak yang punya 12 menu dengan submenu sampai 16 butir.

---

## Tech Stack

### Fondasi
- **Next.js (App Router) + TypeScript** — server actions untuk form admin, tanpa API route terpisah per fitur
- **Vercel (Hobby)** — hosting serverless, tidak bergantung home server
- **Neon (Postgres)** — database serverless managed
- **Drizzle ORM** — ringan, edge-friendly, native untuk driver serverless Neon
- **Session sendiri (`jose`)** — email + kata sandi + cookie session bertanda tangan, middleware proteksi `/admin/*`. **Bukan NextAuth**: v5 masih beta setelah bertahun-tahun, v4 tidak dirancang untuk Next 16 App Router, dan untuk 1 peran tanpa OAuth keduanya membawa banyak permukaan yang tidak terpakai. Makin sedikit dependensi, makin sedikit yang bisa rusak setelah serah terima.
- **bcryptjs** — hash kata sandi, versi murni JavaScript supaya jalan di runtime serverless

### UI
- **Tailwind CSS + shadcn/ui** — accessible & responsive by default, mobile-first
- **next/font (Plus Jakarta Sans)** — di-host sendiri, tanpa permintaan ke Google
- **react-hook-form + Zod** — pesan error ditulis bahasa sehari-hari
- **Tiptap** — editor WYSIWYG dengan toolbar **sengaja dibatasi**. Toolbar penuh membingungkan orang awam dan merusak konsistensi tipografi.
- **Recharts** — hanya dimuat di halaman Infografis Penduduk untuk tooltip
  sentuh, pilihan jumlah/persentase, dan donut dusun yang dapat dipilih.

### Media
- **Cloudflare R2** — upload gambar & PDF lewat server action, memakai SDK S3 (`@aws-sdk/client-s3`). Byte gambar disimpan di R2; database Neon hanya menyimpan **link**-nya. Dipilih menggantikan Vercel Blob karena free tier-nya jauh lebih longgar untuk situs padat foto: **10 GB** (vs ~1 GB) dan **tanpa biaya egress**.
- **browser-image-compression** — kompresi di browser sebelum upload (maks 1600px, target ~200KB). Pengurus desa akan upload foto langsung dari HP (3–8 MB) dan ini menghabiskan kuota penyimpanan dengan cepat kalau tidak dikompresi.
- Registry: tabel `media` mencatat setiap unggahan (url + kunci objek) sebagai sumber tunggal, supaya berkas yatim tidak menumpuk dan kuota bisa dipantau.

### Keamanan konten
- **isomorphic-dompurify** — sanitasi HTML dari Tiptap sebelum dirender. HTML tersimpan di database dan dirender dengan `dangerouslySetInnerHTML`, jadi sanitasi **wajib**.

### Tidak dipakai (dan alasannya)
- Tremor — kartu statistik desa cukup HTML biasa, tidak ada dashboard analitik
- @react-pdf/renderer — leaflet PDF **diupload**, bukan digenerate
- @dnd-kit, exceljs — tidak ada kanban maupun export tabular
- Pustaka kalender eksternal — kalender bulanan agenda memakai `Date` dan
  `Intl` bawaan browser agar tetap ringan di HP. Siklus Pancawara dihitung
  dari acuan terverifikasi 2 Agustus 2026 = Legi, tanpa menambah dependensi.
  Penanda tanggal merah 2026 memakai 17 hari libur nasional dan 8 cuti
  bersama dari SKB 3 Menteri Nomor 1497/2025, 2/2025, dan 5/2025 yang
  dipublikasikan Kementerian Sekretariat Negara.

---

## Struktur Folder (feature-based)

Alasan: project ini akan disentuh developer lain (atau developer yang sama setelah lama tidak membuka), jadi tiap fitur harus bisa dipahami secara terisolasi.

### Anatomi satu folder fitur

Selalu sama, supaya developer berikutnya tahu di mana harus mencari tanpa menjelajah:

```
src/features/<nama-fitur>/
  components/     komponen React khusus fitur ini
  queries.ts      baca data (SELECT)
  actions.ts      ubah data — server action (INSERT/UPDATE/DELETE)
  validasi.ts     aturan Zod + pesan error bahasa sehari-hari
  <domain>.ts     konstanta domain, mis. kategori.ts
```

Tidak semua fitur butuh kelima berkas. Buat saat dibutuhkan, jangan disiapkan kosong di awal.

### Peta lengkap

Tanda `[x]` sudah ada, `[ ]` menyusul pada fase yang disebut.

```
src/
├── app/                          route tipis, cuma import dari features/
│   ├── globals.css               [x] token warna & tipografi
│   ├── layout.tsx                [x]
│   └── page.tsx                  [x] sementara, diganti di Fase 3
│
├── features/
│   ├── artikel/                  inti sistem, dipakai semua kategori konten
│   │   ├── kategori.ts           [x] sumber tunggal kebenaran kategori
│   │   ├── queries.ts            [x] ambilArtikelTerbaru, hitungArtikelPerKategori,
│   │   │                             ambilArtikelPerKategori
│   │   ├── validasi.ts           [ ] Fase 2
│   │   ├── actions.ts            [ ] Fase 2
│   │   └── components/           [ ] Fase 2
│   ├── auth/                     [ ] Fase 1 — session, hash kata sandi, middleware
│   ├── media/                    [ ] Fase 2 — unggah, kompresi, pustaka berkas
│   ├── halaman-statis/           [ ] Fase 4 — profil, sejarah, visi-misi, KPPA
│   ├── pemerintahan/             [ ] Fase 4
│   ├── kontak-layanan/           [ ] Fase 4 — termasuk kontak KPPA
│   ├── agenda/                   [ ] Fase 4
│   ├── galeri/                   [ ] Fase 4
│   ├── statistik/                [ ] Fase 4
│   └── panduan/                  [ ] Fase 5 — MDX, publik
│
├── components/                   [ ] shadcn/ui + Navbar, Footer, KontenAman
│
├── lib/
│   ├── db.ts                     [x] koneksi Neon
│   └── format.ts                 [x] tanggal, angka, tautan WhatsApp
│
└── db/                           lihat bagian berikutnya
```

### Aturan penempatan

Ini yang paling sering dilanggar dan membuat struktur berantakan dalam hitungan minggu:

| Kalau... | Taruh di |
|---|---|
| Cuma dipakai satu fitur | `features/<fitur>/` |
| Dipakai ≥2 fitur, tanpa logika bisnis | `lib/` atau `components/` |
| Ragu | `features/` dulu, pindahkan saat terbukti dipakai ulang |

Arah perpindahannya sengaja satu arah. Memindahkan sesuatu keluar dari `features/` saat terbukti dipakai ulang itu mudah dan aman. Sebaliknya, menarik kembali sesuatu dari `lib/` yang ternyata cuma dipakai sekali hampir tidak pernah terjadi, karena tidak ada yang berani menyentuh berkas di folder bersama.

### Catatan penamaan

Berkas Zod di folder fitur bernama **`validasi.ts`**, bukan `schema.ts`. Alasannya sudah ada `src/db/schema.ts` untuk definisi tabel; dua berkas bernama sama dengan isi yang sama sekali berbeda adalah persis jenis kebingungan yang harus dihindari proyek ini.

---

## Struktur Berkas Database

```
drizzle.config.ts                 [x] konfigurasi CLI drizzle-kit
                                      (memuat .env.local lewat dotenv)
src/lib/db.ts                     [x] koneksi runtime aplikasi
                                      (env dimuat sendiri oleh Next.js/Vercel)
src/db/
├── schema.ts                     [x] 10 tabel + 4 enum + relasi + tipe bantu
├── seed.ts                       [ ] Fase 1 — akun admin, halaman statis,
│                                      kontak KPPA contoh
└── migrations/
    ├── 0000_awal.sql             [x] SQL hasil generate, JANGAN diubah manual
    └── meta/
        ├── _journal.json         [x] daftar migrasi yang sudah dijalankan
        └── 0000_snapshot.json    [x] potret skema untuk membandingkan perubahan
```

### Alur perubahan skema

Selalu satu arah, dan selalu lewat migrasi:

```
edit schema.ts → npm run db:generate → migrations/000X.sql → npm run db:migrate → Neon
```

Folder `meta/` yang membuat `db:generate` tahu apa yang berubah sejak terakhir kali. Kalau dihapus, Drizzle kehilangan riwayat dan menghasilkan migrasi yang mencoba membuat ulang tabel yang sudah ada.

Jangan pakai `db:push` di database yang sudah berisi data. Perintah itu menyinkronkan skema tanpa membuat berkas migrasi, praktis saat eksperimen awal tapi bisa menghapus kolom tanpa peringatan yang jelas.

### Kenapa `schema.ts` tidak dipecah per fitur

Ini terlihat melanggar prinsip feature-based, dan memang disengaja. Database bersifat lintas fitur: `artikel` menunjuk ke `pengguna`, `lampiran` menunjuk ke `artikel`, `media` menunjuk ke `pengguna`. Kalau definisi tabel disebar ke masing-masing folder fitur, foreign key jadi tercerai-berai dan tidak ada satu tempat pun untuk melihat model data secara utuh.

Yang dipecah per fitur adalah **kuerinya** (`features/*/queries.ts`), bukan definisi tabelnya. Satu berkas skema terpusat, banyak berkas kueri tersebar.

---

## Skema Database

```ts
// db/schema.ts (Drizzle)

pengguna        // id, nama, email, kataSandiHash, aktif, dibuatPada
                // multi-akun, TAPI satu peran saja. Tiap anggota tim KKN dapat
                // akun sendiri supaya nama penulis tercatat (bukti luaran akademik).
                // Tidak ada RBAC — makin banyak lapis izin, makin membingungkan awam.

artikel         // id, judul, slug (unique), kategori (enum),
                // jenisKonten (materi|poster), ringkasan,
                // konten (text/HTML), gambarSampulUrl, status (draft|terbit),
                // penulisId -> pengguna, tanggalTerbit, dibuatPada, diperbaruiPada
                // index: (kategori, status, tanggalTerbit desc), unique(slug)

lampiran        // id, artikelId, nama, url, tipe (pdf|gambar), ukuranByte
                // leaflet kesehatan & infografis perawatan alat

halamanStatis   // id, slug (unique: profil-desa|sejarah|visi-misi|kppa),
                // judul, konten (HTML), diperbaruiPada
                // di-seed di awal; admin hanya mengubah, tidak membuat/menghapus

perangkatDesa   // id, nama, jabatan, fotoUrl, urutan, periode, aktif

kontakLayanan   // id, namaLayanan, jenis (umum|kesehatan|kppa|darurat),
                // namaPetugas, nomorWa, jamLayanan, urutan, aktif

agenda          // id, judul, tanggalMulai, tanggalSelesai, lokasi, keterangan

galeri          // id, judul, gambarUrl, keterangan, tanggal

statistikDesa   // id, label, nilai, satuan, tahun, urutan

media           // id, url, kunciObjek, namaBerkas, ukuranByte, tipe, diunggahOlehId, dibuatPada
                // pustaka media — kunciObjek = kunci objek di R2, dipakai saat
                // menghapus; mencegah berkas yatim & memudahkan pantau kuota
```

Kanal informasi publik: `kesehatan` dan `perawatan-alat`.
Enum database masih menyimpan `sejarah-budaya` untuk kompatibilitas record lama,
tetapi kategori tersebut tidak ditampilkan kepada pengunjung.

---

## Peta Rute

### Publik
| Rute | Isi |
|---|---|
| `/` | Beranda |
| `/profil` | **Satu halaman berisi semuanya:** tentang desa, angka desa, sejarah (Cheryl), visi & misi, struktur perangkat desa. Perpindahan antar bagian lewat daftar isi di dalam halaman, bukan submenu. |
| `/berita`, `/berita/[slug]` | Berita & pengumuman |
| `/informasi/[kategori]` | Daftar materi dan poster per kategori |
| `/informasi/[kategori]/[slug]` | Detail materi + lampiran, atau gambar poster |
| `/agenda` | Kalender bulanan kegiatan + rincian tanggal terpilih |
| `/galeri` | Kisi dokumentasi, filter tahun, dan lightbox foto |
| `/layanan/perlindungan-perempuan-anak` | Halaman KPPA |
| `/kontak` | Kontak & jam layanan |
| `/panduan` | Tutorial pemakaian website |
| `/cari` | Hasil pencarian |

### Admin (`/admin/*`, dilindungi middleware)
`/admin` · `/admin/artikel` (+ `/baru`, `/[id]`) · `/admin/halaman` · `/admin/pemerintahan` · `/admin/kontak-layanan` · `/admin/agenda` · `/admin/galeri` · `/admin/statistik` · `/admin/media` · `/admin/pengguna` · `/admin/masuk`

---

## Tahapan Implementasi

**Urutan ini disengaja:** admin artikel diselesaikan lebih dulu supaya 3 anggota tim bisa mulai input konten sementara developer masih mengerjakan halaman publik. Kalau dibalik, input konten jadi bottleneck di akhir KKN.

### Fase 0 — Fondasi
- `create-next-app` (TS, App Router, Tailwind), init shadcn/ui
- Buat project Neon + Vercel **memakai email desa** sejak awal
- Token warna & tipografi ke `globals.css`, konfigurasi `next/font`
- Drizzle config, koneksi Neon, `.env.local`
- Navbar responsif + Footer

### Fase 1 — Database & Auth
- `db/schema.ts` lengkap + migrasi pertama
- NextAuth Credentials + bcrypt, session JWT
- `middleware.ts` melindungi `/admin/*`
- `db/seed.ts`: akun admin, 4 halaman statis, kontak KPPA contoh
- Halaman `/admin/masuk`

### Fase 2 — Admin Artikel + Media  ← *prioritas, membuka kerja paralel tim*
- Pustaka media: upload ke R2 (fondasi `src/lib/r2.ts` + `features/media` sudah ada), kompresi di browser
- Editor Tiptap toolbar terbatas
- Form materi lengkap + lampiran dan form poster khusus gambar
- Slug otomatis + penanganan tabrakan (`sejarah-desa-2`)
- Daftar artikel: cari, saring, kartu di HP
- Draf vs terbit + pratinjau
- `revalidatePath()` setelah tiap simpan

### Fase 3 — Halaman Publik Inti
- Beranda, daftar & detail artikel, berita
- Komponen `KontenAman` (DOMPurify + `prose`) — satu-satunya tempat HTML dirender
- Kotak lampiran dengan tombol unduh
- ISR (`export const revalidate = 3600`)

### Fase 4 — Halaman Pendukung
- Profil, sejarah, visi-misi, pemerintahan, statistik
- **Halaman KPPA** + pita di beranda
- Agenda, galeri, kontak, pencarian

### Fase 5 — SEO, Panduan & Serah Terima
- `generateMetadata`, Open Graph, `sitemap.ts`, `robots.ts`, JSON-LD `GovernmentOrganization`
- `/panduan` (MDX + screenshot)
- Tombol **"Unduh Cadangan Data"**
- Onboarding tatap muka + serah terima akun

---

## Catatan Free Tier

Website ini akan jalan **bertahun-tahun tanpa dipantau developer**, jadi batas kuota diantisipasi sejak desain.

| Layanan | Batas | Mitigasi di desain |
|---|---|---|
| Neon | 0.5 GB storage, compute autosuspend | ISR bikin halaman publik nyaris tidak menyentuh DB. Autosuspend (~500ms cold start) tidak terasa pengunjung karena halaman disajikan statis. Database hanya menyimpan teks & link, bukan gambar, jadi ruangnya praktis tidak habis. |
| Cloudflare R2 | 10 GB storage, egress nol | Semua foto & PDF di sini. Kompresi wajib di browser: tanpa itu, ~1.500 foto HP mentah baru menghabiskan kuota. Egress nol berarti tidak ada tagihan walau foto sering dilihat. |
| Vercel Image Optimization | transformasi terbatas/bulan | Batasi `sizes`/`quality`; gambar sudah dikompresi saat upload |
| Vercel Bandwidth | 100 GB/bulan | Sangat longgar untuk skala desa |

Diverifikasi ulang saat serah terima (kebijakan penyedia berubah):
- Kebijakan Neon terhadap project free tier yang lama tidak aktif
- Ketentuan Vercel Hobby soal penggunaan non-komersial — situs pemerintah desa termasuk non-komersial, konfirmasi ulang bila nanti ada jualan produk UMKM

---

## Verifikasi

1. **Alur admin end-to-end** — buat materi kesehatan dengan isi panjang dan lampiran, lalu buat poster kesehatan hanya dengan gambar. Terbitkan keduanya dan pastikan masuk ke bagian publik yang berbeda di `/informasi/kesehatan`.
2. **Uji di HP sungguhan** — buka preview Vercel dari HP, tulis artikel dan upload foto langsung dari kamera. Emulator desktop tidak menangkap masalah keyboard & ukuran sentuh.
3. **Kontras & keterbacaan** — cek semua pasangan warna teks/latar ≥4.5:1; baca halaman artikel di HP sambil berdiri di bawah sinar matahari
4. **Sanitasi HTML** — sisipkan `<script>alert(1)</script>` lewat editor, pastikan tidak tereksekusi
5. **Kontrol akses** — akses `/admin/artikel` saat logout, harus dialihkan ke `/admin/masuk`
6. **Seksi kosong** — kosongkan tabel agenda & galeri, pastikan seksinya **hilang** dari beranda, bukan menampilkan "Belum Ada Data"
7. **Slug & tabrakan** — buat dua artikel berjudul sama, pastikan slug kedua tidak menimpa
8. **Batas ukuran upload** — upload foto 8 MB dari HP, pastikan terkompresi dan tidak menabrak batas payload server action
9. **Uji pengguna sesungguhnya** — minta satu perangkat desa (bukan anggota tim KKN) menulis satu artikel hanya berbekal halaman `/panduan`, tanpa dibantu. Ini ukuran keberhasilan paling jujur untuk tujuan serah terima.

---

## Risiko

- **Batas payload server action Next.js (default 1 MB)** — upload foto gagal tanpa kompresi browser atau `bodySizeLimit` yang dinaikkan. Uji di Fase 2, jangan tunggu akhir.
- **Konten kosong saat peluncuran** — persis yang terjadi pada Desa Tamang. Diredam dengan mendahulukan Fase 2 dan aturan sembunyikan-seksi-kosong.
- **Domain `.vercel.app` jadi permanen** — mengulang masalah "subdomain pihak ketiga" yang sudah pernah terjadi. Migrasi ke `sangge.desa.id` sebaiknya jadi target berkalender, bukan wacana.
- **Kata sandi admin dibagikan ramai-ramai** — akun terpisah per orang sejak awal, wajib ganti kata sandi saat serah terima.
- **Akun Neon atas nama pribadi (risiko diterima secara sadar).** Database berada di akun `rangga.mulki96@gmail.com`, project `desa-sangge` (`bold-resonance-55167173`), organisasi `org-floral-dust-58266133`. Keputusan ini diambil sadar oleh developer. Konsekuensinya: bila akun tersebut hilang aksesnya, tidak ada pihak di Desa Sangge yang dapat memulihkan database. Mitigasi minimum yang disarankan: undang email desa sebagai member organisasi Neon (Settings → Members) dan cantumkan kredensial di berkas serah terima.
- **Statistik penduduk basi** — angka diisi manual dan tidak akan diperbarui sendiri. Tampilkan tahun data ("Data 2026") supaya pembaca tahu kapan terakhir diperbarui.
