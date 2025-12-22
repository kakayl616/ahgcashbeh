import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;

  const PUBLIC_DOMAIN = "steam-support.help";

  // Requests coming from the public domain
if (host.includes(PUBLIC_DOMAIN)) {
  // Allow profile pages
  if (pathname.startsWith("/profile")) {
    return NextResponse.next();
  }

  // Allow Next.js internal assets & data
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Block everything else
  return new NextResponse("Not Found", { status: 404 });
}
}