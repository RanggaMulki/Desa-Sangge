# Struktur Berkas Proyek

Dokumen ini menjelaskan **di mana setiap berkas harus ditaruh dan mengapa**.
Tujuannya supaya orang yang membuka proyek ini setahun lagi bisa memahami satu
fitur tanpa membaca seluruh isi `src/`.

---

## Gambaran besar

```
src/
├── app/          ALAMAT halaman. Setipis mungkin, tanpa logika.
├── features/     SELURUH isi fitur: backend + frontend, menyatu.
├── lib/          Perkakas murni tanpa logika bisnis (db client, format tanggal).
├── db/           Definisi tabel, migrasi, data awal.
└── proxy.ts      Penjaga /admin/*
```

**Semua komponen tampilan ada di `features/`.** Tidak ada folder
`components/` global. Header, footer, dan menu pun berupa fitur tersendiri
(`tata-letak/`), karena Footer mengambil data kontak dari database, dan
berkas yang menyentuh data tidak boleh tinggal di folder bersama.

### Kenapa `app/` dan `features/` terpisah

Ini pertanyaan yang paling sering muncul, dan jawabannya **bukan pilihan
desain, melainkan syarat Next.js**: berkas yang menentukan alamat halaman
wajib berada di `app/`. `app/(publik)/page.tsx` harus ada di situ agar
alamat `/` terbentuk. Tidak bisa dipindah ke `features/`.

Yang bisa kita kendalikan adalah **seberapa banyak isi yang tinggal di sana**.
Aturannya: berkas di `app/` hanya boleh mengurus tiga hal.

1. Judul halaman dan metadata SEO
2. Boleh diakses siapa (proteksi)
3. Memanggil komponen dari `features/`

Selebihnya, termasuk seluruh query database, wajib di `features/`.

Ukurannya bisa dilihat: seluruh berkas route di proyek ini berkisar 11–57
baris. Kalau ada yang membengkak, hampir pasti ada logika yang bocor ke sana.

**Halaman daftar tidak memanggil query sendiri.** Bentuknya selalu sama:
pita judul, lalu satu komponen fitur yang mengurus datanya. Bandingkan
`/berita`, `/galeri`, dan `/agenda` — ketiganya
berpola identik, jadi halaman baru tinggal meniru tanpa memutuskan apa pun.

Tiga berkas route boleh menyentuh query, dan ketiganya masuk pengecualian
yang sudah disebut di atas:

| Berkas | Query-nya untuk apa | Aturan |
|---|---|---|
| `berita/[slug]/page.tsx` | `generateMetadata` & `generateStaticParams` | 1 |
| `informasi/[kategori]/[slug]/page.tsx` | sama | 1 |
| `admin/(terlindungi)/layout.tsx` | memeriksa akses | 2 |

`generateStaticParams` memang **wajib** berada di berkas route — itu API
Next.js, bukan pilihan kita.

### Contoh: halaman beranda

```
app/(publik)/page.tsx              ← 53 baris, cuma menyusun urutan seksi
  └── features/beranda/components/Hero.tsx
  └── features/beranda/components/StatistikRingkas.tsx
        └── features/statistik/queries.ts      ← query ke database
```

### Contoh: halaman pengelolaan

```
app/admin/(terlindungi)/layout.tsx ← 27 baris, cuma memeriksa akses
  └── features/admin/components/KerangkaAdmin.tsx     ← bilah atas, pengingat
app/admin/(terlindungi)/page.tsx   ← 11 baris, cuma judul halaman
  └── features/admin/components/RingkasanAdmin.tsx
        └── features/artikel/queries.ts
        └── features/auth/queries.ts
```

---

## Anatomi satu folder fitur

Backend dan frontend sebuah fitur tinggal **berdampingan** di folder yang sama:

```
features/<nama-fitur>/
  queries.ts      SERVER    baca data (SELECT)
  actions.ts      SERVER    ubah data (INSERT/UPDATE/DELETE)
  validasi.ts     SERVER    aturan Zod + pesan error bahasa sehari-hari
  <domain>.ts     SERVER    konstanta domain, mis. kategori.ts
  components/     campuran  komponen React fitur ini
```

