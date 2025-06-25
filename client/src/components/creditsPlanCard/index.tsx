"use client";

import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { useUser } from "@/context/authContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreditsPlanCardProps {
  name: string;
  price: number;
  credits: number;
  description: string;
  itineraryEdit: boolean;
  customerSupport: boolean;
  updates: boolean;
}

function CreditsPlanCard({
  name,
  price,
  credits,
  description,
  itineraryEdit,
  customerSupport,
  updates,
}: CreditsPlanCardProps) {
  const [user] = useAuthState(auth);
  const { user: userInfo } = useUser();
  const router = useRouter();

  async function handleBuyCredit() {
    const token = await user?.getIdToken();
    if (!token) {
      console.error("User is not authenticated");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/creditsPurchase/create`,
        {
          packageType: name,
          userId: userInfo?.id,
          totalAmount: price,
          credits: credits,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.client_secret) {
        router.push(`/checkout?client_secret=${response.data.client_secret}`);
      } else {
        toast.error("Failed to book trip.");
      }
    } catch (error) {
      console.error("Error buying credits:", error);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-xl font-semibold text-primary">{name} Plan</h1>
        <h1 className="text-5xl font-bold">${price}</h1>
        <h1 className="text-gray-500">{credits} credits</h1>
      </div>
      <div className="px-4 lg:px-12 mt-8 flex flex-col items-start justify-start space-y-4">
        <div className="flex items-center gap-6 justify-start">
          <span className="rounded-full p-1 bg-[#e5eff6] text-[#0648ed]">
            <Check />
          </span>
          <h1>{description}</h1>
        </div>
        <div className="flex items-center gap-6 justify-start">
          <span
            className={`rounded-full p-1 ${
              itineraryEdit
                ? "bg-[#e5eff6] text-[#0648ed]"
                : "bg-[#f6e5e5] text-[#ed0606]"
            } `}
          >
            {itineraryEdit ? <Check /> : <X />}
          </span>
          <h1>Edit Itineraries</h1>
        </div>
        <div className="flex items-center gap-6 justify-start">
          <span
            className={`rounded-full p-1 ${
              customerSupport
                ? "bg-[#e5eff6] text-[#0648ed]"
                : "bg-[#f6e5e5] text-[#ed0606]"
            } `}
          >
            {customerSupport ? <Check /> : <X />}
          </span>
          <h1>Priority Customer Support</h1>
        </div>
        <div className="flex items-center gap-6 justify-start">
          <span
            className={`rounded-full p-1 ${
              updates
                ? "bg-[#e5eff6] text-[#0648ed]"
                : "bg-[#f6e5e5] text-[#ed0606]"
            } `}
          >
            {updates ? <Check /> : <X />}
          </span>
          <h1>Priority Updates</h1>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-center">
        <Button className="w-[60%] cursor-pointer" onClick={handleBuyCredit}>
          Buy Credit
        </Button>
      </div>
    </div>
  );
}

export default CreditsPlanCard;
