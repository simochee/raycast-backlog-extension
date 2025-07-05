import { Backlog } from "backlog-js";
import { createCache } from "./cache";
import * as v from "valibot";
import { dedupe } from "./promise-dedupe";

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

  const api = new Backlog({ host, apiKey });
  const space = await dedupe(api.getSpace.bind(api));

  cache.set(space);

  return space;
};
