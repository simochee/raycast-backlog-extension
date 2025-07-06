import { CREDENTIALS_STORAGE_KEY, CredentialsSchema } from "./credentials";
import { LocalStorage } from "@raycast/api";
import { Backlog } from "backlog-js";
import * as v from "valibot";

export const getUnreadCounts = async () => {
  try {
    const rawValue = await LocalStorage.getItem<string>(CREDENTIALS_STORAGE_KEY);

    if (!rawValue) return;

    const credentials = v.parse(v.array(CredentialsSchema), JSON.parse(rawValue));

    return await Promise.all(
      credentials.map(async ({ spaceKey, domain, apiKey }) => {
        const host = `${spaceKey}.${domain}`;
        const api = new Backlog({ host, apiKey });
        const { count } = await api.getNotificationsCount({ alreadyRead: false, resourceAlreadyRead: false });

        return { spaceKey, count };
      }),
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
