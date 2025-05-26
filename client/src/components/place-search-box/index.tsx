"use client";

import { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-dropdowns/styles/material.css";
import axios from "axios";
import { get } from "http";

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
    text: String;
    value: String;
  };

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);

  async function fetchSuggestions(userInput: string) {
    if (!userInput || userInput === "" || userInput.length < 3) return;
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

      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
    }
  }

  async function setPlaceDetails() {
    const placeId = suggestions[0]?.placePrediction?.placeId;

    if (!placeId) return;

    const options = {
      method: "GET",
      url: `https://google-map-places-new-v2.p.rapidapi.com/v1/places/${placeId}`,
      headers: {
        "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY_1,
        "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
        "X-Goog-FieldMask": "*",
      },
    };

    try {
      const response = await axios.request(options);
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

  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetchSuggestions(value);
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [value]);

  useEffect(() => {
    if (suggestions.length > 0) {
      const formattedSuggestions = suggestions
        .filter((s) => s.placePrediction?.text?.text)
        .map((suggestion) => ({
          text: suggestion?.placePrediction?.text?.text || "",
          value: suggestion?.placePrediction?.text?.text || "",
        }));
      setPlaces(formattedSuggestions);
    } else {
      setPlaces([]);
    }
  }, [suggestions]);

  return (
    <div className="w-full">
      <Label htmlFor="place">Place</Label>
      <ComboBoxComponent
        id="place"
        dataSource={places}
        fields={{ text: "text", value: "value" }}
        placeholder="Search for a place"
        className="combo-box w-[96%] font-bold "
        change={(e: { value: string | undefined }) => {
          if (e.value) {
            const selectedValue = e.value as string;
            setValue(selectedValue);
            setPlaceDetails();
          }
        }}
        allowFiltering={true}
        filtering={(e) => {
          const userInput = e.text.toLowerCase();
          setValue(userInput);

          e.updateData(
            suggestions
              .filter((item) => item?.placePrediction?.text?.text !== null)
              .map((suggestion) => ({
                text: suggestion?.placePrediction?.text?.text,
                value: suggestion?.placePrediction?.text?.text,
              }))
          );
        }}
      />
    </div>
  );
}

export default PlaceSearchBox;
