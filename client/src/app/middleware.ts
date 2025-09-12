import { NextResponse } from "next/server";

export function middleware() {

  const isAuthenticated = false;

  if (!isAuthenticated) {
    return NextResponse.redirect("/auth/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/generate", "/profile"],
};
