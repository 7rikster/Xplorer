"use client";

import { useEffect, useState } from "react";
import DestinationsCard from "./card";
import LoadingCard from "../loading-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from "axios";

interface DestinationList {
  id: string;
  name: string;
  rating: number;
  photoUrl: string;
  publicId: string;
  placeId: string;
  location: string;
}

function TopDestinations() {
  const [list, setList] = useState<DestinationList[] | []>([]);
  const [loading, setLoading] = useState(true);

  async function fetchDestinations() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/destination/get`,
        {}
      );
      setList(response.data.data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDestinations();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center pt-10 pb-6 px-2   ">
      <div className="flex flex-col items-center justify-center mb-8 sm:mb-12 md:mb-16 space-y-1">
        <h1 className="text-md sm:text-lg font-semibold text-gray-700">
          DESTINATIONS
        </h1>
        <h1 className="text-2xl sm:text-4xl font-bold text-center">
          Explore Top Destinations
        </h1>
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center ">
        <Carousel
          className={`w-full md:w-[85%] h-[194px] sm:h-max px-3 sm:px-0`}
          opts={{
            slidesToScroll: 4,
            loop: false,
          }}
          plugins={[]}
        >
          <CarouselContent
            className={` md:overflow-x-visible `}
            style={{ scrollbarWidth: "none" }}
          >
            {list &&
              list[0] &&
              list.length > 0 &&
              list.map((item, index) => (
                <CarouselItem
                  key={index}
                  className={
                    "basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 h-50 sm:h-82"
                  }
                >
                  <div className={`${"w-full pt-2"}`}>
                    <DestinationsCard
                      key={index}
                      name={item.name}
                      photoUrl={item.photoUrl}
                      rating={item.rating}
                      location={item.location}
                      placeId={item.placeId}
                    />
                  </div>
                </CarouselItem>
              ))}
            {loading &&
              Array.from({ length: 12 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className={
                    "basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 h-50 sm:h-74 "
                  }
                >
                  <div className="w-full pt-2">
                    <LoadingCard />
                  </div>
                </CarouselItem>
              ))}

            {list.length == 0 &&
              !loading &&
              Array.from({ length: 12 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className={
                    "basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 h-50 sm:h-74 "
                  }
                >
                  <div className="w-full pt-2">
                    <DestinationsCard
                      key={index}
                      name="Paris"
                      photoUrl="https://res.cloudinary.com/dqobuxkcj/image/upload/v1744534530/u6c4rwk7yhakk0b3oe6h.webp"
                      rating={5}
                      location="France"
                      placeId="ChIJD7fiBh9u5kcRYJSMaMOCCwQ"
                    />
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <div className="hidden md:flex">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default TopDestinations;
