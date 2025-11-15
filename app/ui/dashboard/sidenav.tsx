"use client";

import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AcmeLogo from "@/app/ui/acme-logo";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ConfirmLogoutButton from "../confirm-logout-button";
import LanguageToggle from "../language-toggle";
import { Dictionary } from "@/app/lib/dictionaries";

interface SideNavProps {
  lang: string;
  dict: Dictionary;
}

export default function SideNav({ lang, dict }: SideNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Topbar móvil con logo y botón de menú */}
      <div className="md:hidden sticky top-0 z-40 p-3">
        <div className="flex items-center justify-between rounded-md bg-blue-600 px-4 py-3 ">
          <Link href={`/${lang}/dashboard`} className="flex items-center">
            <div className="w-28 text-white">
              <AcmeLogo />
            </div>
          </Link>
          <div className="flex items-center">
            <LanguageToggle currentLocale={lang} variant="blue" />
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              className="inline-flex items-center rounded-lg p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer móvil */}
      <div
        className={clsx(
          "md:hidden fixed inset-0 z-50 transition",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className={clsx(
            "absolute inset-0 bg-black/40 transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={clsx(
            "absolute left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform will-change-transform",
            open ? "translate-x-0" : "-translate-x-full"
          )}
          aria-label="Sidebar"
        >
          <div className="flex h-full flex-col">
            {/* Encabezado del drawer (sin logo) */}
            <div className="flex h-14 items-center justify-between border-b px-4">
              <span className=" text-sm font-medium transition-colors">
                {dict.navigation.menu}
              </span>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setOpen(false)}
                className="inline-flex items-center rounded-full p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
              <NavLinks
                lang={lang}
                dict={dict}
                showTextOnAllSizes
                onNavigate={() => setOpen(false)}
              />
            </div>

            {/* Footer con Sign Out */}
            <div className="border-t px-3 py-3">
              <ConfirmLogoutButton />
            </div>
          </div>
        </aside>
      </div>

      {/* Sidebar fijo de escritorio */}
      <aside className="hidden md:flex h-full flex-col px-3 py-4 md:px-2">
        <Link
          className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
          href="/"
        >
          <div className="w-32 text-white md:w-40">
            <AcmeLogo />
          </div>
        </Link>

        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <NavLinks lang={lang} dict={dict} showTextOnAllSizes />
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block" />
          <ConfirmLogoutButton />
        </div>
      </aside>
    </>
  );
}
