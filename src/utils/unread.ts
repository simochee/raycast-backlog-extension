import { LocalStorage } from "@raycast/api";
import { CREDENTIALS_STORAGE_KEY, CredentialsSchema } from "./credentials";
import * as v from "valibot";
import { Backlog } from "backlog-js";

export const getUnreadCounts = async () => {
  try {
    console.log("getting from localstorage");

    const rawValue = await LocalStorage.getItem<string>(CREDENTIALS_STORAGE_KEY);

    console.log(rawValue);

    if (!rawValue) return;

    const credentials = v.parse(v.array(CredentialsSchema), JSON.parse(rawValue));

    console.log(credentials);

    return await Promise.all(
      credentials.map(async ({ spaceKey, domain, apiKey }) => {
        const host = `${spaceKey}.${domain}`;
        const api = new Backlog({ host, apiKey });
        const { count } = await api.getNotificationsCount({ alreadyRead: false, resourceAlreadyRead: false });

        console.log(`${spaceKey} has ${count} unread notifications`);

        return { spaceKey, count };
      }),
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
