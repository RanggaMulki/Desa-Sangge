# Panduan Setup Developer

Dokumen ini untuk developer, bukan untuk pengurus desa.
Panduan untuk pengurus desa nanti ada di halaman `/panduan` pada website.

## Prasyarat

| Kebutuhan | Versi | Catatan |
|---|---|---|
| Node.js | **20.x atau 22.x LTS** | Jangan pakai Node 25, lihat catatan di bawah |
| npm | 10+ | Ikut bawaan Node |
| Akun Neon | gratis | https://neon.tech |
| Akun Vercel | gratis (Hobby) | https://vercel.com |

### Catatan penting soal versi Node

Mesin pengembangan saat ini memakai **Node v25.2.1**, yang merupakan rilis
ganjil (non-LTS) dan tidak tersedia sebagai runtime di Vercel. `package.json`
sudah membatasi `"node": ">=20.9.0 <25"`, jadi `npm install` akan memunculkan
peringatan `EBADENGINE` sampai versi Node diturunkan.

Cara memperbaiki (pilih salah satu):

```bash
# Opsi A: nvm (disarankan, bisa ganti versi per proyek)
brew install nvm            # ikuti instruksi shell setup dari brew
nvm install 22
nvm use 22

# Opsi B: homebrew langsung
brew install node@22
brew link --overwrite --force node@22
```

Setelah itu pastikan versi Node di Vercel Project Settings > General >
Node.js Version disetel ke angka yang sama.

### Catatan soal TypeScript

TypeScript di-pin ke **5.9.3**, bukan `latest`. Versi `latest` saat ini adalah
7.0.2 (port native Go) yang **belum dikenali oleh Next.js 16** dan membuat
`next build` gagal dengan pesan menyesatkan:

```
It looks like you're trying to use TypeScript but do not have the
required package(s) installed.
...
The "id" argument must be of type string. Received undefined
```

Jangan naikkan TypeScript ke 7.x sampai Next.js resmi mendukungnya.

---

## Langkah Setup

### 1. Pasang dependensi

```bash
npm install
```

### 2. Buat database di Neon

1. Daftar di https://neon.tech. **Gunakan email desa**, bukan email pribadi
   mahasiswa. Memindahkan kepemilikan project belakangan jauh lebih repot.
2. Klik **Create project**.
   - Name: `desa-sangge`
   - Postgres version: 17
   - Region: **AWS Asia Pacific (Singapore) `ap-southeast-1`**, region
     terdekat dari Indonesia sehingga latensi paling rendah.
3. Setelah project jadi, buka tab **Connect**.
4. Pilih **Connection pooling** (penting, lihat penjelasan di bawah).
5. Salin connection string. Bentuknya:

```
postgresql://neondb_owner:xxxxx@ep-nama-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

Perhatikan ada `-pooler` di nama host. Kalau tidak ada, berarti Anda
menyalin direct connection, bukan pooled.

**Kenapa harus pooled:** tiap serverless function di Vercel berumur pendek
dan bisa berjalan puluhan instance sekaligus. Direct connection akan
menghabiskan kuota koneksi Neon dan memunculkan error
`too many connections` saat trafik naik. Pooler menyembunyikan itu.

### 3. Siapkan penyimpanan foto di Cloudflare R2

Semua foto dan PDF disimpan di **Cloudflare R2**, bukan di database. Neon hanya
menyimpan **link**-nya. R2 dipilih karena gratisnya 10 GB dan tidak menagih
biaya keluar data (egress) — cocok untuk situs desa yang padat foto.

1. Daftar/masuk di https://dash.cloudflare.com. **Gunakan email desa**, sama
   alasannya seperti Neon: memindahkan kepemilikan belakangan jauh lebih repot.
2. Menu kiri → **R2** → **Create bucket**.
   - Nama: `desa-sangge`
   - Location: **Automatic** (atau Asia-Pacific).
3. Buka bucket itu → tab **Settings** → bagian **Public access** →
   **R2.dev subdomain** → **Allow Access**. Salin URL yang muncul, bentuknya
   `https://pub-xxxxxxxx.r2.dev`. Ini nilai `R2_PUBLIC_URL`.
4. Kembali ke halaman **R2** → **Manage R2 API Tokens** → **Create API Token**.
   - Permissions: **Object Read & Write**
   - Specify bucket: pilih `desa-sangge` saja (jangan semua bucket).
   - Klik Create. Layar menampilkan **Access Key ID** dan **Secret Access Key**
     **hanya sekali** — catat keduanya sekarang. Catat juga **Account ID** yang
     tampil di halaman R2.

> **R2.dev untuk sekarang, custom domain nanti.** URL `r2.dev` ditujukan untuk
> pengembangan dan bisa dibatasi laju oleh Cloudflare. Untuk trafik skala desa
> masih aman. Pindah ke custom domain (mis. `media.sangge.desa.id`) dijadikan
> satu paket dengan migrasi domain `sangge.desa.id` nanti.

### 4. Isi environment variable

Buat berkas `.env.local` di akar proyek, lalu isi baris berikut:

```
DATABASE_URL="..."        # connection string pooled dari langkah 2
AUTH_SECRET="..."         # buat dengan: openssl rand -base64 32
AUTH_URL="http://localhost:3000"

R2_ACCOUNT_ID="..."       # dari langkah 3
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET="desa-sangge"
R2_PUBLIC_URL="..."       # URL publik bucket, https://pub-xxxx.r2.dev
```

`.env.local` sudah masuk `.gitignore`. **Jangan pernah di-commit.** Berkas
inilah satu-satunya tempat kredensial; tidak ada berkas contoh terpisah supaya
tidak ada dua daftar yang bisa saling ketinggalan.

