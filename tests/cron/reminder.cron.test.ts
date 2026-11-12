import { afterEach, describe, expect, it, vi } from "vitest";

const service = vi.hoisted(() => ({
  getDueReminders: vi.fn(),
  completeReminder: vi.fn(),
}));

vi.mock("../../src/modules/community/utility.service.js", () => ({ utilityService: service }));

import { startReminderCron } from "../../src/cron/reminder.cron.js";
import type { ExtendedClient } from "../../src/core/client.js";

describe("reminder delivery", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("keeps a reminder pending when channel and DM delivery fail", async () => {
    vi.useFakeTimers();
    service.getDueReminders.mockResolvedValue([{ id: "reminder", userId: "user", channelId: "channel", message: "test" }]);
    const client = {
      channels: { fetch: vi.fn().mockRejectedValue(new Error("unavailable")) },
      users: { fetch: vi.fn().mockRejectedValue(new Error("unavailable")) },
    } as unknown as ExtendedClient;

    startReminderCron(client);
    await vi.advanceTimersByTimeAsync(10000);

    expect(service.completeReminder).not.toHaveBeenCalled();
  });

  it("marks a reminder complete after channel delivery", async () => {
    vi.useFakeTimers();
    service.getDueReminders.mockResolvedValue([{ id: "reminder", userId: "user", channelId: "channel", message: "test" }]);
    const send = vi.fn().mockResolvedValue(undefined);
    const client = {
      channels: { fetch: vi.fn().mockResolvedValue({ isTextBased: () => true, send }) },
      users: { fetch: vi.fn() },
    } as unknown as ExtendedClient;

    startReminderCron(client);
    await vi.advanceTimersByTimeAsync(10000);

    expect(send).toHaveBeenCalledOnce();
    expect(service.completeReminder).toHaveBeenCalledWith("reminder");
    expect(send.mock.invocationCallOrder[0]).toBeLessThan(service.completeReminder.mock.invocationCallOrder[0]);
  });

  it("marks a reminder complete after fallback DM delivery", async () => {
    vi.useFakeTimers();
    service.getDueReminders.mockResolvedValue([{ id: "reminder", userId: "user", channelId: "channel", message: "test" }]);
    const send = vi.fn().mockResolvedValue(undefined);
    const client = {
      channels: { fetch: vi.fn().mockRejectedValue(new Error("unavailable")) },
      users: { fetch: vi.fn().mockResolvedValue({ send }) },
    } as unknown as ExtendedClient;

    startReminderCron(client);
    await vi.advanceTimersByTimeAsync(10000);

    expect(send).toHaveBeenCalledOnce();
    expect(service.completeReminder).toHaveBeenCalledWith("reminder");
    expect(send.mock.invocationCallOrder[0]).toBeLessThan(service.completeReminder.mock.invocationCallOrder[0]);
  });

  it("does not start another poll while delivery is still running", async () => {
    vi.useFakeTimers();
    service.getDueReminders.mockReturnValue(new Promise(() => {}));
    startReminderCron({} as ExtendedClient);

    await vi.advanceTimersByTimeAsync(20000);

    expect(service.getDueReminders).toHaveBeenCalledOnce();
  });
});
