import { randomBytes } from "node:crypto";
import { CookingRecipe, ParsedRate } from "../domain/types.js";

export const SESSION_TTL_MS = 10 * 60 * 1000;
const DEFAULT_MAX_SESSIONS = 500;
const DEFAULT_MAX_PER_USER = 3;

export const MAX_DRAFT_LENGTH = 100;
export const MAX_RETAINED_DRAFT_LENGTH = 200;

export interface CookRateDraft {
  raw: string;
  parsed: ParsedRate | null;
  error: string | null;
}

export interface CookSession {
  readonly id: string;
  readonly guildId: string;
  readonly channelId: string;
  readonly userId: string;
  messageId: string | null;
  readonly recipe: CookingRecipe;
  readonly batchQuantity: number;
  readonly includeSpices: boolean;
  readonly savedPrices: ReadonlyMap<string, ParsedRate>;
  rateDrafts: Map<string, CookRateDraft>;
  sellRate: ParsedRate | null;
  sellDraft: CookRateDraft | null;
  sellFromSlash: boolean;
  rangeChoices: Map<string, number>;
  revision: number;
  readonly createdAt: number;
  readonly expiresAt: number;
}

export interface CreateCookSessionParams {
  guildId: string;
  channelId: string;
  userId: string;
  recipe: CookingRecipe;
  batchQuantity: number;
  includeSpices: boolean;
  savedPrices: ReadonlyMap<string, ParsedRate>;
}

export interface CookSessionStoreOptions {
  ttlMs?: number;
  maxSessions?: number;
  maxPerUser?: number;
  now?: () => number;
}

export type SessionMutationResult =
  | {
      ok: true;
      session: CookSession;
      rollback: () => void;
    }
  | { ok: false; reason: "missing" | "stale" };

interface SessionStateSnapshot {
  rateDrafts: Map<string, CookRateDraft>;
  sellRate: ParsedRate | null;
  sellDraft: CookRateDraft | null;
  sellFromSlash: boolean;
  rangeChoices: Map<string, number>;
  messageId: string | null;
}

function captureSessionState(session: CookSession): SessionStateSnapshot {
  return {
    rateDrafts: new Map(session.rateDrafts),
    sellRate: session.sellRate,
    sellDraft: session.sellDraft,
    sellFromSlash: session.sellFromSlash,
    rangeChoices: new Map(session.rangeChoices),
    messageId: session.messageId,
  };
}

function restoreSessionState(
  session: CookSession,
  snapshot: SessionStateSnapshot
): void {
  session.rateDrafts = new Map(snapshot.rateDrafts);
  session.sellRate = snapshot.sellRate;
  session.sellDraft = snapshot.sellDraft;
  session.sellFromSlash = snapshot.sellFromSlash;
  session.rangeChoices = new Map(snapshot.rangeChoices);
  session.messageId = snapshot.messageId;
}

export class CookSessionStore {
  private readonly sessions = new Map<string, CookSession>();
  private readonly locks = new Map<string, Promise<void>>();
  private readonly ttlMs: number;
  private readonly maxSessions: number;
  private readonly maxPerUser: number;
  private readonly nowFn: () => number;

  constructor(options: CookSessionStoreOptions = {}) {
    this.ttlMs = options.ttlMs ?? SESSION_TTL_MS;
    this.maxSessions = options.maxSessions ?? DEFAULT_MAX_SESSIONS;
    this.maxPerUser = options.maxPerUser ?? DEFAULT_MAX_PER_USER;
    this.nowFn = options.now ?? (() => Date.now());
  }

  create(params: CreateCookSessionParams): CookSession {
    const now = this.nowFn();
    this.sweep(now);
    this.evictOldestForUser(params.userId, now);
    while (this.sessions.size >= this.maxSessions) {
      this.removeOldest();
    }

    const id = randomBytes(8).toString("hex");
    const session: CookSession = {
      id,
      guildId: params.guildId,
      channelId: params.channelId,
      userId: params.userId,
      messageId: null,
      recipe: params.recipe,
      batchQuantity: params.batchQuantity,
      includeSpices: params.includeSpices,
      savedPrices: new Map(params.savedPrices),
      rateDrafts: new Map(),
      sellRate: null,
      sellDraft: null,
      sellFromSlash: false,
      rangeChoices: new Map(),
      revision: 0,
      createdAt: now,
      expiresAt: now + this.ttlMs,
    };
    this.sessions.set(id, session);
    return session;
  }

  get(id: string): CookSession | null {
    const session = this.sessions.get(id);
    if (!session) {
      return null;
    }
    if (this.isExpired(session, this.nowFn())) {
      this.sessions.delete(id);
      return null;
    }
    return session;
  }

  getByMessage(messageId: string): CookSession | null {
    for (const session of this.sessions.values()) {
      if (session.messageId === messageId) {
        return this.get(session.id);
      }
    }
    return null;
  }

  mutate(
    id: string,
    mutateFn: (session: CookSession) => void
  ): CookSession | null {
    const session = this.get(id);
    if (!session) {
      return null;
    }
    const result = this.mutateIf(id, session.revision, mutateFn);
    return result.ok ? result.session : null;
  }

  mutateIf(
    id: string,
    expectedRevision: number,
    mutateFn: (session: CookSession) => void
  ): SessionMutationResult {
    const session = this.get(id);
    if (!session) {
      return { ok: false, reason: "missing" };
    }
    if (session.revision !== expectedRevision) {
      return { ok: false, reason: "stale" };
    }

    const before = captureSessionState(session);
    mutateFn(session);
    session.revision = expectedRevision + 1;
    const appliedRevision = session.revision;

    return {
      ok: true,
      session,
      rollback: () => {
        const live = this.get(id);
        if (!live || live.revision !== appliedRevision) {
          return;
        }
        restoreSessionState(live, before);
        live.revision = expectedRevision;
      },
    };
  }

  withSessionLock<T>(id: string, task: () => Promise<T>): Promise<T> {
    const previous = this.locks.get(id) ?? Promise.resolve();
    const result = previous.then(task, task);
    const settled = result.then(
      () => undefined,
      () => undefined
    );
    this.locks.set(id, settled);
    void settled.then(() => {
      if (this.locks.get(id) === settled) {
        this.locks.delete(id);
      }
    });
    return result;
  }

  delete(id: string): boolean {
    return this.sessions.delete(id);
  }

  size(): number {
    return this.sessions.size;
  }

  sweep(now: number = this.nowFn()): number {
    let removed = 0;
    for (const [id, session] of this.sessions) {
      if (this.isExpired(session, now)) {
        this.sessions.delete(id);
        removed += 1;
      }
    }
    return removed;
  }

  private isExpired(session: CookSession, now: number): boolean {
    return now > session.expiresAt;
  }

  private evictOldestForUser(userId: string, now: number): void {
    this.sweep(now);
    const owned = Array.from(this.sessions.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => a.createdAt - b.createdAt);

    while (owned.length >= this.maxPerUser) {
      const oldest = owned.shift();
      if (!oldest) break;
      this.sessions.delete(oldest.id);
    }
  }

  private removeOldest(): void {
    let oldest: CookSession | null = null;
    for (const session of this.sessions.values()) {
      if (!oldest || session.createdAt < oldest.createdAt) {
        oldest = session;
      }
    }
    if (oldest) {
      this.sessions.delete(oldest.id);
    }
  }
}

export const cookSessionStore = new CookSessionStore();
