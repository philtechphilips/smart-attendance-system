import { Socket } from "socket.io-client";

const emitWebSocketEvent = (
  socket: Socket,
  eventName: string,
  eventData: any,
) => {
  // Emit a custom event to the server
  socket.emit(eventName, eventData);
};

export default emitWebSocketEvent;
