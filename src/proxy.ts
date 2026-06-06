import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "lojai_admin";

// No customer login anymore — only the /admin area is gated, by a single
// shared password stored in the ADMIN_PASSWORD env var.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
  const expected = process.env.ADMIN_PASSWORD;
  const isAuthed = !!expected && cookie === expected;

  if (!isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar-admin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Only run on the admin area; everything else is fully public (guest store).
  matcher: ["/admin", "/admin/:path*"],
};
