import { useLocalStorage } from "@raycast/utils"
import { SpaceCredentials } from "../types/space"

export const useSpaces = () => {
  const { value: spaces = [], setValue: setSpaces } = useLocalStorage<SpaceCredentials[]>('spaces', [])

  const addSpace = (space: SpaceCredentials) => {
    setSpaces([...spaces, space]);
  }

  return { spaces, addSpace };
}