import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

const useSocketNotifications = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("newNotification", (data) => {
      toast.success(`🔔 ${data.title}`);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [socket]);
};

export default useSocketNotifications;
