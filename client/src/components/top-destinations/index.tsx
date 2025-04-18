"use client";

import { useEffect, useState } from "react";
import DestinationsCard from "./card";
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
}

function TopDestinations() {
  const [list, setList] = useState<DestinationList[] | []>([]);

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
  }

  useEffect(() => {
    fetchDestinations();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 px-2">
      <div className="flex flex-col items-center justify-center mb-8 sm:mb-16 space-y-1">
        <h1 className="text-md sm:text-lg font-semibold text-gray-700">
          DESTINATIONS
        </h1>
        <h1 className="text-2xl sm:text-4xl font-bold text-center">
          Explore Top Destinations
        </h1>
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <Carousel
          className={`w-screen ${"md:w-[85%]"} h-[150px] md:h-max px-3 sm:px-0`}
          opts={{
            slidesToScroll: 4,
            loop: false,
          }}
          plugins={[]}
        >
          <CarouselContent
            className={` md:overflow-x-visible`}
            style={{ scrollbarWidth: "none" }}
          >
            {list &&
              list[0] &&
              list.length > 0 &&
              list.map((item, index) => (
                <CarouselItem
                  key={index}
                  className={
                    "basis-1/3 md:basis-1/6 lg:basis-1/6 h-70  rounded-xl overflow-x-hidden"
                  }
                >
                  <div className={`${"w-max"}`}>
                    <DestinationsCard
                      key={index}
                      name={item.name}
                      photoUrl={item.photoUrl}
                      rating={item.rating}
                    />
                  </div>
                </CarouselItem>
              ))}
            {list.length == 0 &&
              Array.from({ length: 12 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className={
                    "basis-1/3 md:basis-1/4 lg:basis-1/6 sm:h-70  rounded-xl overflow-x-hidden"
                  }
                >
                  <div className="w-max ">
                    <DestinationsCard
                      key={index}
                      name="Paris"
                      photoUrl="https://res.cloudinary.com/dqobuxkcj/image/upload/v1744534530/u6c4rwk7yhakk0b3oe6h.webp"
                      rating={5}
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
