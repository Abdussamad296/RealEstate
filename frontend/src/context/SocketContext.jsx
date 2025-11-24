import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { initSocket, disconnectSocket, getSocket } from "../Service/socket";

const SocketContext = createContext();

export const SocketProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?._id) {
      const newSocket = initSocket(user._id);
      setSocket(newSocket);
    }
    return () => {
      disconnectSocket();
    };
  }, [user]);

    return (
        <SocketContext.Provider value={socket}>
        {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
