"use client";

import { useContext, createContext, useEffect, useRef } from "react";
import { useUser } from "./authContext";
import { io, Socket } from "socket.io-client";
import { useAppStore } from "@/store";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
        console.log(`Connecting to socket server for user: ${user.id}`);
      socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL, {
        withCredentials: true,
        query: { userId: user.id },
      });
      socketRef.current.on("connect", () => {
        console.log(`Connected to socket server`);
      });

      const handleReceiveGroupMessage = (message: Message) => {
        const {selectedChatData, addMessage} = useAppStore.getState();
        if(selectedChatData && selectedChatData.id === message.groupId) {
          addMessage(message);
          console.log(`Received message in group ${message.groupId}:`, message);
        }
      }

      socketRef.current.on("receive-group-message", handleReceiveGroupMessage);
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
