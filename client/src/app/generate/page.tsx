"use client";

import NewTripForm from "@/components/new-trip-form";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";

interface TripData {
  imageUrls: string[];
  tripDetail: string;
  city: string;
  country: string;
  groupType: string;
  budget: string;
}

function Generate() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [credits, setCredits] = useState(0);

  async function saveTrip(data: TripData) {
    if (!user) return;
    setLoading(true);
    const token = await user.getIdToken();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/userTrip/create`,
        {
          tripDetail: data.tripDetail,
          imageUrls: data.imageUrls,
          city: data.city,
          country: data.country,
          groupType: data.groupType,
          budget: data.budget,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/credits`,
        { credits: Number(credits) - 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Trip created successfully:", response.data);
      setLoading(false);
      toast.success("Trip created successfully!");
      router.push(`/dashboard/itineraries/${response.data.data.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      setLoading(false);
    }
  }

  async function fetchCredits() {
    setLoading(true);
    const token = await user?.getIdToken();
    if (!token) {
      console.error("User is not authenticated");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/credits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.data) {
        setCredits(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchCredits();
    }
  }, []);

  return (
    <main className="flex flex-col items-start justify-start p-4 md:p-8 bg-gray-100 min-h-screen gap-6 md:gap-10 pb-20">
      <div className="flex items-center justify-between w-full mx-auto">
        <div className="flex flex-col items-start justify-start space-y-2 md:space-y-4">
          <Button
            className="cursor-pointer text-xs md:text-sm h-7 md:h-auto"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft /> Back to Dashboard
          </Button>
          <div>
            <h1 className="text-lg md:text-2xl font-bold">
              Generate a new Itinerary
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Create a new AI generated Itinerary by filling out the form below.
            </p>
          </div>
        </div>
        <div className="md:p-5 p-3  bg-white rounded-lg shadow-lg inline-block">
          <h1 className="text-center text-2xl sm:text-4xl font-bold">
            {credits}
          </h1>
          <h1 className="text-md sm:text-xl font-semibold">Credits</h1>
        </div>
      </div>
      <section className="mt-2.5 w-full max-w-2xl mx-auto">
        <NewTripForm saveTrip={saveTrip} loading={loading} />
      </section>
    </main>
  );
}

export default Generate;
