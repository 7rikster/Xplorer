"use client";

import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { parseTripData } from "@/lib/utils";
import moment from "moment";
import { CalendarDays } from "lucide-react";

interface Booking {
  id: string;
  tripId: string;
  userId: string;
  isCompleted: boolean;
  adults: number;
  children: number;
  createdAt: string;
  startDate: string;
  endDate?: string;
  totalAmount: number;
  imageUrls: string[];
  trip: Trip | null;
}

function UpcomingTrip() {
  const [upcomingTrip, setUpcomingTrip] = useState<Booking | null>(null);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [animatedDaysLeft, setAnimatedDaysLeft] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [user] = useAuthState(auth);

  function getDaysLeft(startDate: string | Date) {
    const today = new Date();
    const tripDate = new Date(startDate);

    today.setHours(0, 0, 0, 0);
    tripDate.setHours(0, 0, 0, 0);

    const diffInMs = tripDate.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    setDaysLeft(diffInDays);
  }

  function animateNumber(finalValue: number, setValue: (val: number) => void) {
    let current = 0;
    const increment = Math.max(1, Math.floor(finalValue / 30)); // smoothness control
    const interval = setInterval(() => {
      current += increment;
      if (current >= finalValue) {
        setValue(finalValue);
        clearInterval(interval);
      } else {
        setValue(current);
      }
    }, 20);
  }

  useEffect(() => {
    animateNumber(daysLeft, setAnimatedDaysLeft);
  }, [daysLeft]);

  useEffect(() => {
    if (upcomingTrip && upcomingTrip.startDate) {
      getDaysLeft(upcomingTrip.startDate);
    }
  }, [upcomingTrip]);

  useEffect(() => {
    async function fetchUpcomingTrip() {
      setLoading(true);
      try {
        const token = await user?.getIdToken();
        if (!token) {
          console.error("User is not authenticated. Please log in.");
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/tripBooking/user/get-upcoming-trip`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.data.upcomingTrip) {
          setUpcomingTrip({
          id: response.data.data.upcomingTrip.id,
          tripId: response.data.data.upcomingTrip.tripId,
          userId: response.data.data.upcomingTrip.userId,
          isCompleted: response.data.data.upcomingTrip.isCompleted,
          adults: response.data.data.upcomingTrip.adults,
          children: response.data.data.upcomingTrip.children,
          createdAt: response.data.data.upcomingTrip.createdAt,
          startDate: response.data.data.upcomingTrip.startDate,
          totalAmount: response.data.data.upcomingTrip.totalAmount,
          endDate: response.data.data.upcomingTrip.endDate || undefined,
          imageUrls: response.data.data.upcomingTrip.trip.imageUrls || [],
          trip: parseTripData(response.data.data.upcomingTrip.trip.tripDetail),
        });
        }
        
      } catch (error) {
        console.error("Error fetching upcoming trip:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchUpcomingTrip();
  }, []);

  // console.log("Upcoming Trip:", upcomingTrip);

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-md sm:h-full">
      <h2 className="text-2xl font-semibold mb-2">Upcoming Trip</h2>
      {loading ? (
        <div className="w-full h-60 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : upcomingTrip ? (
        <div className="flex relative flex-col items-center justify-between flex-1">
          <Image
            src={upcomingTrip.imageUrls[0] || "/placeholder.png"}
            alt="Trip Image"
            width={500}
            height={100}
            className=" object-cover rounded-lg h-60"
          />
          <div className="absolute top-4 left-4">
            <h1 className="text-gray-100 text-xl md:text-2xl font-semibold">
              {upcomingTrip.trip?.location?.city},{" "}
              {upcomingTrip.trip?.location?.country}
            </h1>
            <h1 className="text-gray-100 text-lg  ">
              {moment(upcomingTrip.startDate).format("LL").split(",")[0]} -{" "}
              {moment(upcomingTrip.endDate).format("LL").split(",")[0]}
            </h1>
            <h1 className="text-gray-100 text-md  ">
            Booked on: {moment(upcomingTrip.createdAt).format("LL")}
            </h1>
          </div>
          <div className="absolute top-48 left-4 right-4 justify-between flex items-center gap-4 ">
            <h1 className="text-gray-100 text-lg flex">
              <CalendarDays className="mr-2" /> {animatedDaysLeft} {daysLeft && daysLeft === 1 ? "day" : "days"} left
            </h1>
            <Link href={`/dashboard/trips/${upcomingTrip.tripId}`}>
              <Button className="cursor-pointer h-8 w-25 sm:w-auto sm:h-9">
                View Itinerary
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full ">
          <p className="text-gray-500">No upcoming trips found.</p>
          <p className="text-gray-500">Book a trip to see it here!</p>
          <Link href="/explore/tours" className="mt-2 cursor-pointer">
            <Button className="cursor-pointer">Book a Trip</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default UpcomingTrip;
