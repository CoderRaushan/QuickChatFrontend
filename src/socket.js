// src/socket.js
import { io } from "socket.io-client";

let socket;

export const initSocket = (userId) => {
  socket = io("http://localhost:7464", {
    query: { userId },
    transports: ["websocket"],
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
