import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mantenerlo inline para ser muy liviano
const locales = ["es", "en"] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = "es";
const LOCALE_COOKIE = "NEXT_LOCALE";

function isLocale(v?: string): v is Locale {
  return !!v && (locales as readonly string[]).includes(v as any);
}

const SESSION_COOKIE_CANDIDATES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

function hasSessionCookie(req: NextRequest) {
  return SESSION_COOKIE_CANDIDATES.some(
    (name) => !!req.cookies.get(name)?.value
  );
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return;
  }

  const seg = pathname.split("/")[1];

  // 1) Inyectar locale preferido (cookie) si falta
  if (!isLocale(seg)) {
    const cookiePref = req.cookies.get(LOCALE_COOKIE)?.value;
    const chosen = isLocale(cookiePref) ? cookiePref : defaultLocale;
    const url = req.nextUrl.clone();
    url.pathname = `/${chosen}${pathname}`;
    return NextResponse.redirect(url);
  }

  // 2) Bloqueo ligero de rutas protegidas (basado solo en cookie)
  if (pathname.startsWith(`/${seg}/dashboard`) && !hasSessionCookie(req)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${seg}/login`;
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
