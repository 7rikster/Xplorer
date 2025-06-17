import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useAppStore } from "@/store";
import Image from "next/image";

function ChatHeader() {
  const { closeChat, selectedChatData } = useAppStore();

  return (
    <div className="h-[10vh] shadow-sm flex items-center justify-between px-2 md:px-4 rounded-t-lg md:rounded-none md:rounded-tr-lg bg-white">
      <div className="flex items-center gap-2 sm:gap-5">
        <div>
          <Button
            variant={"ghost"}
            className="cursor-pointer"
            onClick={closeChat}
          >
            <ArrowLeft />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Image
            src={
              selectedChatData?.photoUrl ||
              "https://res.cloudinary.com/dqobuxkcj/image/upload/v1750107060/k5jelf6gijej6kx64c9j.jpg"
            }
            height={60}
            width={42}
            className="rounded-full object-cover h-10 w-10 sm:h-12 sm:w-12"
            alt="profile pic"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-medium">{selectedChatData?.name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
