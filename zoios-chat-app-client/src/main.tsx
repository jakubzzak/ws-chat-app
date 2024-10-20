import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WebsocketProvider } from "./utils/ws-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WebsocketProvider>
      <App />
    </WebsocketProvider>
  </StrictMode>
);
