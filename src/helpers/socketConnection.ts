import { io, Socket } from "socket.io-client";
import { API_URL } from "./axios-request";

const makeWebSocketConnection = (): Socket => {
  const socket = io(API_URL, {
    autoConnect: false,
    transports: ["websocket"],
  });

  // Event handler for when the connection is established
  socket.on("connect", () => {
    console.log("Connected to the WebSocket server");
  });

  // Error handling
  socket.on("connect_error", (error) => {
    console.error("WebSocket connection error:", error);
  });

  return socket;
};

export default makeWebSocketConnection;
