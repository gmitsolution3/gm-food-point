"use client";

import { createContext, useContext, useEffect } from "react";
import { Socket } from "socket.io-client";

import { getSocket } from "@/lib/socket";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socket = getSocket();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used within SocketProvider");
  }

  return socket;
};
