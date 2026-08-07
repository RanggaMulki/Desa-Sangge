# Validasi Data Penduduk Juni 2026

Dokumen ini mencatat cara memperoleh angka agregat pada halaman
`/infografis`. Data bersumber dari enam workbook di folder
`SANGGE UPDATE DATA MCD JUNI 2026`.

Nama, NIK, alamat, dan data individu lainnya tidak disimpan di repository
atau database website. Website hanya menerima hasil agregat.

## Aturan Pengolahan

1. Form 1 menjadi sumber utama data individu.
2. Baris berstatus `MENINGGAL`, `PINDAH`, atau `GANDA` tidak dihitung.
3. NIK aktif yang muncul lebih dari sekali dihitung satu kali.
4. Satu kelahiran baru pada Form 2 ditambahkan karena NIK-nya belum ada pada
   Form 1.
5. Umur dihitung pada tanggal acuan 30 Juni 2026 dari tanggal lahir.
6. Jumlah KK dihitung dari penduduk unik yang berstatus Kepala Keluarga.
7. Status perkawinan, pendidikan, dan pekerjaan dihitung kembali dari data
   individu yang telah disaring dan dideduplikasi.

## Rekonsiliasi Penduduk

| Tahap | Jumlah |
|---|---:|
| Baris bernama pada Form 1 | 4.039 |
| Dikurangi meninggal | 189 |
| Dikurangi pindah | 230 |
| Dikurangi baris bertanda ganda | 4 |
| Kandidat penduduk aktif | 3.616 |
| Dikurangi NIK aktif terduplikasi | 7 |
| Penduduk unik Form 1 | 3.609 |
| Ditambah kelahiran baru Form 2 | 1 |
| **Total penduduk Juni 2026** | **3.610** |

## Angka Utama

| Indikator | Jumlah |
|---|---:|
| Total penduduk | 3.610 |
| Laki-laki | 1.813 |
| Perempuan | 1.797 |
| Jumlah KK | 1.212 |

Kontrol silang menghasilkan total yang sama untuk jenis kelamin, kelompok
umur, status perkawinan, dan pendidikan, yaitu 3.610 penduduk.

## Catatan Kualitas Data

- Empat tanggal lahir tidak tersimpan dalam format tanggal yang valid. Tiga
  dapat dipulihkan dari tanggal lahir pada NIK, sedangkan satu hanya memiliki
  tahun 2025 pada kolom usia dan ditempatkan pada kelompok umur 0-4 tahun.
- Dua anak berusia di bawah tujuh tahun tidak memiliki isian pendidikan.
  Keduanya dimasukkan ke golongan `Tidak/Belum Sekolah`.
- Form 6 mencatat total 3.623 pekerjaan, lebih banyak 13 daripada penduduk
  unik. Karena itu grafik pekerjaan dihitung dari data individu Form 1 dan
  Form 2, bukan memakai total Form 6.
- Keenam workbook tidak menyediakan kolom agama. Grafik agama tidak
  ditampilkan agar website tidak menerbitkan angka yang tidak bersumber.

## Menjalankan Impor

```bash
npm run db:penduduk
```

Perintah tersebut memeriksa ulang seluruh total agregat sebelum mengganti data
infografis di database.
