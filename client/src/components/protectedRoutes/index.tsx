"use client";

import { useUser } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { user, loading: authLoading } = useUser();
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user && !authLoading) {
      console.log(user);
      toast("You need to be logged in to access this page.");
      router.push(
        `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      toast("You do not have permission to access this page.");
      if (user?.role === "ADMIN") router.push("/admin");
      else router.push("dashboard");
      return;
    }

    setChecking(false);
  }, [authLoading, user, allowedRoles, redirectTo, router]);

  if (authLoading || checking) return <Loading />;
  return <>{children}</>;
}