**Tidak semua fitur butuh kelimanya.** Buat saat dibutuhkan. Fitur yang UI-nya
belum dikerjakan wajar hanya punya `queries.ts`.

Contoh yang sudah lengkap, `features/auth/`:

```
auth/
├── konfigurasi.ts   SERVER   saklar WAJIB_LOGIN
├── token.ts         SERVER   tanda tangan JWT (aman untuk Edge)
├── session.ts       SERVER   cookie httpOnly
├── validasi.ts      SERVER   aturan Zod
├── queries.ts       SERVER   baca pengguna
├── actions.ts       SERVER   masuk & keluar
└── components/
    └── FormMasuk.tsx   BROWSER
```

Kalau ini memakai pola lapisan (NestJS, Laravel), isinya akan tersebar ke
`controllers/`, `services/`, `repositories/`, dan `views/` di empat folder
berbeda. Di sini satu folder, jadi mengubah alur login cukup membuka satu
tempat.

### Penamaan

- **`validasi.ts`, bukan `schema.ts`.** Sudah ada `src/db/schema.ts` untuk
  definisi tabel. Dua berkas bernama sama dengan isi berbeda menyesatkan.
- **Bahasa Indonesia** untuk nama fungsi dan berkas, mengikuti seluruh proyek.

---

## Daftar fitur

| Folder | Yang dikelola | Backend | Frontend | Fase |
|---|---|:---:|:---:|:---:|
| `artikel/` | Inti sistem. Berita, pengumuman, dan **seluruh konten edukasi tim KKN** (kesehatan, perawatan alat, sejarah budaya) memakai sistem ini, dibedakan lewat kategori. | ✅ | ✅ | 2 |
| `auth/` | Login, session, hash kata sandi, saklar `WAJIB_LOGIN` | ✅ | ✅ | 1 |
| `admin/` | Bingkai dan ringkasan halaman pengelolaan | ✅ | ✅ | 1 |
| `beranda/` | Seksi-seksi halaman depan (lihat catatan di bawah) | — | ✅ | 3 |
| `statistik/` | Angka penduduk, KK, luas wilayah | ✅ | ✅ | 4 |
| `agenda/` | Jadwal posyandu, musdes, kerja bakti | ✅ | ✅ | 4 |
| `galeri/` | Dokumentasi foto kegiatan | ✅ | ✅ | 4 |
| `kontak-layanan/` | Kontak desa **dan halaman KPPA** | ✅ | ✅ | 4 |
| `halaman-statis/` | Profil, sejarah, visi-misi, KPPA | ✅ | ✅ | 4 |
| `pemerintahan/` | Struktur perangkat desa | ✅ | ✅ | 4 |
| `media/` | Unggah foto & PDF, kompresi, pustaka berkas | ⬜ | ⬜ | 2 |
| `tata-letak/` | Header, footer, menu, pembungkus seksi, pita judul halaman | ✅ | ✅ | 0 |
| `panduan/` | Tutorial pemakaian website untuk pengurus desa | — | ✅ | 5 |

Kolom **Frontend** yang sudah ✅ berarti halaman publiknya jadi. Yang belum
ada di mana pun adalah **form pengelolaannya** — itu Fase 2, dan sampai
selesai, isi website hanya bisa diubah lewat `npm run db:seed` atau langsung
di database.

Folder yang masih kosong sengaja dibiarkan ada supaya polanya terlihat.

### Dua fitur yang menyimpang, dan alasannya

**`beranda/` hanya punya frontend.** Isinya enam komponen seksi tanpa satu pun
berkas backend. Datanya diambil dari fitur lain:

```
beranda/components/  →  artikel/queries + artikel/kategori
                     →  statistik/queries
                     →  agenda/queries
                     →  kontak-layanan/queries
```

Ini disengaja. Kalau query agenda ditaruh di `beranda/`, halaman `/agenda`
nanti harus mengimpor dari folder beranda, dan kepemilikan datanya jadi kabur.
Jadi `beranda/` sebenarnya bukan fitur domain melainkan **lapisan penyusun
halaman**: ia merangkai data milik fitur lain menjadi satu halaman.

