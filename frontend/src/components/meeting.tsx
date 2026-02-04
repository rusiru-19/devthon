"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function Meeting() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  const roomId = "room-123"; // same room on both clients

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");

    peerRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Join room
    socketRef.current.emit("join-room", roomId);

    // Get media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          peerRef.current?.addTrack(track, stream);
        });
      });

    // Remote stream
    peerRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // ICE candidates
    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    // Socket events
    socketRef.current.on("offer", async (offer) => {
      await peerRef.current?.setRemoteDescription(offer);
      const answer = await peerRef.current?.createAnswer();
      await peerRef.current?.setLocalDescription(answer!);
      socketRef.current?.emit("answer", { roomId, answer });
    });

    socketRef.current.on("answer", async (answer) => {
      await peerRef.current?.setRemoteDescription(answer);
    });

    socketRef.current.on("ice-candidate", async (candidate) => {
      await peerRef.current?.addIceCandidate(candidate);
    });

    return () => {
      socketRef.current?.disconnect();
      peerRef.current?.close();
    };
  }, []);

  const startCall = async () => {
    const offer = await peerRef.current?.createOffer();
    await peerRef.current?.setLocalDescription(offer!);
    socketRef.current?.emit("offer", { roomId, offer });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">1-to-1 Video Call</h1>

      <div className="flex gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-72 rounded-xl bg-black"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-72 rounded-xl bg-black"
        />
      </div>

      <button
        onClick={startCall}
        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
      >
        Start Call
      </button>
    </div>
  );
}
