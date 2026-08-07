import { Clock, Phone, User } from "lucide-react";
import type { KontakLayanan } from "@/db/schema";
import { nomorTampil } from "@/lib/format";
import { JENIS_KONTAK } from "../jenis";
import { ambilKontakAdmin, ambilKontakById } from "../queries";
import { FormKontak } from "./FormKontak";
import { AksiKontakAdmin } from "./AksiKontakAdmin";

function BarisKontak({ item }: { item: KontakLayanan }) {
  return (
    <li className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="font-bold leading-snug">
          {item.namaLayanan}
          {!item.aktif && (
            <span className="ml-2 rounded-full bg-permukaan px-2 py-0.5 text-xs font-bold uppercase text-tinta-redup">
              disembunyikan
            </span>
          )}
        </p>
        <div className="mt-1 space-y-0.5 text-sm text-tinta-redup">
          {item.namaPetugas && (
            <p className="flex items-center gap-1.5">
              <User size={14} aria-hidden="true" className="shrink-0" />
              {item.namaPetugas}
            </p>
          )}
          {item.nomorWa ? (
            <p className="flex items-center gap-1.5">
              <Phone size={14} aria-hidden="true" className="shrink-0" />
              {nomorTampil(item.nomorWa)}
            </p>
          ) : (
            <p className="italic">Belum ada nomor</p>
          )}
          {item.jamLayanan && (
            <p className="flex items-center gap-1.5">
              <Clock size={14} aria-hidden="true" className="shrink-0" />
              {item.jamLayanan}
            </p>
          )}
        </div>
      </div>
      <div className="shrink-0 sm:pt-1">
        <AksiKontakAdmin id={item.id} nama={item.namaLayanan} />
      </div>
    </li>
  );
}

/**
 * Pengelolaan kontak & layanan: form di kiri, daftar per jenis di kanan.
 *
 * Daftarnya dikelompokkan mengikuti urutan kemendesakan JENIS_KONTAK —
 * susunan yang sama dengan yang dilihat warga — supaya pengurus langsung
 * paham nomor mana yang tampil di mana.
 */
export async function KelolaKontak({ idUbah }: { idUbah?: string }) {
  const [semua, yangDiubah] = await Promise.all([
    ambilKontakAdmin(),
    idUbah ? ambilKontakById(idUbah) : Promise.resolve(null),
  ]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,24rem)_1fr]">
      <div className="lg:sticky lg:top-6">
        <FormKontak key={yangDiubah?.id ?? "baru"} awal={yangDiubah} />
      </div>

      <div className="space-y-5">
        {JENIS_KONTAK.map((jenis) => {
          const daftar = semua.filter((k) => k.jenis === jenis.kode);
          return (
            <section
              key={jenis.kode}
              className="overflow-hidden rounded-xl border border-garis bg-white"
            >
              <div className="border-b border-garis bg-permukaan/70 px-4 py-3">
                <h2 className="font-bold">{jenis.label}</h2>
                {jenis.keterangan && (
                  <p className="text-sm text-tinta-redup">{jenis.keterangan}</p>
                )}
              </div>
              {daftar.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-tinta-redup">
                  Belum ada kontak. Tambahkan lewat form dengan jenis
                  “{jenis.label}”.
                </p>
              ) : (
                <ul className="divide-y divide-garis">
                  {daftar.map((item) => (
                    <BarisKontak key={item.id} item={item} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
