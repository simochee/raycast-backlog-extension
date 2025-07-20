import { LocalStorage } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { SpaceCredentials } from "~space/utils/credentials";
import { CREDENTIALS_STORAGE_KEY } from "~space/utils/credentials";
import { credentialsOptions } from "~common/utils/queryOptions";

export const useCredentials = () => {
  const { data: initialCredentials } = useSuspenseQuery(credentialsOptions());

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
