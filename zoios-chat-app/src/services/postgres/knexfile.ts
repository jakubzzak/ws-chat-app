import type { Knex } from "knex";

export const knexConfig: { [key: string]: Knex.Config } = {
  test: {
    client: "pg",
    connection: {
      database: "postgres",
      user: "postgres",
      password: "password",
    },
    pool: { min: 1, max: 50 },
    migrations: {
      directory: ["./migrations"],
    },
    seeds: {
      directory: ["./seeds"],
    },
  },
};
