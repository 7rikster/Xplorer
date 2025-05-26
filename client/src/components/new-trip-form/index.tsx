"use client";

import { useState } from "react";
import PlaceSearchBox from "../place-search-box";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { budget, groupTypes, interests, travelStyle } from "@/app/constants";
import Map from "../map";
import { Button } from "../ui/button";

function NewTripForm() {
  type Place = {
    location: string;
    placeId: string;
    latitude: number;
    longitude: number;
  };
  type TripFormData = {
    duration: number;
    place: string;
    groupType: string;
    travelStyle: string;
    interest: string;
    budget: string;
  };
  const [place, setPlace] = useState<Place | null>(null);
  const [formData, setFormData] = useState<TripFormData | null>(null);

  function handleChange(key: keyof TripFormData, value: string | number) {
    if (key === "duration" && typeof value !== "number") {
      console.error("Duration must be a number");
      return;
    }

    setFormData((prevData) => {
      const updatedData = {
        duration:
          key === "duration" ? (value as number) : prevData?.duration ?? 0,
        place: key === "place" ? (value as string) : prevData?.place ?? "",
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

  return (
    <div>
      <form className="p-6 bg-white rounded-lg shadow-md space-y-4">
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
            className="combo-box w-[96%] font-bold"
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
            className="combo-box w-[96%] font-bold"
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
            className="combo-box w-[96%] font-bold"
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
            className="combo-box w-[96%] font-bold"
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

        <div className="w-full h-96">
          <Map
            latitude={place?.latitude}
            longitude={place?.longitude}
            place={place?.location || ""}
          />
        </div>

        <Button className="w-full"><img src="/magic-star.svg"/>Generate</Button>
      </form>
    </div>
  );
}

export default NewTripForm;
