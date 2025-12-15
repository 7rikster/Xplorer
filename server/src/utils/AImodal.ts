import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMarkdownToJson } from "./utils.js";
dotenv.config();

interface TripRequestBody {
    location: string;
    numberOfDays: number;
    travelStyle: string;
    interests: string;
    budget: string;
    groupType: string;
}

export const getAIGeneratedTrip = async ({location, numberOfDays, travelStyle, interests, budget, groupType}: TripRequestBody) => {


  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

  try {
    const prompt = `You are a highly detailed travel assistant.

    Generate a ${numberOfDays}-day personalized travel itinerary for a trip to ${location}, based on the following user preferences:
    - Budget: '${budget}'
    - Interests: '${interests}'
    - Travel Style: '${travelStyle}'
    - Group Type: '${groupType}'

    Respond in **clean, valid JSON only** (no markdown or comments), following the format below:

    {
    "name": "Descriptive and catchy trip title",
    "description": "Brief highlight (max 100 words) about the experience and what makes the trip special",
    "estimatedPrice": "Estimated lowest total price for the trip in USD, e.g. $1350",
    "duration": ${numberOfDays},
    "budget": "${budget}",
    "travelStyle": "${travelStyle}",
    "location": "${location}",
    "interests": ${interests},
    "groupType": "${groupType}",
    "bestTimeToVisit": [
        "🌸 Spring (Mar–May): reason to visit",
        "☀️ Summer (Jun–Aug): reason to visit",
        "🍁 Autumn (Sep–Nov): reason to visit",
        "❄️ Winter (Dec–Feb): reason to visit"
    ],
    "weatherInfo": [
        "☀️ Summer: 25°C–32°C (77°F–90°F)",
        "🌦️ Monsoon: 20°C–28°C (68°F–82°F)",
        "🍁 Autumn: 18°C–25°C (64°F–77°F)",
        "❄️ Winter: 5°C–15°C (41°F–59°F)"
    ],
    "location": {
        "city": "Main destination",
        "country": "Country name",
        "coordinates": [latitude, longitude],
        "openStreetMap": "https://www.openstreetmap.org/?mlat=lat&mlon=lon"
    },
    "accommodation": {
        "hotelName": "Recommended hotel or stay",
        "stars": 4,
        "location": "Hotel area description",
        "pricePerNight": "$150",
        "amenities": ["Wi-Fi", "Pool", "Breakfast", "Airport shuttle"],
        "photoUrl": "https://example.com/hotel-photo.jpg",
        "bookingLink": "https://example.com/hotel-booking"
    },
    "transport": {
        "localTransport": ["Metro", "Bike rentals", "Taxi"],
        "intercityTransport": ["Train", "Car rental", "Flight if needed"],
        "notes": "Travel from City A to B takes 2h by train. Local taxis are recommended for attractions."
    },
    "itinerary": [
        {
        "day": 1,
        "location": "City or attraction",
        "photoUrl": "https://example.com/day1.jpg",
        "activities": [
            {
            "time": "Morning",
            "description": "Breakfast at a famous café",
            "location": "Central Market Café",
            "ticketPrice": "Free entry",
            "openingHours": "7:00 AM – 11:00 AM",
            "travelTimeFromHotel": "10 minutes by walk"
            },
            {
            "time": "Midday",
            "description": "Visit the National Museum with a guided tour",
            "location": "National Museum of Art",
            "ticketPrice": "$12",
            "openingHours": "10:00 AM – 5:00 PM",
            "travelTimeFromHotel": "15 minutes by metro"
            },
            {
            "time": "Afternoon",
            "description": "Explore local markets and try street food",
            "location": "Old Town Bazaar",
            "ticketPrice": "Free entry",
            "openingHours": "11:00 AM – 8:00 PM",
            "travelTimeFromPrevious": "10 minutes walk"
            },
            {
            "time": "Evening",
            "description": "Dinner at a rooftop restaurant with city views",
            "location": "Skyline Dine & Wine",
            "ticketPrice": "Average meal $25 per person",
            "openingHours": "6:00 PM – 11:00 PM",
            "travelTimeFromHotel": "15 minutes by cab"
            }
        ]
        },
        ...
    ]
    }

    Guidelines:
    - Each day must have a relevant "photoUrl" (use Unsplash or a similar source).
    - Include all ticket prices, travel durations, and attraction opening hours.
    - Activities must reflect the user's interests and travel style (e.g. adventure, leisure, cultural).
    - Ensure variety and balance: culture, relaxation, local cuisine, nature, etc.
    - Do not include markdown or extra text — **output only pure JSON**.
    `;

    const textResult = await genAI.getGenerativeModel({model: "gemini-2.5-flash"}).generateContent([prompt]);

    const trip = parseMarkdownToJson(textResult.response.text());
    const city = location.split(",")[0].trim();

    const imageResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${city} &client_id=${unsplashApiKey}`
    );
    const imageUrls = (await imageResponse.json()).results.slice(0,3).map((result: any) => result.urls?.regular || null);

    const data = {
        imageUrls,
        tripDetail: JSON.stringify(trip)
      }

      return data;

  } catch (error) {
    console.error("Error generating trip:", error);
    throw new Error("Failed to generate trip");
}
};
