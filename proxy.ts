import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nếu user truy cập đúng "/"
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/vi", request.url));
  }

  return NextResponse.next();
}

// Chỉ áp dụng cho root
export const config = {
  matcher: "/",
};