### 5. Terapkan skema ke database

```bash
npm run db:migrate
```

Perintah ini menjalankan berkas SQL di `src/db/migrations/` terhadap database
Neon. Setelahnya, cek isinya:

```bash
npm run db:studio
```

Drizzle Studio terbuka di browser dan menampilkan tabel-tabelnya kosong.

### 6. Jalankan

```bash
npm run dev
```

Buka http://localhost:3000

---

## Perintah yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi |
| `npm run db:generate` | Buat berkas migrasi baru setelah `schema.ts` diubah |
| `npm run db:migrate` | Terapkan migrasi ke database |
| `npm run db:studio` | Buka penjelajah database di browser |
| `npm run db:seed` | Isi data awal: akun admin, 4 halaman statis, kontak |
| `npm run db:penduduk` | Impor agregat penduduk MCD Juni 2026 yang telah divalidasi |
| `npm run db:dummy` | Pasang **data contoh** untuk menguji tampilan |
| `npm run db:dummy:hapus` | Cabut data contoh |

---

## ⚠️ Data contoh WAJIB dicabut sebelum tayang

Saat ini database berisi data contoh yang dipasang `npm run db:dummy`:
nama perangkat desa, jumlah penduduk, batas wilayah, berita, agenda, dan
foto galeri. **Semuanya karangan**, dipasang hanya supaya tata letak website
bisa dinilai sebelum data asli tersedia.

```bash
npm run db:dummy:hapus
```

Jalankan itu sebelum website dipakai warga, lalu isi data yang sebenarnya.

Kenapa ini serius: nama "Suparno, Kepala Desa" itu tidak ada. Kalau website
terlanjur tayang begitu saja, yang beredar adalah susunan perangkat desa
palsu di situs resmi pemerintah desa — dan orang akan mempercayainya, karena
memang tidak ada tandanya kalau itu karangan.

Dua pengaman sudah dipasang supaya ini tidak terlewat:

1. Halaman `/admin` menampilkan pita peringatan oker selama data contoh
   masih ada. Pita itu hilang sendiri setelah perintah di atas dijalankan.
2. Perintah hapusnya menyasar ID tertentu, bukan mengosongkan tabel. Data
   asli yang sudah terlanjur dimasukkan perangkat desa tidak akan ikut
   terhapus. (Sudah diuji: cabut lalu pasang lagi, `kontak_layanan`,
   `pengguna`, dan `halaman_statis` tidak berubah.)

### Alur mengubah struktur database

Selalu lewat migrasi, jangan `db:push` di database yang sudah berisi data:

```bash
# 1. Ubah src/db/schema.ts
# 2. Hasilkan migrasi
npm run db:generate
# 3. Baca dulu SQL yang dihasilkan di src/db/migrations/
# 4. Terapkan
npm run db:migrate
```

`db:push` menyinkronkan skema tanpa membuat berkas migrasi. Praktis saat
eksperimen awal, tapi berbahaya setelah ada data asli karena bisa menghapus
kolom tanpa peringatan yang jelas.

---

## Struktur Berkas

Peta lengkap folder fitur dan berkas database ada di
[websitedesasangge.md](websitedesasangge.md), bagian **Struktur Folder** dan
**Struktur Berkas Database**. Sengaja hanya ditulis di satu tempat supaya
tidak menyimpang saat salah satunya diperbarui.

Yang paling sering dicari:

```
src/db/schema.ts         definisi seluruh tabel
src/db/migrations/       berkas SQL, JANGAN diubah manual
src/lib/db.ts            koneksi database untuk kode aplikasi
drizzle.config.ts        konfigurasi drizzle-kit (CLI)
src/app/globals.css      token warna & tipografi
```

Perhatikan pemisahan `drizzle.config.ts` dan `src/lib/db.ts`. Keduanya
membaca `DATABASE_URL` tapi untuk keperluan berbeda: yang pertama dipakai
CLI di komputer developer (memuat `.env.local` lewat dotenv), yang kedua
dipakai aplikasi saat berjalan (Next.js dan Vercel memuat env sendiri).

---

## Database yang Sedang Dipakai

| Item | Nilai |
|---|---|
| Project Neon | `desa-sangge` (`bold-resonance-55167173`) |
| Organisasi | `org-floral-dust-58266133` |
| Region | `aws-ap-southeast-1` (Singapura) |
| Postgres | 17 |
| Batas storage | 512 MB (free tier) |
| Koneksi | pooled + `sslmode=require` |

**Catatan serah terima:** akun pemilik saat ini adalah email pribadi developer,
bukan email desa. Undang email desa sebagai member organisasi Neon
(Settings → Members) sebelum KKN berakhir, dan cantumkan kredensialnya di
berkas serah terima. Tanpa itu, desa tidak punya jalan masuk ke databasenya
sendiri.

## Status

Sudah selesai:

- [x] Fondasi Next.js 16 + React 19 + TypeScript + Tailwind 4
- [x] Token warna & tipografi
- [x] Koneksi Neon + Drizzle
- [x] Skema database 10 tabel + migrasi awal
- [x] Build produksi hijau, 0 kerentanan
- [x] Project Neon dibuat, migrasi diterapkan, uji tulis-baca-hapus lolos

Berikutnya (Fase 1):

- [ ] Auth: session sendiri pakai `jose` + `bcryptjs` (bukan NextAuth)
- [ ] Middleware proteksi `/admin/*`
- [ ] Seed data awal (akun admin, 4 halaman statis, kontak KPPA)
- [ ] Halaman masuk admin
