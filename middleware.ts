import { NextRequest, NextResponse } from "next/server";

const locales = ["es", "en"] as const;
const defaultLocale = "es";

function getLocale(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return pathname.split("/")[1];

  const acceptLanguage = request.headers.get("Accept-Language") || "";
  if (acceptLanguage.includes("es")) return "es";
  if (acceptLanguage.includes("en")) return "en";

  return defaultLocale;
}

function hasAuthCookie(req: NextRequest): boolean {
  return (
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("next-auth.session-token") ||
    req.cookies.has("__Secure-next-auth.session-token")
  );
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip API routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Verificar si pathname ya tiene locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Redirect si no hay locale
    const locale = getLocale(req);
    const newUrl = new URL(`/${locale}${pathname}`, req.url);
    return NextResponse.redirect(newUrl);
  }

  // Auth logic para rutas protegidas
  const currentLocale = pathname.split("/")[1];
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");

  if (pathWithoutLocale.startsWith("/dashboard") && !hasAuthCookie(req)) {
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
