import { describe, it, expect } from "vitest";
import { createHmac } from "node:crypto";
import { verifyAuditSignature } from "../../../src/modules/audit/audit.verifier.js";

const secret = "test-secret";

function sign(body: string): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

describe("verifyAuditSignature", () => {
  it("accepts a valid signature", () => {
    const body = '{"kind":"audit","timestamp":"2026-09-21T10:00:00Z","command":"ls"}';
    expect(verifyAuditSignature(body, sign(body), secret)).toBe(true);
  });

  it("rejects a signature over a different body", () => {
    const body = '{"kind":"audit","command":"ls"}';
    const sig = sign('{"kind":"audit","command":"pwd"}');
    expect(verifyAuditSignature(body, sig, secret)).toBe(false);
  });

  it("rejects a wrong secret", () => {
    const body = '{"kind":"audit","command":"ls"}';
    expect(verifyAuditSignature(body, sign(body), "wrong-secret")).toBe(false);
  });

  it("rejects a missing signature", () => {
    expect(verifyAuditSignature("body", undefined, secret)).toBe(false);
  });
});
