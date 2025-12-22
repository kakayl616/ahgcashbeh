import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;

  const PUBLIC_DOMAINS = [
    "steam-support.help",
    "www.steam-support.help"
  ];

  // Requests coming from the public domain
  if (PUBLIC_DOMAINS.some(d => host.includes(d))) {
    // Allow profile pages
    if (pathname.startsWith("/profile")) {
      return NextResponse.next();
    }

    // Allow Next.js internal assets & API
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon") ||
      pathname.startsWith("/api")
    ) {
      return NextResponse.next();
    }

    // Block everything else on public domain
    return new NextResponse("Not Found", { status: 404 });
  }

  // Non-public domains (Railway, internal) → allow all
  return NextResponse.next();
}
