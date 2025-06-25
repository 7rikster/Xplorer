import { getFirstWord } from "@/lib/utils";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

interface HandpickedTripCardProps {
  image: string;
  name: string;
  id: string;
  location: string;
  tags: string[];
  days: number;
  price?: string;
  buttonText?: string;
  buttonClickNavigate?: string;
  showPrice?: boolean;
  showBooking?: boolean;
  tripDate?: string;
  bookedOn?: string;
  adults?: number;
}

function HandpickedTripCard({ trip }: { trip: HandpickedTripCardProps }) {
  return (
    <div className="w-full rounded-xl shadow-lg bg-white flex flex-col  hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105">
      <div className="relative w-full h-32 sm:h-46 overflow-hidden rounded-t-xl">
        <Image
          src={trip.image}
          alt={trip.name}
          layout="fill"
          objectFit="cover"
        />
        <h1 className="absolute bottom-2 left-2 z-100 text-gray-100 font-semibold flex text-xs sm:text-[1rem]">
          <MapPin className="w-3 h-4 sm:w-5 sm:h-6 mr-0.5" />
          {trip.location}
        </h1>
      </div>
      <div className="w-full flex flex-col justify-between p-2 sm:p-2 space-y-0.5">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-sm sm:text-lg font-semibold">{trip.name}</h1>
          <h3 className="text-gray-500 text-[10px] sm:text-sm font-semibold">
            {trip.days} Days / {trip.days - 1} Nights
          </h3>
          {trip.tags && trip.tags.length > 0 && (
            <p className=" text-xs md:text-sm md:font-semibold flex flex-wrap mt-2">
              {trip.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`rounded-full px-1 sm:px-2 py-1 mr-1 mb-1 ${
                    index === 0
                      ? "bg-red-100 text-red-800"
                      : index === 1
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-800"
                  } text-[9px] md:text-sm`}
                >
                  {getFirstWord(tag)}
                </span>
              ))}
            </p>
          )}
          {trip.showBooking && (
            <div className="flex flex-col items-start">
              <h4 className="md:text-[14px] text-[11px] text-[#0a0a0abc] font-semibold">
                Trip Date: {trip.tripDate?.split("T")[0]}
              </h4>
              <h3 className="md:text-[14px] text-[11px] text-[#0a0a0abc] font-semibold">
                Booked on: {trip.bookedOn?.split("T")[0]}
              </h3>
              <h3 className="md:text-[14px] text-[11px] text-[#0a0a0abc] font-semibold">
                Travellers: {trip.adults}
              </h3>
            </div>
          )}
        </div>
        <div
          className={`flex justify-between ${
            trip.showBooking ? "justify-end" : ""
          } items-center mt-1 mb-2`}
        >
          <Link href={trip.buttonClickNavigate || `/explore/tours/${trip.id}`}>
            <Button className="cursor-pointer w-12 h-6 text-[10px] sm:w-16 sm:h-7 md:text-xs lg:w-auto lg:h-auto lg:text-sm">
              {trip.buttonText || "Explore"}
            </Button>
          </Link>
          {trip.price && trip.showPrice && (
            <div className="flex flex-col items-end">
              <h4 className="text-[12px] text-gray-500 hidden sm:block">
                Estimated price
              </h4>
              <h3 className="font-bold text-md sm:text-xl">{trip.price}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HandpickedTripCard;