**`admin/` hampir seluruhnya frontend**, dengan alasan yang sama. Ia bingkai
halaman pengelolaan, bukan pemilik data.

Satu-satunya query miliknya adalah `adaDataContoh()`, dan itu memang bukan
data domain melainkan pertanyaan tentang keadaan website itu sendiri:
"apakah data contoh masih terpasang?" Tidak ada fitur lain yang pantas
memilikinya, karena yang membutuhkannya cuma peringatan di halaman
pengelolaan.

Aturan turunannya: **query tinggal bersama fitur yang memiliki datanya**,
siapa pun yang memakainya.

---

## Aturan penempatan

| Kalau... | Taruh di |
|---|---|
| Menentukan alamat halaman | `app/` (wajib, syarat Next.js) |
| Cuma dipakai satu fitur | `features/<fitur>/` |
| Dipakai ≥2 fitur, ada logika bisnis | fitur pemilik datanya |
| Dipakai ≥2 fitur, tanpa logika bisnis sama sekali | `lib/` |
| Dipakai ≥2 fitur **dan** menyentuh data | tetap sebuah fitur, mis. `tata-letak/` |
| Definisi tabel database | `src/db/schema.ts`, tidak pernah di `features/` |
| Ragu | `features/` dulu |

Arahnya sengaja berat sebelah ke `features/`. Memindahkan sesuatu keluar saat
terbukti dipakai ulang itu mudah dan aman. Sebaliknya, menarik kembali sesuatu
dari `lib/` yang ternyata cuma dipakai sekali hampir tidak pernah terjadi,
karena tidak ada yang berani menyentuh berkas di folder bersama.

### Isi `tata-letak/` dan `lib/`

```
features/tata-letak/
├── navigasi.ts             sumber tunggal struktur menu & identitas desa
└── components/
    ├── Header.tsx          bilah atas
    ├── NavigasiDesktop.tsx BROWSER, penanda halaman aktif
    ├── MenuMobile.tsx      BROWSER, tombol hamburger
    ├── Footer.tsx          mengambil kontak dari database
    ├── KepalaHalaman.tsx   judul halaman (<h1>), dipakai SEMUA halaman
    │                       selain beranda dan halaman artikel
    ├── KontenAman.tsx      satu-satunya tempat HTML database dirender
    ├── KotakKosong.tsx     tampilan halaman yang belum ada isinya
    ├── SeksiBerjudul.tsx   bagian ber-jangkar di halaman panjang
    ├── Seksi.tsx           pembungkus seksi, jarak & lebar seragam
    └── JudulSeksi.tsx      judul seksi + tautan "lihat semua"

lib/
├── db.ts                   koneksi Neon
├── format.ts               tanggal, angka, ukuran berkas, tautan WhatsApp
└── sanitasi.ts             penyaring HTML (dipakai KontenAman)
```

### Dua pola yang berlaku di semua halaman

**Setiap halaman selain beranda dibuka dengan `<KepalaHalaman>`.** Isinya
`<h1>` judul halaman dan satu kalimat penjelas — tanpa latar, tanpa remah
roti. Sempat berupa pita berlatar hijau muda meniru situs desa rujukan, tapi
di layar nyata hasilnya dua pita bertumpuk (header hijau tua, lalu pita hijau
muda) dan keduanya terbaca sebagai dua header.

Yang tidak boleh ikut hilang adalah **`<h1>`-nya**. Halaman tanpa `<h1>`
tidak terlihat cacat di layar, jadi gampang lolos — padahal pembaca layar
kehilangan penanda "halaman ini tentang apa" dan mesin pencari kehilangan
judul utamanya. Halaman artikel tidak memakai komponen ini karena `<h1>`-nya
ada di dalam `<article>`: untuk artikel, judul memang bagian dari tulisannya.

