// types/socket.ts
import { Socket } from 'socket.io-client';

export interface ServerToClientEvents {
  // Define server to client events here
  'connect': () => void;
  'disconnect': (reason: string) => void;
  'connect_error': (error: Error) => void;
  'room-joined': (data: { room: string; role: string }) => void;
  'error': (data: { message: string }) => void;
  // Add more events as needed
}

export interface ClientToServerEvents {
  // Define client to server events here
  'join-room': (data: { role: string }) => void;
  'leave-room': (data: { role: string }) => void;
  // Add more events as needed
}

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;