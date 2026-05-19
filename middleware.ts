import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Airtight Next.js Edge Middleware for route protection and redirection.
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email");

  const isDashboardPage = pathname.startsWith("/dashboard");

  // 1. If user is authenticated and attempts to access auth gates, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. If user is NOT authenticated and attempts to access protected dashboard, redirect to login
  if (!token && isDashboardPage) {
    // Save search params if needed, but simple redirect is clean and standard
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Limit middleware to run only on auth-related and dashboard routes for optimal performance
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ],
};
