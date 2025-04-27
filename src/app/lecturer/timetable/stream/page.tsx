"use client";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

export default function StreamingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [roomId, setRoomId] = useState<string>("83ca9237-1448-4a00-a983-4fc5645ed6fa");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:8000", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      setError(null);
      console.log("Connected to socket server");
    });

    newSocket.on("connect_error", (err) => {
      setError(`Connection error: ${err.message}`);
      console.error("Socket connection error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add your TURN servers if needed
      ],
    });
    setPeerConnection(pc);

    pc.ontrack = (event) => {
      if (videoRef.current && event.streams.length > 0) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && roomId) {
        socket.emit("ice-candidate", { candidate: event.candidate, room: roomId });
      }
    };

    const handleOffer = async ({ offer, sender }: { offer: any; sender: string }) => {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { answer, sender, room: roomId });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    const handleIceCandidate = async ({ candidate }: { candidate: any }) => {
      try {
        if (candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    };

    const handleRequestStream = async ({ requester }: { requester: string }) => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { offer, room: roomId, sender: socket.id });
      } catch (err) {
        console.error("Error handling stream request:", err);
      }
    };

    socket.on("offer", handleOffer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("request-stream", handleRequestStream);

    if (roomId) {
      socket.emit("join-room", roomId);
    }

    return () => {
      pc.close();
      socket.off("offer", handleOffer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("request-stream", handleRequestStream);
    };
  }, [socket, roomId]);

  const handleJoinRoom = () => {
    if (!roomId) {
      setError("Please enter a room ID to join.");
      return;
    }
    if (socket) {
      socket.emit("join-room", roomId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Live Streaming</h1>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <button
          onClick={handleJoinRoom}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Join Room
        </button>
      </div>
      <div className="w-full max-w-3xl bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          controls
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}