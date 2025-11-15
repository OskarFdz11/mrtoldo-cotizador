import { NextRequest, NextResponse } from "next/server";

const locales = ["es", "en"] as const;
const defaultLocale = "es";

const PUBLIC_PATHS = ["/login", "/"];

const PROTECTED_PREFIX = "/dashboard";

function extractOrDetectLocale(req: NextRequest): string {
  const pathname = req.nextUrl.pathname;
  const directLocale = locales.find(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );
  if (directLocale) return directLocale;

  const accept = req.headers.get("Accept-Language") || "";
  if (accept.includes("es")) return "es";
  if (accept.includes("en")) return "en";
  return defaultLocale;
}

function hasLocale(pathname: string) {
  return locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );
}

function hasSession(req: NextRequest): boolean {
  const cookies = req.cookies;
  return (
    cookies.has("authjs.session-token") ||
    cookies.has("__Secure-authjs.session-token") ||
    cookies.has("next-auth.session-token") ||
    cookies.has("__Secure-next-auth.session-token")
  );
}

function needsAuth(pathWithoutLocale: string) {
  if (PUBLIC_PATHS.includes(pathWithoutLocale)) return false;
  if (pathWithoutLocale.startsWith(PROTECTED_PREFIX)) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (!hasLocale(pathname)) {
    const locale = extractOrDetectLocale(req);
    const url = new URL(`/${locale}${pathname}`, req.url);
    return NextResponse.redirect(url);
  }

  const segments = pathname.split("/");
  const currentLocale = segments[1];
  const pathWithoutLocale = `/${segments.slice(2).join("/")}` || "/";

  if (needsAuth(pathWithoutLocale) && !hasSession(req)) {
    const loginUrl = new URL(`/${currentLocale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)",
  ],
};
