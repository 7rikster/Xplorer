"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import Loading from "@/app/loading";
import ItineraryDetails from "@/components/itineraryDetails";
import { Button } from "@/components/ui/button";
import { parseTripData } from "@/lib/utils";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

type Params = {
  tripId: string;
};

function SharedPage({ params }: { params: Promise<Params> }) {
  const { tripId } = use(params);
  const [trip, setTrip] = useState<Trip>();
  const [loading, setLoading] = useState(false);

  const fetchTripDetails = async () => {
    console.log("TripId: ", tripId);
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/sharedItinerary/get/${tripId}`
      );
      console.log("Trip details: ", response.data.data);
      const parsedTrip = parseTripData(response.data.data.tripDetail);
      if (parsedTrip && parsedTrip.name) {
        setTrip({
          ...parsedTrip,
          imageUrls: response.data.data.imageUrls
            ? response.data.data.imageUrls
            : [],
          faqs: [],
          reviews: [],
        });
      } else {
        console.log("HI");
        setTrip(undefined);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTripDetails();
  }, [params]);

  console.log("Trip data: ", trip);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-center w-full pt-12 p-2 md:p-6 bg-gray-200 md:pl-20">
      
      {trip ? (
        <ItineraryDetails
          itineraryId={tripId}
          trip={trip}
          viewFaqs={false}
          viewReviews={false}
        />
      ) : (
        <div className="flex items-center justify-center h-[80vh] w-full">
          <h1 className="text-2xl font-semibold">
            The Itinerary does not exist..{" "}
          </h1>
        </div>
      )}
    </div>
  );
}

export default SharedPage;
