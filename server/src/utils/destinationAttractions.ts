import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface DestinationAttraction {
  name: string;
  address: string;
  description: string;
  latitude: string;
  longitude: string;
  locationId: string;
  neighborhood: string[];
  imageUrl?: string;
  rating: string;
}

interface DestinationAttractions {
  attractions: DestinationAttraction[];
}

interface DestinationAttractionsRequestBody {
  city: string;
  country: string;
}

export const getDestinationAttractions = async ({
  city,
  country,
}: DestinationAttractionsRequestBody) => {
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

  const locationOptions = {
    method: "GET",
    url: "https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete",
    params: {
      query: `${city}, ${country}`,
      lang: "en_US",
      units: "km",
    },
    headers: {
      "x-rapidapi-key": "714f4a5ff6msh90208b509c7ad35p1b591ajsn22a4da2c5e0a",
      "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
    },
  };

  try {
    const locationResponse = await axios.request(locationOptions);
    
    const locationId =
      locationResponse.data.data.Typeahead_autocomplete.results[0].detailsV2
        .locationId;
    console.log("Location ID:", locationId);
    if (!locationId) {
      throw new Error("Location ID not found in response");
    }
    const options = {
      method: "GET",
      url: "https://travel-advisor.p.rapidapi.com/attractions/list",
      params: {
        location_id: locationId,
        currency: "USD",
        lang: "en_US",
        lunit: "km",
        sort: "recommended",
      },
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
      },
    };
    const response = await axios.request(options);

    const attractions: DestinationAttractions = response.data.data.map(
      (attraction: any) => ({
        name: attraction.name || "No name available",
        address: attraction.address || "No address available",
        description: attraction.description || "No description available",
        latitude: attraction.latitude || "No latitude available",
        longitude: attraction.longitude || "No longitude available",
        locationId: attraction.location_id || "No location ID available",
        neighborhood:
          attraction.neighbourhood_info?.map((info: any) => info.name) || [],
        imageUrl: attraction.photo?.images?.medium?.url || null,
        rating: attraction.rating || "No rating available",
      })
    );

    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }
    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${city} ${country} &client_id=${unsplashApiKey}`
    );
    const imageUrls = (await imageResponse.json()).results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular || null);

    const data = {
      imageUrls,
      attractions,
    };

    return data;
  } catch (error) {
    console.error("Error fetching attractions:", error);
    throw error;
  }
};
