import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Camera from "../../components/live/Camera";
import Chat from "../../components/live/Chat";
import { useToast } from "@/components/ui/use-toast";

import io from "socket.io-client";

const pc_config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const SOCKET_SERVER_URL = "https://socketio.nizamettinsimsek.com";

const Live = () => {
  let { roomId } = useParams();
  const { toast } = useToast();

  const socketRef = useRef();
  const pcRef = useRef();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("https://robohash.org/odioeahic.png?size=300x300&set=set1");
  const [firstDialog, setFirstDialog] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (firstDialog) return;
    document.title = roomId ? `Live | ${roomId}` : "Live";

    socketRef.current = io.connect(SOCKET_SERVER_URL);
    pcRef.current = new RTCPeerConnection(pc_config);

    socketRef.current.on("all_users", (users) => {
      console.log("all_users", users);
      if (users.length > 0) {
        createOffer();
      }
    });

    socketRef.current.on("getOffer", (sdp) => {
      console.log("getOffer");
      createAnswer(sdp);
    });

    socketRef.current.on("getAnswer", (sdp) => {
      console.log("getAnswer");
      if (!pcRef.current) return;
      pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socketRef.current.on("getCandidate", async (candidate) => {
      if (!pcRef.current) return;
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("candidate add success");
    });

    startVideo();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, [roomId, firstDialog]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      if (!(pcRef.current && socketRef.current)) return;

      stream.getTracks().forEach((track) => {
        if (!pcRef.current) return;
        pcRef.current.addTrack(track, stream);
      });

      pcRef.current.onicecandidate = (e) => {
        const { candidate } = e;
        if (candidate) {
          if (!socketRef.current) return;
          console.log("onicecandidate", candidate);
          socketRef.current.emit("candidate", candidate);
        }
      };

      pcRef.current.oniceconnectionstatechange = (e) => {
        console.log("oniceconnectionstatechange", e);
      };

      pcRef.current.ontrack = (e) => {
        console.log("add remotetrack success");
        console.log("ontrack", e);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      };

      socketRef.current.emit("join_room", { roomId, user: { firstName, lastName, avatar } });
    } catch (error) {
      console.error("startVideo Error : ", error);
    }
  };

  const createOffer = async () => {
    console.log("create offer");
    if (!(pcRef.current && socketRef.current)) return;

    try {
      const sdp = await pcRef.current.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
      await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
      socketRef.current.emit("offer", sdp);
    } catch (error) {
      console.error("createOffer Error : ", error);
    }
  };

  const createAnswer = async (sdp) => {
    if (!(pcRef.current && socketRef.current)) return;
    try {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      console.log("answer set remote description success");
      const mySdp = await pcRef.current.createAnswer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
      console.log("create answer success");
      await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
      socketRef.current.emit("answer", mySdp);
    } catch (error) {
      console.error("createAnswer Error : ", error);
    }
  };

  const avatarLinks = [
    {
      id: 1,
      link: "https://robohash.org/odioeahic.png?size=300x300&set=set1",
    },
    {
      id: 2,
      link: "https://robohash.org/delenitiautquod.png?size=300x300&set=set1",
    },
    {
      id: 3,
      link: "https://robohash.org/sinterrorid.png?size=300x300&set=set1",
    },
    {
      id: 4,
      link: "https://robohash.org/saepeautemnobis.png?size=300x300&set=set1",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4">
      {firstDialog ? (
        <Card className="w-full max-w-lg h-auto m-auto bg-slate-200">
          <CardHeader className="text-center">
            <CardTitle>Odaya Katıl</CardTitle>
            <CardDescription>Odaya katılmak için bilgilerinizi giriniz</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Label htmlFor="firstName">Adınızı giriniz</Label>
            <Input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <Label htmlFor="lastName">Soyadınızı giriniz</Label>
            <Input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <Label htmlFor="avatar">Avatarınızı giriniz</Label>
            <div className="flex justify-between">
              {avatarLinks.map((avatarLink) => {
                return (
                  <img
                    className={"w-20 h-20 rounded-full hover:cursor-pointer" + (avatar === avatarLink.link ? " outline outline-2 outline-green-400" : "")}
                    key={avatarLink.id}
                    src={avatarLink.link}
                    alt="avatar"
                    onClick={() => {
                      setAvatar(avatarLink.link);
                    }}
                  />
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              onClick={() => {
                if (firstName?.length < 3 || lastName?.length < 3) {
                  toast({
                    title: "Hata",
                    description: "Adınız ve soyadınız en az 3 karakter olmalıdır",
                    variant: "destructive",
                    duration: 3000,
                  });
                  return;
                }
                setFirstDialog(false);
              }}
            >
              Katıl
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <React.Fragment>
          <Card className="w-full h-1/3 lg:h-full flex flex-col flex-grow">
            <CardContent className="p-2 gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full flex-auto overflow-y-auto">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full" />
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full" />
            </CardContent>
          </Card>
          {/* <Chat
            myId={myId}
            messages={messages}
            sendMessage={sendMessage}
            message={message}
            setMessage={setMessage}
          /> */}
        </React.Fragment>
      )}
    </div>
  );
};

export default Live;
