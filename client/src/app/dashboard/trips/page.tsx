"use client"

import { useUser } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

function ClientDashboard() {
  const router = useRouter();
  const {user} = useUser();

  useEffect(()=>{
    if(user?.role === "ADMIN"){
      toast.error("You are not allowed to access this page");
      router.push("/admin");
    }
  },[user, router])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-xl font-semibold mb-4">
        This is the Client Trips page
      </h1>
      <h1 className="text-6xl font-bold">Coming soon</h1>
    </div>
  );
}

export default ClientDashboard;
