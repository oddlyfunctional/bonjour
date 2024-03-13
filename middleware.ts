import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionId = req.cookies.get("sessionId")?.value;
  if (!sessionId) return Response.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/chat/:path*", "/account/profile", "/api/:path*"],
};
