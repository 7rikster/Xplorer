"use client";

import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");
  const [user] = useAuthState(auth);

  useEffect(() => {
    async function updatePaymentStatus() {
      const token = await user?.getIdToken();
      if (!token) {
        console.error("User is not authenticated");
        return;
      }
      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/booking/update`,
          { paymentIntent },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTimeout(()=>{
            router.push("/dashboard");
        }, 3000);
     

      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    }
    if (paymentIntent) {
      updatePaymentStatus();
    }
  }, [paymentIntent, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 w-full p-4">
      <div className="bg-white shadow-xl rounded-lg p-4 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-xl text-center md:text-2xl font-semibold">
          Payment successful. You are being redirected to the Dashboard
        </h1>
        <div className="w-20 h-20 rounded-full bg-[#03f81c] flex items-center justify-center text-white">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-lg md:text-2xl font-semibold text-center">
          Please do not close this page
        </h1>
      </div>
    </div>
  );
}

export default SuccessPage;
