import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = (options?: object) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize the socket connection
    const socketInstance: Socket = io(process.env.NEXT_PUBLIC_BE_URL, options);
    setSocket(socketInstance);

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [options]);

  return socket;
};

export default useSocket;
