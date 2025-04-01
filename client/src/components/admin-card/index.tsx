import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Delete, SquarePen, Star } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface AdminCardProps {
  image: string;
  name: string;
  description?: string;
  rating?: number;
  onEditNavigate: string;
  onDelete?: () => void;
}

function AdminCard({
  image,
  name,
  description,
  rating,
  onEditNavigate,
  onDelete,
}: AdminCardProps) {
  return (
    <Card className="w-40 md:w-60 p-2">
      <Image
        src={"/image3.jpg"}
        alt={name}
        width={300}
        height={300}
        className="rounded-lg"
      />
      <CardContent className="px-1 py-0 flex flex-col items-center justify-between">
        <div className="flex justify-between items-center w-full mb-2">
          <div>
            <p className="font-bold text-lg md:text-2xl">{name}</p>
            {description && (
              <p className="text-gray-600 text-sm md:text-md md:font-bold">
                {description}
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
        <div className="flex flex-row justify-between items-center w-full mb-2 mt-2">
          <Link href={onEditNavigate}>
            <Button variant="outline" className="cursor-pointer">
              <SquarePen /> <span className="hidden md:block">Edit</span>
            </Button>
          </Link>
          <Button className="cursor-pointer">
            <Delete /> <span className="hidden md:block">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminCard;
