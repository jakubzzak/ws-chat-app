import { Label } from "@radix-ui/react-label";
import { useContext, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { UsernameDialog } from "./lib/username-dialog";
import { EventTypes, WebsocketContext } from "./utils/ws-context";

function App() {
  const { isConnected, sendEvent, messages } = useContext(WebsocketContext);
  const [message, setMessage] = useState("");
  const messageInput = useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    if (messageInput.current?.value) {
      sendEvent(EventTypes.SendMessage, messageInput.current.value);
      messageInput.current.value = "";
    }
  };

  return (
    <div className="p-12">
      <UsernameDialog />

      <Card className="min-h-[calc(100vh-6rem)]">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div>Group chat</div>
            <div>{isConnected ? "🟢" : "🔴"}</div>
          </CardTitle>
          <CardDescription className="flex justify-start">
            Members online: x
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <Card className="min-h-[calc(100vh-18rem)]">
            <CardContent className="grid grid-rows-1 pt-5">
              {messages.map((msg, index) => (
                <Label key={index} className="w-full">
                  [{msg.time}] {msg.username}: {msg.message}
                </Label>
              ))}
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="w-full flex justify-between gap-5">
          <Input
            ref={messageInput}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message.."
          />
          <Button onClick={onButtonClick} disabled={message.length === 0}>
            Send
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
