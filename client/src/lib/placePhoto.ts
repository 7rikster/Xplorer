import axios from "axios";

interface FunctionProps {
  query: string;
  latitude: number;
  longitude: number;
}

export default async function getPlacePhoto({
  query,
  latitude,
  longitude,
}: FunctionProps) {
  const options = {
    method: "POST",
    url: "https://google-map-places-new-v2.p.rapidapi.com/v1/places:searchText",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY_2,
      "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
      "Content-Type": "application/json",
      "X-Goog-FieldMask": "*",
    },
    data: {
      textQuery: query,
      languageCode: "",
      regionCode: "",
      rankPreference: 0,
      includedType: "",
      openNow: true,
      minRating: 0,
      maxResultCount: 1,
      priceLevels: [],
      strictTypeFiltering: true,
      locationBias: {
        circle: {
          center: {
            latitude: latitude,
            longitude: longitude,
          },
          radius: 10000,
        },
      },
      evOptions: {
        minimumChargingRateKw: 0,
        connectorTypes: [],
      },
    },
  };

  try {
    const response = await axios.request(options);
    // console.log("Place search response:", response.data);
    if (response.data.places.length !== 0) {
      const photoReference = response.data.places[0].photos[1].name;
      const options2 = {
        method: "GET",
        url: `https://google-map-places-new-v2.p.rapidapi.com/v1/${photoReference}/media`,
        params: {
          maxWidthPx: "400",
          maxHeightPx: "400",
          skipHttpRedirect: "true",
        },
        headers: {
          "x-rapidapi-key":
            process.env.NEXT_PUBLIC_RAPID_API_KEY_2,
          "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
        },
      };
      const photoResponse = await axios.request(options2);
      return photoResponse.data.photoUri;
    }
  } catch (error) {
    console.error(error);
  }
}
