"use client";

import { useUser } from "@/context/authContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import LoadingCard from "@/components/loading-card";
import HandpickedTripCard from "@/components/handpicked-trips/card";
import axios from "axios";
import { parseTripData } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import Link from "next/link";

function ClientItineraries() {
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [limit, setLimit] = useState(0);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // const paramsString = searchParams.toString();

  const { user:userInfo } = useUser();
  const [user] = useAuthState(auth);

  useEffect(() => {
    setTrips([]);
    setNextCursor(null);

    const fetchFirstPage = async () => {
      setLoading(true);
      console.log(limit)
      const token = await user?.getIdToken(); 
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/userTrip/get-all`,
          {
            params: {
              cursor: null,
              limit: limit,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        const mapped: Trip[] = res.data.data.map((trip: TripResponse) => ({
          id: trip.id,
          ...parseTripData(trip.tripDetail),
          imageUrls: trip.imageUrls || [],
          createdAt: trip.createdAt,
        }));

        setTrips(mapped);
        setNextCursor(res.data.pagination.nextCursor);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstPage();
  }, []);

  useEffect(() => {
    if (!nextCursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          const token = user?.getIdToken();
          axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/userTrip/get-all`, {
              params: {
                cursor: nextCursor,
                limit: limit,
              },
              headers: {
              Authorization: `Bearer ${token}`,
            }
            })
            .then((res) => {
              const newTrips: Trip[] = res.data.data.map(
                (trip: TripResponse) => ({
                  id: trip.id,
                  ...parseTripData(trip.tripDetail),
                  imageUrls: trip.imageUrls || [],
                  createdAt: trip.createdAt,
                })
              );

              setTrips((prev) => {
                const existingIds = new Set(prev.map((t) => t.id));
                const uniqueNew = newTrips.filter(
                  (t) => !existingIds.has(t.id)
                );
                return [...prev, ...uniqueNew];
              });

              setNextCursor(res.data.pagination.nextCursor);
            })
            .catch((err) => console.error("Failed to fetch next page:", err))
            .finally(() => setLoading(false));
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.disconnect();
    };
  }, [nextCursor]);

  useEffect(() => {
    const handleResize = () => {
      setLimit(window.innerWidth < 640 ? 4 : window.innerWidth < 1024 ? 6 : 8);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  useEffect(() => {
    if (userInfo?.role === "ADMIN") {
      toast.error("You are not allowed to access this page");
      router.push("/admin");
    }
  }, [userInfo, router]);

  return (
    <div className="flex flex-col  w-full h-screen bg-gray-100 gap-2 md:gap-4">
      <div className="justify-end flex items-center gap-2 p-4">
        <Link href={"/generate"}>
          <Button className="cursor-pointer md:h-auto md:w-auto h-7 text-[11px] px-2 md:text-sm">Create a new Itinerary</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 w-full px-3 sm:px-8 md:px-16 lg:px-24">
        {trips.map((trip) => (
          <HandpickedTripCard
            key={trip.id}
            trip={{
              id: trip.id,
              image: trip.imageUrls[0],
              name: trip.name.split(":")[0],
              location: `${trip.location.city}, ${trip.location.country}`,
              tags:
                limit === 4
                  ? [trip.groupType, trip.travelStyle]
                  : [trip.groupType, trip.travelStyle, trip.budget],
              days: trip.duration,
              price: trip.estimatedPrice,
              buttonText: limit === 4?"View":"View Itinerary",
              buttonClickNavigate: `/dashboard/itineraries/${trip.id}`,
              showPrice: true,
              showBooking: false,
            }}
          />
        ))}
      </div>

      <div
        ref={loaderRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 w-full px-3 sm:px-8 md:px-16 lg:px-24 mt-6"
      >
        {loading &&
          Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="w-full pt-2">
              <LoadingCard />
            </div>
          ))}
      </div>
    </div>
  );
}

export default ClientItineraries;