**Halaman kosong dijelaskan, bukan disembunyikan.** Di beranda, seksi tanpa
data dihapus sama sekali (`return null`). Halaman utuh tidak boleh begitu:
pengunjung yang mengklik "Agenda" harus mendarat di suatu tempat. Jadi halaman
memakai `<KotakKosong>` yang menerangkan apa yang nanti akan ada di situ.

Ada satu perkecualian: `SeksiStatistik` di halaman profil tetap tampil saat
datanya kosong, sementara kembarannya `StatistikRingkas` di beranda menghilang.
Bedanya karena bagian profil punya `id` yang jadi sasaran jangkar (mis.
`/profil#angka` dari pengalihan alamat lama), dan jangkar yang sasarannya
lenyap membuat tautannya diam saat diklik.

### Halaman panjang, bukan submenu

Profil desa dulu terpecah jadi empat halaman di balik dropdown. Sekarang satu
halaman `/profil` dengan enam bagian berurutan. Alasannya: isi tiap bagian
cuma beberapa paragraf, jadi memecahnya berarti pengunjung mengklik empat kali
untuk membaca yang muat dalam satu gulir — dan di HP, dropdown itu sendiri
sudah berubah jadi daftar yang harus digulir dulu.

Tiap bagian dibungkus `<SeksiBerjudul>` yang memasang `id`. `id` itu bukan
hiasan: alamat lama seperti `/profil/sejarah` dialihkan ke `/profil#sejarah`
lewat `next.config.ts`, jadi mengubah atau menghapus sebuah `id` akan membuat
pengalihan yang sesuai mendarat di tempat yang salah.

`lib/` sengaja dijaga tetap kecil: isinya hanya perkakas yang tidak tahu
apa pun tentang isi website. Begitu sebuah berkas mulai mengenal tabel atau
aturan desa, tempatnya di `features/`.

### Catatan untuk shadcn/ui

Saat shadcn/ui dipasang nanti, komponennya akan ditaruh di `components/ui/`
sesuai bawaan perkakasnya. Itu pengecualian yang wajar: isinya komponen
generik (tombol, dialog, dropdown) yang tidak mengenal Desa Sangge sama
sekali, dan dipelihara oleh CLI-nya, bukan oleh kita.

---

## Backend dan frontend dibedakan lewat penanda, bukan folder

Next.js tidak memisahkan keduanya lewat folder. Yang menentukan adalah
penanda di baris pertama berkas:

| Penanda | Artinya |
|---|---|
| *(tanpa penanda)* | Jalan di server. **Ini default.** |
| `"use client"` | Dikirim ke browser. Pakai hanya kalau butuh `useState`, `onClick`, atau hook browser. |
| `"use server"` | Boleh dipanggil dari browser, tapi eksekusinya tetap di server. Pengganti endpoint API. |
| `"server-only"` | Pengaman: kalau tidak sengaja diimpor dari komponen klien, **build langsung gagal**. |

Saat ini hanya **5 berkas** yang benar-benar dikirim ke browser:

```
app/(publik)/error.tsx
app/admin/(terlindungi)/error.tsx
features/tata-letak/components/MenuMobile.tsx
features/tata-letak/components/NavigasiDesktop.tsx
features/auth/components/FormMasuk.tsx
```

Sisanya jalan di server, termasuk komponen React yang melakukan query SQL
langsung. Kredensial database dan `AUTH_SECRET` tidak pernah sampai ke browser
bukan karena disembunyikan, melainkan karena berkasnya memang tidak dikirim.

---

## Menambah fitur baru: urutannya

Misalnya membuat pengelolaan agenda.

1. Tabelnya sudah ada di `src/db/schema.ts` — biarkan di sana
2. `features/agenda/validasi.ts` — aturan Zod form agenda
3. `features/agenda/actions.ts` — simpan, ubah, hapus
4. `features/agenda/components/FormAgenda.tsx` — tampilannya
5. `app/admin/(terlindungi)/agenda/page.tsx` — **hanya** judul halaman dan
   memanggil komponen di atas

Yang **tidak** dilakukan: membuat `src/backend/agenda/`, `src/api/agenda/`,
atau menaruh query di dalam berkas `page.tsx`.
