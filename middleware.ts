// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Look for the standard Supabase authentication cookie
  const hasAuthCookie = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token"),
    );

  // 1. Protect the main /chat route
  // If user goes exactly to /chat (no ID) and is NOT logged in -> redirect to login
  if (pathname === "/chat" && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Prevent logged-in users from seeing /login or /signup again
  if ((pathname === "/login" || pathname === "/signup") && hasAuthCookie) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  // 3. Shared Links like /chat/12345 are intentionally allowed to pass through
  // so that unauthenticated users can view the shared chat!

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/chat", "/chat/:path*", "/login", "/signup"],
};
