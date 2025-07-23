import { pick } from "es-toolkit";
import type { Entity } from "backlog-js";

export const transformWikiListItem = (wikiListItem: Entity.Wiki.WikiListItem) => {
  return {
    ...pick(wikiListItem, ["id", "name", "projectId", "updated"]),
    tags: wikiListItem.tags.map((v) => pick(v, ["id", "name"])),
  } satisfies { [K in keyof Entity.Wiki.WikiListItem]?: unknown };
};

export const transformRecentlyViewedWiki = (wikiListItem: Entity.Wiki.RecentlyViewedWiki) => {
  return {
    page: transformWikiListItem(wikiListItem.page),
  } satisfies { [K in keyof Entity.Wiki.RecentlyViewedWiki]?: unknown };
};

export type WikiListItem = ReturnType<typeof transformWikiListItem>;
export type RecentlyViewedWiki = ReturnType<typeof transformRecentlyViewedWiki>;
