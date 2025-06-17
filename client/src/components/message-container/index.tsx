"use client";

import { useUser } from "@/context/authContext";
import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { set } from "date-fns";
import { Button } from "../ui/button";

function MessageContainer() {
  const { selectedChatData, selectedChatMessages, setSelectedChatMessages } =
    useAppStore();
  const { user: userInfo } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const rendermessages = () => {
    let lastDate: string | null = null;
    let lastSenderId: string | null = null;

    return selectedChatMessages.map((message: Message, index: number) => {
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      const isSameSender = lastSenderId === message.sender.id;
      lastDate = messageDate;
      lastSenderId = message.sender.id;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.createdAt).format("LL")}
            </div>
          )}
          {renderGroupMessages(message, isSameSender)}
        </div>
      );
    });
  };

  const renderGroupMessages = (message: Message, isSameSender: boolean) => {
    const isCurrentUser = message.sender.id === userInfo?.id;

    return (
      <div
        className={`${isSameSender ? "mt-1" : "mt-5"} ${
          isCurrentUser ? "text-right" : "text-left"
        } w-full`}
      >
        {message.content !== "" && (
          <div
            className={`${
              isCurrentUser ? "justify-end" : "justify-start flex-wrap-reverse"
            } gap-1 sm:gap-2 w-auto flex break-words mr-2 sm:mr-0`}
          >
            {/* Only show profile image if not same sender as previous */}
            {!isCurrentUser && !isSameSender && (
              <div className="ml-2 sm:ml-0">
                <Image
                  src={message.sender.photoUrl || "/default-avatar.png"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full w-8 h-8 md:w-10 md:h-10"
                />
              </div>
            )}
            <div
              className={`${
                isCurrentUser ? "bg-primary text-white" : "bg-white text-black"
              } px-3 py-1 rounded-lg max-w-[70%] inline-block ${
                isSameSender ? "ml-11 sm:ml-10 md:ml-12" : ""
              }`}
            >
              {!isSameSender && message.sender.id !== userInfo?.id && (
                <div className="font-semibold text-[11px] sm:text-xs">
                  {message.sender.name}
                </div>
              )}
              <div className="pb-1 text-sm md:text-[1rem]">
                {message.content}
              </div>
              <div className="text-[10px] sm:text-xs text-right">
                {moment(message.createdAt).format("LT")}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  useEffect(() => {
    const getChannelmessages = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setSelectedChatMessages([]);
        const token = await user.getIdToken();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/groupChat/get-group-messages/${selectedChatData?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data) {
          // console.log("Fetched group messages:", response.data.data);
          setSelectedChatMessages(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching group messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedChatData && selectedChatData.id) {
      getChannelmessages();
    }
  }, [selectedChatData]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      setShowScrollButton(!isBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  console.log(showScrollButton)

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden sm:p-4 w-full" ref={containerRef}>
      {rendermessages()}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="w-10 h-10 justify-center border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div ref={scrollRef} className="w-full h-0"></div>
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          variant={"outline"}
          className="absolute bottom-17 right-1 h-7 w-6 sm:h-8 sm:w-8 sm:bottom-26 sm:right-12 cursor-pointer z-10 "
        >
          ↓
        </Button>
      )}
    </div>
  );
}

export default MessageContainer;
