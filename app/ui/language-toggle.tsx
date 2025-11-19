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

type LanguageToggleProps = {
  variant?: "auto" | "login" | "topbar" | "sidebar";
  showTargetInstead?: boolean; // si quieres mostrar el idioma destino
  className?: string; // override externo opcional
  iconClassName?: string; // override opcional icono
};

export default function LanguageToggle({
  variant = "auto",
  showTargetInstead = false,
  className,
  iconClassName,
}: LanguageToggleProps) {
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

  // Texto que se muestra
  const label = showTargetInstead
    ? nextLocale.toUpperCase()
    : currentLocale.toUpperCase();

  // Clases base
  let baseTextClasses =
    "inline-flex items-center gap-1 px-1.5 py-1 text-sm font-semibold tracking-wide focus:outline-none  transition";

  // Segun variante
  switch (variant) {
    case "login":
      // Mantener blanco siempre (como tu header azul en login)
      baseTextClasses += " text-white hover:text-white/80";
      break;
    case "topbar":
      // Modo barra azul móvil
      baseTextClasses +=
        " text-white hover:text-white/80 md:text-gray-700 md:hover:text-gray-900";
      break;
    case "sidebar":
      // Para sidebar claro (solo gris)
      baseTextClasses += " text-gray-600 hover:text-gray-900";
      break;
    case "auto":
    default:
      // Comportamiento actual por defecto
      baseTextClasses +=
        " text-white hover:text-white/80 md:text-gray-700 md:hover:text-gray-900";
      break;
  }

  // Clases icono
  let iconClasses = "h-4 w-4 transition-colors";
  switch (variant) {
    case "login":
      // Ícono blanco o azulado — si lo quieres azul sobre fondo azul NO se vería,
      // así que normalmente blanco es mejor. Si insistes en azul:
      // iconClasses += " text-blue-200";
      iconClasses += " text-white";
      break;
    case "sidebar":
      iconClasses += " text-gray-500 group-hover:text-gray-700";
      break;
    case "topbar":
    case "auto":
    default:
      iconClasses += " text-current";
      break;
  }

  if (iconClassName) iconClasses = iconClassName;
  const rootClasses = className
    ? `${baseTextClasses} ${className}`
    : baseTextClasses;

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
      className={rootClasses}
    >
      <LanguageIcon className={iconClasses} />
      <span>{label}</span>
    </button>
  );
}
