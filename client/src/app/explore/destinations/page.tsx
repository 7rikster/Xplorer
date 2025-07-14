"use client";

import PlaceSearchBox from "@/components/place-search-box";
import TopDestinations from "@/components/top-destinations";
import { Button } from "@/components/ui/button";
import { useDestination } from "@/context/destinationContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Destination() {
  const { place, setPlace } = useDestination();

  const router = useRouter();

  function handleExploreClick() {
    if (!place || !place.placeId) {
      toast.error("Please select a place from the search box");
      return;
    }
    if (place) {
      const queryParams = new URLSearchParams({
        location: place.location,
      }).toString();
      router.push(`destinations/${place.placeId}?${queryParams}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-100">
      <div className="w-full relative h-screen overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dqobuxkcj/image/upload/v1751788384/w48opuunhosimzgyljtn.jpg"
          alt="Tours background"
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-semibold text-white mb-2">
            Destinations
          </h1>
          <h3 className="text-lg md:text-xl text-white">
            Explore the world with us
          </h3>
        </div>
        <div className="absolute sm:top-[65%] top-[70%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex items-center gap-1 flex-col sm:flex-row sm:gap-4">
          <div className="w-[90vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] mx-auto bg-white rounded-lg shadow-lg">
            <PlaceSearchBox setPlace={setPlace} />
          </div>
          <Button className="cursor-pointer" onClick={handleExploreClick}>
            Explore
          </Button>
        </div>
      </div>
      <TopDestinations />
    </div>
  );
}

export default Destination;
