import type { Knex } from "knex";
import type { HistoryRepository, UserRecord } from "./types.ts";

export class PGHistoryRepository implements HistoryRepository {
  constructor(private readonly client: Knex) {}

  getLastActiveList = async (): Promise<UserRecord[]> => {
    return await this.client.select("*").from("users");
  };

  saveLastActive = async (user_id: string) => {
    await this.client
      .insert({
        user_id,
        last_active: new Date().toISOString(),
      })
      .into("users")
      .onConflict("user_id")
      .merge();
  };
}
