"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Paperclip, SendHorizontal, SmilePlus } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useSocket } from "@/context/socketContext";
import { useUser } from "@/context/authContext";
import { useAppStore } from "@/store";
import { Input } from "../ui/input";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { set } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";

function MessageBar() {
  const [message, setMessage] = useState<string>("");
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();
  const { user: userInfo } = useUser();
  const { selectedChatData } = useAppStore();
  const [user] = useAuthState(auth);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleAddEmoji = (emoji: any) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  async function handleSendMessage() {
    if (imageUrls.length === 0 && !message.trim()) return;
    socket.emit("send-group-message", {
      sender: userInfo?.id,
      content: message,
      groupId: selectedChatData?.id,
      url: imageUrls,
      fileType: imageUrls.length === 0 ? "text" : "image",
    });
    setMessage("");
    setImageUrls([]);
  }

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  async function handleImageUploadChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedImages = event.target.files;
    if (selectedImages && selectedImages.length > 0) {
      setIsImageUploading(true);
      if(selectedImages.length >3){
        toast.error("You can only upload up to 3 images at a time. Sending the first 3 images.");
      }
      const imageFormData = new FormData();
      Array.from(selectedImages).forEach((file) => {
        imageFormData.append("files", file);
      });

      try {
        const token = await user?.getIdToken();
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/media/upload-many`,
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          setImageUrls(response.data.data);
          console.log("Image uploaded successfully:", response.data.data);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      setIsImageUploading(false);
    }
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
    <div className="h-[9vh] flex justify-center items-center px-2 md:px-8 sm:mb-3 mb-1 gap-2 md:gap-4 relative">
      <div
        className={`absolute bottom-12 md:bottom-18 left-2 right-2 md:left-8 md:right-8 p-2 md:p-4 h-20 md:h-40 bg-white rounded-md ${
          isImageUploading || imageUrls.length > 0 ? "flex" : "hidden"
        }  items-center justify-start shadow-lg`}
      >
        {isImageUploading && (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 justify-center border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {imageUrls.length > 0 && (
          <div className="flex gap-2 items-center justify-start h-full">
            {imageUrls.map((url) => (
              <Image
                key={url}
                src={url}
                width={200}
                height={200}
                alt="Uploaded"
                className="w-20 h-20 md:w-40 md:h-40 max-h-full object-cover rounded-md"
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 flex bg-white rounded-md items-center gap-2 md:gap-4 md:pr-5">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 h-full text-sm md:text-[1rem] md:p-5 p-3 bg-transparent rounded-md focus:border-none focus:outline-none    "
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          variant={"ghost"}
          className="cursor-pointer text-neutral-500 w-5 h-5 sm:h-10 sm:w-10 flex items-center justify-center"
          onClick={handleAttachmentClick}
        >
          <ImagePlus />
          <Input
            ref={fileInputRef}
            onChange={(event) => handleImageUploadChange(event)}
            type="file"
            accept="image/*"
            className="hidden"
            multiple
          />
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
