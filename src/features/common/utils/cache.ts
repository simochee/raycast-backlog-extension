import { Cache } from "@raycast/api";
import * as v from "valibot";
import { CACHE_TTL } from "~common/constants/cache";

export const cache = new Cache();

/**
 * Cache wrapper that validates and expires the cache.
 */
export const createCache = <const T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(
  keyOrArray: string | Array<string>,
  schema: T,
  expiresIn = CACHE_TTL.DEFAULT,
) => {
  const key = Array.isArray(keyOrArray) ? keyOrArray.join("-") : keyOrArray;

  const schemaWithTimestamp = v.object({
    value: schema,
    timestamp: v.number(),
  });

  const get = () => {
    try {
      const cached = cache.get(key);
      if (cached) {
        const parsed = v.parse(schemaWithTimestamp, JSON.parse(cached));
        if (!parsed.timestamp || parsed.timestamp + expiresIn > Date.now()) {
          return parsed.value;
        }
        cache.remove(key);
      }
      return;
    } catch {
      return;
    }
  };

  const set = (value: unknown) => {
    const validated = v.parse(schema, value);
    cache.set(
      key,
      JSON.stringify({
        value: validated,
        timestamp: Date.now(),
      }),
    );
  };

  return { get, set };
};
