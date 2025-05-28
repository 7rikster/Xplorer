"use client";

import { Button } from "@/components/ui/button";
import { getFirstWord, parseTripData } from "@/lib/utils";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type TripDetailsProps = {
  trip?: Trip;
};

function TripDetails({ trip }: TripDetailsProps) {
  const router = useRouter();

  const {
    name,
    duration,
    itinerary,
    travelStyle,
    groupType,
    budget,
    interests,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
    location,
    imageUrls,
  } = trip || {};

  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-100 !text-pink-500" },
    { text: groupType, bg: "!bg-blue-100 !text-blue-500" },
    { text: budget, bg: "!bg-purple-100 !text-purple-500" },
    { text: interests, bg: "!bg-green-100 !text-green-800" },
  ];

  return (
    <div>
      
      <div className="bg-white p-8 rounded-lg shadow-md max-w-5xl w-full">
        <header className="mb-6">
          <h1 className="text-4xl font-bold mb-4">{trip?.name}</h1>
          <div className="flex gap-4">
            <p className="flex items-center text-md text-gray-600">
              <CalendarDays className="w-5 h-5 mr-1" />
              {duration} day plan
            </p>
            <p className="flex items-center text-md text-gray-600">
              <MapPin className="w-5 h-5 mr-1" />
              {location?.city}, {location?.country}
            </p>
          </div>
        </header>
        <div className="grid grid-cols-1 grid-rows-3 md:grid-rows-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-6 h-100">
          {imageUrls &&
            imageUrls.length > 0 &&
            imageUrls.map((imageUrl, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden shadow-md ${
                  index === 0
                    ? "sm:col-span-2 sm:row-span-2"
                    : "col-span-1 row-span-1"
                }`}
              >
                <Image
                    width={500}
                    height={300}
                  src={imageUrl}
                  alt={`Trip Image ${index + 1}`}
                  className="w-full object-cover h-full"
                />
              </div>
            ))}
        </div>
        <div className="flex justify-between items-start mt-8">
          <p className=" text-sm md:text-sm md:font-semibold flex flex-wrap  gap-4">
            {pillItems.map((item, index) => (
              <span
                key={index}
                className={`rounded-full px-4 py-1 mr-1 mb-1 ${item.bg} text-xs md:text-sm`}
              >
                {getFirstWord(item.text)}
              </span>
            ))}
          </p>
          <p className="font-bold flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                className="w-2 h-2 sm:w-4 sm:h-4 text-yellow-400"
              >
                <path
                  fill="#FFD43B"
                  d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                />
              </svg>
            ))}
            <span className="rounded-full px-4 py-1 ml-2  text-xs md:text-sm bg-yellow-100 text-yellow-600">
              4.9/5.0
            </span>
          </p>
        </div>
        <section className="mt-8">
            <h1 className="text-3xl font-semibold">{duration}-Day {location?.city} {travelStyle}</h1>
        </section>
      </div>
    </div>
  );
}

export default TripDetails;
