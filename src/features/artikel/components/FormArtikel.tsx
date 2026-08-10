"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  FileImage,
  FileText,
  ImagePlus,
  Paperclip,
  Trash2,
} from "lucide-react";
import type { Lampiran } from "@/db/schema";
import { konfirmasi } from "@/lib/alert";
import { ukuranBerkas } from "@/lib/format";
import { hapusMedia, unggahMedia } from "@/features/media/actions";
import { siapkanGambarUntukUnggah } from "@/features/media/gambar-klien";
import { simpanArtikel } from "../actions";
import type {
  NilaiFormulirArtikel,
  TujuanSimpanArtikel,
} from "../validasi";
import {
  KATEGORI,
  KATEGORI_PER_KANAL,
  kanalDariKategori,
  urlAdminKanal,
  type KanalKelola,
} from "../kategori";
import {
  JENIS_KONTEN,
  jenisKontenSah,
  type JenisKonten,
} from "../jenis";
import { EditorArtikel } from "./EditorArtikel";

type KategoriForm = NilaiFormulirArtikel["kategori"];

export type ArtikelUntukForm = {
  id: string;
  judul: string;
  kategori: KategoriForm;
  jenisKonten: JenisKonten;
  ringkasan: string;
  konten: string;
  gambarSampulUrl: string | null;
  status: "draf" | "terbit";
  lampiran: Lampiran[];
};

type PesanForm = { ok: boolean; teks: string } | null;

const KELAS_INPUT =
  "mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 focus:border-hijau-utama focus:outline-none focus:ring-2 focus:ring-hijau-muda";

function jenisLampiran(berkas: File) {
  if (berkas.type === "application/pdf") return "pdf";
  if (berkas.type.startsWith("image/")) return "gambar";
  return null;
}

