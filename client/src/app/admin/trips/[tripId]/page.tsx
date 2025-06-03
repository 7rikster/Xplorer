"use client";

import Loading from "@/app/loading";
import TripDetails from "@/components/trip-details";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/firebaseConfig";
import { getFirstWord, parseTripData } from "@/lib/utils";
import axios from "axios";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type Params = {
  tripId: string;
};

function TripPage({ params }: { params: Promise<Params> }) {
  const [user] = useAuthState(auth);
  const { tripId } = use(params);
  const [trip, setTrip] = useState<Trip>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/trip/get/${tripId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log("Trip details: ",response.data.data);
        const parsedTrip = parseTripData(response.data.data.tripDetail);
        if (parsedTrip && parsedTrip.name) {
          setTrip({
            id: response.data.data.id,
            ...parsedTrip,
            imageUrls: response.data.data.imageUrls
              ? response.data.data.imageUrls
              : [],
            createAt: response.data.data.createAt,
          });
        } else {
          setTrip(undefined);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    setLoading(true);
    void fetchTripDetails();
  }, [params]);

  console.log("Trip data: ", trip);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-center w-full p-2 md:p-8 bg-gray-200">
      <div className="flex justify-between items-center w-full mb-2 md:mb-6">
        <Link href="/admin">
          <Button className="cursor-pointer">
            <ArrowLeft /> Back to Dashboard
          </Button>
        </Link>
      </div>
      <TripDetails trip={trip} />
    </div>
  );
}

export default TripPage;
