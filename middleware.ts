import { locales } from "@/i18n";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: "en",
});

export function middleware(req: NextRequest) {
  let [_root, locale, ...segments] = req.nextUrl.pathname.split("/");
  locale = locale || "en";
  const path = "/" + segments.join("/");
  const isPublicPage =
    path === "/" ||
    path === "/account/registration" ||
    req.nextUrl.pathname === "/verify";

  if (!isPublicPage) {
    const sessionId = req.cookies.get("sessionId")?.value;
    if (!sessionId) return Response.redirect(new URL(`/${locale}`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/",
    "/verify",
    `/(en|pt|fr)/:path*`,

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
