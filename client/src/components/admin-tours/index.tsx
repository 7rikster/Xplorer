"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import AdminCard from "../admin-card";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { auth } from "@/lib/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { parseTripData } from "@/lib/utils";

function AdminTours() {
  const [user] = useAuthState(auth);
  const [trips, setTrips] = useState<Trip[] | []>([]);

  const router = useRouter();

  async function handleDeletetrip(id: string, publicId: string) {
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

  async function fetchTrips() {
    if (!user) return;
    const token = await user.getIdToken();
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/trip/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    }
  }

  useEffect(() => {
    fetchTrips();
  }, [user]);
  console.log("Trips:", trips);

  return (
    <div>
      <Card className="px-0">
        <CardHeader className="flex flex-row justify-between items-center px-3 md:px-6">
          <CardTitle className="text-lg md:text-3xl font-extrabold">
            Trips
          </CardTitle>
          <Button
            className="cursor-pointer px-2 md:px-4"
            onClick={() => router.push("/admin/add-new-trip")}
          >
            Add <span className="hidden md:block">New</span> Trip
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 md:gap-4 px-2 md:px-6">
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
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminTours;
