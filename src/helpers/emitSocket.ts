import { Socket } from "socket.io-client";

const emitWebSocketEvent = (
  socket: Socket,
  eventName: string,
  eventData: any,
) => {
  // Emit a custom event to the server
  socket.emit(eventName, eventData);
};

export const emitJoinBroadcast = (socket: Socket, roomId: string) => {
  socket.emit("joinBroadcast", { roomId });
};

export const emitBroadcastStarted = (socket: Socket, roomId: string) => {
  socket.emit("broadcastStarted", { roomId });
};

export default emitWebSocketEvent;
