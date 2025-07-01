"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { CircleDollarSign, MessageSquareText, Sparkles } from "lucide-react";
import { useUser } from "@/context/authContext";
import { useRouter } from "next/navigation";

function GenerateYourOwnItinerary() {
    const {user} = useUser();
    const router = useRouter();
  return ( 
    <div className="w-full bg-gray-100 flex flex-col items-center justify-center py-8 ">
      <div className="w-full md:w-[90%] lg:w-[75%] grid grid-cols-1 md:grid-cols-2  justify-center sm:p-4 ">
        <div className=" w-full flex flex-col items-center justify-center">
          <h1 className="md:hidden text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">
            Want to Generate your own AI-powered Itinerary?
          </h1>
          <Image
            src="http://res.cloudinary.com/dqobuxkcj/image/upload/v1751108656/vzkkx0wbwviiamw7qvwd.jpg"
            alt="User Photo"
            width={300}
            height={500}
            className="md:h-full h-80 object-cover md:w-full rounded-2xl shadow-lg"
          />
        </div>
        <div className="w-full p-4 flex flex-col ">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 text-center hidden md:block">
            Want to Generate your own AI-powered Itinerary?
          </h1>
          <div className="flex flex-col items-start justify-center md:mt-6 w-full sm:px-4 gap-4">
            <div className="flex items-center bg-gray-50 w-full rounded-lg gap-3 px-4 py-2">
              <div className="text-4xl p-2 hover:bg-gray-100 bg-white rounded-md transition-all duration-200">
                <CircleDollarSign className="w-7 h-7 text-4xl text-gray-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Get Credits</h1>
                <p className="text-gray-400 text-sm font-semibold">
                  Create an account and get 5 free credits.
                </p>
              </div>
            </div>
            <div className="flex items-center bg-gray-50 w-full rounded-lg gap-3 px-4 py-2">
              <div className="text-4xl p-2 hover:bg-gray-100 bg-white rounded-md transition-all duration-200">
                <MessageSquareText className="w-7 h-7 text-4xl text-gray-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">
                  Tell us your preferences
                </h1>
                <p className="text-gray-400 text-sm font-semibold">
                  Tell us about your destination, travel preferences, interests,
                  and budget.
                </p>
              </div>
            </div>
            <div className="flex items-center bg-gray-50 w-full rounded-lg gap-3 px-4 py-2">
              <div className="text-4xl p-2 hover:bg-gray-100 bg-white rounded-md transition-all duration-200">
                <Sparkles className="w-7 h-7 text-4xl text-gray-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">
                  Get AI Generated Itinerary
                </h1>
                <p className="text-gray-400 text-sm font-semibold">
                  Receive a personalized itinerary with recommendations for day
                  to day activities, accommodations, and more.
                </p>
              </div>
            </div>
            <div className="flex items-center bg-gray-50 w-full rounded-lg gap-3 px-4 py-2">
              <div className="text-4xl p-2 hover:bg-gray-100 bg-white rounded-md transition-all duration-200">
                <CircleDollarSign className="w-7 h-7 text-4xl text-gray-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Buy Credits</h1>
                <p className="text-gray-400 text-sm font-semibold">
                  Buy credits to generate more itineraries or access premium
                  features.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center sm:px-4 mt-6">
            <Button className="w-full cursor-pointer" onClick={()=>{
                if(user) {
                    router.push("/generate");
                }
                else {
                    router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                }
            }}>
              {
                user? "Generate Itinerary" : "Login to Generate Itinerary"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateYourOwnItinerary;
