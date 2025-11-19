"use client";

import { usePathname, useRouter } from "next/navigation";
import { LanguageIcon } from "@heroicons/react/24/outline";

const LOCALES = ["es", "en"] as const;
const DEFAULT_LOCALE = "es";
const LOCALE_COOKIE = "NEXT_LOCALE";

function extractLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  return (LOCALES as readonly string[]).includes(seg as any)
    ? seg
    : DEFAULT_LOCALE;
}

function stripLocale(pathname: string): string {
  const parts = pathname.split("/");
  const first = parts[1];
  if ((LOCALES as readonly string[]).includes(first as any)) {
    const stripped = "/" + parts.slice(2).join("/");
    return stripped === "//" || stripped === "/"
      ? "/"
      : stripped.replace(/\/+$/, "") || "/";
  }
  return pathname || "/";
}

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = extractLocale(pathname);
  const basePath = stripLocale(pathname) || "/";
  const nextLocale = currentLocale === "es" ? "en" : "es";

  const switchLanguage = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    try {
      document.cookie = `${LOCALE_COOKIE}=${newLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {}
    const nextPath =
      basePath === "/" ? `/${newLocale}` : `/${newLocale}${basePath}`;
    router.push(nextPath);
    setTimeout(() => {
      if (window.location.pathname !== nextPath) {
        window.location.href = nextPath;
      }
    }, 120);
  };

  return (
    <button
      type="button"
      onClick={() => switchLanguage(nextLocale)}
      aria-label={
        currentLocale === "es"
          ? "Cambiar idioma a inglés"
          : "Switch language to Spanish"
      }
      title={currentLocale === "es" ? "Switch to English" : "Cambiar a Español"}
      className={`
        inline-flex items-center gap-1 px-2 py-1
        text-sm font-semibold tracking-wide
        focus:outline-none 
        
        /* Mobile (topbar azul) */
        text-white hover:text-white/80
        /* Desktop (sidebar / fondos claros) */
        md:text-gray-700 md:hover:text-gray-900
      `}
    >
      <LanguageIcon className="h-4 w-4 md:text-gray-600 md:hover:text-gray-800 transition-colors" />
      {/* Variante A: mostrar el actual */}
      <span>{currentLocale.toUpperCase()}</span>
      {/* Variante B: mostrar el destino (descomenta para usarla)
          <span>{nextLocale.toUpperCase()}</span>
      */}
    </button>
  );
}
