import * as v from "valibot";

export const CredentialsSchema = v.object({
  spaceKey: v.string(),
  domain: v.union([v.literal("backlog.com"), v.literal("backlog.jp")]),
  apiKey: v.string(),
});

export const CREDENTIALS_STORAGE_KEY = "credentials";

export type SpaceCredentials = v.InferOutput<typeof CredentialsSchema>;
