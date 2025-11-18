"use client";

import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "@/app/ui/i18n-provider";

const LOCALE_COOKIE = "NEXT_LOCALE";

function withLocalePrefix(locale: string, href: string) {
  // URLs externas
  if (/^https?:\/\//i.test(href)) return href;
  // Ya tiene prefijo de locale
  if (/^\/(es|en)(\/|$)/.test(href)) return href;
  // Agregar prefijo
  if (href.startsWith("/")) return `/${locale}${href}`;
  return `/${locale}/${href}`.replace(/\/{2,}/g, "/");
}

// Leer cookie del lado cliente
function getLocaleFromCookie(): string {
  if (typeof document === "undefined") return "es";
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  return match?.[1] || "es";
}

export function useLocaleRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useI18n();

  // Usar cookie como fuente de verdad si está disponible
  const effectiveLocale = getLocaleFromCookie();

  return {
    locale: effectiveLocale,
    pathname,
    push: (href: string) => {
      const finalHref = withLocalePrefix(effectiveLocale, href);
      router.push(finalHref);
    },
    replace: (href: string) => {
      const finalHref = withLocalePrefix(effectiveLocale, href);
      router.replace(finalHref);
    },
    prefetch: (href: string) =>
      router.prefetch(withLocalePrefix(effectiveLocale, href)),
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
  };
}
