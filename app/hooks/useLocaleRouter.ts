"use client";

import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "@/app/ui/i18n-provider";

function withLocalePrefix(locale: string, href: string) {
  // deja intacto si ya trae http(s)
  if (/^https?:\/\//i.test(href)) return href;
  // ya trae locale
  if (/^\/(es|en)(\/|$)/.test(href)) return href;
  // fuerza prefijo
  if (href.startsWith("/")) return `/${locale}${href}`;
  return `/${locale}/${href}`.replace(/\/{2,}/g, "/");
}

export function useLocaleRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useI18n();

  return {
    locale,
    pathname,
    push: (href: string) => router.push(withLocalePrefix(locale, href)),
    replace: (href: string) => router.replace(withLocalePrefix(locale, href)),
    prefetch: (href: string) => router.prefetch(withLocalePrefix(locale, href)),
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,
  };
}
