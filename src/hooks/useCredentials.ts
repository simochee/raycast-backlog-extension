import { LocalStorage, environment } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { CREDENTIALS_STORAGE_KEY, CredentialsSchema } from "../utils/credentials";
import type { SpaceCredentials } from "../utils/credentials";

const getCredentials = async () => {
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

export const useCredentials = () => {
  const { data: initialCredentials } = useSuspenseQuery({
    queryKey: ["credentials"],
    queryFn: () => getCredentials(),
  });

  const [credentials, setCredentials] = useCachedState("credentials", initialCredentials);

  const updateCredential = async (credential: SpaceCredentials) => {
    if (!credentials.some((c) => c.spaceKey === credential.spaceKey)) {
      addCredential(credential);
      return;
    }

    const newValue = credentials.map((c) => (c.spaceKey === credential.spaceKey ? credential : c));
    await LocalStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(newValue));
    setCredentials(newValue);
  };

  const addCredential = async (credential: SpaceCredentials) => {
    if (credentials.some((c) => c.spaceKey === credential.spaceKey)) {
      updateCredential(credential);
      return;
    }

    const newValue = [...credentials, credential];
    await LocalStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(newValue));
    setCredentials(newValue);
  };

  const removeCredential = async (spaceKey: string) => {
    const newValue = credentials.filter((credential) => credential.spaceKey !== spaceKey);
    await LocalStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(newValue));
    setCredentials(newValue);
  };

  return { credentials, addCredential, updateCredential, removeCredential };
};
