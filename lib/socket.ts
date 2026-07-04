import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const socketUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SOCKET_URL
    : process.env.NEXT_PUBLIC_SOCKET_DEV_URL;

export const getSocket = () => {
  if (!socket) {
    socket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }

  return socket;
};
