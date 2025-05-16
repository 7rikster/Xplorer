"use client"

import { useAuthState } from "react-firebase-hooks/auth";
import AdminCard from "../admin-card";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { auth } from "@/lib/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import axios from "axios";

interface DestinationData {
  id: string;
  name: string;
  rating: number;
  photoUrl: string;
  publicId: string;
  placeId: string;
  location: string;
}

function AdminTours() {

  const [user] = useAuthState(auth);
  const [destinations, setDestinations] = useState<DestinationData[] | []>([]);

  async function handleDeleteDestination(id: string, publicId: string) {
    if (!user) return;
    const token = await user.getIdToken();
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/destination/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/media/delete/${publicId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDestinations();
    } catch (error) {
      console.error("Error deleting destination:", error);
    }
  }

  async function fetchDestinations() {
    if (!user) return;
    const token = await user.getIdToken();
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/destination/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDestinations(response.data.data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  }

  useEffect(() => {
    fetchDestinations();
  }, [user]);


  return (
    <div>
      <Card className="px-0">
        <CardHeader className="flex flex-row justify-between items-center px-3 md:px-6">
          <CardTitle className="text-lg md:text-3xl font-extrabold">
            Trips
          </CardTitle>
          <Button className="cursor-pointer px-2 md:px-4">
            Add <span className="hidden md:block">New</span> Trip
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 md:gap-4 px-2 md:px-6">
          {destinations.length > 0 &&
            destinations.map((destination) => (
              <AdminCard
                key={destination.id}
                id={destination.id}
                image={destination.photoUrl}
                name={destination.name}
                rating={destination.rating}
                location={destination.location}
                isEdit={false}
                onDelete={handleDeleteDestination}
                publicId={destination.publicId}
              />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminTours;
