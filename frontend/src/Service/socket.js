import { io } from "socket.io-client";

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io("http://localhost:3000", { withCredentials: true });
    socket.emit("registerUser", userId);
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
  socket = null;
};
