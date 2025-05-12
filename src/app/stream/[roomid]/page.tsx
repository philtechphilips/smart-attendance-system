"use client";
import { useParams, useRouter } from "next/navigation";
// pages/watch/[roomId].tsx
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type RoomJoinedMessage = string;
type InvalidRoomMessage = void;
type BroadcasterDisconnectedMessage = void;
type OfferMessage = { sender: string; offer: RTCSessionDescriptionInit };
type IceCandidateMessage = { sender: string; candidate: RTCIceCandidate };

const WatchPage = () => {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.roomid;
  const [status, setStatus] = useState("Connecting...");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!roomId) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_BE_URL); // Replace with your NestJS server URL

    socketRef.current.emit("join-room", roomId as any);

    socketRef.current.on("room-joined", (roomId: RoomJoinedMessage) => {
      setStatus("Waiting for stream...");
      setIsConnected(true);
    });

    socketRef.current.on("invalid-room", () => {
      setStatus("Stream Ended");
    });

    socketRef.current.on("broadcaster-disconnected", () => {
      setStatus("Broadcaster has ended the stream");
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    });

    socketRef.current.on("offer", async ({ sender, offer }: OfferMessage) => {
      setStatus("Connecting to stream...");
      try {
        // Create peer connection
        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peerConnectionRef.current = peerConnection;

        // Set up event handlers
        peerConnection.onicecandidate = (event) => {
          if (event.candidate && socketRef.current) {
            socketRef.current.emit("ice-candidate", {
              target: sender,
              candidate: event.candidate,
            });
          }
        };

        peerConnection.ontrack = (event) => {
          if (videoRef.current && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
            setStatus("Live");
          }
        };

        // Set remote description and create answer
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer),
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        if (socketRef.current && peerConnection.localDescription) {
          socketRef.current.emit("answer", {
            target: sender,
            answer: peerConnection.localDescription,
          });
        }
      } catch (error) {
        console.error("Error handling offer:", error);
        setStatus("Error connecting to stream");
      }
    });

    socketRef.current.on(
      "ice-candidate",
      ({ sender, candidate }: IceCandidateMessage) => {
        if (peerConnectionRef.current && candidate) {
          peerConnectionRef.current
            .addIceCandidate(new RTCIceCandidate(candidate))
            .catch((err) => console.error("Error adding ICE candidate:", err));
        }
      },
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [roomId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Live Stream Viewer</h1>

      <div className="mb-4">
        <p className="font-semibold">Room ID: {roomId}</p>
        <p className="font-semibold">Status: {status}</p>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls
        className="w-full max-w-2xl border rounded"
      />

      {!isConnected && (
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </button>
      )}
    </div>
  );
};

export default WatchPage;
