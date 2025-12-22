import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;

  const PUBLIC_DOMAINS = [
    "steam-support.help",
    "www.steam-support.help"
  ];

  if (PUBLIC_DOMAINS.some(d => host.includes(d))) {
    // Allow profile pages
    if (pathname.startsWith("/profile")) {
      return NextResponse.next();
    }

    // Allow Next.js internals, APIs, and static assets
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/images") ||
      pathname.startsWith("/screenshots") ||
      pathname.startsWith("/favicon") ||
      pathname.endsWith(".png") ||
      pathname.endsWith(".jpg") ||
      pathname.endsWith(".jpeg") ||
      pathname.endsWith(".webp") ||
      pathname.endsWith(".svg")
    ) {
      return NextResponse.next();
    }

    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}
