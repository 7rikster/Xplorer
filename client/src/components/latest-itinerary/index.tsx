import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { parseTripData } from "@/lib/utils";

function LatestItinerary() {
  const [loading, setLoading] = useState(true);
  const [latestItinerary, setLatestItinerary] = useState<Trip | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    async function fetchLatestItinerary() {
      setLoading(true);
      try {
        const token = await user?.getIdToken();
        if (!token) {
          console.error("User is not authenticated. Please log in.");
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/latest-itinerary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLatestItinerary({
          id: response.data.data.id,
          ...parseTripData(response.data.data.tripDetail),
          imageUrls: response.data.data.imageUrls || [],
          createAt: response.data.data.createdAt,
        });
      } catch (error) {
        console.error("Error fetching latest itinerary:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchLatestItinerary();
  }, []);

  // console.log("Latest Itinerary:", latestItinerary);

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-md sm:h-full">
      <h2 className="text-2xl font-semibold mb-2">Latest Itinerary</h2>
      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : latestItinerary ? (
        <div className="flex relative flex-col items-center justify-between h-full">
          <Image
            src={latestItinerary.imageUrls[0] || "/placeholder.png"}
            alt="Trip Image"
            width={500}
            height={400}
            className=" object-cover rounded-lg h-60"
          />
          <div className="absolute top-4 left-4">
            <h1 className="text-gray-100 text-xl md:text-2xl font-semibold">
              {latestItinerary.location?.city},{" "}
              {latestItinerary.location?.country}
            </h1>
            <h1 className="text-gray-100 text-lg  ">
              {latestItinerary?.groupType}, {latestItinerary?.travelStyle}
            </h1>
          </div>
          <div className="absolute top-48 left-4 right-4 justify-between flex items-center gap-4 ">
            <h1 className="text-gray-100 text-lg flex">
              <CalendarDays className="mr-2" /> {latestItinerary?.duration}{" "}
              {latestItinerary?.duration === 1 ? "day" : "days"} trip
            </h1>
            <Link href={`/dashboard/itineraries/${latestItinerary.id}`}>
              <Button className="cursor-pointer h-8 w-25 sm:w-auto sm:h-9">
                View Itinerary
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full ">
          <p className="text-gray-500">No itineraries found.</p>
          <p className="text-gray-500">Create an Itinerary to see it here!</p>
          <Link href="/generate" className="mt-2 cursor-pointer">
            <Button className="cursor-pointer">Create an Itinerary</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default LatestItinerary;
