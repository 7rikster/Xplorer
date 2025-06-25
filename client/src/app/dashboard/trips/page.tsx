"use client";

import HandpickedTripCard from "@/components/handpicked-trips/card";
import LoadingCard from "@/components/loading-card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/authContext";
import { auth } from "@/lib/firebase/firebaseConfig";
import { parseTripData } from "@/lib/utils";
import axios from "axios";
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import { parse } from "path";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";

interface Booking {
  id: string;
  tripId: string;
  userId: string;
  isCompleted: boolean;
  adults: number;
  children: number;
  createdAt: string;
  startDate: string;
  totalAmount: number;
  imageUrls: string[];
  trip: Trip;
}

function ClientDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user: userInfo } = useUser();
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (userInfo?.role === "ADMIN") {
      toast.error("You are not allowed to access this page");
      router.push("/admin");
    }
  }, [userInfo, router]);

  async function fetchBookings() {
    setLoading(true);
    const token = await user?.getIdToken();
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/booking/user/get-trips`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Bookings fetched:", response.data);
      setBookings(() => {
        return response.data.data.map((booking: any) => ({
          id: booking.id,
          tripId: booking.trip.id,
          userId: booking.userId,
          isCompleted: booking.isCompleted,
          adults: booking.adults,
          children: booking.children,
          createdAt: booking.createdAt,
          startDate: booking.startDate,
          totalAmount: booking.totalAmount,
          imageUrls: booking.trip.imageUrls || [],
          trip: parseTripData(booking.trip.tripDetail),
        }));
      });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to fetch bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  console.log("Bookings:", bookings);
  useEffect(() => {
    if (!user) {
      toast.error("You are not authenticated. Please log in.");
      return;
    }
    fetchBookings();
  }, []);

  const [limit, setLimit] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setLimit(window.innerWidth < 640 ? 4 : window.innerWidth < 1024 ? 6 : 8);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col  h-screen bg-gray-100 p-2 md:pl-20">
      <div className="flex items-center justify-between mt-6 md:mt-0 mb-6 md:px-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold ">Your Booked Trips</h1>
          <p className="text-gray-600 hidden md:block mt-1">
            Here are the trips you have booked.
          </p>
        </div>
        <Button
          className="cursor-pointer text-[10px] sm:text-[13px] md:text-[1rem] px-2 h-6 sm:h-auto sm:px-3"
          onClick={() => {
            router.push("/explore/tours");
          }}
        >
          Book a Trip
        </Button>
      </div>
      <div className="flex flex-col h-full">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 w-full sm:px-8 md:px-12 mt-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="w-full pt-2">
                <LoadingCard />
              </div>
            ))}
          </div>
        )}
        {!loading && bookings && bookings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 w-full sm:px-8 md:px-12 md:mt-6">
            {bookings.map((booking: Booking, index) => (
              <HandpickedTripCard
                key={booking.id}
                trip={{
                  id: booking.tripId,
                  image:
                    booking.imageUrls[0] || "https://via.placeholder.com/150",
                  name: booking.trip.name.split(":")[0],
                  location: `${booking.trip.location.city}, ${booking.trip.location.country}`,
                  tags:
                    limit === 4
                      ? [booking.trip.groupType, booking.trip.travelStyle]
                      : [
                          booking.trip.groupType,
                          booking.trip.travelStyle,
                          booking.trip.budget,
                        ],
                  days: booking.trip.duration,
                  price: booking.trip.estimatedPrice,
                  buttonText: limit === 4 ? "View" : "View Itinerary",
                  buttonClickNavigate: `/dashboard/trips/${booking.tripId}`,
                  showBooking: true,
                  showPrice: false,
                  tripDate: booking.startDate,
                  bookedOn: booking.createdAt,
                  adults: booking.adults,
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center h-full ${
              loading ? "hidden" : ""
            }`}
          >
            <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-xl md:text-3xl font-semibold">
                You have not booked any trip yet.. Book one now!
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
