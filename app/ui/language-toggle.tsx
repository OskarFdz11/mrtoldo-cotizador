"use client";

import { usePathname, useRouter } from "next/navigation";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

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
    }, 100);
  };

  return (
    <div className="flex items-center gap-2">
      {(LOCALES as readonly string[]).map((lng) => {
        const active = lng === currentLocale;
        return (
          <button
            key={lng}
            onClick={() => switchLanguage(lng)}
            className={`flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors ${
              active
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-pressed={active}
          >
            <GlobeAltIcon className="h-4 w-4" />
            <span className="font-medium">{lng.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
