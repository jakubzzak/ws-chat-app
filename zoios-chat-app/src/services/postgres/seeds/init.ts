import type { Knex } from "knex";

export const seed = async (knex: Knex): Promise<void> => {
  await knex("users").insert([
    {
      user_id: "user1",
      last_active: new Date().toISOString(),
    },
    {
      user_id: "user2",
      last_active: new Date().toISOString(),
    },
    {
      user_id: "user3",
      last_active: new Date().toISOString(),
    },
  ]);
};
