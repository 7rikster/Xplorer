"use client";

import NewTripForm from "@/components/new-trip-form";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";

interface TripData{
  imageUrls: string[];
  tripDetail: string;
  city: string;
  country: string;
  groupType: string;
  budget: string;

}

function AddNewTrip() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function saveTrip(data: TripData) {
    if (!user) return;
    setLoading(true);
    const token = await user.getIdToken();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/trip/create`,
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
      console.log("Trip created successfully:", response.data);
      setLoading(false);
      toast.success("Trip created successfully!");
      router.push(`/admin/trips/${response.data.data.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-start justify-start p-4 md:p-8 bg-gray-100 min-h-screen gap-6 md:gap-10 pb-20">
      <div className="flex flex-col items-start justify-start space-y-2 md:space-y-4">
        <Button
          className="cursor-pointer text-xs md:text-sm h-7 md:h-auto"
          onClick={() => router.push("/admin")}
        >
          <ArrowLeft /> Back to Dashboard
        </Button>
        <div>
          <h1 className="text-lg md:text-2xl font-bold">Add a New Trip</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Create a new AI generated trip by filling out the form below.
          </p>
        </div>
      </div>
      <section className="mt-2.5 w-full max-w-2xl mx-auto">
        <NewTripForm saveTrip={saveTrip} loading={loading}/>
      </section>
    </main>
  );
}

export default AddNewTrip;
