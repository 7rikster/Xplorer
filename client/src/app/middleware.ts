import { useUser } from "@/context/authContext";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { user } = useUser();

  const isAuthenticated = false;

  if (!isAuthenticated) {
    return NextResponse.redirect("/auth/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/generate", "/profile"],
};
