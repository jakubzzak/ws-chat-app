import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { PGHistoryRepository } from "./history.ts";
import knex from "npm:knex";

describe("PGHistoryRepository", () => {
  const db = knex({
    client: "pg",
    connection: Deno.env.get("DATABASE_URL"),
    pool: { min: 0, max: 100 },
  });

  describe("getLastActiveList", () => {
    it("succeeds with empty activity log", async () => {
      const historyRepo = new PGHistoryRepository(db);

      const activity = await historyRepo.getLastActiveList();

      expect(activity.length).toBe(0);
    });

    it("succeeds with 2 activity logs after they are inserted", async () => {
      const historyRepo = new PGHistoryRepository(db);
      await Promise.all([
        historyRepo.saveLastActive("client1"),
        historyRepo.saveLastActive("client2"),
      ]);

      const activity = await historyRepo.getLastActiveList();

      expect(activity.length).toBe(2);
    });
  });

  describe("saveLastActive", () => {
    it("succeeds with creating a new activity log", async () => {
      const historyRepo = new PGHistoryRepository(db);
      const activityBefore = await historyRepo.getLastActiveList();

      await historyRepo.saveLastActive("client99");

      const activityAfter = await historyRepo.getLastActiveList();
      expect(activityAfter).toEqual(
        expect.arrayContaining([
          {
            client_id: "client99",
            last_active: expect.any(String),
          },
        ])
      );
      expect(activityAfter.length).toBe(activityBefore.length + 1);
    });

    it("succeeds with updating exiting client record", async () => {
      const historyRepo = new PGHistoryRepository(db);
      await historyRepo.saveLastActive("client12");
      const activityBefore = await historyRepo.getLastActiveList();

      await historyRepo.saveLastActive("client12");

      const activityAfter = await historyRepo.getLastActiveList();
      expect(activityAfter.length).toBe(activityBefore.length);
      expect(activityAfter[0].last_active > activityBefore[0].last_active);
    });
  });
});
