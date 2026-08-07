"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarOff,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import {
  labelJenisLibur,
  liburUntukTanggal,
  TAHUN_DATA_LIBUR,
} from "@/features/agenda/libur-nasional";
import { pasaranUntukTanggal } from "@/features/agenda/pasaran";

export type CalendarEvent = {
  id: string;
  name: string;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  description?: string | null;
};

type FullScreenCalendarProps = {
  data: CalendarEvent[];
  today: string;
};

const NAMA_HARI = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];
const FORMAT_BULAN = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
});
const FORMAT_TANGGAL = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const FORMAT_RENTANG = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function parseTanggal(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function formatTanggal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function tambahHari(date: Date, jumlah: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + jumlah);
  return next;
}

function awalBulan(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

function daftarHariBulan(month: Date) {
  const first = awalBulan(month);
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0, 12);
  const daysBefore = (first.getDay() + 6) % 7;
  const daysAfter = 6 - ((last.getDay() + 6) % 7);
  const start = tambahHari(first, -daysBefore);
  const total = Math.round(
    (tambahHari(last, daysAfter).getTime() - start.getTime()) / 86_400_000,
  );

  return Array.from({ length: total + 1 }, (_, index) =>
    tambahHari(start, index),
  );
}

function rentangTanggal(event: CalendarEvent) {
  if (!event.endDate || event.endDate === event.startDate) {
    return FORMAT_RENTANG.format(parseTanggal(event.startDate));
  }

  return `${FORMAT_RENTANG.format(parseTanggal(event.startDate))} - ${FORMAT_RENTANG.format(parseTanggal(event.endDate))}`;
}

function gabungKelas(...kelas: Array<string | false | null | undefined>) {
  return kelas.filter(Boolean).join(" ");
}

function kelasLingkaranTanggal({
  isCurrentMonth,
  isHoliday,
  isSelected,
  isSunday,
  isToday,
}: {
  isCurrentMonth: boolean;
  isHoliday: boolean;
  isSelected: boolean;
  isSunday: boolean;
  isToday: boolean;
}) {
  if (!isCurrentMonth) {
    return isHoliday || isSunday
      ? "bg-merah-kalender-muda/50 text-merah-kalender/55 ring-1 ring-merah-kalender/15"
      : "bg-latar/45 text-tinta-redup/55 ring-1 ring-garis/60";
  }

  if (isHoliday) {
    return "bg-merah-kalender text-white ring-2 ring-merah-kalender/20";
  }

  if (isSelected && isSunday) {
    return "bg-merah-kalender-muda text-merah-kalender-pekat ring-2 ring-merah-kalender";
  }

  if (isSelected) {
    return "bg-hijau-utama text-white ring-2 ring-hijau-utama/20";
  }

  if (isSunday) {
    return "bg-merah-kalender-muda text-merah-kalender-pekat ring-1 ring-merah-kalender/30";
  }

  if (isToday) {
    return "bg-white text-hijau-utama ring-2 ring-hijau-utama";
  }

  return "bg-latar text-tinta ring-1 ring-garis";
}

