"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_UTAMA, menuSedangAktif } from "../navigasi";

/**
 * Menu untuk layar kecil. Satu-satunya bagian header yang butuh JavaScript,
 * jadi sengaja dipisah supaya sisa header tetap komponen server.
 */
export function MenuMobile() {
  const [terbuka, setTerbuka] = useState(false);
  const [submenuTerbuka, setSubmenuTerbuka] = useState<string | null>(null);
  const pathname = usePathname();
  const tombolRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Tutup menu setiap kali pindah halaman.
  useEffect(() => {
    setTerbuka(false);
    setSubmenuTerbuka(null);
  }, [pathname]);

  // Kunci gulir latar saat menu terbuka supaya tidak ikut bergeser.
  useEffect(() => {
    if (!terbuka) return;

    const overflowSebelumnya = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflowSebelumnya;
    };
  }, [terbuka]);

  useEffect(() => {
    if (!terbuka) return;

    const fokusPertama = panelRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    fokusPertama?.focus();

    function tanganiKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setTerbuka(false);
        tombolRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;
      const fokus = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );
      const pertama = fokus[0];
      const terakhir = fokus[fokus.length - 1];
      if (!pertama || !terakhir) return;

      if (event.shiftKey && document.activeElement === pertama) {
        event.preventDefault();
        terakhir.focus();
      } else if (!event.shiftKey && document.activeElement === terakhir) {
        event.preventDefault();
        pertama.focus();
      }
    }

    document.addEventListener("keydown", tanganiKeyboard);
    return () => document.removeEventListener("keydown", tanganiKeyboard);
  }, [terbuka]);

  function bukaAtauTutupMenu() {
    if (terbuka) {
      setTerbuka(false);
      return;
    }

    const indukAktif = MENU_UTAMA.find(
      (butir) => butir.anak && menuSedangAktif(pathname, butir),
    );
    setSubmenuTerbuka(indukAktif?.href ?? null);
    setTerbuka(true);
  }

  function tutupMenu() {
    setTerbuka(false);
    tombolRef.current?.focus();
  }

  return (
    <div className="xl:hidden">
      <button
        ref={tombolRef}
        type="button"
        onClick={bukaAtauTutupMenu}
        aria-expanded={terbuka}
        aria-controls="menu-hp"
        aria-label={terbuka ? "Tutup menu utama" : "Buka menu utama"}
        title={terbuka ? "Tutup menu" : "Buka menu"}
        className="grid size-12 place-items-center rounded-lg transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {terbuka ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <Menu className="size-6" aria-hidden="true" />
        )}
      </button>

      {terbuka && (
        <div
          id="menu-hp"
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-menu-hp"
          className="fixed inset-x-0 top-[var(--tinggi-header)] z-40 h-[calc(100dvh-var(--tinggi-header))] bg-tinta/55 sm:flex sm:justify-end"
        >
          <button
            type="button"
            onClick={tutupMenu}
            aria-label="Tutup menu utama"
            className="absolute inset-0 hidden cursor-default sm:block"
            tabIndex={-1}
          />

          <div
            ref={panelRef}
            className="menu-masuk relative ml-auto flex h-full w-full flex-col overflow-hidden bg-[linear-gradient(155deg,#3a4a2b_0%,#2e303e_64%,#493932_115%)] shadow-2xl sm:max-w-[26rem] sm:border-l sm:border-white/15"
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/15 px-5 py-3.5">
              <div>
                <p
                  id="judul-menu-hp"
                  className="text-lg font-bold leading-tight text-white"
                >
                  Menu Utama
                </p>
                <p className="mt-1 text-sm text-white/65">Desa Sangge</p>
              </div>
              <button
                type="button"
                onClick={tutupMenu}
                aria-label="Tutup menu utama"
                title="Tutup menu"
                className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Menu utama"
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 [scrollbar-gutter:stable]"
            >
              <ul className="space-y-1">
                {MENU_UTAMA.map((butir) => {
                  const aktif = menuSedangAktif(pathname, butir);

                  if (butir.anak) {
                    const submenuAktif = submenuTerbuka === butir.href;
                    const submenuId = `submenu-${butir.label.toLowerCase().replaceAll(" ", "-")}`;

                    return (
                      <li key={butir.href}>
                        <button
                          type="button"
                          onClick={() =>
                            setSubmenuTerbuka((nilai) =>
                              nilai === butir.href ? null : butir.href,
                            )
                          }
                          aria-expanded={submenuAktif}
                          aria-controls={submenuId}
                          className={[
                            "flex min-h-14 w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left font-medium text-white transition-colors",
                            aktif
                              ? "bg-white/15 font-semibold ring-1 ring-inset ring-white/15"
                              : "hover:bg-white/10",
                          ].join(" ")}
                        >
                          <span>{butir.label}</span>
                          <ChevronDown
                            className={[
                              "size-5 shrink-0 text-white/65 transition-transform",
                              submenuAktif ? "rotate-180" : "",
                            ].join(" ")}
                            aria-hidden="true"
                          />
                        </button>

                        {submenuAktif && (
                          <ul
                            id={submenuId}
                            className="ml-5 mt-1 border-l border-white/20 pl-3"
                          >
                            {butir.anak.map((anak) => {
                              const anakAktif =
                                pathname === anak.href ||
                                pathname.startsWith(anak.href + "/");
                              return (
                                <li key={anak.href}>
                                  <Link
                                    href={anak.href}
                                    aria-current={
                                      anakAktif ? "page" : undefined
                                    }
                                    className={[
                                      "flex min-h-[3.25rem] items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-white transition-colors",
                                      anakAktif
                                        ? "bg-white/15 font-semibold"
                                        : "hover:bg-white/10",
                                    ].join(" ")}
                                  >
                                    <span>{anak.label}</span>
                                    <ChevronRight
                                      className="size-4 shrink-0 text-white/55"
                                      aria-hidden="true"
                                    />
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  return (
                    <li key={butir.href}>
                      <Link
                        href={butir.href}
                        aria-current={aktif ? "page" : undefined}
                        className={[
                          "flex min-h-14 items-center justify-between gap-3 rounded-lg px-4 py-3 font-medium text-white transition-colors",
                          aktif
                            ? "bg-white/15 font-semibold ring-1 ring-inset ring-white/15"
                            : "hover:bg-white/10",
                        ].join(" ")}
                      >
                        <span>{butir.label}</span>
                        <ChevronRight
                          className="size-5 shrink-0 text-white/55"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
