import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mantén todo inline para minimizar el bundle del Edge Function
const locales = ["es", "en"] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = "es";

function isLocale(v?: string): v is Locale {
  return !!v && (locales as readonly string[]).includes(v as any);
}

// Cookies de sesión que puede establecer NextAuth (v5/v4, con y sin __Secure-)
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

  // Ignora assets, API y archivos
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return;
  }

  const seg = pathname.split("/")[1];

  // 1) Inyectar locale si falta
  if (!isLocale(seg)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // 2) Bloqueo ligero de rutas protegidas (basado en cookie)
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
