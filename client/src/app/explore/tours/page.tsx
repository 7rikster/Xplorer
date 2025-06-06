"use client";

import ComboBoxComponent from "@/components/comboboxCompo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { budget, groupTypes } from "@/constants";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LoadingCard from "@/components/loading-card";
import HandpickedTripCard from "@/components/handpicked-trips/card";
import axios from "axios";
import { parseTripData } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

function Tours() {
  const [selectedGroupType, setSelectedGroupType] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [place, setPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsString = searchParams.toString();

  useEffect(() => {
    const cityParam = searchParams.get("place") || "";
    const budgetParam = searchParams.get("budget") || "";
    const groupParam = searchParams.get("groupType") || "";

    setPlace(cityParam);
    setSelectedBudget(budgetParam);
    setSelectedGroupType(groupParam);

    setTrips([]);
    setNextCursor(null);

    const fetchFirstPage = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/trip/get-all`,
          {
            params: {
              cursor: null,
              place: cityParam || undefined,
              budget: budgetParam || undefined,
              groupType: groupParam || undefined,
            },
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
  }, [paramsString]);

  useEffect(() => {
    if (!nextCursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/trip/get-all`, {
              params: {
                cursor: nextCursor,
                place: place || undefined,
                budget: selectedBudget || undefined,
                groupType: selectedGroupType || undefined,
              },
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
  }, [nextCursor, place, selectedBudget, selectedGroupType]);

  const [limit, setLimit] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setLimit(window.innerWidth < 640 ? 4 : window.innerWidth < 1024 ? 6 : 8);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (place) params.set("place", place);
    if (selectedBudget) params.set("budget", selectedBudget);
    if (selectedGroupType) params.set("groupType", selectedGroupType);

    router.push(`/explore/tours?${params.toString()}`);
  };

  const resetFilters = () => {
    setSelectedGroupType("");
    setSelectedBudget("");
    setPlace("");
    router.push("/explore/tours");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-100">
      <div className="w-full relative h-[90vh] overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dqobuxkcj/image/upload/v1749151328/neikdmqtbo8mfp8y91fn.jpg"
          alt="Tours background"
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-semibold text-white mb-2">
            Tours & Packages
          </h1>
          <h3 className="text-lg md:text-xl text-white">
            Discover our premium tour experiences
          </h3>
        </div>
      </div>

      <div className="relative flex justify-center mt-[-3rem]">
        <div className="relative bg-white rounded-lg shadow-lg p-6 left-1/2 transform -translate-x-1/2 ">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex gap-4 items-center">
              <ComboBoxComponent
                data={groupTypes.map((g) => ({ label: g, value: g }))}
                placeholder="Group Type"
                value={selectedGroupType}
                setValue={setSelectedGroupType}
              />
              <ComboBoxComponent
                data={budget.map((b) => ({ label: b, value: b }))}
                placeholder="Budget"
                value={selectedBudget}
                setValue={setSelectedBudget}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Input
                placeholder="City, State, or Country"
                className="w-[250px] lg:w-[300px] h-10"
                type="search"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
              <div className="flex gap-2 ">
                <Button onClick={applyFilters} className="px-6 cursor-pointer">
                  Filter
                </Button>
                <Button onClick={resetFilters} className="px-6 cursor-pointer">
                  Reset <span className="hidden lg:block">filters</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 w-full px-3 sm:px-8 md:px-16 lg:px-24 mt-16">
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
              buttonText: "Explore",
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

export default Tours;