export function FullScreenCalendar({ data, today }: FullScreenCalendarProps) {
  const agendaBerikutnya =
    data.find((event) => (event.endDate ?? event.startDate) >= today) ?? data[0];
  const tanggalAwal = agendaBerikutnya?.startDate ?? today;
  const [selectedDay, setSelectedDay] = useState(() =>
    parseTanggal(tanggalAwal),
  );
  const [currentMonth, setCurrentMonth] = useState(() =>
    awalBulan(parseTanggal(tanggalAwal)),
  );

  const days = useMemo(() => daftarHariBulan(currentMonth), [currentMonth]);
  const eventsByDay = useMemo(() => {
    const result = new Map<string, CalendarEvent[]>();

    for (const event of data) {
      let day = parseTanggal(event.startDate);
      const end = parseTanggal(event.endDate ?? event.startDate);
      let guard = 0;

      while (day <= end && guard < 366) {
        const key = formatTanggal(day);
        result.set(key, [...(result.get(key) ?? []), event]);
        day = tambahHari(day, 1);
        guard += 1;
      }
    }

    return result;
  }, [data]);

  const selectedKey = formatTanggal(selectedDay);
  const selectedEvents = eventsByDay.get(selectedKey) ?? [];
  const selectedHoliday = liburUntukTanggal(selectedKey);
  const selectedIsSunday = selectedDay.getDay() === 0;
  const todayDate = parseTanggal(today);

  function pindahBulan(jumlah: number) {
    const next = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + jumlah,
      1,
      12,
    );
    setCurrentMonth(next);
    setSelectedDay(next);
  }

  function kembaliHariIni() {
    setCurrentMonth(awalBulan(todayDate));
    setSelectedDay(todayDate);
  }

  return (
    <section
      aria-label="Kalender kegiatan Desa Sangge"
      className="overflow-hidden rounded-xl border border-garis bg-white"
    >
      <header className="flex flex-col gap-5 bg-permukaan/55 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div
            aria-hidden="true"
            className="hidden w-16 shrink-0 overflow-hidden rounded-lg border border-hijau-utama/25 bg-white text-center sm:block"
          >
            <span className="block bg-hijau-utama px-2 py-1 text-xs font-bold text-white">
              {new Intl.DateTimeFormat("id-ID", { month: "short" }).format(
                todayDate,
              )}
            </span>
            <span className="block py-1 text-xl font-extrabold text-tinta">
              {todayDate.getDate()}
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold capitalize text-tinta sm:text-3xl">
              {FORMAT_BULAN.format(currentMonth)}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-tinta-redup sm:text-base">
              Pilih tanggal untuk melihat hari pasaran dan rincian kegiatan.
            </p>
          </div>
        </div>

        <div
          className="grid w-full grid-cols-[3rem_1fr_3rem] overflow-hidden rounded-lg border border-garis bg-white lg:w-auto lg:grid-cols-[3rem_auto_3rem]"
          role="group"
          aria-label="Navigasi bulan"
        >
          <button
            type="button"
            onClick={() => pindahBulan(-1)}
            aria-label="Bulan sebelumnya"
            title="Bulan sebelumnya"
            className="grid min-h-12 place-items-center text-hijau-utama hover:bg-hijau-muda"
          >
            <ChevronLeft size={21} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={kembaliHariIni}
            className="min-h-12 border-x border-garis px-5 font-bold text-tinta hover:bg-hijau-muda"
          >
            Hari ini
          </button>
          <button
            type="button"
            onClick={() => pindahBulan(1)}
            aria-label="Bulan berikutnya"
            title="Bulan berikutnya"
            className="grid min-h-12 place-items-center text-hijau-utama hover:bg-hijau-muda"
          >
            <ChevronRight size={21} aria-hidden="true" />
          </button>
        </div>
      </header>

      {currentMonth.getFullYear() !== TAHUN_DATA_LIBUR && (
        <p
          role="note"
          className="border-b border-garis bg-merah-kalender-muda px-4 py-2.5 text-sm font-semibold text-merah-kalender-pekat sm:px-6"
        >
          Penanda libur resmi saat ini tersedia untuk tahun {TAHUN_DATA_LIBUR}.
          Hari Minggu tetap ditandai merah.
        </p>
      )}

      <div className="grid grid-cols-7 border-b border-garis bg-hijau-utama text-center text-[10px] font-bold text-white sm:text-sm">
        {NAMA_HARI.map((day, index) => (
          <div
            key={day}
            className={gabungKelas(
              "min-w-0 border-r border-white/15 px-0.5 py-3 last:border-r-0 sm:px-2",
              index === 6 && "bg-merah-kalender-pekat",
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div
        key={`mobile-${formatTanggal(currentMonth)}`}
        className="masuk-halus grid grid-cols-7 md:hidden"
      >
        {days.map((day) => {
          const key = formatTanggal(day);
          const events = eventsByDay.get(key) ?? [];
          const holiday = liburUntukTanggal(key);
          const isSelected = key === selectedKey;
          const isSunday = day.getDay() === 0;
          const isToday = key === today;
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const pasaran = pasaranUntukTanggal(day);
          const statusTanggal = holiday
            ? `${labelJenisLibur(holiday.jenis)}: ${holiday.nama}`
            : isSunday
              ? "Hari Minggu"
              : "Hari kerja";

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDay(day)}
              aria-label={`${FORMAT_TANGGAL.format(day)}, pasaran ${pasaran}, ${statusTanggal}${events.length ? `, ${events.length} agenda` : ", tidak ada agenda"}`}
              aria-pressed={isSelected}
              className={gabungKelas(
                "relative flex min-h-20 flex-col items-center border-b border-r border-garis px-1 py-2 last:border-r-0",
                isCurrentMonth
                  ? "bg-white text-tinta"
                  : "bg-latar/65 text-tinta-redup/60",
                isSelected &&
                  (holiday || isSunday
                    ? "bg-merah-kalender-muda/65"
                    : "bg-hijau-muda"),
                !isSelected && "hover:bg-permukaan",
              )}
            >
              <time
                dateTime={key}
                className={gabungKelas(
                  "grid size-8 shrink-0 place-items-center rounded-full text-sm font-extrabold",
                  kelasLingkaranTanggal({
                    isCurrentMonth,
                    isHoliday: Boolean(holiday),
                    isSelected,
                    isSunday,
                    isToday,
                  }),
                )}
              >
                {day.getDate()}
              </time>
              <span
                className={gabungKelas(
                  "text-[10px] font-bold leading-none",
                  isCurrentMonth
                    ? "text-oker"
                    : "text-tinta-redup/55",
                )}
              >
                {pasaran}
              </span>
              <span
                className="mt-1 flex min-h-3 max-w-full items-center gap-1"
                aria-hidden="true"
              >
                {holiday && (
                  <span className="truncate text-[9px] font-extrabold leading-none text-merah-kalender-pekat">
                    {holiday.jenis === "libur-nasional" ? "Libur" : "Cuti"}
                  </span>
                )}
                {events.length > 0 && (
                  <span className="flex items-center gap-0.5">
                  {events.slice(0, 3).map((event) => (
                    <span
                      key={event.id}
                      className="size-1.5 rounded-full bg-hijau-utama"
                    />
                  ))}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={`desktop-${formatTanggal(currentMonth)}`}
        className="masuk-halus hidden grid-cols-7 md:grid"
      >
        {days.map((day) => {
          const key = formatTanggal(day);
          const events = eventsByDay.get(key) ?? [];
          const holiday = liburUntukTanggal(key);
          const isSelected = key === selectedKey;
          const isSunday = day.getDay() === 0;
          const isToday = key === today;
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const pasaran = pasaranUntukTanggal(day);
          const statusTanggal = holiday
            ? `${labelJenisLibur(holiday.jenis)}: ${holiday.nama}`
            : isSunday
              ? "Hari Minggu"
              : "Hari kerja";

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDay(day)}
              aria-label={`${FORMAT_TANGGAL.format(day)}, pasaran ${pasaran}, ${statusTanggal}${events.length ? `, ${events.length} agenda` : ", tidak ada agenda"}`}
              aria-pressed={isSelected}
              className={gabungKelas(
                "flex min-h-36 flex-col border-b border-r border-garis p-3 text-left lg:min-h-40",
                isCurrentMonth
                  ? "bg-white text-tinta"
                  : "bg-latar/65 text-tinta-redup/60",
                isSelected &&
                  (holiday || isSunday
                    ? "bg-merah-kalender-muda/55"
                    : "bg-hijau-muda/65"),
                !isSelected && "hover:bg-permukaan/75",
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <strong
                  className={gabungKelas(
                    "pt-1 text-sm leading-none",
                    isCurrentMonth ? "text-oker" : "text-tinta-redup/55",
                  )}
                >
                  {pasaran}
                </strong>
                <time
                  dateTime={key}
                  className={gabungKelas(
                    "grid size-10 shrink-0 place-items-center rounded-full text-base font-extrabold",
                    kelasLingkaranTanggal({
                      isCurrentMonth,
                      isHoliday: Boolean(holiday),
                      isSelected,
                      isSunday,
                      isToday,
                    }),
                  )}
                >
                  {day.getDate()}
                </time>
              </span>

              {holiday && (
                <span className="mt-2 block rounded-md bg-merah-kalender-muda px-2 py-1.5 text-merah-kalender-pekat">
                  <span className="block text-[10px] font-extrabold leading-none">
                    {labelJenisLibur(holiday.jenis)}
                  </span>
                  <span className="mt-1 block line-clamp-2 text-[11px] font-semibold leading-tight">
                    {holiday.nama}
                  </span>
                </span>
              )}

              <span className="mt-auto block space-y-1.5 pt-2">
                {events.slice(0, 2).map((event) => (
                  <span
                    key={event.id}
                    className="block truncate rounded-md bg-hijau-utama px-2 py-1 text-xs font-semibold text-white"
                    title={event.name}
                  >
                    {event.name}
                  </span>
                ))}
                {events.length > 2 && (
                  <span className="block text-xs font-semibold text-hijau-utama">
                    +{events.length - 2} kegiatan lain
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="grid border-t border-garis bg-latar sm:grid-cols-[11rem_minmax(0,1fr)]"
        aria-live="polite"
      >
        <div
          className={gabungKelas(
            "px-5 py-5 text-white sm:px-6",
            selectedHoliday || selectedIsSunday
              ? "bg-merah-kalender-pekat"
              : "bg-hijau-pekat",
          )}
        >
          <CalendarDays
            size={23}
            aria-hidden="true"
            className={
              selectedHoliday || selectedIsSunday
                ? "text-merah-kalender-muda"
                : "text-hijau-muda"
            }
          />
          <p className="mt-3 text-sm font-semibold capitalize text-white/75">
            Tanggal dipilih
          </p>
          <p className="mt-1 font-bold capitalize leading-snug">
            {FORMAT_TANGGAL.format(selectedDay)}
          </p>
          <p className="mt-2 text-sm text-white/75">
            Pasaran{" "}
            <strong className="text-white">
              {pasaranUntukTanggal(selectedDay)}
            </strong>
          </p>
        </div>

        <div className="min-w-0 px-5 py-5 sm:px-6">
          {selectedHoliday && (
            <div className="mb-5 flex items-start gap-3 rounded-lg bg-merah-kalender-muda px-4 py-3 text-merah-kalender-pekat">
              <CalendarOff
                size={20}
                aria-hidden="true"
                className="mt-0.5 shrink-0"
              />
              <div>
                <p className="text-sm font-extrabold">
                  {labelJenisLibur(selectedHoliday.jenis)}
                </p>
                <p className="mt-0.5 font-semibold leading-snug">
                  {selectedHoliday.nama}
                </p>
              </div>
            </div>
          )}
          {!selectedHoliday && selectedIsSunday && (
            <div className="mb-5 flex items-center gap-3 rounded-lg bg-merah-kalender-muda px-4 py-3 font-semibold text-merah-kalender-pekat">
              <CalendarOff size={20} aria-hidden="true" className="shrink-0" />
              Hari Minggu
            </div>
          )}
          {selectedEvents.length > 0 ? (
            <ul className="divide-y divide-garis">
              {selectedEvents.map((event) => (
                <li key={event.id} className="py-4 first:pt-0 last:pb-0">
                  <p className="font-bold leading-snug text-tinta">
                    {event.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-hijau-utama">
                    {rentangTanggal(event)}
                  </p>
                  {event.location && (
                    <p className="mt-2 flex items-start gap-2 text-sm text-tinta-redup">
                      <MapPin
                        size={16}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-oker"
                      />
                      <span>{event.location}</span>
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-tinta-redup sm:text-base">
                      {event.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex min-h-24 items-center">
              <div>
                <p className="font-bold text-tinta">Tidak ada kegiatan</p>
                <p className="mt-1 text-sm leading-relaxed text-tinta-redup sm:text-base">
                  Pilih tanggal lain pada kalender untuk melihat jadwalnya.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
