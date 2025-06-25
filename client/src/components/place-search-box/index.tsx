"use client";

import { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-dropdowns/styles/material.css";
import axios from "axios";
import { get } from "http";
import SingleSelector from "../single-select";

type Place = {
  location: string;
  placeId: string;
  latitude: number;
  longitude: number;
};

interface PlaceSearchBoxProps {
  setPlace: Dispatch<SetStateAction<Place | null>>;
}

function PlaceSearchBox({ setPlace }: PlaceSearchBoxProps) {
  const [value, setValue] = useState("");
  type Suggestion = {
    placePrediction?: {
      placeId?: string;
      text?: {
        text?: string;
      };
    };
  };
  type Place = {
    label: string;
    value: string;
  };

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);

  async function fetchSuggestions(userInput: string) {
    if (!userInput || userInput === "" || userInput.length < 3) return;
    console.log(process.env.NEXT_PUBLIC_RAPID_API_KEY_3);
    try {
      const url =
        "https://google-map-places-new-v2.p.rapidapi.com/v1/places:autocomplete";
      const options = {
        method: "POST",
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY_3,
          "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "*",
        },
        data: {
          input: userInput,
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
      console.log("Api called for place details:");
      const suggestions = response.data.suggestions || [];

      return suggestions
        .filter((s: any) => s.placePrediction?.text?.text)
        .map((s: any) => ({
          label: s.placePrediction.text.text!,
          value: s.placePrediction.placeId!,
        }));
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
      return [];
    }
  }

  async function setPlaceDetails(placeId: string) {
    console.log(suggestions);
    console.log("Place ID:", placeId);
    if (!placeId || placeId === "") return;

    const options = {
      method: "GET",
      url: `https://google-map-places-new-v2.p.rapidapi.com/v1/places/${placeId}`,
      headers: {
        "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY_3,
        "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
        "X-Goog-FieldMask": "*",
      },
    };

    try {
      const response = await axios.request(options);
      console.log("Hiii");
      setPlace({
        location: response.data.formattedAddress || "",
        placeId: placeId,
        latitude: response.data.location?.latitude || 0,
        longitude: response.data.location?.longitude || 0,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-full relative">
      <Label htmlFor="place" className="mb-1">
        Place
      </Label>

      <SingleSelector
        options={places}
        placeholder="Search for a place"
        onChange={(option) => {
          if (option && option.value) {
            const selectedLabel = option.label as string;
            const selectedValue = option.value as string;
            setValue(selectedLabel);
            setPlaceDetails(selectedValue);
          }
        }}
        onSearch={fetchSuggestions}
      />
    </div>
  );
}

export default PlaceSearchBox;
