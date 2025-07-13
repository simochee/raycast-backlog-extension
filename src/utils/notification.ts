import * as v from "valibot";
import { cache } from "./cache";
import { getBacklogApi } from "./backlog";
import type { useSpaces } from "../hooks/useSpaces";

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
const CACHE_TTL = 1000 * 60 * 3; // 3 minutes

export const getNotificationCount = async (
  spaces: ReturnType<typeof useSpaces>,
): Promise<Array<v.InferOutput<typeof NotificationCountSchema>>> => {
  const cached = await v.safeParseAsync(CacheSchema, await cache.get(CACHE_KEY));
  if (cached.success) {
    const now = Date.now();
    const diff = now - cached.output.timestamp;

    if (diff < CACHE_TTL) {
      return cached.output.spaces;
    }
  }

  const data = await Promise.all(
    spaces.map(async ({ credential }) => {
      const api = getBacklogApi(credential);
      // @ts-expect-error invalid type definition
      const { count } = await api.getNotificationsCount({ resourceAlreadyRead: false });

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
