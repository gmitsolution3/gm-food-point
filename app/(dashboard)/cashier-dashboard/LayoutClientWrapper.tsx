"use client";
import { useSocket } from "@/socket/socket-provider";
import { ROLES, SOCKET_EVENTS } from "@/socket/socket.events";
import { notify } from "@/utils";
import { playNotification } from "@/utils/playNotification";
import { useEffect } from "react";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const joinRoom = () => {
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
        role: ROLES.CASHIER,
      });
    };

    const handleConnect = () => {
      joinRoom();
    };

    const handleNewNotification = (notification: string) => {
      playNotification();
      notify.success(notification);
    };

    if (socket.connected) {
      joinRoom();
    }

    socket.on(SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(SOCKET_EVENTS.NOTIFICATION, handleNewNotification);

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(SOCKET_EVENTS.NOTIFICATION, handleNewNotification);
    };
  }, [socket]);

  return <>{children}</>;
}
