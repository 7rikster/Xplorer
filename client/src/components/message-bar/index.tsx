"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Paperclip, SendHorizontal, SmilePlus } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useSocket } from "@/context/socketContext";
import { useUser } from "@/context/authContext";
import { useAppStore } from "@/store";

function MessageBar() {
  const [message, setMessage] = useState<string>("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const {user} = useUser();
  const {selectedChatData} = useAppStore();

  const handleAddEmoji = (emoji: any) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  async function handleSendMessage() {
    if(!message.trim()) return;
    socket.emit("send-group-message", {
      sender: user?.id,
      content: message,
      groupId: selectedChatData?.id,
      url: [],
      fileType: "text"
    })
    setMessage("");
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [emojiRef]);

  useEffect(() => {
    import("emoji-picker-react");
  }, []);

  return (
    <div className="h-[9vh] flex justify-center items-center px-2 md:px-8 sm:mb-3 mb-1 gap-2 md:gap-4 ">
      <div className="flex-1 flex bg-white rounded-md items-center gap-2 md:gap-4 md:pr-5">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 h-full text-sm md:text-[1rem] md:p-5 p-3 bg-transparent rounded-md focus:border-none focus:outline-none    "
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <Button variant={"ghost"} className="cursor-pointer text-neutral-500 w-5 h-5 sm:h-10 sm:w-10 flex items-center justify-center">
          <Paperclip />
        </Button>
        <div className="relative">
          <Button
            variant={"ghost"}
            className="cursor-pointer text-neutral-500 w-5 h-5 sm:w-10 sm:h-10 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setEmojiPickerOpen((prev) => !prev);
            }}
          >
            <SmilePlus />
          </Button>
          {emojiPickerOpen && (
            <div
              className="absolute bottom-16 right-0"
              ref={emojiRef}
              onClick={(e) => e.stopPropagation()}
            >
              <EmojiPicker
                theme={Theme.LIGHT}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
          {typeof window !== "undefined" && (
            <div className="hidden">
              <EmojiPicker
                theme={Theme.LIGHT}
                onEmojiClick={() => {}}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>
      <Button
        className="cursor-pointer text-white text-3xl h-10 md:h-15  sm:w-12 md:w-15 p-0 hover:bg-[#e21a35]"
        onClick={handleSendMessage}
      >
        <SendHorizontal className="text-4xl w-8 h-8" />
      </Button>
    </div>
  );
}

export default MessageBar;
