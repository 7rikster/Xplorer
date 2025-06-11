"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./bookingWidget.css";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function BookingWidget({ price }: { price: number }) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  console.log("BookingWidget price:", price);
  const handleBooking = () => {
    alert(
      `Bookings will begin soon! Stay tuned!`
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full lg:max-w-sm mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-2 text-center">
        Select start date
      </h1>
      <div className="mb-4 flex items-center justify-center">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          minDate={new Date()}
          inline
        />
      </div>

      <div className="flex justify-between items-center gap-4 mb-4 px-1">
        <div className="flex items-center gap-2">
          <Label
            className="block text-sm font-medium text-gray-600 mb-1"
            htmlFor="adults"
          >
            Adults
          </Label>
          <input
            type="number"
            min={1}
            value={adults}
            id="adults"
            onChange={(e) => setAdults(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label
            className="block text-sm font-medium text-gray-600 mb-1"
            htmlFor="kids"
          >
            Kids (0-12)
          </Label>

          <input
            type="number"
            min={0}
            value={kids}
            id="kids"
            onChange={(e) => setKids(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 justify-between items-center mt-5">
        <h1 className="text-3xl font-bold text-center">${price*adults}</h1>
        <Button
          onClick={handleBooking}
          className=" hover:bg-red-600 font-semibold transition duration-300 cursor-pointer"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
