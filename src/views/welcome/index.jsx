import { useContext, useEffect, useState } from "react";
import MainContext from "../../contexts/mainContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [{ room }, dispatch] = useContext(MainContext);
  const [roomName, setRoomName] = useState("");
  const [roomLink, setRoomLink] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (room?.id) {
      navigate(`/room/${room.id}`);
    }
  }, [navigate, room]);

  return (
    <Card className="w-auto h-auto m-auto p-6">
      <CardContent className="flex flex-col items-center gap-2">
        <Avatar className="w-auto h-auto mx-auto">
          <AvatarImage
            className="w-32 h-32"
            src="https://github.com/shadcn.png"
            alt="@shadcn"
          />
        </Avatar>
        <CardDescription>Live&#39;a hoşgeldiniz.</CardDescription>
        <CardDescription> Nasıl devam etmek istersiniz ?</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 p-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Oda Oluştur</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Label htmlFor="name">Oda Adı</Label>
            <Input
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
              }}
            />
            <DialogFooter>
              <Button
                onClick={() => {
                  dispatch({ type: "CREATE_ROOM", payload: roomName });
                }}
              >
                Oluştur
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Odaya Katıl</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Label htmlFor="name">Davet Linki</Label>
            <Input
              value={roomLink}
              onChange={(e) => {
                setRoomLink(e.target.value);
              }}
            />
            <DialogFooter>
              <Button
                onClick={() => {
                  let roomLink2 = roomLink.split("/").pop();
                  navigate(`/room/${roomLink2}`);
                }}
              >
                Katıl
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default Welcome;
