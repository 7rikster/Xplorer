import Image from "next/image";
import { Button } from "../ui/button";
import { MapPin } from "lucide-react";

interface CardProps {
  name: string;
  photoUrl: string;
  rating: number;
  location?: string;
}

function DestinationsCard({ name, photoUrl, rating, location }: CardProps) {
  return (
    <div className="w-full rounded-xl shadow-lg flex flex-col  hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-105">
      <div className="w-full h-32 sm:h-46 overflow-hidden rounded-t-xl">
        <Image
          src={photoUrl}
          width={200}
          height={200}
          alt=""
          className="w-full h-32 sm:h-46 rounded-t-xl object-cover "
        />
      </div>
      <div className="w-full flex items-center justify-between text-center p-2 sm:p-2 space-y-0.5">
        <div className="flex flex-col items-start justify-center py-1">
          <h1 className="text-sm sm:text-lg">{name}</h1>
          {location && (
              <p className="text-gray-600 text-sm md:text-md  flex ">
                <MapPin className="w-4 h-5 mr-0.5"/>
                {location}
              </p>
            )}
          <div className="flex items-center justify-center mt-1">
            {Array.from({ length: rating }).map((_, index) => (
              <svg key={index}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400"
              >
                <path
                  fill="#FFD43B"
                  d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                />
              </svg>
            ))}
          </div>
        </div>
        <div>
          <Button className="cursor-pointer w-12 h-6 text-[10px] sm:w-12 sm:h-7 md:text-xs lg:w-auto lg:h-auto lg:text-sm">
            Explore
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DestinationsCard;
