import { describe, it, expect } from "vitest";

describe("Role Hierarchy Verification", () => {
  function canManageRole(
    executorHighestPos: number,
    botHighestPos: number,
    targetRolePos: number,
    isOwner = false
  ): { ok: boolean; reason?: string } {
    if (botHighestPos <= targetRolePos) {
      return { ok: false, reason: "Bot role hierarchy is too low." };
    }
    if (!isOwner && executorHighestPos <= targetRolePos) {
      return { ok: false, reason: "Your role hierarchy is too low." };
    }
    return { ok: true };
  }

  it("should allow role assignment when executor and bot are higher than target", () => {
    const res = canManageRole(10, 8, 5);
    expect(res.ok).toBe(true);
  });

  it("should deny when bot role position is lower or equal to target role", () => {
    const res = canManageRole(10, 5, 5);
    expect(res.ok).toBe(false);
    expect(res.reason).toBe("Bot role hierarchy is too low.");
  });

  it("should deny when executor role position is lower or equal to target role", () => {
    const res = canManageRole(4, 10, 5, false);
    expect(res.ok).toBe(false);
    expect(res.reason).toBe("Your role hierarchy is too low.");
  });

  it("should allow server owner even if role position is low", () => {
    const res = canManageRole(1, 10, 5, true);
    expect(res.ok).toBe(true);
  });
});
