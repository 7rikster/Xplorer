"use client";

import { useUser } from "@/context/authContext";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../../loading";

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading: authLoading } = useUser();

  useEffect(() => {
    console.log(user);
    if (authLoading) return;
    if (user) {
      setTimeout(() => {
        // toast("User already signed in");
        redirect("/explore");
      }, 100);
    } 
  }, [authLoading]);
  return <main>{children}</main>;
}
