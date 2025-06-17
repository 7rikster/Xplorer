"use client";

import ChatContainer from "@/components/chat-container";
import EmptyChatContainer from "@/components/empty-chat-container";
import GroupChatContainer from "@/components/group-chat-container";
import { useUser } from "@/context/authContext";
import { SocketProvider } from "@/context/socketContext";
import { useAppStore } from "@/store";
import { Group } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

function Chat() {
  // Add a type argument or cast to the correct type if available, e.g. useAppStore<{ selectedChatData: YourType }>
  const { selectedChatData } = useAppStore() as { selectedChatData: any };
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user?.role === "ADMIN") {
      toast.error("You are not allowed to access this page");
      router.push("/admin");
    }
  }, [user, router]);

  return (
    <SocketProvider>
      <div className="flex p-2 pt-11 md:p-5 h-screen bg-gray-200  md:ml-18 ">
        <div className="flex w-full h-full shadow-xl rounded-lg">
          <GroupChatContainer />
          {selectedChatData === undefined ? (
            <EmptyChatContainer />
          ) : (
            <ChatContainer />
          )}
        </div>
      </div>
    </SocketProvider>
  );
}

export default Chat;
