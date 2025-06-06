"use client";

import Loading from "@/app/loading";
import Map from "@/components/map";
import TripDetails from "@/components/trip-details";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import getPlacePhoto from "@/lib/placePhoto";
import { getFirstWord, parseTripData } from "@/lib/utils";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

type Params = {
  tripId: string;
};

function ClientTripPage({ params }: { params: Promise<Params> }) {
  const { tripId } = use(params);
  const [trip, setTrip] = useState<Trip>();
  const [loading, setLoading] = useState(true);
  const [hotelPhoto, setHotelPhoto] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>(
    {}
  );

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
    accommodation,
  } = trip || {};

  const pillItems = [
    { text: travelStyle, bg: "bg-blue-100 text-blue-600" },
    { text: groupType, bg: "bg-green-100 text-green-600" },
    { text: budget, bg: "bg-yellow-100 text-yellow-600" },
    { text: interests, bg: "bg-red-100 text-red-600" },
  ];

  const toggleDay = (index: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/trip/get/${tripId}`
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

  useEffect(() => {
    if (accommodation) {
      const fetchPhoto = async () => {
        const url = await getPlacePhoto({
          query: accommodation.hotelName,
          latitude: location?.coordinates[0] || 0,
          longitude: location?.coordinates[1] || 0,
        });
        setHotelPhoto(url);
      };

      // fetchPhoto();
    }
  }, [accommodation]);

  console.log("Trip data: ", trip);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-center w-full bg-gray-200">
      <div className="w-full relative h-[95vh] overflow-hidden">
        <Image
          src={
            trip?.imageUrls[0]! ||
            "https://res.cloudinary.com/dqobuxkcj/image/upload/v1749151328/neikdmqtbo8mfp8y91fn.jpg"
          }
          alt="Tours background"
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-semibold text-white mb-2">
            {location?.city}, {location?.country}
          </h1>
        </div>
      </div>

      <div className="relative flex justify-center mt-[-3rem]">
        <div className="relative bg-white rounded-lg shadow-lg p-2 px-4 md:px-8 md:py-6 left-1/2 transform -translate-x-1/2 ">
          <div className="flex flex-col lg:flex-row md:gap-3 items-center">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-semibold font-serif ">
              {name?.split(":")[0]}
              {":  "}
            </h1>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-semibold font-serif">
              {" "}
              {name?.split(":")[1]}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center mt-4 gap-5 w-full p-2 sm:p-5">
        <div className="flex-1 bg-white rounded-lg shadow-lg p-3 sm:p-6">
          <section>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold">
              {duration}-Day {location?.city} {travelStyle}
            </h1>
            <p className="text-gray-500 mt-1 text-md sm:text-xl md:text-2xl">
              {budget}, {groupType} and {interests}
            </p>
            <p className="mt-4 text-sm sm:text-md md:text-lg px-2 sm:px-4">
              {description}
            </p>
          </section>
          <section className="mt-4">
            <div className="grid grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 gap-4 h-100 sm:h-80 px-2 sm:px-4">
              <div className="rounded-lg overflow-hidden shadow-md col-span-1 row-span-1">
                <Image
                  src={
                    trip?.imageUrls[1]! ||
                    "https://res.cloudinary.com/dqobuxkcj/image/upload/v1749151328/neikdmqtbo8mfp8y91fn.jpg"
                  }
                  alt={`Image of ${name}`}
                  width={400}
                  height={300}
                  objectFit="cover"
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md col-span-1 row-span-1">
                <Image
                  src={
                    trip?.imageUrls[2]! ||
                    "https://res.cloudinary.com/dqobuxkcj/image/upload/v1749151328/neikdmqtbo8mfp8y91fn.jpg"
                  }
                  alt={`Image of ${name}`}
                  width={400}
                  height={300}
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start mt-4 gap-1 sm:mt-6 px-4">
              <p className=" text-xs md:text-sm md:font-semibold flex flex-wrap gap-1  sm:gap-4">
                {pillItems.map((item, index) => (
                  <span
                    key={index}
                    className={`rounded-full px-4 py-1 mr-1 ${item.bg} text-xs md:text-sm`}
                  >
                    {getFirstWord(item.text)}
                  </span>
                ))}
              </p>
              <p className="font-bold flex items-center ml-auto">
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
          </section>
          <section className="mt-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1">
              Accommodation
            </h2>
            <div className="flex items-center gap-4 justify-between px-2 sm:px-3">
              <div className="w-full ">
                <h3 className="text-lg sm:text-lg md:text-2xl mb-1 font-semibold flex items-center justify-between">
                  {accommodation?.hotelName}
                  <span className="sm:mr-10">
                    <span className="font-bold">
                      {accommodation?.pricePerNight}
                    </span>
                    /night
                  </span>
                </h3>
                <p className=" flex items-center">
                  {Array.from({ length: accommodation?.stars }, (_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      className="w-3 h-3 sm:w-3 sm:h-3 text-yellow-400"
                    >
                      <path
                        fill="#FFD43B"
                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                      />
                    </svg>
                  ))}
                </p>
                <p className="text-gray-600 mt-2 text-sm sm:text-md md:text-lg">
                  {accommodation?.location}
                </p>

                <div className="sm:w-2/3">
                  <h3 className="text-lg font-semibold mt-1">Amenities:</h3>
                  <ul className="list-disc list-inside text-gray-600 text-sm sm:text-[1rem] columns-2 gap-x-4">
                    {accommodation?.amenities?.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {hotelPhoto && (
                <Image
                  src={hotelPhoto}
                  alt="Hotel"
                  width={200}
                  height={200}
                  className="rounded-lg shadow-md hidden sm:block"
                />
              )}
            </div>
          </section>
          <section className="mt-4 sm:mt-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Itinerary
            </h1>
            <div className="flex flex-col gap-3 sm:gap-5 mt-2 sm:mt-4">
              {itinerary?.map((day, index) => (
                <div
                  key={index}
                  className="px-2 sm:px-4 bg-gray-100 rounded-lg shadow-sm"
                >
                  <div
                    className=" py-2 sm:py-4 flex items-center gap-3 sm:gap-12 cursor-pointer"
                    onClick={() => toggleDay(index)}
                  >
                    <h2 className="text-md sm:text-xl font-semibold">
                      DAY {day.day}
                    </h2>
                    <h3 className="font-semibold text-md sm:text-lg">
                      {day.location}
                    </h3>
                    <span className="ml-auto">
                      {expandedDays[index] ? (
                        <ChevronUp className="w-3 h-3 sm:w-5 sm:h-5 transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="w-3 h-3 sm:w-5 sm:h-5 transition-transform duration-300" />
                      )}
                    </span>
                  </div>
                  <AnimatePresence initial={false}>
                    {expandedDays[index] && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="list-disc list-inside px-3 pb-2 sm:pb-4">
                          {day.activities.map((activity, activityIndex) => (
                            <li
                              key={activityIndex}
                              className="mt-1 text-sm md:text-[1rem]"
                            >
                              <span className="font-semibold">
                                {activity.time}
                              </span>
                              : {activity.description}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
          <section className="mt-6 sm:mt-8">
            <h1 className="text-xl sm:text-2xl font-semibold">
              Best Time to Visit
            </h1>
            <div className="mt-3">
              {bestTimeToVisit && bestTimeToVisit?.length > 0 ? (
                <ul className="list-disc list-inside px-2 md:px-3 text-sm md:text-[1rem]">
                  {bestTimeToVisit.map((time, index) => (
                    <li key={index} className="mt-2">
                      {time}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mt-2">
                  No specific best time provided.
                </p>
              )}
            </div>
          </section>
          <section className="mt-4 sm:mt-8">
            <h1 className="text-xl sm:text-2xl font-semibold">Weather Info</h1>
            <div className="mt-3">
              {weatherInfo && weatherInfo?.length > 0 ? (
                <ul className="list-disc list-inside px-2 md:px-3 text-sm md:text-[1rem]">
                  {weatherInfo.map((info, index) => (
                    <li key={index} className="mt-2">
                      {info}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mt-2">
                  No specific weather information provided.
                </p>
              )}
            </div>
          </section>
          <section className="mt-10 sm:px-4">
            <Map
              mapPins={
                location
                  ? [
                      {
                        latitude: location?.coordinates[0],
                        longitude: location?.coordinates[1],
                        place: location?.city || "",
                      },
                    ]
                  : []
              }
            />
          </section>
        </div>

        <div className="sticky top-4 w-60 lg:w-90 h-100 bg-white rounded-lg shadow-lg">
          <ScrollArea className="h-full p-4">
            {/* Your scrollable content here */}
            <div className="space-y-4">
              {/* Example content */}
              {[...Array(20)].map((_, i) => (
                <p key={i}>Scrollable item {i + 1}</p>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default ClientTripPage;
