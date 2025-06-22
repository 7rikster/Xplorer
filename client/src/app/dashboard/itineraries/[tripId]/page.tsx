"use client";

import Loading from "@/app/loading";
import TripDetails from "@/components/trip-details";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/firebaseConfig";
import { parseTripData } from "@/lib/utils";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type Params = {
  tripId: string;
};

function ItineraryPage({ params }: { params: Promise<Params> }) {
  const [user] = useAuthState(auth);
  const { tripId } = use(params);
  const [trip, setTrip] = useState<Trip>();
  const [loading, setLoading] = useState(false);

  const fetchTripDetails = async () => {
    if (!user) return;
    const token = await user.getIdToken();
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/userTrip/get/${tripId}`,
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
          faqs: [],
          reviews: [],
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

  

  useEffect(() => {
    setLoading(true);
    void fetchTripDetails();
  }, [params]);

  console.log("Trip data: ", trip);

  if (loading) return <Loading />;

  console.log("Trip data: ", trip);

  return (
    <div className="min-h-screen flex flex-col items-center w-full pt-10 p-2 md:p-6 bg-gray-200 md:pl-20">
      <div className="hidden md:flex justify-between items-center w-full mb-2 md:mb-6">
        <Link href="/dashboard/itineraries">
          <Button className="cursor-pointer md:ml-0">
            <ArrowLeft /> Back to Itineraries
          </Button>
        </Link>
      </div>
      <TripDetails trip={trip} viewFaqs={false} viewReviews={false}  />
    </div>
  );
}

export default ItineraryPage;
