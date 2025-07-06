import { Backlog } from "backlog-js";
import { createCache } from "./cache";
import * as v from "valibot";
import { dedupe } from "./promise-dedupe";
import type { SpaceCredentials } from "./credentials";

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

export const getSpaceWithCache = async ({ spaceKey, domain, apiKey }: SpaceCredentials) => {
  const cache = createCache([spaceKey, "space"], schema);
  const cached = await cache.get();

  if (cached) {
    return cached;
  }

  const api = new Backlog({ host: getSpaceHost({ spaceKey, domain }), apiKey });
  const space = await dedupe(api.getSpace.bind(api));

  cache.set(space);

  return space;
};

export const getSpaceHost = ({ spaceKey, domain }: Pick<SpaceCredentials, "spaceKey" | "domain">) => {
  switch (domain) {
    case "backlog.com":
    case "backlog.jp":
      return `${spaceKey}.${domain}`;
    default:
      throw new TypeError(`invalid domain: ${domain as never}`);
  }
};
