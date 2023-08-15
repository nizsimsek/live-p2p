import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { Link, MoreVertical, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const Chat = ({ myId, messages, sendMessage, message, setMessage }) => {
  const { toast } = useToast();

  return (
    <Card className="w-full lg:w-1/3 h-80 lg:h-full lg:flex-auto flex flex-col gap-1">
      <CardHeader className="py-1 px-2 lg:px-4 lg:pb-2 lg:pt-4 flex items-center flex-row w-full space-y-0">
        <CardTitle className="text-center">Sohbet</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-6 w-6 ml-auto" variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mx-6 bg-slate-300">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="hover:cursor-copy"
                onClick={() => {
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => {
                      toast({
                        title: "Kopyalandı!",
                        description: "Davet linki panoya kopyalandı.",
                        variant: "success",
                        duration: 2000,
                      });
                    })
                    .catch(() => {
                      toast({
                        title: "Hata!",
                        description: "Davet linki kopyalanamadı.",
                        variant: "destructive",
                        duration: 2000,
                      });
                    });
                }}
              >
                <Button
                  variant="ghost"
                  className="h-auto p-0 hover:cursor-copy"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Davet linkini kopyala
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-auto w-full overflow-y-auto py-0 px-4">
        <ScrollArea className="w-full h-full">
          {messages?.map((message, index) => {
            return (
              <React.Fragment key={index}>
                <div className="flex gap-2 items-center">
                  {message?.user?.id === messages[index - 1]?.user?.id ? (
                    <div className="w-8"></div>
                  ) : (
                    <img
                      src={message?.user?.avatar}
                      alt={message?.user?.firstName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="flex flex-col">
                    {message?.user?.id ===
                    messages[index - 1]?.user?.id ? null : (
                      <span className="font-bold">
                        {message?.user?.firstName +
                          " " +
                          message?.user?.lastName}
                      </span>
                    )}
                    <span className="text-sm">{message?.message}</span>
                  </div>
                </div>
                {message?.user?.id === messages[index + 1]?.user?.id ? null : (
                  <Separator className="my-1" />
                )}
              </React.Fragment>
            );
          })}
        </ScrollArea>
      </CardContent>
      <CardFooter className="w-full px-2 py-2 rounded-b-lg flex gap-1">
        <Input
          type="text"
          placeholder="Mesajınız.."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <Button variant="outline" size="icon" onClick={sendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Chat;
