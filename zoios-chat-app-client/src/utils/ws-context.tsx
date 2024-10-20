import { createContext, useEffect, useRef, useState } from "react";
import { w3cwebsocket } from "websocket";

type ChatMessage = {
  username: string;
  time: string;
  message: string;
};
enum EventTypes {
  SendMessage = "send_message",
}
type WebsocketContextType = {
  isConnected: boolean;
  connect: (username: string) => void;
  sendEvent: (event: EventTypes, message: string) => void;
  messages: ChatMessage[];
  disconnect: () => void;
};
const WebsocketContext = createContext<WebsocketContextType>({
  isConnected: false,
  connect: () => {},
  sendEvent: () => {},
  messages: [],
  disconnect: () => {},
});

type Props = {
  children?: React.ReactNode;
  username?: string;
};
const WebsocketProvider = ({ children, username }: Props) => {
  const ws = useRef<w3cwebsocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const connect = (username: string) => {
    const wsUrl = new URL(import.meta.env.VITE_WEBSOCKET_URL);
    wsUrl.search = new URLSearchParams({
      username,
    }).toString();
    ws.current = new w3cwebsocket(wsUrl.toString());

    ws.current.onerror = (e) => {
      console.log("onerror", e);
      setIsConnected(ws.current?.readyState === w3cwebsocket.OPEN);
    };

    ws.current.onopen = () => {
      console.log("onopen");
      setIsConnected(ws.current?.readyState === w3cwebsocket.OPEN);
    };

    ws.current.onclose = () => {
      console.log("onclose");
      setIsConnected(ws.current?.readyState === w3cwebsocket.OPEN);
    };

    ws.current.onmessage = (e) => {
      console.log("onmessage", e.data);

      let event: any;
      try {
        event = JSON.parse(e.data as string);
      } catch (error) {
        console.error("event couldn't be parsed", e.data, error);
      }

      if (event.type === "send_message") {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            username: event.username,
            time: new Date().toISOString().split(/(T|\.)/g)[2],
            message: event.message,
          },
        ]);
      } else {
        console.error("unknown event type", event.type);
      }
    };
  };

  const sendEvent = (type: EventTypes, message: string) => {
    ws.current?.send(JSON.stringify({ type, message }));
    if (type === "send_message") {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          username: "me",
          time: new Date().toISOString().split(/(T|\.)/g)[2],
          message,
        },
      ]);
    }
  };

  const disconnect = () => {
    ws.current?.close();
  };

  useEffect(() => {
    if (!username) {
      ws.current?.close();
      return;
    }

    return () => ws.current?.close();
  }, [username]);

  useEffect(() => {
    setIsConnected(ws.current?.readyState === w3cwebsocket.OPEN);
  }, [isConnected]);

  return (
    <WebsocketContext.Provider
      value={{
        isConnected: isConnected ?? false,
        connect,
        sendEvent,
        messages,
        disconnect,
      }}
    >
      {children}
    </WebsocketContext.Provider>
  );
};

export { EventTypes, WebsocketContext, WebsocketProvider };
