import { NextResponse } from "next/server";

export function middleware(request) {
  // 1. Get the token from cookies (Middleware can't read localStorage)
  const token = request.cookies.get("access")?.value;
  const { pathname } = request.nextUrl;

  // 2. Define which paths are public (login and signup)
  const isPublicPath = pathname === "/login" || pathname === "/signup";

  // 3. Logic: If no token and trying to access a private path -> Redirect to Login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. Logic: If has token and trying to access Login -> Redirect to Dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/employees", request.url));
  }

  return NextResponse.next();
}

// 5. Tell Next.js which routes this should run on
export const config = {
  matcher: [
    "/employees/:path*",
    "/attendance/:path*",
    "/login",
    "/signup",
  ],
};