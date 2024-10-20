import { Application, Context, Router } from "@oak/oak";
import ChatServer from "./src/chat-server.ts";
import { logger } from "./src/utils/logger.ts";

const port = 8080;
const app = new Application();
const router = new Router();

// new PGHistoryRepository(
//   knex({
//     client: "pg",
//     connection: Deno.env.get("DATABASE_URL"),
//     pool: { min: 0, max: 100 },
//   })
// )
const server = new ChatServer();

router.get("/start_web_socket", (ctx: Context) => {
  server.handleConnection(ctx);
});

app.use(router.routes());
app.use(router.allowedMethods());

logger.info(`Listening at http://localhost:${port}`);
await app.listen({ port });
