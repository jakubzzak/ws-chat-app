import { Context } from "@oak/oak";
import { PGHistoryRepository } from "./services/postgres/entities/history.ts";
import { logger } from "./utils/logger.ts";

type WebSocketWithClient = WebSocket & { clientId: string; username: string };
type AppEvent = { type: string; [key: string]: any };

export default class ChatServer {
  private connectedClients = new Map<string, WebSocketWithClient>();

  constructor(private readonly historyRepo?: PGHistoryRepository) {}

  handleConnection(ctx: Context) {
    const socket = ctx.upgrade() as WebSocketWithClient;
    const username = ctx.request.url.searchParams.get("username");
    if (!username) {
      logger.error(
        "Failed to handle connection due to missing username url param"
      );
      socket.close(1008, "Username is required");
      return;
    }

    socket.clientId = crypto.randomUUID();
    socket.username = username;

    socket.onopen = () => {
      this.broadcast(socket.clientId, { type: "client_connected", username });
    };
    socket.onclose = async () => {
      await this.historyRepo?.saveLastActive(socket.clientId);
      this.clientDisconnected(socket.clientId, socket.username);
    };
    socket.onmessage = (m) => {
      this.send(socket.clientId, socket.username, m);
    };

    this.connectedClients.set(socket.clientId, socket);
    logger.info("New client connected", {
      clientId: socket.clientId,
      username: socket.username,
    });
  }

  private send(clientId: string, username: string, message: MessageEvent) {
    const data = JSON.parse(message.data);

    this.broadcast(clientId, {
      type: data.type,
      username,
      message: data.message,
    });
  }

  private clientDisconnected(clientId: string, username: string) {
    this.connectedClients.delete(clientId);
    this.broadcast(clientId, { type: "client_disconnected", username });
    logger.info("Client disconnected", { clientId, username });
  }

  private broadcast(clientId: string, event: AppEvent) {
    const eventString = JSON.stringify(event);
    logger.info("Broadcasting new event", {
      authorId: clientId,
      event,
    });

    for (const client of this.connectedClients.values()) {
      if (client.clientId !== clientId) {
        client.send(eventString);
      }
    }
  }
}
