import { CalendarDays, MapPin } from "lucide-react";
import type { Agenda } from "@/db/schema";
import { tanggalPanjang, tanggalRingkas } from "@/lib/format";
import { ambilAgendaAdmin, ambilAgendaById } from "../queries";
import { FormAgenda } from "./FormAgenda";
import { AksiAgendaAdmin } from "./AksiAgendaAdmin";

function BarisAgenda({ item, redup = false }: { item: Agenda; redup?: boolean }) {
  return (
    <li className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p
          className={`text-sm font-semibold ${
            redup ? "text-tinta-redup" : "text-hijau-utama"
          }`}
        >
          <time dateTime={item.tanggalMulai}>
            {tanggalPanjang(item.tanggalMulai)}
          </time>
          {item.tanggalSelesai && item.tanggalSelesai !== item.tanggalMulai && (
            <> – {tanggalRingkas(item.tanggalSelesai)}</>
          )}
        </p>
        <p className="mt-0.5 font-bold leading-snug">{item.judul}</p>
        {item.lokasi && (
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-tinta-redup">
            <MapPin size={14} aria-hidden="true" className="shrink-0" />
            {item.lokasi}
          </p>
        )}
        {item.keterangan && (
          <p className="mt-1 line-clamp-2 text-sm text-tinta-redup">
            {item.keterangan}
          </p>
        )}
      </div>
      <div className="shrink-0 sm:pt-1">
        <AksiAgendaAdmin id={item.id} judul={item.judul} />
      </div>
    </li>
  );
}

/**
 * Pengelolaan agenda: form di kiri, daftar di kanan.
 *
 * Form selalu terlihat (bukan di balik tombol) karena menambah jadwal adalah
 * pekerjaan yang paling sering dilakukan di halaman ini. Kegiatan yang sudah
 * lewat dilipat di bawah supaya tidak mengaburkan jadwal yang masih berjalan.
 */
export async function KelolaAgenda({ idUbah }: { idUbah?: string }) {
  const [{ mendatang, lampau }, yangDiubah] = await Promise.all([
    ambilAgendaAdmin(),
    idUbah ? ambilAgendaById(idUbah) : Promise.resolve(null),
  ]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,24rem)_1fr]">
      {/* key memaksa form ter-reset saat berpindah tambah <-> ubah */}
      <div className="lg:sticky lg:top-6">
        <FormAgenda key={yangDiubah?.id ?? "baru"} awal={yangDiubah} />
      </div>

      <div className="space-y-5">
        <section className="overflow-hidden rounded-xl border border-garis bg-white">
          <h2 className="flex items-center gap-2 border-b border-garis bg-permukaan/70 px-4 py-3 font-bold">
            <CalendarDays
              size={18}
              aria-hidden="true"
              className="text-hijau-utama"
            />
            Akan datang
            <span className="ml-auto rounded-full bg-hijau-muda px-2.5 py-0.5 text-sm font-bold text-hijau-utama">
              {mendatang.length}
            </span>
          </h2>
          {mendatang.length === 0 ? (
            <p className="px-4 py-8 text-center text-tinta-redup">
              Belum ada kegiatan yang dijadwalkan. Isi form di samping untuk
              menambah kegiatan pertama.
            </p>
          ) : (
            <ul className="divide-y divide-garis">
              {mendatang.map((item) => (
                <BarisAgenda key={item.id} item={item} />
              ))}
            </ul>
          )}
        </section>

        {lampau.length > 0 && (
          <details className="overflow-hidden rounded-xl border border-garis bg-white">
            <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 py-3 font-bold text-tinta-redup hover:bg-permukaan/60">
              Sudah lewat
              <span className="ml-auto rounded-full bg-permukaan px-2.5 py-0.5 text-sm font-bold">
                {lampau.length}
              </span>
            </summary>
            <ul className="divide-y divide-garis border-t border-garis">
              {lampau.map((item) => (
                <BarisAgenda key={item.id} item={item} redup />
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
