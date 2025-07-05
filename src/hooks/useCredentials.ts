import { useLocalStorage } from "@raycast/utils";
import { SpaceCredentials } from "../types/space";

export const useCredentials = () => {
  const { value: credentials = [], setValue: setCredentials } = useLocalStorage<SpaceCredentials[]>("credentials", []);

  const addCredential = async (credential: SpaceCredentials) => {
    await setCredentials([...credentials, credential]);
  };

  const updateCredential = async (credential: SpaceCredentials) => {
    await setCredentials(credentials.map((c) => (c.spaceKey === credential.spaceKey ? credential : c)));
  };

  const removeCredential = async (spaceKey: string) => {
    await setCredentials(credentials.filter((credential) => credential.spaceKey !== spaceKey));
  };

  return { credentials, addCredential, updateCredential, removeCredential };
};
