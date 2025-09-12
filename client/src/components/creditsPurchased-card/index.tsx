"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface CreditPurchase {
  id: string;
  createdAt: string;
  isCompleted: boolean;
  packageType: string;
  paymentIntent: string;
  totalAmount: number;
  userId: string;
  updatedAt: string;
}

function CreditsPurchasedCard() {
  const [creditPurchases, setCreditPurchases] = useState<CreditPurchase[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPurchases, setTotalPurchases] = useState<number>(0);
  const [animatedTotalPurchases, setAnimatedTotalPurchases] =
    useState<number>(0);
  const [user] = useAuthState(auth);


  function animateNumber(finalValue: number, setValue: (val: number) => void) {
    let current = 0;
    const increment = Math.max(1, Math.floor(finalValue / 30)); // smoothness control
    const interval = setInterval(() => {
      current += increment;
      if (current >= finalValue) {
        setValue(finalValue);
        clearInterval(interval);
      } else {
        setValue(current);
      }
    }, 20);
  }

  useEffect(() => {
    animateNumber(totalPurchases, setAnimatedTotalPurchases);
  }, [totalPurchases]);

  useEffect(() => {
    async function fetchCreditPurchases() {
      if (!user) return;
      setLoading(true);
      try {
        const token = await user.getIdToken();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/creditsPurchase/get-user-purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const purchases: CreditPurchase[] = response.data.data;
        setCreditPurchases(purchases);

        const total = purchases.reduce(
          (sum, purchase) => sum + purchase.totalAmount,
          0
        );
        setTotalPurchases(total);
      } catch (error) {
        console.error("Error fetching credit purchases:", error);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchCreditPurchases();
    }
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-2xl font-semibold">Total Credits Purchase</h1>
      <h1 className="text-4xl font-semibold">$ {animatedTotalPurchases.toFixed(2)}</h1>
      <div className="mt-2 flex gap-2">
        <Link href={"/dashboard/credits-buy"} className="cursor-pointer">
          <Button variant={"outline"} className=" cursor-pointer">
            Buy Credits
          </Button>
        </Link>
        <Button
          variant={"outline"}
          className="cursor-pointer"
          onClick={() => setDialogOpen(true)}
        >
          View Details
        </Button>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl h-70 sm:h-100 px-2 sm:px-4 flex flex-col items-start justify-center">
          <DialogHeader className="flex items-center justify-center text-center w-full">
            <DialogTitle className="text-center">
              Your Credits Purchase History
            </DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-y-auto w-full">
            <ScrollArea>
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {creditPurchases && creditPurchases.length > 0
                ? creditPurchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="p-2 sm:p-4 border-b last:border-b-0 flex justify-between items-center"
                    >
                      <h1>{purchase.packageType} Plan</h1>
                      <h1 className="text-lg font-semibold">
                        ${purchase.totalAmount.toFixed(2)}
                      </h1>
                      <h1 className="text-end">
                        {new Date(purchase.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </h1>
                    </div>
                  ))
                : !loading && (
                    <div className="p-4">
                      <h1 className="text-center">
                        You have not purchased any Credits yet
                      </h1>
                    </div>
                  )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreditsPurchasedCard;
