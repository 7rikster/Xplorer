import React from "react";
import { Check, X, Plane, MapPin, Clock, User } from "lucide-react";

const TourPlanTable: React.FC<{ trip: Trip }> = ({ trip }) => {
  return (
    <div className=" rounded-xl max-w-3xl mx-auto shadow-lg">
      <div className="divide-y divide-gray-700 border border-gray-500 rounded-lg">
        {/* Row 1 */}
        <div className="grid grid-cols-2">
          <div className="border-r border-gray-500 py-4 px-2 sm:px-4">
            <div className="flex gap-2 items-center font-medium ">
              <MapPin size={18} /> Destination
            </div>
          </div>
          <div className="ml-2 sm:ml-4 py-4">
            {trip?.location?.city}, {trip?.location?.country}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2">
          <div className="border-r border-gray-500 py-4 px-2 sm:px-4">
            <div className="flex gap-2 items-center font-medium">
              <Clock size={18} /> Package For
            </div>
          </div>
          <div className="ml-2 sm:ml-4 py-4">
            {trip?.duration} Days, {trip?.duration - 1} Nights
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2">
          <div className="border-r border-gray-500 py-4 px-2 sm:px-4">
            <div className="flex gap-2 items-center font-medium">
              <Plane size={18} /> Departure
            </div>
          </div>
          <div className="ml-2 sm:ml-4 py-4">
            {trip?.location?.city}, {trip?.location?.country}
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-2">
          <div className="border-r border-gray-500 py-4 px-2 sm:px-4">
            <div className="flex gap-2 items-center font-medium">
              <User size={18} /> Age
            </div>
          </div>
          <div className="ml-2 sm:ml-4 py-4">{trip?.groupType == "Couple" || trip?.groupType == "Solo"  || trip?.groupType == "Friends" || trip?.groupType == "Business" ? "18+" : "All Ages"}</div>
        </div>

        {/* Included */}
        <div className="grid grid-cols-2">
          <div className="border-r border-gray-500 py-4 px-2 sm:px-4 h-full">
            <div className="font-medium mb-2 flex items-center h-full">
              ✅ Package Included
            </div>
          </div>
          <ul className="space-y-1 ml-2 sm:ml-4 py-4">
            <li className="flex items-center gap-2 text-sm sm:text-[1rem]">
              <Check className="text-green-500 w-3 h-3 sm:w-5 sm:h-5" /> Internal
              Transportations
            </li>
            <li className="flex items-center gap-2 text-sm sm:text-[1rem]">
              <Check className="text-green-500 w-3 h-3 sm:w-5 sm:h-5"  /> Accommodations
            </li>
            <li className="flex items-center gap-2 text-sm sm:text-[1rem]">
              <Check className="text-green-500 w-3 h-3 sm:w-5 sm:h-5"  /> Breakfast
            </li>
          </ul>
        </div>

        {/* Excluded */}
        <div className="grid grid-cols-2">
          <div className="border-r border-gray-500 py-4 px-2 sm:px-4 h-full">
            <div className="font-medium mb-2 flex h-full items-center">
              ❌ Package Excluded
            </div>
          </div>
          <ul className="space-y-1 ml-2 sm:ml-4 py-4">
            <li className="flex items-center gap-2 text-sm sm:text-[1rem]">
              <X className="text-red-500 w-3 h-3 sm:w-5 sm:h-5" /> Air Fares
            </li>
            <li className="flex items-center gap-2 text-sm sm:text-[1rem]">
              <X className="text-red-500 w-3 h-3 sm:w-5 sm:h-5" /> Any Personal Expenses
            </li>
            <li className="flex items-center gap-2 text-sm sm:text-[1rem]">
              <X className="text-red-500 w-3 h-3 sm:w-5 sm:h-5" /> Laundry Or Phone Calls
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TourPlanTable;
