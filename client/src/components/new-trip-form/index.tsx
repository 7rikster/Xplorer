"use client";

import { useState } from "react";
import PlaceSearchBox from "../place-search-box";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { budget, groupTypes, interests, travelStyle } from "@/app/constants";
import Map from "../map";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import Loading from "@/app/loading";

interface TripData {
  imageUrls: string[];
  tripDetail: string;
  city: string;
  country: string;
  groupType: string;
  budget: string;
}

interface NewTripFormProps {
  saveTrip: (data: TripData) => void;
  loading?: boolean;
}

function NewTripForm({ saveTrip, loading: dbLoading }: NewTripFormProps) {
  type Place = {
    location: string;
    placeId: string;
    latitude: number;
    longitude: number;
  };
  type TripFormData = {
    duration: number;
    location: string;
    groupType: string;
    travelStyle: string;
    interest: string;
    budget: string;
  };
  const [user] = useAuthState(auth);
  const [place, setPlace] = useState<Place | null>(null);
  const [formData, setFormData] = useState<TripFormData>({
    duration: 0,
    location: "",
    groupType: "",
    travelStyle: "",
    interest: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleGenerateTrip(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    if (
      !place ||
      !formData.budget ||
      !formData.duration ||
      !formData.groupType ||
      !formData.interest ||
      !formData.travelStyle
    ) {
      setLoading(false);
      toast.error("Please fill all fields");
      return;
    }
    if (formData.duration <= 0 || formData.duration > 10) {
      setLoading(false);
      toast.error("Duration must be between 1 and 10");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      location: place.location,
    }));

    const token = await user.getIdToken();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/trip/generate`,
        {
          location: place.location,
          budget: formData.budget,
          numberOfDays: formData.duration,
          groupType: formData.groupType,
          interests: formData.interest,
          travelStyle: formData.travelStyle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const tripData: TripData = {
        imageUrls: response.data.data.imageUrls,
        tripDetail: response.data.data.tripDetail,
        city: place?.location.split(",")[1]
          ? place?.location.split(",")[0]
          : "",
        country: place?.location.split(",")[1]
          ? place?.location.split(",")[place.location.split(",").length - 1]
          : place?.location,
        groupType: formData.groupType,
        budget: formData.budget,
      };
      console.log("Generated trip data:", tripData);
      saveTrip(tripData);
      // setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error generating trip:", error);
      toast.error("Failed to generate trip. Please try again.");
    }
  }

  function handleChange(key: keyof TripFormData, value: string | number) {
    if (key === "duration" && typeof value !== "number") {
      console.error("Duration must be a number");
      return;
    }

    setFormData((prevData) => {
      const updatedData = {
        duration:
          key === "duration" ? (value as number) : prevData?.duration ?? 0,
        location:
          key === "location" ? (value as string) : prevData?.location ?? "",
        groupType:
          key === "groupType" ? (value as string) : prevData?.groupType ?? "",
        travelStyle:
          key === "travelStyle"
            ? (value as string)
            : prevData?.travelStyle ?? "",
        interest:
          key === "interest" ? (value as string) : prevData?.interest ?? "",
        budget: key === "budget" ? (value as string) : prevData?.budget ?? "",
      };
      return updatedData;
    });
  }

  if (loading)
    return (
      <Loading
        text={`Generating your trip${place ? ` to ${place.location}` : ""}...`}
      />
    );

  return (
    <div>
      <form
        className="p-6 bg-white rounded-lg shadow-md space-y-4"
        onSubmit={handleGenerateTrip}
      >
        <PlaceSearchBox setPlace={setPlace} />
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            name="duration"
            placeholder="Enter number of days"
            type="number"
            className="placeholder:text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleChange("duration", Number(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="groupType">Group Type</Label>
          <ComboBoxComponent
            id="groupType"
            dataSource={groupTypes.map((item) => ({ text: item, value: item }))}
            fields={{ text: "text", value: "value" }}
            placeholder="Select group type"
            className="combo-box w-[92%] md:w-[96%] font-bold"
            change={(e: { value: string | undefined }) => {
              if (e.value) {
                handleChange("groupType", e.value);
              }
            }}
            allowFiltering={true}
            filtering={(e) => {
              const userInput = e.text.toLowerCase();
              e.updateData(
                groupTypes
                  .filter((item) => item.toLowerCase().includes(userInput))
                  .map((item) => ({ text: item, value: item }))
              );
            }}
          />
        </div>

        <div>
          <Label htmlFor="travelStyle">Travel Style</Label>
          <ComboBoxComponent
            id="travelStyle"
            dataSource={travelStyle[
              (formData?.groupType as keyof typeof travelStyle) || "Friends"
            ].map((item) => ({ text: item, value: item }))}
            fields={{ text: "text", value: "value" }}
            placeholder="Select travel style"
            className="combo-box w-[92%] md:w-[96%] font-bold"
            change={(e: { value: string | undefined }) => {
              if (e.value) {
                handleChange("travelStyle", e.value);
              }
            }}
            allowFiltering={true}
            filtering={(e) => {
              const userInput = e.text.toLowerCase();
              e.updateData(
                travelStyle[
                  (formData?.groupType as keyof typeof travelStyle) || "Friends"
                ]
                  .filter((item) => item.toLowerCase().includes(userInput))
                  .map((item) => ({ text: item, value: item }))
              );
            }}
          />
        </div>

        <div>
          <Label htmlFor="interest">Interest</Label>
          <ComboBoxComponent
            id="interest"
            dataSource={interests[
              (formData?.groupType as keyof typeof interests) || "Friends"
            ].map((item) => ({ text: item, value: item }))}
            fields={{ text: "text", value: "value" }}
            placeholder="Select interest"
            className="combo-box w-[92%] md:w-[96%] font-bold"
            change={(e: { value: string | undefined }) => {
              if (e.value) {
                handleChange("interest", e.value);
              }
            }}
            allowFiltering={true}
            filtering={(e) => {
              const userInput = e.text.toLowerCase();
              e.updateData(
                interests[
                  (formData?.groupType as keyof typeof interests) || "Friends"
                ]
                  .filter((item) => item.toLowerCase().includes(userInput))
                  .map((item) => ({ text: item, value: item }))
              );
            }}
          />
        </div>

        <div>
          <Label htmlFor="budget">Budget</Label>
          <ComboBoxComponent
            id="budget"
            dataSource={budget.map((item) => ({ text: item, value: item }))}
            fields={{ text: "text", value: "value" }}
            placeholder="Select budget"
            className="combo-box w-[92%] md:w-[96%] font-bold"
            change={(e: { value: string | undefined }) => {
              if (e.value) {
                handleChange("budget", e.value);
              }
            }}
            allowFiltering={true}
            filtering={(e) => {
              const userInput = e.text.toLowerCase();
              e.updateData(
                budget
                  .filter((item) => item.toLowerCase().includes(userInput))
                  .map((item) => ({ text: item, value: item }))
              );
            }}
          />
        </div>

        <div className="w-full">
          <Map
            mapPins={
              place
                ? [
                    {
                      latitude: place?.latitude,
                      longitude: place?.longitude,
                      place: place?.location || "",
                    },
                  ]
                : []
            }
          />
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading || dbLoading}
        >
          {loading || dbLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <img src="/magic-star.svg" />
              Generate
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default NewTripForm;
