import {
  FullScreenCalendar,
  type CalendarEvent,
} from "@/components/ui/fullscreen-calendar";
import { tanggalHariIni } from "@/lib/format";
import { ambilAgendaPublik } from "../queries";

/**
 * Isi halaman /agenda memakai kalender bulanan interaktif.
 * Komponen klien hanya menerima data siap tampil; pengambilan database tetap
 * berlangsung di server supaya kredensial dan logika query tidak ikut terkirim.
 */
export async function SeksiAgenda() {
  const daftar = await ambilAgendaPublik();

  const data: CalendarEvent[] = daftar.map((item) => ({
    id: item.id,
    name: item.judul,
    startDate: item.tanggalMulai,
    endDate: item.tanggalSelesai,
    location: item.lokasi,
    description: item.keterangan,
  }));

  return <FullScreenCalendar data={data} today={tanggalHariIni()} />;
}
