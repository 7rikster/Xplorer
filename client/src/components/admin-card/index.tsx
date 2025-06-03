"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Delete, MapPin, SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { getFirstWord } from "@/lib/utils";

interface AdminCardProps {
  image: string;
  name: string;
  description?: string;
  rating?: number;
  onEditNavigate?: string;
  id: string;
  onDelete: (id: string, publicId: string) => Promise<void>;
  isEdit?: boolean;
  publicId?: string;
  location?: string;
  tags?: string[];
  onClickNavigate?: string;
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
  tags = [],
  onClickNavigate,
}: AdminCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Card className={`w-full p-1 md:p-2 gap-0 md:gap-4`}>
      <CardContent
        className={`px-1 py-0 flex flex-col items-center justify-start ${
          onClickNavigate ? "cursor-pointer" : ""
        }`}
        onClick={() => router.push(onClickNavigate || "")}
      >
        <Image
          src={image}
          alt={name}
          width={300}
          height={100}
          className="rounded-lg h-20 md:h-40 object-cover"
        />

        <div className="flex flex-col md:flex-row items-start justify-between md:items-center w-full mt-2 ">
          <div>
            <p className="font-bold text-sm md:text-xl">{name}</p>
            {description && (
              <p className="text-gray-600 text-xs md:text-md md:font-bold">
                {description}
              </p>
            )}

            {location && (
              <p className="text-gray-500 text-xs md:text-md md:font-semibold flex ">
                <MapPin className="w-4 h-5 mr-0.5" />
                {location}
              </p>
            )}
            {tags && tags.length > 0 && (
              <p className=" text-xs md:text-sm md:font-semibold flex flex-wrap mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`rounded-full px-1 sm:px-2 py-1 mr-1 mb-1 ${
                      index === 0
                        ? "bg-red-100 text-red-800"
                        : index === 1
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-800"
                    } text-[9px] md:text-sm`}
                  >
                    {getFirstWord(tag)}
                  </span>
                ))}
              </p>
            )}
          </div>
          <div>
            {rating && (
              <p className="font-bold flex">
                {Array.from({ length: rating }, (_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    className="w-2 h-2 sm:w-4 sm:h-4 text-yellow-400"
                  >
                    <path
                      fill="#FFD43B"
                      d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                    />
                  </svg>
                ))}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-1">
        <div
          className={`flex flex-row ${
            !isEdit ? "justify-end" : "justify-between"
          } items-center w-full mb-2`}
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={loading}
                className={`w-8 h-8 md:w-20 md:h-9 ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Delete /> <span className={`hidden md:block`}>Delete</span>
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-md font-bold">
                  Are you sure you want to delete {name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center gap-2">
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
                      await onDelete(id, publicId!);
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
                    <>YES</>
                  )}
                </Button>
                <Button
                  className="cursor-pointer w-8 h-8 md:w-20 md:h-9"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={loading}
                >
                  NO
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}

export default AdminCard;
