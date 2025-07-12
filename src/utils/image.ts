import { getSpaceHost } from "./space";
import type { SpaceCredentials } from "./credentials";

export const getSpaceImageUrl = (credential: SpaceCredentials) => {
  return `https://${getSpaceHost(credential)}/api/v2/space/image?apiKey=${credential.apiKey}`;
};

export const getProjectImageUrl = (credential: SpaceCredentials, projectId: string | number) => {
  return `https://${getSpaceHost(credential)}/api/v2/projects/${projectId}/image?apiKey=${credential.apiKey}`;
};

export const getUserIconUrl = (credential: SpaceCredentials, userId: string | number) => {
  return `https://${getSpaceHost(credential)}/api/v2/users/${userId}/icon?apiKey=${credential.apiKey}`;
};
