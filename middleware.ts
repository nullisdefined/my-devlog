import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/devlog/") &&
    !request.nextUrl.pathname.startsWith("/devlog/series/") &&
    !request.nextUrl.pathname.startsWith("/devlog/posts/") &&
    !request.nextUrl.pathname.startsWith("/devlog/categories/") &&
    !request.nextUrl.pathname.startsWith("/devlog/tags/") &&
    request.nextUrl.pathname !== "/devlog"
  ) {
    const newUrl = request.nextUrl.pathname.replace(
      "/devlog/",
      "/devlog/posts/"
    );
    return NextResponse.redirect(new URL(newUrl, request.url), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/devlog/:path*"],
};
