import { describe, it, expect, vi, beforeEach } from "vitest";
import { PermissionFlagsBits } from "discord.js";
import { repoCommand } from "../../../../src/modules/github/commands/repo.command.js";

const envState = vi.hoisted(() => ({
  BOT_OWNER_ID: undefined as string | undefined,
}));

const prismaMock = vi.hoisted(() => ({
  repoChannel: {
    upsert: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../../../src/config/env.js", () => ({ env: envState }));
vi.mock("../../../../src/core/db.js", () => ({ prisma: prismaMock }));

const OWNER_ID = "owner-123";

type MemberPerms = (permission: bigint) => boolean;

function makeInteraction(
  subcommand: string,
  opts: { userId?: string; memberPerms?: MemberPerms } = {}
) {
  const userId = opts.userId ?? "user-1";
  const memberPerms: MemberPerms = opts.memberPerms ?? (() => false);
  const reply = vi.fn().mockResolvedValue(undefined);
  const createChannel = vi.fn().mockResolvedValue({ id: "chan-created" });
  const interaction = {
    user: { id: userId },
    guildId: "guild-123",
    guild: {
      members: {
        cache: new Map([[userId, { permissions: { has: memberPerms } }]]),
      },
      channels: { cache: [], create: createChannel },
    },
    options: {
      getSubcommand: () => subcommand,
      getString: (name: string) => (name === "repo" ? "acme/website" : null),
      getChannel: () => null,
    },
    reply,
  };
  return { interaction: interaction as any, reply, createChannel };
}

const unauthorizedCases: Array<[string, MemberPerms]> = [
  ["a user with Administrator", (p) => p === PermissionFlagsBits.Administrator],
  ["a user with ManageGuild", (p) => p === PermissionFlagsBits.ManageGuild],
  ["a normal user", () => false],
];

describe("/repo command authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    envState.BOT_OWNER_ID = OWNER_ID;
  });

  function expectDenied(reply: ReturnType<typeof vi.fn>, createChannel: ReturnType<typeof vi.fn>) {
    expect(reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("do not have permission"),
      })
    );
    expect(prismaMock.repoChannel.upsert).not.toHaveBeenCalled();
    expect(prismaMock.repoChannel.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.repoChannel.findMany).not.toHaveBeenCalled();
    expect(prismaMock.repoChannel.delete).not.toHaveBeenCalled();
    expect(createChannel).not.toHaveBeenCalled();
  }

  describe.each(["add", "remove", "list"])("%s", (subcommand) => {
    it.each(unauthorizedCases)("denies %s", async (_label, memberPerms) => {
      const { interaction, reply, createChannel } = makeInteraction(subcommand, { memberPerms });

      await repoCommand.execute(interaction);

      expectDenied(reply, createChannel);
    });

    it("denies the configured owner id when BOT_OWNER_ID is unset", async () => {
      envState.BOT_OWNER_ID = undefined;
      const { interaction, reply, createChannel } = makeInteraction(subcommand, {
        userId: OWNER_ID,
        memberPerms: (p) => p === PermissionFlagsBits.Administrator,
      });

      await repoCommand.execute(interaction);

      expectDenied(reply, createChannel);
    });
  });

  it("allows the bot owner to add a mapping", async () => {
    const { interaction, reply, createChannel } = makeInteraction("add", { userId: OWNER_ID });

    await repoCommand.execute(interaction);

    expect(createChannel).toHaveBeenCalledTimes(1);
    expect(prismaMock.repoChannel.upsert).toHaveBeenCalledWith({
      where: { repoFullName: "acme/website" },
      update: { channelId: "chan-created" },
      create: { repoFullName: "acme/website", channelId: "chan-created" },
    });
    expect(reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("acme/website"),
      })
    );
  });

  it("allows the bot owner to remove a mapping", async () => {
    prismaMock.repoChannel.findUnique.mockResolvedValue({
      repoFullName: "acme/website",
      channelId: "chan-9",
    });
    const { interaction, reply } = makeInteraction("remove", { userId: OWNER_ID });

    await repoCommand.execute(interaction);

    expect(prismaMock.repoChannel.delete).toHaveBeenCalledWith({
      where: { repoFullName: "acme/website" },
    });
    expect(reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Removed mapping"),
      })
    );
  });

  it("allows the bot owner to list mappings", async () => {
    prismaMock.repoChannel.findMany.mockResolvedValue([
      { repoFullName: "acme/website", channelId: "chan-9" },
    ]);
    const { interaction, reply } = makeInteraction("list", { userId: OWNER_ID });

    await repoCommand.execute(interaction);

    expect(prismaMock.repoChannel.findMany).toHaveBeenCalledTimes(1);
    expect(reply).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: expect.any(Array) })
    );
  });
});

describe("/repo command definition", () => {
  it("documents owner-only access", () => {
    const json = repoCommand.data.toJSON();
    expect(json.description).toContain("Owner only");
    expect(json.description).not.toContain("Admin");
  });

  it("keeps Administrator as the default member permission", () => {
    const json = repoCommand.data.toJSON();
    expect(json.default_member_permissions).toBe(
      PermissionFlagsBits.Administrator.toString()
    );
  });
});
