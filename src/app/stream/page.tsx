"use client";
// pages/broadcast.tsx
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { FaBroadcastTower, FaStop } from "react-icons/fa";

type RoomCreatedMessage = string;
type NewViewerMessage = string;
type OfferMessage = { sender: string; offer: RTCSessionDescriptionInit };
type AnswerMessage = { sender: string; answer: RTCSessionDescriptionInit };
type IceCandidateMessage = { sender: string; candidate: RTCIceCandidate };

const BroadcastPage = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [viewers, setViewers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null); // Initialize as null
  const streamRef = useRef<MediaStream | null>(null); // Initialize as null
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("process.env.NEXT_PUBLIC_BE_URL"); // Replace with your NestJS server URL

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      stopStreaming();
    };
  }, []);

  const startStreaming = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;

      // Create a room
      socketRef.current?.emit("create-room");
      socketRef.current?.on("room-created", (roomId: RoomCreatedMessage) => {
        setRoomId(roomId);
        setIsStreaming(true);
      });

      // Handle new viewers
      socketRef.current?.on("new-viewer", (viewerId: NewViewerMessage) => {
        setViewers((prev) => [...prev, viewerId]);
        createPeerConnection(viewerId, stream);
      });

      // Handle answers from viewers
      socketRef.current?.on("answer", ({ sender, answer }: AnswerMessage) => {
        const pc = peerConnectionsRef.current[sender];
        if (pc) {
          pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      // Handle ICE candidates from viewers
      socketRef.current?.on(
        "ice-candidate",
        ({ sender, candidate }: IceCandidateMessage) => {
          const pc = peerConnectionsRef.current[sender];
          if (pc && candidate) {
            pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        },
      );
    } catch (error) {
      console.error("Error starting stream:", error);
    }
  };

  const createPeerConnection = (viewerId: string, stream: MediaStream) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Add tracks to peer connection
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    // Handle ICE candidate generation
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", {
          target: viewerId,
          candidate: event.candidate,
        });
      }
    };

    // Create and send offer
    peerConnection
      .createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .then(() => {
        if (peerConnection.localDescription) {
          socketRef.current?.emit("offer", {
            target: viewerId,
            offer: peerConnection.localDescription,
          });
        }
      });

    peerConnectionsRef.current[viewerId] = peerConnection;
  };

  const stopStreaming = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null; // Changed from undefined to null
    }

    Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
    peerConnectionsRef.current = {};

    if (socketRef.current) {
      socketRef.current.off("room-created");
      socketRef.current.off("new-viewer");
      socketRef.current.off("answer");
      socketRef.current.off("ice-candidate");
    }

    setRoomId("");
    setViewers([]);
    setIsStreaming(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Live Stream Broadcaster</h1>

      {!isStreaming ? (
        <button
          onClick={startStreaming}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaBroadcastTower className="mr-2" /> Start Streaming
        </button>
      ) : (
        <div>
          <div className="mb-4">
            <video
              ref={(video) => {
                if (video && streamRef.current) {
                  video.srcObject = streamRef.current;
                }
              }}
              autoPlay
              muted
              className="w-full max-w-2xl border rounded"
            />
          </div>

          <div className="mb-4">
            <p className="font-semibold">Room ID: {roomId}</p>
            <p className="font-semibold">Viewers: {viewers.length}</p>
          </div>

          <button
            onClick={stopStreaming}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaStop className="mr-2" /> Stop Streaming
          </button>
        </div>
      )}
    </div>
  );
};

export default BroadcastPage;
