import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const preferredLocale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  if (!isLocale(seg)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${preferredLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  if (seg !== preferredLocale) {
    const url = req.nextUrl.clone();
    const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/");
    url.pathname = `/${preferredLocale}${pathWithoutLocale}`.replace(
      /\/+/g,
      "/"
    );
    return NextResponse.redirect(url);
  }

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
