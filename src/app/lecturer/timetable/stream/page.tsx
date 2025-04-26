"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BE_URL); // Replace with your backend URL

export default function StreamingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [roomId, setRoomId] = useState<string>(
    "83ca9237-1448-4a00-a983-4fc5645ed6fa",
  ); // Room ID to join

  useEffect(() => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle incoming ICE candidates
    socket.on("ice-candidate", async ({ candidate }) => {
      if (candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Handle incoming offer
    socket.on("offer", async ({ offer, sender }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { answer, sender });
    });

    // Handle request to resend the stream
    socket.on("request-stream", async ({ requester }) => {
      if (peerConnection) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", { offer, room: roomId, sender: socket.id });
      }
    });

    // Join the room
    if (roomId) {
      socket.emit("join-room", roomId);
    }

    return () => {
      pc.close();
      socket.off("ice-candidate");
      socket.off("offer");
      socket.off("request-stream");
    };
  }, [roomId]);

  const handleJoinRoom = () => {
    if (!roomId) {
      alert("Please enter a room ID to join.");
      return;
    }
    socket.emit("join-room", roomId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Live Streaming</h1>
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
