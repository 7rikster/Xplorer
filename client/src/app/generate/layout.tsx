"use client";

import { useUser } from "@/context/authContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";

export default function GenerateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading: authLoading } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(user);
    if (authLoading) return;
    if (!user) {
      setTimeout(() => {
        toast("You need to be logged in to access this page");
        redirect(`/auth/login?redirect=${encodeURIComponent("/generate")}`);
      }, 100);
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);
  if (loading) return <Loading />;
  return <main>{children}</main>;
}
