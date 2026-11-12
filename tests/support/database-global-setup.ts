import { execFileSync } from "node:child_process";
import { unlinkSync } from "node:fs";
import { resolve } from "node:path";
import type { GlobalSetupContext } from "vitest/node";
import { createTestDatabaseUrl } from "./test-database.js";

export default function setup({ provide }: GlobalSetupContext) {
  const databaseUrl = createTestDatabaseUrl();
  execFileSync(process.execPath, [resolve("node_modules/prisma/build/index.js"), "db", "push", "--skip-generate"], {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "inherit",
  });
  provide("testDatabaseUrl", databaseUrl);
  return () => {
    for (const suffix of ["", "-journal", "-wal", "-shm"]) {
      try {
        unlinkSync(databaseUrl.slice(5) + suffix);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    }
  };
}

declare module "vitest" {
  export interface ProvidedContext {
    testDatabaseUrl: string;
  }
}
