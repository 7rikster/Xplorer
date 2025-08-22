import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMarkdownToJson } from "./utils.js";
dotenv.config();

interface SuggestionRequestBody {
  mood: string;
}

interface DestinationResponse{
    place: string;
    country: string;
    description: string;
}

export const getAISuggestedDestination = async ({ mood }: SuggestionRequestBody) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY2!);
  const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY!;

  try {
    const prompt = `You are a highly detailed travel assistant. Suggest a travel destination based on the user's current travel mood.

Requirements:
- Use the mood provided below.
- Recommend *only one* destination that best fits the mood.
- Output a *JSON* object with the following structure:
  - place: Name of the destination
  - country: Country of the destination
  - description: A short paragraph explaining why this destination fits the user's mood, including its vibe, activities, and atmosphere.

Mood: ${mood}

Respond in **clean, valid JSON only** (no markdown or comments), following the format below:
    { 
        "place": "Queenstown",
        "country": "New Zealand",
        "description": "Queenstown is known as the adventure capital of the world. It's perfect for an adventurous mood with thrilling activities like bungee jumping, skydiving, white-water rafting, and mountain biking. The stunning landscapes of mountains and lakes add to the adrenaline-fueled experience, making it a top pick for thrill-seekers."
    }

Guidelines: Do not include markdown or extra text — **output only pure JSON**.
`;

    const textResult = await genAI
      .getGenerativeModel({ model: "gemini-2.0-flash" })
      .generateContent([prompt]);

    const trip = parseMarkdownToJson(textResult.response.text()) as DestinationResponse;
    const city = trip.place || "";
    const country = trip.country || "";

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${city} ${country} &client_id=${unsplashApiKey}`
    );
    const imageUrl = (await imageResponse.json()).results
      .slice(0, 1)
      .map((result: any) => result.urls?.regular || null);

    const data = {
      imageUrl,
      place: trip.place,
      country: trip.country,
      description: trip.description,
    };

    return data;
  } catch (error) {
    console.error("Error generating trip:", error);
    throw new Error("Failed to generate trip");
  }
};
