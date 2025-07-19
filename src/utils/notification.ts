import { setTimeout } from "node:timers/promises";
import * as v from "valibot";
import { cache } from "./cache";
import { getBacklogApi } from "./backlog";
import type { useSpaces } from "../hooks/useSpaces";
import type { useCurrentSpace } from "../hooks/useCurrentSpace";

export const NotificationCountSchema = v.object({
  spaceKey: v.string(),
  count: v.number(),
});
export const CacheSchema = v.pipe(
  v.string(),
  v.parseJson(),
  v.object({
    spaces: v.array(NotificationCountSchema),
    timestamp: v.number(),
  }),
);

const CACHE_KEY = "notification-count";
const CACHE_TTL = 1000 * 60 * 1; // 3 minutes

export const getNotificationCountCache = () => {
  const cached = v.safeParse(CacheSchema, cache.get(CACHE_KEY));

  if (cached.success) {
    return cached.output;
  }

  return null;
}

export const getNotificationCount = async (
  spaces: ReturnType<typeof useSpaces>,
): Promise<Array<v.InferOutput<typeof NotificationCountSchema>>> => {
  const cached = getNotificationCountCache()

  if (cached) {
    const now = Date.now();
    const diff = now - cached.timestamp;

    if (diff < CACHE_TTL) {
      return cached.spaces;
    }
  }

  const data = await Promise.all(
    spaces.map(async ({ credential }) => {
      const api = getBacklogApi(credential);
      const { count } = await api.getNotificationsCount({ alreadyRead: false, resourceAlreadyRead: false });

      return {
        spaceKey: credential.spaceKey,
        count,
      };
    }),
  );

  await cache.set(
    CACHE_KEY,
    JSON.stringify({
      spaces: data,
      timestamp: Date.now(),
    }),
  );

  await setTimeout(500);

  return data;
};

export const setNotificationCount = async (spaceKey: string, setter: (count: number) => number): Promise<boolean> => {
  const cached = await v.safeParseAsync(CacheSchema, await cache.get(CACHE_KEY));

  if (!cached.success) return false;

  const index = cached.output.spaces.findIndex((space) => space.spaceKey === spaceKey);

  if (cached.output.spaces[index] == null) return false;

  const newCount = setter(cached.output.spaces[index].count);

  if (newCount === cached.output.spaces[index].count) return false;

  cached.output.spaces[index].count = newCount;

  await cache.set(CACHE_KEY, JSON.stringify(cached.output));

  return true;
};

export const resetNotificationsMarkAsRead = async (space: ReturnType<typeof useCurrentSpace>) => {
  const hasSet = await setNotificationCount(space.space.spaceKey, () => 0);

  if (!hasSet) return false;

  const api = getBacklogApi(space.credential);
  await api.resetNotificationsMarkAsRead();

  return true;
};
