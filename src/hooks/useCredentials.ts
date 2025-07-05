import { useLocalStorage } from "@raycast/utils"
import { SpaceCredentials } from "../types/space"

export const useCredentials = () => {
  const { value: credentials = [], setValue: setCredentials } = useLocalStorage<SpaceCredentials[]>('credentials', [])

  const addCredential = (credential: SpaceCredentials) => {
    setCredentials([...credentials, credential]);
  }

  const updateCredential = (credential: SpaceCredentials) => {
    setCredentials(credentials.map((c) => c.spaceKey === credential.spaceKey ? credential : c));
  } 

  const removeCredential = (spaceKey: string) => {
    setCredentials(credentials.filter((credential) => credential.spaceKey !== spaceKey));
  }

  return { credentials, addCredential, updateCredential, removeCredential };
}