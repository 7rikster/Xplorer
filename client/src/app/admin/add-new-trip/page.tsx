"use client";

import NewTripForm from "@/components/new-trip-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function AddNewTrip() {
   
  const router = useRouter();

  return (
    <main className="flex flex-col items-start justify-start p-4 md:p-8 bg-gray-100 min-h-screen gap-6 md:gap-10 pb-20">
      <div className="flex flex-col items-start justify-start space-y-2 md:space-y-4">
        <Button
          className="cursor-pointer text-xs md:text-sm h-7 md:h-auto"
          onClick={() => router.push("/admin")}
        >
          <ArrowLeft /> Back to Dashboard
        </Button>
        <div>
          <h1 className="text-lg md:text-2xl font-bold">Add a New Trip</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Create a new AI generated trip by filling out the form below.
          </p>
        </div>
      </div>
      <section className="mt-2.5 w-full max-w-2xl mx-auto">
        <NewTripForm  />
      </section>
    </main>
  );
}

export default AddNewTrip;
