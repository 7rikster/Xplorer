"use client";

import { useContext, createContext, useEffect, useState, useRef } from "react";
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
  const { user, loading } = useUser(); 
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!loading && user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
        withCredentials: true,
        query: { userId: user.id },
      });

      newSocket.on("connect", () => {
        console.log(`Connected to socket server with ID: ${newSocket.id}`);
      });

      newSocket.on("receive-group-message", (message: Message) => {
        const { selectedChatData, addMessage, addGroupinGroupList } =
          useAppStore.getState();
        if (selectedChatData && selectedChatData.id === message.groupId) {
          addMessage(message);
          console.log(`Received message in group ${message.groupId}:`, message);
        }
        addGroupinGroupList(message);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user, loading]);

  if (!socket) return null;

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
