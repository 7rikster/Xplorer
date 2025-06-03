"use client";

import { parseTripData } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingCard from "../loading-card";
import AdminCard from "../admin-card";
import HandpickedTripCard from "./card";
import TripsPagination from "../pagination";

function HandpickedTrips() {
  const [trips, setTrips] = useState<Trip[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  async function fetchTrips(page: number = 1) {
    if (page === currentPage) return;
    setLoading(true);
    setCurrentPage(page);
    setTrips([]);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/trip/get`,
        {
          params: {
            page,
            limit,
          },
        }
      );
      setTotalPages(response.data.pagination.totalPages);
      setTrips(() => {
        return response.data.data.map((trip: any) => ({
          id: trip.id,
          ...parseTripData(trip.tripDetail),
          imageUrls: trip.imageUrls ? trip.imageUrls : [],
          createAt: trip.createAt,
        }));
      });
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (limit > 0) {
      fetchTrips();
    }
  }, [limit]);

  useEffect(() => {
    const handleResize = () => {
      setLimit(window.innerWidth < 640 ? 4 : window.innerWidth < 1024 ? 6 : 8);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("Trips:", trips);

  return (
    <div className="w-full flex flex-col items-center justify-center pt-10 pb-6 px-2   ">
      <div className="flex flex-col items-center justify-center mb-8 sm:mb-12 md:mb-16 space-y-1">
        <h1 className="text-md sm:text-lg font-semibold text-gray-700">
          TOURS
        </h1>
        <h1 className="text-2xl sm:text-4xl font-bold text-center">
          Explore Handpicked Trips
        </h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 w-full px-3 sm:px-8 md:px-16 lg:px-24">
        {loading &&
          Array.from({ length: limit }).map((_, index) => (
            <div className="w-full pt-2" key={index}>
              <LoadingCard />
            </div>
          ))}
        {trips.length > 0 &&
          trips.map((trip) => (
            <HandpickedTripCard
              key={trip.id}
              trip={{
                id: trip.id,
                image: trip.imageUrls[0],
                name: trip.name.split(":")[0],
                location: `${trip.location.city}, ${trip.location.country}`,
                tags: limit==4? [trip.groupType, trip.travelStyle]:[trip.groupType, trip.travelStyle, trip.budget],
                days: trip.duration,
                price: trip.estimatedPrice,
                buttonText: "Explore",
              }}
            />
          ))}
      </div>
      <div className="flex justify-center items-center mt-8">
        <TripsPagination
          totalPages={totalPages || 1}
          onPageChange={fetchTrips}
        />
      </div>

        

    </div>
  );
}

export default HandpickedTrips;
