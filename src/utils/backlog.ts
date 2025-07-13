import { Backlog } from "backlog-js";
import { getSpaceHost } from "./space";
import type { SpaceCredentials } from "./credentials";

export const getBacklogApi = (credential: SpaceCredentials) => {
  return new Backlog({ host: getSpaceHost(credential), apiKey: credential.apiKey });
};
