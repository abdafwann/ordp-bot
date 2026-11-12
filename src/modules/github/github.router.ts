export type RepoChannelMap = ReadonlyMap<string, string>;

export function resolveRepoChannelId(
  repoFullName: string | undefined,
  mapping: RepoChannelMap,
  fallbackChannelId?: string
): string | null {
  if (repoFullName) {
    const normalized = repoFullName.trim().toLowerCase();
    const mapped = mapping.get(normalized);
    if (mapped) return mapped;
  }

  return fallbackChannelId ?? null;
}
