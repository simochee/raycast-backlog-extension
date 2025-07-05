import { Backlog } from "backlog-js";
import { createCache } from "./cache";
import * as v from "valibot";

const schema = v.object({
  spaceKey: v.string(),
  name: v.string(),
  ownerId: v.number(),
  lang: v.string(),
  timezone: v.string(),
  reportSendTime: v.string(),
  textFormattingRule: v.string(),
  created: v.string(),
  updated: v.string(),
});

export const getSpaceWithCache = async (spaceKey: string, domain: string, apiKey: string) => {
  const cache = createCache([spaceKey, "space"], schema);

  const host = `${spaceKey}.${domain}`;
  const cached = await cache.get();

  if (cached) {
    return cached;
  }

  const backlog = new Backlog({ host, apiKey });
  const space = await backlog.getSpace();

  cache.set(space);

  return space;
};
