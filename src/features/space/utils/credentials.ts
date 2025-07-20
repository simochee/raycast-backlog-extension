import { LocalStorage, environment } from "@raycast/api";
import * as v from "valibot";

export const CredentialsSchema = v.object({
  spaceKey: v.string(),
  domain: v.union([v.literal("backlog.com"), v.literal("backlog.jp")]),
  apiKey: v.string(),
});

export const CREDENTIALS_STORAGE_KEY = "credentials";

export type SpaceCredentials = v.InferOutput<typeof CredentialsSchema>;

export const getCredentials = async () => {
  try {
    const raw = await LocalStorage.getItem<string>(CREDENTIALS_STORAGE_KEY);
    const spaces = await v.parseAsync(v.array(CredentialsSchema), JSON.parse(raw || ""));

    console.log(
      `*${environment.commandName}* [useCredentials] spaces`,
      spaces.map(({ spaceKey }) => spaceKey).join(", "),
    );

    return spaces;
  } catch {
    return [];
  }
};
