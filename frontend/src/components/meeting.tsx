"use client";

import axios from "axios";
import { use, useEffect, useRef , useState} from "react";
import { io, Socket } from "socket.io-client";

export default function Meeting() {
  const [data, setData] = useState<any[] | null>(null);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  const getdata = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    axios.get(url+"/schedule").then((res) => {
      console.log(res.data);
      setData(res.data);
    }).catch((err) => {      console.log(err);
    });
  }
  useEffect(() => {
    getdata();
  }, []);

  return (
    <div className="min-h-screen  items-center justify-center gap-6">
      {activeRoom && <Call roomId={activeRoom} />}

      <h1 className="text-2xl font-semibold">Meeting Schedule</h1>
      <table className="table-auto w-full text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">Candidate Name</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Interview ID</th>
            <th className="px-4 py-2">Interview Password</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data ? data.map((item: any) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.candidateName}</td> 
              <td className="border px-4 py-2">{item.scheduledAt}</td>
              <td className="border px-4 py-2">{item.interviewId}</td>
              <td className="border px-4 py-2">{item.interviewPassword}</td>
              <td className="border px-4 py-2">
               <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => setActiveRoom(item.code)}
              >
                Join
              </button>
              </td>
            </tr>
          )) : <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>}
        </tbody>
      </table>
    </div>
  );
}


function Call({ roomId }: { roomId: any }) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    socketRef.current = io(url!);

    peerRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    socketRef.current.emit("join-room", roomId);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach(track => peerRef.current?.addTrack(track, stream));
    });

    peerRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) socketRef.current?.emit("ice-candidate", { roomId, candidate: event.candidate });
    };

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
  }, [roomId]);

  const startCall = async () => {
    console.log("Active Room:", roomId);
    const offer = await peerRef.current?.createOffer();
    await peerRef.current?.setLocalDescription(offer!);
    socketRef.current?.emit("offer", { roomId, offer });
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">1-to-1 Video Call</h1>

      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay muted playsInline className="w-72 rounded-xl bg-black" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-72 rounded-xl bg-black" />
      </div>

      <button onClick={startCall} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">
        Start Call
      </button>
    </div>
  );
}
