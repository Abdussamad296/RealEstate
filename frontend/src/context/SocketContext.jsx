// src/context/SocketProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?._id) {
      // User not logged in → disconnect and cleanup
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Create new socket connection
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      transports: ["websocket", "polling"], // websocket first, fallback to polling
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("registerUser", user._id); // Register user when connected
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    // Cleanup on unmount or user change
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        setSocket(null);
      }
    };
  }, [user?._id]); // Reconnect only when user ID changes

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};