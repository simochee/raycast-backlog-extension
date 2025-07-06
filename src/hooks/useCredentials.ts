import { useCachedState } from "@raycast/utils";
import { CREDENTIALS_STORAGE_KEY, CredentialsSchema, type SpaceCredentials } from "../utils/credentials";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LocalStorage } from "@raycast/api";
import * as v from "valibot";

const getCredentials = async () => {
  try {
    const raw = await LocalStorage.getItem<string>(CREDENTIALS_STORAGE_KEY);

    return v.parseAsync(v.array(CredentialsSchema), JSON.parse(raw || ""));
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
