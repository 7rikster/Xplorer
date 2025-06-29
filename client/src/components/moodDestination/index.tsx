import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import { toast } from "sonner";
import Image from "next/image";

interface DestinationResponse {
  place: string;
  country: string;
  description: string;
  imageUrl?: string;
}

export default function MoodDestinationCard() {
  const [mood, setMood] = useState("");
  const [destination, setDestination] = useState<DestinationResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [user] = useAuthState(auth);

  const handleSubmit = async () => {
    const token = await user?.getIdToken();
    if (!token) {
      console.error("User is not authenticated");
      return;
    }
    if (!mood.trim()) {
      toast.error("Mood cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/mood-destination/generate`,
        {
          mood,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response from AI:", response.data);
      setDestination({
        place: response.data.data.place,
        country: response.data.data.country,
        description: response.data.data.description,
        imageUrl: response.data.data.imageUrl
          ? response.data.data.imageUrl[0]
          : "",
      });
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/moodDestination/create`,
        {
          imageUrl: response.data.data.imageUrl
            ? response.data.data.imageUrl[0]
            : "",
          place: response.data.data.place,
          country: response.data.data.country,
          description: response.data.data.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error fetching destination:", error);
      toast.error("Failed to fetch destination. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDestination = async () => {
      if (!user) return;
      setInitialLoading(true);
      const token = await user.getIdToken();
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/moodDestination/get`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDestination(response.data.data);
      } catch (error) {
        console.error("Error fetching destination:", error);
        toast.error("Failed to fetch destination. Please try again.");
      }
      finally{
        setInitialLoading(false);
      }
    };
    fetchDestination();
  }, [user]);

  

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full shadow-lg rounded-lg bg-white px-4 py-2">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full shadow-lg rounded-lg bg-white px-4 py-2">
      {" "}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl"
      >
        {" "}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {" "}
          Where Should You Go Based on Your Mood?{" "}
        </h1>{" "}
        {!destination && (
          <div>
            <p className="text-gray-600 text-lg mb-6">
              {" "}
              In the mood for adventure? Romance? Relaxation? Let us match your
              emotions with the perfect escape .{" "}
            </p>{" "}
            <div className="flex gap-2 items-center">
              {" "}
              <Textarea
                className="w-full rounded-2xl "
                placeholder="Tell us about your mood... (e.g., adventurous, relaxed, romantic)"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              />{" "}
              <Button
                onClick={handleSubmit}
                className="rounded-xl cursor-pointer w-24"
                disabled={loading || !mood.trim()}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="mr-1 w-4 h-4" /> Suggest{" "}
                  </div>
                )}
              </Button>{" "}
            </div>
          </div>
        )}
      </motion.div>
      {destination && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className=" w-full max-w-md flex flex-col h-full"
        >
          <div className="rounded-2xl shadow-xl bg-white">
            <div className="relative">
              <Image
                src={destination.imageUrl || "/placeholder-image.jpg"}
                alt={`Image of ${destination.place}`}
                width={500}
                height={300}
                className="w-full h-56 lg:h-42 object-cover rounded-t-2xl"
              />
              <h2 className="text-2xl font-semibold  absolute bottom-4 left-4 text-gray-100">
                {destination.place}, {destination.country}
              </h2>
            </div>
            <div className="p-2">
              <p className="text-gray-600 ">{destination.description}</p>
            </div>
          </div>
          <div className=" flex justify-center gap-3 items-center mt-4 lg:mt-3">
            <h1 className="text-gray-600 text-lg ">Mood Changed?</h1>
            <Button
            disabled={loading}
              onClick={async () => {
                setLoading(true);
                const token = await user?.getIdToken();
                await axios.delete(
                  `${process.env.NEXT_PUBLIC_API_URL}/moodDestination/delete`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                setMood("");
                setLoading(false);
                setDestination(null);
              }}
              className="cursor-pointer w-24"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Reset mood"
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
