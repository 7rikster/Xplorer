"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAuthState } from "react-firebase-hooks/auth";
import AdminCard from "../admin-card";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { auth } from "@/lib/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import axios from "axios";
import { parseTripData } from "@/lib/utils";
import Link from "next/link";
import TripsPagination from "../pagination";
import LoadingCard from "../loading-card";

function AdminTours() {
  const [user] = useAuthState(auth);
  const [trips, setTrips] = useState<Trip[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  async function handleDeletetrip(id: string) {
    if (!user) return;
    const token = await user.getIdToken();
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/trip/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTrips();
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  }

  async function fetchTrips(page:number = 1) {
    if (!user) return;
    if(page===currentPage) return; 
    setLoading(true);
    setCurrentPage(page);
    setTrips([]);
    const token = await user.getIdToken();
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/trip/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            limit
          },
        }
        
      );
      // console.log("Response:", response.data)
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
    if(user && limit>0) {
      fetchTrips();
    }
  }, [user, limit]);

  useEffect(() => {
    const handleResize = () => {
      setLimit(window.innerWidth < 768 ? 4 : window.innerWidth < 1024 ? 6 : 8);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Card className="px-0">
        <CardHeader className="flex flex-row justify-between items-center px-3 md:px-6">
          <CardTitle className="text-lg md:text-3xl font-extrabold">
            Trips
          </CardTitle>
          <Link href="/admin/add-new-trip">
            <Button className="cursor-pointer px-2 md:px-4">
              Add <span className="hidden md:block">New</span> Trip
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 md:gap-4 px-2 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {
              loading &&
              Array.from({ length: limit }).map((_, index) => (
                <div className="w-full pt-2" key={index}>
                  <LoadingCard />
                </div>
              ))
            }
            {trips.length > 0 &&
              trips.map((trip) => (
                <AdminCard
                  key={trip.id}
                  id={trip.id}
                  image={trip.imageUrls[0]}
                  name={trip.name.split(":")[0]}
                  location={`${trip.location.city}, ${trip.location.country}`}
                  tags={[trip.groupType, trip.travelStyle, trip.budget]}
                  isEdit={false}
                  onDelete={handleDeletetrip}
                  onClickNavigate={`/admin/trips/${trip.id}`}
                />
              ))}
          </div>
          <div className="flex justify-center items-center mt-4">
            <TripsPagination totalPages={totalPages||1} onPageChange={fetchTrips} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminTours;
