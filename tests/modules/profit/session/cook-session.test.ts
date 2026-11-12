import { describe, it, expect } from "vitest";
import {
  CookSessionStore,
  SESSION_TTL_MS,
  CreateCookSessionParams,
  MAX_DRAFT_LENGTH,
  MAX_RETAINED_DRAFT_LENGTH,
} from "../../../../src/modules/profit/session/cook-session.js";
import { CookingRecipe } from "../../../../src/modules/profit/domain/types.js";
import { parseRate } from "../../../../src/modules/profit/domain/rate.js";

const recipe: CookingRecipe = {
  id: "berry_crepes",
  name: "Berry Crepes",
  heatLevel: "Low",
  punchTiming: "1m",
  ingredients: [
    { id: "flour", name: "Flour", quantity: 1, timing: "0s", requirement: "required" },
  ],
};

function createParams(overrides?: Partial<CreateCookSessionParams>): CreateCookSessionParams {
  return {
    guildId: "guild-1",
    channelId: "channel-1",
    userId: "user-1",
    recipe,
    batchQuantity: 1,
    includeSpices: false,
    savedPrices: new Map([["flour", parseRate("200/150")]]),
    ...overrides,
  };
}

describe("CookSessionStore", () => {
  it("exposes a ten minute absolute TTL", () => {
    expect(SESSION_TTL_MS).toBe(10 * 60 * 1000);
  });

  it("creates sessions with opaque short ids and expiry metadata", () => {
    const store = new CookSessionStore({ now: () => 1000 });
    const session = store.create(createParams());

    expect(session).not.toBeNull();
    expect(session!.id).toMatch(/^[a-f0-9]{16}$/);
    expect(session!.createdAt).toBe(1000);
    expect(session!.expiresAt).toBe(1000 + SESSION_TTL_MS);
    expect(session!.revision).toBe(0);
    expect(session!.messageId).toBeNull();
    expect(session!.recipe.id).toBe("berry_crepes");
    expect(session!.savedPrices.get("flour")?.rate?.wl).toBe(150);
  });

  it("retrieves sessions by id and by message binding", () => {
    const store = new CookSessionStore({ now: () => 1000 });
    const session = store.create(createParams())!;
    session.messageId = "message-1";

    expect(store.get(session.id)?.id).toBe(session.id);
    expect(store.getByMessage("message-1")?.id).toBe(session.id);
    expect(store.getByMessage("unknown")).toBeNull();
  });

  it("rejects unknown ids and expired sessions", () => {
    let now = 1000;
    const store = new CookSessionStore({ now: () => now });
    const session = store.create(createParams())!;

    now = 1000 + SESSION_TTL_MS + 1;
    expect(store.get(session.id)).toBeNull();
    expect(store.size()).toBe(0);

    const again = store.create(createParams())!;
    expect(store.get(again.id)?.id).toBe(again.id);
  });

  it("treats the boundary between active and expired precisely", () => {
    let now = 1000;
    const store = new CookSessionStore({ now: () => now });
    const session = store.create(createParams())!;

    now = 1000 + SESSION_TTL_MS;
    expect(store.get(session.id)).not.toBeNull();

    now = 1000 + SESSION_TTL_MS + 1;
    expect(store.get(session.id)).toBeNull();
  });

  it("bumps revision on each mutation and skips stale mutations", () => {
    const store = new CookSessionStore({ now: () => 1000 });
    const session = store.create(createParams())!;

    const updated = store.mutate(session.id, (s) => {
      s.sellRate = parseRate("1/3");
    });

    expect(updated?.revision).toBe(1);
    expect(updated?.sellRate?.rate?.wl).toBe(3);
    expect(store.get(session.id)?.revision).toBe(1);

    expect(store.mutate("missing-id", () => undefined)).toBeNull();
  });

  it("deletes sessions on cancel", () => {
    const store = new CookSessionStore({ now: () => 1000 });
    const session = store.create(createParams())!;

    expect(store.delete(session.id)).toBe(true);
    expect(store.get(session.id)).toBeNull();
    expect(store.delete(session.id)).toBe(false);
  });

  it("evicts the oldest session of a user beyond the per-user bound", () => {
    let now = 1000;
    const store = new CookSessionStore({ now: () => now, maxPerUser: 2 });

    const first = store.create(createParams())!;
    now = 2000;
    const second = store.create(createParams())!;
    now = 3000;
    const third = store.create(createParams({ channelId: "channel-2" }))!;

    expect(store.get(first.id)).toBeNull();
    expect(store.get(second.id)?.id).toBe(second.id);
    expect(store.get(third.id)?.id).toBe(third.id);
  });

  it("evicts the globally oldest session when the total bound is reached", () => {
    let now = 1000;
    const store = new CookSessionStore({
      now: () => now,
      maxSessions: 2,
      maxPerUser: 10,
    });

    const first = store.create(createParams())!;
    now = 2000;
    store.create(createParams({ userId: "user-2" }))!;
    now = 3000;
    store.create(createParams({ userId: "user-3" }))!;

    expect(store.get(first.id)).toBeNull();
    expect(store.size()).toBe(2);
  });

  it("sweeps expired sessions lazily and reports the count", () => {
    let now = 1000;
    const store = new CookSessionStore({ now: () => now });
    store.create(createParams())!;
    store.create(createParams({ userId: "user-2" }))!;

    now = 1000 + SESSION_TTL_MS + 1;
    const removed = store.sweep();
    expect(removed).toBe(2);
    expect(store.size()).toBe(0);
  });

  it("copies the saved price snapshot defensively", () => {
    const store = new CookSessionStore({ now: () => 1000 });
    const savedPrices = new Map([["flour", parseRate("200/150")]]);
    const session = store.create(createParams({ savedPrices }))!;

    savedPrices.set("egg", parseRate("100/50"));
    savedPrices.delete("flour");

    expect(session.savedPrices.get("flour")?.rate?.wl).toBe(150);
    expect(session.savedPrices.has("egg")).toBe(false);
  });

  it("exposes the draft length bounds", () => {
    expect(MAX_DRAFT_LENGTH).toBe(100);
    expect(MAX_RETAINED_DRAFT_LENGTH).toBeGreaterThan(MAX_DRAFT_LENGTH);
  });

  describe("compare-and-swap mutations", () => {
    it("applies a mutation only when the expected revision matches", () => {
      const store = new CookSessionStore({ now: () => 1000 });
      const session = store.create(createParams())!;

      const result = store.mutateIf(session.id, 0, (s) => {
        s.sellRate = parseRate("1/3");
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.session.revision).toBe(1);
        expect(result.session.sellRate?.rate?.wl).toBe(3);
      }
    });

    it("rejects stale and unknown CAS mutations without state changes", () => {
      const store = new CookSessionStore({ now: () => 1000 });
      const session = store.create(createParams())!;

      const stale = store.mutateIf(session.id, 5, () => undefined);
      expect(stale.ok).toBe(false);
      if (!stale.ok) {
        expect(stale.reason).toBe("stale");
      }
      expect(session.revision).toBe(0);

      const missing = store.mutateIf("missing-id", 0, () => undefined);
      expect(missing.ok).toBe(false);
      if (!missing.ok) {
        expect(missing.reason).toBe("missing");
      }
    });

    it("applies only one of two concurrent same-revision mutations", () => {
      const store = new CookSessionStore({ now: () => 1000 });
      const session = store.create(createParams())!;

      const first = store.mutateIf(session.id, 0, (s) => {
        s.sellRate = parseRate("1/3");
      });
      const second = store.mutateIf(session.id, 0, (s) => {
        s.sellRate = parseRate("2/1dl");
      });

      expect(first.ok).toBe(true);
      expect(second.ok).toBe(false);
      if (!second.ok) {
        expect(second.reason).toBe("stale");
      }
      expect(session.revision).toBe(1);
      expect(session.sellRate).toEqual(parseRate("1/3"));
    });

    it("rolls a transition back so the prior revision stays usable", () => {
      const store = new CookSessionStore({ now: () => 1000 });
      const session = store.create(createParams())!;
      session.rangeChoices.set("sugar", 2);

      const result = store.mutateIf(session.id, 0, (s) => {
        s.rangeChoices.set("sugar", 3);
        s.sellRate = parseRate("1/3");
        s.rateDrafts.set("flour", { raw: "1/3", parsed: parseRate("1/3"), error: null });
      });
      expect(result.ok).toBe(true);
      expect(session.revision).toBe(1);

      if (result.ok) {
        result.rollback();
      }

      expect(session.revision).toBe(0);
      expect(session.rangeChoices.get("sugar")).toBe(2);
      expect(session.sellRate).toBeNull();
      expect(session.rateDrafts.size).toBe(0);

      const retry = store.mutateIf(session.id, 0, (s) => {
        s.sellRate = parseRate("2/1dl");
      });
      expect(retry.ok).toBe(true);
    });

    it("skips rollback for superseded transitions without clobbering them", () => {
      const store = new CookSessionStore({ now: () => 1000 });
      const session = store.create(createParams())!;

      const first = store.mutateIf(session.id, 0, (s) => {
        s.sellRate = parseRate("1/3");
      });
      const second = store.mutateIf(session.id, 1, (s) => {
        s.sellRate = parseRate("2/1dl");
      });
      expect(first.ok && second.ok).toBe(true);

      if (first.ok) {
        first.rollback();
      }
      expect(session.revision).toBe(2);
      expect(session.sellRate).toEqual(parseRate("2/1dl"));

      if (second.ok) {
        second.rollback();
      }
      expect(session.revision).toBe(1);
      expect(session.sellRate).toEqual(parseRate("1/3"));
    });

    it("never rolls a cancelled session back into existence", () => {
      const store = new CookSessionStore({ now: () => 1000 });
      const session = store.create(createParams())!;

      const result = store.mutateIf(session.id, 0, (s) => {
        s.sellRate = parseRate("1/3");
      });
      expect(result.ok).toBe(true);

      store.delete(session.id);
      if (result.ok) {
        result.rollback();
      }
      expect(store.get(session.id)).toBeNull();
    });
  });

  describe("per-session publication lock", () => {
    it("serializes tasks per session while other sessions run freely", async () => {
      const store = new CookSessionStore({ now: () => 1000 });
      const first = store.create(createParams())!;
      const other = store.create(createParams({ userId: "user-2" }))!;

      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      const order: string[] = [];

      const taskA = store.withSessionLock(first.id, async () => {
        order.push("a-start");
        await gate;
        order.push("a-end");
        return "a";
      });
      await Promise.resolve();
      const taskB = store.withSessionLock(first.id, async () => {
        order.push("b");
        return "b";
      });
      const taskC = store.withSessionLock(other.id, async () => {
        order.push("c");
        return "c";
      });
      await Promise.resolve();
      await Promise.resolve();

      expect(order).toEqual(["a-start", "c"]);

      release();
      await expect(taskA).resolves.toBe("a");
      await expect(taskB).resolves.toBe("b");
      await expect(taskC).resolves.toBe("c");
      expect(order).toEqual(["a-start", "c", "a-end", "b"]);
    });

    it("propagates task failures and releases the lock afterwards", async () => {
      const store = new CookSessionStore({ now: () => 1000 });
      const session = store.create(createParams())!;

      const failing = store.withSessionLock(session.id, async () => {
        throw new Error("publication failed");
      });
      await expect(failing).rejects.toThrow("publication failed");

      const locks = (
        store as unknown as { locks: Map<string, unknown> }
      ).locks;
      await Promise.resolve();
      await Promise.resolve();
      expect(locks.size).toBe(0);

      const followUp = await store.withSessionLock(session.id, async () => "ok");
      expect(followUp).toBe("ok");
    });
  });
});