export function FormArtikel({
  awal,
  kanal: kanalProp,
  kategoriAwal,
  jenisAwal,
}: {
  awal?: ArtikelUntukForm;
  /** Pintu pengelolaan asal form: menentukan pilihan jenis isi. */
  kanal?: KanalKelola;
  /** Prapilihan jenis isi dari tombol "Tulis" di kartu kategori. */
  kategoriAwal?: string;
  /** Prapilihan bentuk informasi: materi atau poster. */
  jenisAwal?: string;
}) {
  // Saat mengubah artikel lama, kanal mengikuti kategorinya — bukan prop —
  // supaya artikel Berita yang dibuka dari mana pun tetap berperilaku Berita.
  const kanal: KanalKelola = awal
    ? kanalDariKategori(awal.kategori)
    : (kanalProp ?? "informasi");
  const pilihanKategori = KATEGORI_PER_KANAL[kanal];
  const kategoriBawaan: KategoriForm =
    awal?.kategori ??
    (pilihanKategori.includes(kategoriAwal as KategoriForm)
      ? (kategoriAwal as KategoriForm)
      : (pilihanKategori[0] as KategoriForm));
  const jenisKontenBawaan: JenisKonten =
    awal?.jenisKonten ??
    (kanal === "informasi" &&
    (jenisAwal === "poster" || kategoriBawaan === "perawatan-alat")
      ? "poster"
      : "materi");

  const router = useRouter();
  const sudahDisimpan = useRef(false);
  const [sedang, setSedang] = useState(false);
  const [tahap, setTahap] = useState("");
  const [pesan, setPesan] = useState<PesanForm>(null);
  const [sampulBaru, setSampulBaru] = useState<File | null>(null);
  const [urlSampulBaru, setUrlSampulBaru] = useState<string | null>(null);
  const [hapusSampul, setHapusSampul] = useState(false);
  const [lampiranBaru, setLampiranBaru] = useState<File[]>([]);
  const [lampiranHapus, setLampiranHapus] = useState<string[]>([]);
  const [mediaDiubah, setMediaDiubah] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    setValue,
    trigger,
    watch,
    formState: { errors, isDirty },
  } = useForm<NilaiFormulirArtikel>({
    defaultValues: {
      judul: awal?.judul ?? "",
      kategori: kategoriBawaan,
      jenisKonten: jenisKontenBawaan,
      ringkasan: awal?.ringkasan ?? "",
      konten: awal?.konten ?? "<p></p>",
    },
    mode: "onBlur",
  });

  const ringkasan = watch("ringkasan");
  const jenisKonten = watch("jenisKonten");
  const kategoriSaatIni = watch("kategori");
  const berupaPoster = jenisKonten === "poster";
  const pilihanKategoriTersedia = pilihanKategori.filter((kode) =>
    jenisKontenSah(kode, jenisKonten),
  );
  const sebutanForm = berupaPoster
    ? "poster"
    : kanal === "berita"
      ? "berita"
      : "materi";
  const adaPerubahan = (isDirty || mediaDiubah) && !sudahDisimpan.current;

  useEffect(() => {
    register("konten", {
      validate: (html) => {
        if (getValues("jenisKonten") === "poster") return true;
        const teks = html
          .replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/gi, " ")
          .replace(/\s+/g, " ")
          .trim();
        return (
          teks.length >= 20 ||
          "Isi materi masih kosong. Tambahkan penjelasan terlebih dahulu."
        );
      },
    });
  }, [getValues, register]);

  useEffect(() => {
    const kategoriAktif = getValues("kategori");
    if (jenisKontenSah(kategoriAktif, jenisKonten)) return;

    const pengganti = pilihanKategori.find((kode) =>
      jenisKontenSah(kode, jenisKonten),
    );
    if (!pengganti) return;

    setValue("kategori", pengganti as KategoriForm, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [getValues, jenisKonten, pilihanKategori, setValue]);

  useEffect(() => {
    if (!sampulBaru) {
      setUrlSampulBaru(null);
      return;
    }
    const url = URL.createObjectURL(sampulBaru);
    setUrlSampulBaru(url);
    return () => URL.revokeObjectURL(url);
  }, [sampulBaru]);

  useEffect(() => {
    function sebelumKeluar(e: BeforeUnloadEvent) {
      if (!adaPerubahan) return;
      e.preventDefault();
    }

    /**
     * Dialog SweetAlert tidak bisa menahan event secara sinkron seperti
     * window.confirm, jadi urutannya dibalik: navigasinya DICEGAT dulu,
     * baru bertanya; kalau pengurus setuju, barulah tautannya diikuti.
     */
    function sebelumKlikTautan(e: MouseEvent) {
      if (!adaPerubahan) return;
      const sasaran = e.target as Element | null;
      const tautan = sasaran?.closest("a");
      if (!tautan || tautan.target === "_blank") return;
      e.preventDefault();
      e.stopPropagation();

      const href = tautan.getAttribute("href");
      void konfirmasi({
        judul: "Tinggalkan halaman ini?",
        teks: "Perubahan yang belum disimpan akan hilang.",
        tombolYa: "Ya, tinggalkan",
        berbahaya: true,
      }).then((setuju) => {
        if (!setuju || !href) return;
        sudahDisimpan.current = true;
        router.push(href);
      });
    }

    window.addEventListener("beforeunload", sebelumKeluar);
    document.addEventListener("click", sebelumKlikTautan, true);
    return () => {
      window.removeEventListener("beforeunload", sebelumKeluar);
      document.removeEventListener("click", sebelumKlikTautan, true);
    };
  }, [adaPerubahan, router]);

  function pilihSampul(e: React.ChangeEvent<HTMLInputElement>) {
    const berkas = e.target.files?.[0];
    e.target.value = "";
    if (!berkas) return;
    if (!berkas.type.startsWith("image/") && !/\.(heic|heif)$/i.test(berkas.name)) {
      setPesan({
        ok: false,
        teks: `${berupaPoster ? "Poster" : "Foto sampul"} harus berupa gambar. Pilih JPG, PNG, atau HEIC.`,
      });
      return;
    }
    setSampulBaru(berkas);
    setHapusSampul(false);
    setMediaDiubah(true);
    setPesan(null);
  }

  function pilihLampiran(e: React.ChangeEvent<HTMLInputElement>) {
    const dipilih = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (dipilih.length === 0) return;

    const tidakSah = dipilih.find(
      (berkas) =>
        !jenisLampiran(berkas) &&
        !/\.(heic|heif)$/i.test(berkas.name),
    );
    if (tidakSah) {
      setPesan({
        ok: false,
        teks: `Berkas “${tidakSah.name}” belum didukung. Pilih PDF atau gambar.`,
      });
      return;
    }

    const terlaluBesar = dipilih.find(
      (berkas) =>
        berkas.type === "application/pdf" && berkas.size > 6 * 1024 * 1024,
    );
    if (terlaluBesar) {
      setPesan({
        ok: false,
        teks: `PDF “${terlaluBesar.name}” lebih dari 6 MB. Kecilkan PDF lalu pilih lagi.`,
      });
      return;
    }

    setLampiranBaru((lama) => [...lama, ...dipilih]);
    setMediaDiubah(true);
    setPesan(null);
  }

  async function bersihkanUnggahan(ids: string[]) {
    await Promise.allSettled(ids.map((id) => hapusMedia(id)));
  }

  async function kirim(
    nilai: NilaiFormulirArtikel,
    tujuan: TujuanSimpanArtikel,
  ) {
    if (nilai.jenisKonten === "poster" && !sampulTampil) {
      setPesan({
        ok: false,
        teks: "Gambar poster belum dipilih. Pilih gambar poster terlebih dahulu.",
      });
      return;
    }

    setSedang(true);
    setPesan(null);
    const mediaBaruIds: string[] = [];

    try {
      let mediaSampulId = "";
      if (sampulBaru) {
        setTahap(
          nilai.jenisKonten === "poster"
            ? "Menyiapkan gambar poster..."
            : "Menyiapkan foto sampul...",
        );
        const kecil = await siapkanGambarUntukUnggah(sampulBaru, {
          batasMb: nilai.jenisKonten === "poster" ? 0.9 : 0.45,
          sisiMaksimal: nilai.jenisKonten === "poster" ? 2200 : 1600,
        });
        setTahap(
          nilai.jenisKonten === "poster"
            ? "Mengunggah gambar poster..."
            : "Mengunggah foto sampul...",
        );
        const hasil = await unggahMedia(kecil, "artikel");
        if (!hasil.ok) throw new Error(hasil.pesan);
        mediaSampulId = hasil.id;
        mediaBaruIds.push(hasil.id);
      }

      const mediaLampiranIds: string[] = [];
      const lampiranYangDiunggah =
        nilai.jenisKonten === "poster" ? [] : lampiranBaru;
      for (let i = 0; i < lampiranYangDiunggah.length; i += 1) {
        const berkas = lampiranYangDiunggah[i];
        setTahap(
          `Mengunggah lampiran ${i + 1} dari ${lampiranYangDiunggah.length}...`,
        );
        const siap =
          berkas.type === "application/pdf"
            ? berkas
            : await siapkanGambarUntukUnggah(berkas, {
                batasMb: 0.8,
                sisiMaksimal: 1920,
              });
        const hasil = await unggahMedia(siap, "lampiran");
        if (!hasil.ok) throw new Error(hasil.pesan);
        mediaLampiranIds.push(hasil.id);
        mediaBaruIds.push(hasil.id);
      }

      setTahap(`Menyimpan ${sebutanForm}...`);
      const formData = new FormData();
      if (awal) formData.set("id", awal.id);
      formData.set("judul", nilai.judul);
      formData.set("kategori", nilai.kategori);
      formData.set("jenisKonten", nilai.jenisKonten);
      formData.set("ringkasan", nilai.ringkasan);
      formData.set("konten", nilai.konten);
      formData.set("tujuan", tujuan);
      formData.set("mediaSampulId", mediaSampulId);
      formData.set("mediaLampiranIds", JSON.stringify(mediaLampiranIds));
      formData.set(
        "lampiranHapusIds",
        JSON.stringify(nilai.jenisKonten === "poster" ? [] : lampiranHapus),
      );
      formData.set("hapusSampul", hapusSampul ? "ya" : "tidak");

      const hasil = await simpanArtikel(formData);
      if (!hasil.ok) {
        await bersihkanUnggahan(mediaBaruIds);
        if (hasil.kesalahan) {
          for (const [nama, teks] of Object.entries(hasil.kesalahan)) {
            if (teks) {
              setError(nama as keyof NilaiFormulirArtikel, {
                type: "server",
                message: teks,
              });
            }
          }
        }
        setPesan({ ok: false, teks: hasil.pesan });
        return;
      }

      sudahDisimpan.current = true;
      if (tujuan === "pratinjau") {
        router.push(`/admin/artikel/${hasil.id}/pratinjau`);
        return;
      }

      const parameter = new URLSearchParams({
        hasil: hasil.status,
        id: hasil.id,
        kategori: hasil.kategori,
        slug: hasil.slug,
      });
      // Kembali ke pintu pengelolaan asal artikelnya (Informasi atau Berita).
      router.push(
        `${urlAdminKanal(kanalDariKategori(hasil.kategori))}?${parameter.toString()}`,
      );
    } catch (error) {
      await bersihkanUnggahan(mediaBaruIds);
      setPesan({
        ok: false,
        teks:
          error instanceof Error
            ? error.message
            : "Informasi belum berhasil disimpan. Coba lagi sebentar.",
      });
    } finally {
      setTahap("");
      setSedang(false);
    }
  }

  function simpanDenganTujuan(tujuan: TujuanSimpanArtikel) {
    void handleSubmit((nilai) => kirim(nilai, tujuan))();
  }

  const sampulTampil = urlSampulBaru
    ? urlSampulBaru
    : hapusSampul
      ? null
      : (awal?.gambarSampulUrl ?? null);
  const lampiranTampil =
    awal?.lampiran.filter((item) => !lampiranHapus.includes(item.id)) ?? [];

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {pesan && (
        <div
          role={pesan.ok ? "status" : "alert"}
          className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            pesan.ok
              ? "border-hijau-utama/30 bg-hijau-muda text-hijau-utama"
              : "border-merah-layanan/30 bg-white text-merah-layanan"
          }`}
        >
          {pesan.teks}
        </div>
      )}

      <section className="rounded-lg border border-garis bg-white p-5 sm:p-6">
        {kanal === "informasi" && !awal && (
          <fieldset>
            <legend className="text-lg font-bold">Bentuk informasi</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(["materi", "poster"] as const).map((jenis) => {
                const dipilih = jenisKonten === jenis;
                const Ikon = jenis === "poster" ? FileImage : FileText;
                return (
                  <label
                    key={jenis}
                    className={`flex min-h-28 cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                      dipilih
                        ? "border-hijau-utama bg-hijau-muda"
                        : "border-garis hover:border-hijau-utama"
                    }`}
                  >
                    <input
                      type="radio"
                      value={jenis}
                      className="mt-1 size-4 accent-hijau-utama"
                      {...register("jenisKonten")}
                    />
                    <Ikon
                      size={24}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-hijau-utama"
                    />
                    <span>
                      <span className="block font-bold">
                        {JENIS_KONTEN[jenis].label}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-tinta-redup">
                        {JENIS_KONTEN[jenis].deskripsi}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.jenisKonten && (
              <p role="alert" className="mt-2 text-sm text-merah-layanan">
                {errors.jenisKonten.message}
              </p>
            )}
          </fieldset>
        )}

        {kanal === "informasi" && awal && (
          <div>
            <p className="font-semibold">Bentuk informasi</p>
            <div className="mt-2 flex items-start gap-3 rounded-lg bg-permukaan px-4 py-3">
              {berupaPoster ? (
                <FileImage
                  size={22}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-hijau-utama"
                />
              ) : (
                <FileText
                  size={22}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-hijau-utama"
                />
              )}
              <span>
                <span className="block font-bold">
                  {JENIS_KONTEN[jenisKonten].label}
                </span>
                <span className="block text-sm text-tinta-redup">
                  Bentuk informasi dikunci setelah dibuat agar isi tidak
                  terhapus tanpa sengaja.
                </span>
              </span>
            </div>
            <input type="hidden" {...register("jenisKonten")} />
          </div>
        )}

        {kanal === "berita" && (
          <input type="hidden" {...register("jenisKonten")} />
        )}

        <div
          className={
            kanal === "informasi"
              ? "mt-6 border-t border-garis pt-6"
              : undefined
          }
        >
          <label htmlFor="judul" className="font-semibold">
            {berupaPoster
              ? "Nama poster"
              : kanal === "berita"
                ? "Judul berita atau pengumuman"
                : "Judul materi"}
          </label>
          <input
            id="judul"
            type="text"
            maxLength={200}
            placeholder={
              berupaPoster
                ? kategoriSaatIni === "perawatan-alat"
                  ? "Contoh: Cara Membersihkan Mesin Potong Rumput"
                  : "Contoh: Jadwal Posyandu Balita"
                : "Contoh: Cara Menjaga Kesehatan Lansia"
            }
            aria-invalid={Boolean(errors.judul)}
            className={`${KELAS_INPUT} ${
              errors.judul ? "border-merah-layanan" : "border-garis"
            }`}
            {...register("judul", {
              required: berupaPoster
                ? "Nama poster belum diisi."
                : kanal === "berita"
                  ? "Judul berita atau pengumuman belum diisi."
                  : "Judul materi belum diisi.",
              minLength: {
                value: 5,
                message: "Judul masih terlalu pendek.",
              },
            })}
          />
          {errors.judul && (
            <p role="alert" className="mt-1.5 text-sm text-merah-layanan">
              {errors.judul.message}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="kategori" className="font-semibold">
            {kanal === "informasi" ? "Topik informasi" : "Jenis isi"}
          </label>
          <select
            id="kategori"
            aria-invalid={Boolean(errors.kategori)}
            className={`${KELAS_INPUT} ${
              errors.kategori ? "border-merah-layanan" : "border-garis"
            }`}
            {...register("kategori")}
          >
            {pilihanKategoriTersedia.map((kode) => (
              <option key={kode} value={kode}>
                {KATEGORI[kode].label}
              </option>
            ))}
          </select>
          {errors.kategori && (
            <p role="alert" className="mt-1.5 text-sm text-merah-layanan">
              {errors.kategori.message}
            </p>
          )}
        </div>

        {!berupaPoster && (
          <div className="mt-5">
            <div className="flex items-end justify-between gap-3">
              <label htmlFor="ringkasan" className="font-semibold">
                Ringkasan singkat
              </label>
              <span className="text-sm text-tinta-redup">
                {ringkasan.length}/300
              </span>
            </div>
            <textarea
              id="ringkasan"
              rows={3}
              maxLength={300}
              placeholder="Tulis 1-2 kalimat yang akan tampil di daftar materi."
              aria-invalid={Boolean(errors.ringkasan)}
              className={`${KELAS_INPUT} resize-y ${
                errors.ringkasan ? "border-merah-layanan" : "border-garis"
              }`}
              {...register("ringkasan", {
                required: "Ringkasan belum diisi.",
                minLength: {
                  value: 20,
                  message: "Ringkasan masih terlalu pendek.",
                },
              })}
            />
            {errors.ringkasan && (
              <p role="alert" className="mt-1 text-sm text-merah-layanan">
                {errors.ringkasan.message}
              </p>
            )}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-garis bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold">
          {berupaPoster ? "Gambar poster (wajib)" : "Foto sampul (opsional)"}
        </h2>

        {sampulTampil && (
          <div
            className={`mt-4 overflow-hidden rounded-lg border border-garis bg-permukaan ${
              berupaPoster ? "max-w-xs" : "max-w-md"
            }`}
          >
            {/* URL blob untuk pratinjau lokal tidak bisa dipakai oleh next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sampulTampil}
              alt={
                berupaPoster
                  ? "Pratinjau gambar poster"
                  : "Pratinjau foto sampul"
              }
              className={
                berupaPoster
                  ? "aspect-[3/4] w-full bg-white object-contain"
                  : "aspect-video w-full object-cover"
              }
            />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-hijau-utama px-4 py-2.5 font-semibold text-white hover:bg-hijau-pekat">
            <ImagePlus size={19} aria-hidden="true" />
            {sampulTampil
              ? berupaPoster
                ? "Ganti gambar poster"
                : "Ganti foto sampul"
              : berupaPoster
                ? "Pilih gambar poster"
                : "Pilih atau ambil foto"}
            <input
              type="file"
              accept="image/*,.heic,.heif"
              onChange={pilihSampul}
              disabled={sedang}
              aria-required={berupaPoster}
              className="hidden"
            />
          </label>
          {sampulTampil && !berupaPoster && (
            <button
              type="button"
              onClick={() => {
                setSampulBaru(null);
                setHapusSampul(true);
                setMediaDiubah(true);
              }}
              disabled={sedang}
              className="inline-flex items-center gap-2 rounded-lg border border-garis px-4 py-2.5 font-semibold text-merah-layanan hover:border-merah-layanan"
            >
              <Trash2 size={18} aria-hidden="true" />
              Hapus foto sampul
            </button>
          )}
        </div>
      </section>

      {!berupaPoster && (
        <>
          <section className="rounded-lg border border-garis bg-white p-5 sm:p-6">
            <label
              htmlFor="isi-artikel-editor"
              className="mb-3 block text-lg font-bold"
            >
              {kanal === "berita" ? "Isi berita atau pengumuman" : "Isi materi"}
            </label>
            <EditorArtikel
              nilai={awal?.konten ?? "<p></p>"}
              onChange={(html) =>
                setValue("konten", html, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              onBlur={() => void trigger("konten")}
              pesanError={errors.konten?.message}
            />
          </section>

          <section className="rounded-lg border border-garis bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold">Berkas lampiran (opsional)</h2>

            {(lampiranTampil.length > 0 || lampiranBaru.length > 0) && (
              <ul className="mt-4 divide-y divide-garis rounded-lg border border-garis">
                {lampiranTampil.map((item) => (
                  <li
                    key={item.id}
                    className="flex min-w-0 items-center gap-3 px-3 py-3"
                  >
                    {item.tipe === "pdf" ? (
                      <FileText
                        className="shrink-0 text-hijau-utama"
                        size={22}
                      />
                    ) : (
                      <FileImage
                        className="shrink-0 text-hijau-utama"
                        size={22}
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {item.nama}
                      </span>
                      <span className="block text-sm text-tinta-redup">
                        {ukuranBerkas(item.ukuranByte)}
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Hapus lampiran ${item.nama}`}
                      title="Hapus lampiran"
                      onClick={() => {
                        setLampiranHapus((ids) => [...ids, item.id]);
                        setMediaDiubah(true);
                      }}
                      disabled={sedang}
                      className="grid size-11 shrink-0 place-items-center rounded-md text-merah-layanan hover:bg-permukaan"
                    >
                      <Trash2 size={19} aria-hidden="true" />
                    </button>
                  </li>
                ))}
                {lampiranBaru.map((item, index) => (
                  <li
                    key={`${item.name}-${item.size}-${index}`}
                    className="flex min-w-0 items-center gap-3 px-3 py-3"
                  >
                    {item.type === "application/pdf" ? (
                      <FileText
                        className="shrink-0 text-hijau-utama"
                        size={22}
                      />
                    ) : (
                      <FileImage
                        className="shrink-0 text-hijau-utama"
                        size={22}
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {item.name}
                      </span>
                      <span className="block text-sm text-tinta-redup">
                        Baru · {ukuranBerkas(item.size)}
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Batalkan lampiran ${item.name}`}
                      title="Batalkan lampiran"
                      onClick={() => {
                        setLampiranBaru((daftar) =>
                          daftar.filter((_, posisi) => posisi !== index),
                        );
                        setMediaDiubah(true);
                      }}
                      disabled={sedang}
                      className="grid size-11 shrink-0 place-items-center rounded-md text-merah-layanan hover:bg-permukaan"
                    >
                      <Trash2 size={19} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <label className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-hijau-utama px-4 py-2.5 font-semibold text-hijau-utama hover:bg-hijau-muda">
              <Paperclip size={19} aria-hidden="true" />
              Tambah PDF atau gambar
              <input
                type="file"
                accept="application/pdf,image/*,.heic,.heif"
                multiple
                onChange={pilihLampiran}
                disabled={sedang}
                className="hidden"
              />
            </label>
          </section>
        </>
      )}

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-garis bg-latar px-4 py-3 shadow-[0_-8px_24px_rgb(46_48_62/0.08)] sm:mx-0 sm:rounded-lg sm:border">
        {tahap && (
          <p role="status" className="mb-2 text-sm font-medium text-tinta-redup">
            {tahap}
          </p>
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          {awal?.status === "terbit" ? (
            <button
              type="button"
              onClick={() => simpanDenganTujuan("simpan")}
              disabled={sedang}
              className="rounded-lg bg-hijau-utama px-5 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
            >
              {sedang
                ? "Menyimpan..."
                : `Simpan perubahan ${sebutanForm}`}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => simpanDenganTujuan("draf")}
                disabled={sedang}
                className="rounded-lg border border-garis bg-white px-5 py-2.5 font-semibold hover:border-hijau-utama disabled:opacity-60"
              >
                Simpan draf
              </button>
              <button
                type="button"
                onClick={() => simpanDenganTujuan("terbit")}
                disabled={sedang}
                className="rounded-lg bg-hijau-utama px-5 py-2.5 font-semibold text-white hover:bg-hijau-pekat disabled:opacity-60"
              >
                {sedang
                  ? "Menyimpan..."
                  : `Terbitkan ${sebutanForm}`}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => simpanDenganTujuan("pratinjau")}
            disabled={sedang}
            className="rounded-lg border border-hijau-utama bg-white px-5 py-2.5 font-semibold text-hijau-utama hover:bg-hijau-muda disabled:opacity-60"
          >
            Simpan & pratinjau
          </button>
        </div>
      </div>
    </form>
  );
}
