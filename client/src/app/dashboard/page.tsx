"use client";

import CreditsPurchasedCard from "@/components/creditsPurchased-card";
import ExpenseCard from "@/components/expense-card";
import LatestItinerary from "@/components/latest-itinerary";
import ProfileCard from "@/components/profile-card";
import UpcomingTrip from "@/components/upcoming-trip";
import { useUser } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

function ClientDashboard() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user?.role === "ADMIN") {
      toast.error("You are not allowed to access this page");
      router.push("/admin");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-200 md:pl-22 px-2 sm:p-4 pt-7 md:p-4">
      <div className="w-full">
        <ProfileCard />
      </div>
      <div className="flex-1 w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <div className="grid grid-cols-2 col-span-1 sm:col-span-2 sm:h-full sm:w-full gap-4 sm:grid-rows-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2 h-full w-full  gap-4 rounded-lg sm:row-span-2">
            <UpcomingTrip />
            <LatestItinerary/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2 h-full w-full  gap-4 rounded-lg ">
            <ExpenseCard/>
            <CreditsPurchasedCard/>
          </div>
        </div>
        <div className="bg-black h-full"></div>
      </div>
    </div>
  );
}

export default ClientDashboard;
