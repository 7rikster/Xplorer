"use client";

import Loading from "@/app/loading";
import Map from "@/components/map";
import { useDestination } from "@/context/destinationContext";
import axios from "axios";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

type Params = {
  placeId: string;
};
type Attractions = {
  address: string;
  description: string;
  imageUrl: string;
  longitude: string;
  latitude: string;
  name: string;
  rating: string;
};
interface DestinationDetails {
  id: string;
  imageUrls: string[];
  placeId: string;
  city: string;
  country: string;
  attractions?: Attractions[];
}

function DestinationDetailsPage({ params }: { params: Promise<Params> }) {
  const { placeId } = use(params);
  const { place, setPlace } = useDestination();
  const [destinationDetails, setDestinationDetails] =
    useState<DestinationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  async function fetchDestinationDetails() {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/destinationDetails/get`,
        {
          placeId: placeId,
          city: place?.location.split(",")[0] || "",
          country: place?.location.split(",").pop() || "",
        }
      );
      setDestinationDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching destination details:", error);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/destinationDetails/get`,
        {
          placeId: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
          city: "Paris",
          country: "France",
        }
      );

      setDestinationDetails(response.data.data);
      toast.error(
        "There was an error fetching destination details. This is just a mock response for now."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!place) {
      const location = searchParams.get("location");
      const latitude = parseFloat(searchParams.get("lat") || "0");
      const longitude = parseFloat(searchParams.get("lng") || "0");

      if (location) {
        setPlace({
          location,
          placeId,
          latitude,
          longitude,
        });
      }
    }
    if (place) {
      fetchDestinationDetails();
    }
  }, [place, placeId, searchParams]);

  console.log("Destination:", destinationDetails);

  if (loading) {
    return <Loading text="Fetching Destination details..." />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-100">
      <div className="w-full relative h-screen overflow-hidden">
        <Image
          src={
            destinationDetails?.imageUrls[0] ||
            "https://res.cloudinary.com/dqobuxkcj/image/upload/v1751788384/w48opuunhosimzgyljtn.jpg"
          }
          alt="Tours background"
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-semibold text-white mb-2">
            {destinationDetails?.city}, {destinationDetails?.country}
          </h1>
        </div>
      </div>
      <div className="p-4 mt-4 w-full">
        <h2 className="text-4xl text-center md:text-start md:text-4xl font-semibold mb-2 md:mb-4">
          Attractions in {destinationDetails?.city},{" "}
          {destinationDetails?.country}
        </h2>
        {destinationDetails?.attractions &&
        destinationDetails.attractions.length > 0 ? (
          <div className="mt-4">
            <Map
              mapPins={destinationDetails.attractions.filter((attraction) => (
                parseFloat(attraction.latitude) && parseFloat(attraction.longitude)
              )).map((attraction) => ({
                latitude: parseFloat(attraction.latitude),
                longitude: parseFloat(attraction.longitude),
                place: attraction.name,
              }))}
              zoom={11}
            />
          </div>
        ) : (
          <p className="text-center md:text-start text-gray-500">No attractions found.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {destinationDetails?.attractions?.map((attraction, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow grid grid-cols-1 lg:grid-cols-3 lg:items-center lg:justify-center  lg:gap-4"
            >
              <div className="lg:hidden">
                <Image
                  src={
                    attraction.imageUrl ||
                    destinationDetails?.imageUrls[1] ||
                    ""
                  }
                  alt={attraction.name}
                  width={400}
                  height={200}
                  className="w-full h-60 object-cover rounded mb-4"
                />
              </div>
              <div className="col-span-2">
                <h3 className="font-semibold text-2xl">{attraction.name}</h3>
                <h3 className="font-semibold text-gray-500">
                  {attraction.address}
                </h3>
                <p className="mt-2 text-sm md:text-[1rem]">
                  {attraction.description}
                </p>
              </div>
              <div className="hidden lg:block">
                <Image
                  src={
                    attraction.imageUrl ||
                    destinationDetails?.imageUrls[1] ||
                    ""
                  }
                  alt={attraction.name}
                  width={400}
                  height={200}
                  className="w-full h-60 object-cover rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DestinationDetailsPage;
