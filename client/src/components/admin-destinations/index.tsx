"use client";

import AdminCard from "../admin-card";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

interface DestinationData {
  id: string;
  name: string;
  rating: number;
  photoUrl: string;
  publicId: string;
  placeId: string;
  location: string;
}

function AdminDestination() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState<DestinationData[] | []>([]);
  const [destinationData, setDestinationData] = useState({
    name: "",
    rating: 0,
    photoUrl: "",
    publicId: "",
    placeId: "",
    location: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  async function handleImageUploadChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedImage = event.target.files ? event.target.files[0] : null;
    if (selectedImage) {
      setIsImageUploading(true);
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        const token = await user?.getIdToken();
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/media/upload`,
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setDestinationData((prev) => ({
            ...prev,
            photoUrl: response.data.data.secure_url,
            publicId: response.data.data.public_id,
          }));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      setIsImageUploading(false);
    }
  }

  async function getPlaceId(place: string) {
    if (!place || place === "" || place.length < 3) return;
    try {
      const url =
        "https://google-map-places-new-v2.p.rapidapi.com/v1/places:autocomplete";
      const options = {
        method: "POST",
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY_1,
          "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "*",
        },
        data: {
          input: place,
          locationBias: {
            circle: {
              center: {
                latitude: 40,
                longitude: -110,
              },
              radius: 10000,
            },
          },
          includedPrimaryTypes: [],
          includedRegionCodes: [],
          languageCode: "",
          regionCode: "",
          origin: {
            latitude: 0,
            longitude: 0,
          },
          inputOffset: 0,
          includeQueryPredictions: true,
          sessionToken: "",
        },
      };

      const response = await axios.post(url, options.data, {
        headers: options.headers,
      });

      const placeId = response.data.suggestions[0].placePrediction.placeId;
      return placeId;
    } catch (error) {
      console.error("Error fetching placeId:", error);
    }
  }

  async function handleAddDestination() {
    if (!user) return;
    setLoading(true);
    const token = await user.getIdToken();
    if (!destinationData.name || destinationData.name === "") {
      toast.error("Please enter a name for the destination.");
      setLoading(false);
      return;
    }
    if (!destinationData.photoUrl || destinationData.photoUrl === "") {
      setLoading(false);
      toast.error("Please upload an image for the destination.");
      return;
    }
    if (!destinationData.rating || destinationData.rating === 0) {
      setLoading(false);
      toast.error("Please enter a rating for the destination.");
      return;
    }
    if (!destinationData.location || destinationData.location === "") {
      setLoading(false);
      toast.error("Please enter a location for the destination.");
      return;
    }
    const place_Id = await getPlaceId(destinationData.name);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/destination/add`,
        {
          name: destinationData.name,
          rating: destinationData.rating,
          photoUrl: destinationData.photoUrl,
          publicId: destinationData.publicId,
          placeId: place_Id,
          location: destinationData.location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error adding destination:", error);
    }
    setLoading(false);
    setDestinationData({
      name: "",
      rating: 0,
      photoUrl: "",
      publicId: "",
      placeId: "",
      location: "",
    });
    fetchDestinations();
    isDialogOpen && setIsDialogOpen(false);
  }

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
            Top Destinations
          </CardTitle>
          <Dialog
            open={isDialogOpen}
            onOpenChange={() => {
              setIsDialogOpen((prev) => !prev);
              setDestinationData({
                name: "",
                rating: 0,
                photoUrl: "",
                publicId: "",
                placeId: "",
                location: "",
              });
            }}
          >
            <DialogTrigger asChild>
              <Button className="cursor-pointer px-2 md:px-4">
                Add <span className="hidden md:block">New</span> Destination
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Add a New Destination</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Place
                  </Label>
                  <Input
                    id="name"
                    value={destinationData.name}
                    onChange={(event) =>
                      setDestinationData((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="name"
                    value={destinationData.location}
                    onChange={(event) =>
                      setDestinationData((prev) => ({
                        ...prev,
                        location: event.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rating" className="text-right">
                    Rating
                  </Label>
                  <Input
                    id="rating"
                    value={destinationData.rating}
                    onChange={(event) =>
                      setDestinationData((prev) => ({
                        ...prev,
                        rating: Number(event.target.value),
                      }))
                    }
                    className="col-span-3"
                    type="number"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rating" className="text-right">
                    Image
                  </Label>
                  {destinationData.photoUrl === "" ? (
                    <Input
                      onChange={(event) => handleImageUploadChange(event)}
                      type="file"
                      accept="image/*"
                      className="col-span-3"
                    />
                  ) : (
                    <Image
                      src={destinationData.photoUrl}
                      width={300}
                      height={100}
                      alt={destinationData.name}
                      className="col-span-3 object-cover h-36 w-full rounded-md"
                    />
                  )}
                  {isImageUploading && (
                    <div className="col-span-4 flex items-center justify-center gap-4">
                      <h1>Uploading image </h1>
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleAddDestination}
                className="cursor-pointer"
                disabled={loading || isImageUploading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Add Destination"
                )}
              </Button>
            </DialogContent>
          </Dialog>
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
                onEditNavigate={`/admin/destination/edit/${destination.id}`}
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

export default AdminDestination;
