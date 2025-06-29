import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface DestinationResponse {
    place: string;
    country: string;
    description: string;
}

export default function MoodBasedSuggestion() {
  const [mood, setMood] = useState("");
  const [destination, setDestination] = useState<DestinationResponse | null>(null);

  const handleSubmit = async () => {
    const response = {
      place: "Queenstown",
      country: "New Zealand",
      description:
        "Queenstown is known as the adventure capital of the world. It's perfect for an adventurous mood with thrilling activities like bungee jumping, skydiving, white-water rafting, and mountain biking. The stunning landscapes of mountains and lakes add to the adrenaline-fueled experience.",
    };
    setDestination(response);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full shadow-lg rounded-lg bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      {" "}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl"
      >
        {" "}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {" "}
          Where Should You Go Based on Your Mood?{" "}
        </h1>{" "}
        <p className="text-gray-600 text-lg mb-6">
          {" "}
          Your mood is the compass. Let us find the destination.{" "}
        </p>{" "}
        <div className="flex gap-2 items-center">
          {" "}
          <Textarea
            className="w-full rounded-2xl shadow-md"
            placeholder="Tell us about your mood... (e.g., adventurous, relaxed, romantic)"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />{" "}
          <Button onClick={handleSubmit} className="rounded-2xl">
            {" "}
            <Sparkles className="mr-1 w-4 h-4" /> Suggest{" "}
          </Button>{" "}
        </div>{" "}
      </motion.div>
      {destination && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 w-full max-w-md"
        >
          <Card className="rounded-2xl shadow-xl bg-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {destination.place}, {destination.country}
              </h2>
              <p className="text-gray-600 mt-2">{destination.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
