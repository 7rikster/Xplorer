"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Delete, MapPin, SquarePen, Star } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

interface AdminCardProps {
  image: string;
  name: string;
  description?: string;
  rating?: number;
  onEditNavigate?: string;
  id: string;
  onDelete: (id: string, publicId: string) => Promise<void>;
  isEdit?: boolean;
  publicId: string;
  location?: string;
}

function AdminCard({
  image,
  name,
  description,
  rating,
  onEditNavigate,
  onDelete,
  id,
  publicId,
  location,
  isEdit = true,
}: AdminCardProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="w-29 sm:w-40 md:w-60 p-1 md:p-2 gap-0 md:gap-4">
      <Image
        src={image}
        alt={name}
        width={300}
        height={10}
        className="rounded-lg h-20 md:h-40"
      />
      <CardContent className="px-1 py-0 flex flex-col items-center justify-start">
        <div className="flex flex-col md:flex-row items-start justify-between md:items-center w-full  md:mb-2">
          <div>
            <p className="font-bold text-lg md:text-2xl">{name}</p>
            {description && (
              <p className="text-gray-600 text-sm md:text-md md:font-bold">
                {description}
              </p>
            )}
            {location && (
              <p className="text-gray-600 text-sm md:text-md md:font-semibold flex ">
                <MapPin className="w-4 h-5 mr-0.5"/>
                {location}
              </p>
            )}
          </div>
          <div>
            {rating && (
              <p className="font-bold flex">
                {Array.from({ length: rating }, (_, i) => (
                  <Star
                    key={i}
                    color="#ffdd00"
                    strokeWidth={3}
                    className="w-3 md:w-4"
                  />
                ))}
              </p>
            )}
          </div>
        </div>
        <div
          className={`flex flex-row ${
            !isEdit ? "justify-end" : "justify-between"
          } items-center w-full mb-2 mt-2`}
        >
          {isEdit && (
            <Link href={onEditNavigate || ""}>
              <Button
                variant="outline"
                className="cursor-pointer w-8 h-8 md:w-20 md:h-9"
              >
                <SquarePen /> <span className="hidden md:block">Edit</span>
              </Button>
            </Link>
          )}

          <Button
            disabled={loading}
            className={`w-8 h-8 md:w-20 md:h-9 ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={async () => {
              setLoading(true);
              await new Promise((r) => setTimeout(r, 0));
              toast.loading(`Deleting ${name}...`);
              try {
                await onDelete(id, publicId);
                toast.dismiss();
                toast.success(`Deleted ${name} successfully!`);
              } catch (error) {
                console.error("Error deleting item:", error);
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Delete /> <span className={`hidden md:block`}>Delete</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminCard;
