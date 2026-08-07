"use client";

import {
  useId,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

type ModeTampilan = "grafik" | "tabel";

/**
 * Tab lokal untuk mengganti satu visualisasi antara grafik dan tabel.
 *
 * Setiap panel menyimpan modenya sendiri. Panel yang tidak aktif tidak
 * dirender agar Recharts selalu menghitung ukuran dari wadah yang terlihat.
 */
export function TampilanData({
  label,
  grafik,
  tabel,
}: {
  label: string;
  grafik: ReactNode;
  tabel: ReactNode;
}) {
  const [mode, setMode] = useState<ModeTampilan>("grafik");
  const idDasar = useId().replaceAll(":", "");
  const idTabGrafik = `${idDasar}-tab-grafik`;
  const idTabTabel = `${idDasar}-tab-tabel`;
  const idPanelGrafik = `${idDasar}-panel-grafik`;
  const idPanelTabel = `${idDasar}-panel-tabel`;

  const pindahDenganKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
    nilai: ModeTampilan,
  ) => {
    let tujuan: ModeTampilan | null = null;
    if (event.key === "ArrowLeft" || event.key === "Home") tujuan = "grafik";
    if (event.key === "ArrowRight" || event.key === "End") tujuan = "tabel";
    if (!tujuan || tujuan === nilai) return;

    event.preventDefault();
    setMode(tujuan);
    const idTujuan = tujuan === "grafik" ? idTabGrafik : idTabTabel;
    requestAnimationFrame(() => document.getElementById(idTujuan)?.focus());
  };

  const tab = (
    nilai: ModeTampilan,
    teks: string,
    idTab: string,
    idPanel: string,
  ) => {
    const aktif = mode === nilai;

    return (
      <li role="presentation">
        <button
          type="button"
          role="tab"
          id={idTab}
          aria-selected={aktif}
          aria-controls={idPanel}
          tabIndex={aktif ? 0 : -1}
          onClick={() => setMode(nilai)}
          onKeyDown={(event) => pindahDenganKeyboard(event, nilai)}
          className={`min-h-11 px-4 text-sm font-bold sm:px-5 ${
            aktif
              ? "bg-hijau-utama text-white"
              : "text-tinta-redup hover:bg-permukaan hover:text-tinta"
          }`}
        >
          {teks}
        </button>
      </li>
    );
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <ul
          role="tablist"
          aria-orientation="horizontal"
          aria-label={label}
          className="inline-grid grid-cols-2 divide-x divide-garis overflow-hidden rounded-lg border border-garis bg-latar"
        >
          {tab("grafik", "Grafik", idTabGrafik, idPanelGrafik)}
          {tab("tabel", "Tabel", idTabTabel, idPanelTabel)}
        </ul>
      </div>

      <div
        role="tabpanel"
        id={idPanelGrafik}
        aria-labelledby={idTabGrafik}
        hidden={mode !== "grafik"}
      >
        {mode === "grafik" ? grafik : null}
      </div>
      <div
        role="tabpanel"
        id={idPanelTabel}
        aria-labelledby={idTabTabel}
        hidden={mode !== "tabel"}
      >
        {mode === "tabel" ? tabel : null}
      </div>
    </div>
  );
}
