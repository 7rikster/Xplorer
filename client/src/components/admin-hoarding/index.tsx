"use client";

/* eslint-disable @typescript-eslint/no-unused-expressions */

import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";
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
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import AdminCard from "../admin-card";
import LoadingCard from "../loading-card";

interface HoardingData {
  id: string;
  name: string;
  location: string;
  photoUrl: string;
  publicId: string;
  placeId: string;
  description: string;
}

function AdminHoarding() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [hoardings, setHoardings] = useState<HoardingData[]>([]);
  const [hoarding, setHoarding] = useState({
    name: "",
    location: "",
    photoUrl: "",
    publicId: "",
    placeId: "",
    description: "",
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
          setHoarding((prev) => ({
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

  async function handleAddHoarding() {
    if (!user) return;
    setLoading(true);
    const token = await user.getIdToken();
    if (!hoarding.name || hoarding.name === "") {
      toast.error("Please enter a name for the hoarding.");
      setLoading(false);
      return;
    }
    if (!hoarding.photoUrl || hoarding.photoUrl === "") {
      setLoading(false);
      toast.error("Please upload an image for the hoarding.");
      return;
    }
    if (!hoarding.location || hoarding.location === "") {
      setLoading(false);
      toast.error("Please enter a location for the hoarding.");
      return;
    }
    if (!hoarding.description || hoarding.description === "") {
      setLoading(false);
      toast.error("Please enter a description for the hoarding.");
      return;
    }
    const place_Id = await getPlaceId(hoarding.name);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/hoarding/add`,
        {
          name: hoarding.name,
          description: hoarding.description,
          photoUrl: hoarding.photoUrl,
          publicId: hoarding.publicId,
          placeId: place_Id,
          location: hoarding.location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error adding hoarding:", error);
    }
    setLoading(false);
    setHoarding({
      name: "",
      description: "",
      photoUrl: "",
      publicId: "",
      placeId: "",
      location: "",
    });
    fetchHoardings();
    isDialogOpen && setIsDialogOpen(false);
  }

  async function handleDeleteHoarding(id: string, publicId: string) {
    if (!user) return;
    const token = await user.getIdToken();
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/hoarding/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/media/delete/${publicId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchHoardings();
    } catch (error) {
      console.error("Error deleting hoarding:", error);
    }
  }

  async function fetchHoardings() {
    if (!user) return;
    setDataLoading(true);
    const token = await user.getIdToken();
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/hoarding/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHoardings(response.data.data);
    } catch (error) {
      console.error("Error fetching hoardings:", error);
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    fetchHoardings();
  }, [user]);

  return (
    <div>
      <Card className="px-0">
        <CardHeader className="flex flex-row justify-between items-center px-3 md:px-6">
          <CardTitle className="text-lg md:text-3xl font-extrabold">
            Hoarding Items
          </CardTitle>
          <Dialog
            open={isDialogOpen}
            onOpenChange={() => {
              setIsDialogOpen((prev) => !prev);
              setHoarding({
                name: "",
                description: "",
                location: "",
                photoUrl: "",
                publicId: "",
                placeId: "",
              });
            }}
          >
            <DialogTrigger asChild>
              <Button className="cursor-pointer px-2 md:px-4">
                Add <span className="hidden md:block">New</span> Hoarding
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Add a New Hoarding</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={hoarding.name}
                    onChange={(event) =>
                      setHoarding((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={hoarding.location}
                    onChange={(event) =>
                      setHoarding((prev) => ({
                        ...prev,
                        location: event.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={hoarding.description}
                    onChange={(event) =>
                      setHoarding((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rating" className="text-right">
                    Image
                  </Label>
                  {hoarding.photoUrl === "" ? (
                    <Input
                      onChange={(event) => handleImageUploadChange(event)}
                      type="file"
                      accept="image/*"
                      className="col-span-3"
                    />
                  ) : (
                    <Image
                      src={hoarding.photoUrl}
                      width={300}
                      height={100}
                      alt={hoarding.name}
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
                onClick={handleAddHoarding}
                className="cursor-pointer"
                disabled={loading || isImageUploading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Add Hoarding"
                )}
              </Button>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 md:gap-4 px-2 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {dataLoading &&
              Array.from({ length: 8 }).map((_, index) => (
                <div className="w-full pt-2" key={index}>
                  <LoadingCard />
                </div>
              ))}
          {hoardings.length > 0 &&
            hoardings.map((hoardingItem) => (
              <AdminCard
              key={hoardingItem.id}
              id={hoardingItem.id}
              image={hoardingItem.photoUrl}
              name={hoardingItem.name}
              location={hoardingItem.location}
              onEditNavigate={`/admin/hoardingItem/edit/${hoardingItem.id}`}
              isEdit={false}
              onDelete={handleDeleteHoarding}
              publicId={hoardingItem.publicId}
              />
            ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminHoarding;
