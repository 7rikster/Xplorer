"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

function AddDestination() {
  const [destinationData, setDestinationData] = useState({
    name: "",
    placeId: "",
    imageUrl: "",
    rating: 0,
  });

  return (
    <div className="px-8 pt-28">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Add a new Destination</h1>
        <Button className="text-lg px-8 py-5 cursor-pointer">Submit</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Destination details</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter name of the destination"
          />
          <Label htmlFor="location">Location</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter name of the destination"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default AddDestination;
