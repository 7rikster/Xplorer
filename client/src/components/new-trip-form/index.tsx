"use client";

import { useEffect, useState } from "react";
import PlaceSearchBox from "../place-search-box";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { budget, groupTypes, interests, travelStyle } from "@/constants";
import Map from "../map";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import Loading from "@/app/loading";
import SingleSelector from "../single-select";
import { useUser } from "@/context/authContext";
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "../ui/dialog";
import { useRouter } from "next/navigation";

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
  const [credits, setCredits] = useState(0);
  const { user: userInfo } = useUser();
  const [buyCreditsDialogOpen, setBuyCreditsDialogOpen] = useState(false);
  const router = useRouter();

  async function handleGenerateTrip(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if(userInfo && userInfo.role !== "ADMIN" && credits <= 0){
      setBuyCreditsDialogOpen(true);
      return;
    } 
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

  async function fetchCredits() {
    const token = await user?.getIdToken();
    if (!token) {
      console.error("User is not authenticated");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/credits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.data) {
        setCredits(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  }

  useEffect(() => {
    if (userInfo && userInfo.role !== "ADMIN") {
      fetchCredits();
    }
  }, []);

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
          <Label htmlFor="duration" className="mb-1">
            Duration
          </Label>
          <Input
            id="duration"
            name="duration"
            placeholder="Enter number of days"
            type="number"
            className="placeholder:text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleChange("duration", Number(e.target.value))}
          />
        </div>

        <div className="w-full relative">
          <Label htmlFor="groupType" className="mb-1">
            Group Type
          </Label>
          <SingleSelector
            options={groupTypes.map((item) => ({ label: item, value: item }))}
            placeholder="Select group type"
            onChange={(option) => {
              if (option && option.value) {
                handleChange("groupType", option.value);
              }
            }}
          />
        </div>

        <div className="w-full relative">
          <Label htmlFor="travelStyle" className="mb-1">
            Travel Style
          </Label>

          <SingleSelector
            options={travelStyle[
              (formData?.groupType as keyof typeof travelStyle) || "Friends"
            ].map((item) => ({ label: item, value: item }))}
            placeholder="Select Travel Style"
            onChange={(option) => {
              if (option && option.value) {
                handleChange("travelStyle", option.value);
              }
            }}
          />
        </div>

        <div className="w-full relative">
          <Label htmlFor="interest" className="mb-1">
            Interest
          </Label>

          <SingleSelector
            options={interests[
              (formData?.groupType as keyof typeof interests) || "Friends"
            ].map((item) => ({ label: item, value: item }))}
            placeholder="Select Interest "
            onChange={(option) => {
              if (option && option.value) {
                handleChange("interest", option.value);
              }
            }}
          />
        </div>

        <div className="w-full relative">
          <Label htmlFor="budget" className="mb-1">
            Budget
          </Label>

          <SingleSelector
            options={budget.map((item) => ({ label: item, value: item }))}
            placeholder="Select Budget "
            onChange={(option) => {
              if (option && option.value) {
                handleChange("budget", option.value);
              }
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
      <Dialog open={buyCreditsDialogOpen} onOpenChange={setBuyCreditsDialogOpen}>
        <DialogContent className="z-1000 w-96">
          <DialogHeader>
            <DialogTitle className="text-center">Ooops!! You ran out of Credits</DialogTitle>
          </DialogHeader>
          <div className="md:p-6 text-center space-y-4">
            <p className="text-gray-600 mb-4">
              You need to buy credits to generate itineraries. Please purchase
              credits to continue.
            </p>
            <Button
            
              onClick={() => {
                setBuyCreditsDialogOpen(false);
                router.push("/dashboard/credits-buy");
              }}
              className="w-full cursor-pointer"
            >
              Buy Credits
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NewTripForm;
