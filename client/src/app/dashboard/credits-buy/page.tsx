"use client";

import Loading from "@/app/loading";
import CreditsPlanCard from "@/components/creditsPlanCard";
import { creditPlans } from "@/constants";
import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function BuyCredits() {
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  async function fetchCredits() {
    setLoading(true);
    const token = await user?.getIdToken();
    if (!token) {
      console.error("User is not authenticated");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/credits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.data) {
        setCredits(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchCredits();
    }
  }, []);
  if (loading) return <Loading />;

  return (
    <div className="md:pl-20 flex flex-col pt-10 md:pt-4 min-h-screen bg-gray-100 w-full p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold ">Buy Credits</h1>
          <p className="text-gray-600 hidden md:block mt-1">
            Buy more Credits to Generate Itineraries
          </p>
        </div>
        <div className="p-5  bg-white rounded-lg shadow-lg inline-block">
          <h1 className="text-center text-4xl font-bold">{credits}</h1>
          <h1 className="text-xl font-semibold">Credits</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8  mt-12 lg:px-22">
        {
            creditPlans.map((plan, index) => (
                <CreditsPlanCard
                key={index}
                name={plan.name}
                price={plan.price}
                credits={plan.credits}
                description={plan.description}
                itineraryEdit={plan.itineraryEdit}
                customerSupport={plan.customerSupport}
                updates={plan.updates}
                />
            ))
        }
      </div>
    </div>
  );
}

export default BuyCredits;
