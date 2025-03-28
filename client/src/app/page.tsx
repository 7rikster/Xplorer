import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-start bg-[url(/cover-photo.jpg)] bg-cover bg-center">
      <div className="h-[80%] w-[40%] p-20 text-white text-xl font-sans flex flex-col justify-center">
        <p>
          Discover the world like never before with Xplorer! 🌍✨ Search for
          breathtaking destinations, uncover hidden gems, explore places across
          the globe and plan your perfect trip—all in one seamless experience.
          Let Xplorer be your smart travel companion!
        </p>
        <div className="flex space-x-4 mt-8">
          <Link href="/explore">
            <Button className="cursor-pointer w-25">Explore</Button>
          </Link>
          <Link href="/generate">
            <Button
              variant="outline"
              className="bg-transparent cursor-pointer w-25"
            >
              Generate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
