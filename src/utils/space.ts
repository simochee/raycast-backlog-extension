import type { SpaceCredentials } from "./credentials";

export const getSpaceHost = ({ spaceKey, domain }: Pick<SpaceCredentials, "spaceKey" | "domain">) => {
  switch (domain) {
    case "backlog.com":
    case "backlog.jp":
      return `${spaceKey}.${domain}`;
    default:
      throw new TypeError(`invalid domain: ${domain satisfies never}`);
  }
};
