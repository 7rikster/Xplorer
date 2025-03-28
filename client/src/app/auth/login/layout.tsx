"use client";

import { useUser } from "@/context/authContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../loading";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading: authLoading } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(user);
    if (authLoading) return;
    if (user) {
      setTimeout(() => {
        toast("User already signed in");
        redirect("/explore");
      }, 100);
    } else {
      setLoading(false);
    }
  }, [authLoading]);
  if (loading) return <Loading />;
  return <main>{children}</main>;
}
