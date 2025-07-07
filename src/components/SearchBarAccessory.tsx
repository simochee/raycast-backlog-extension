import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { useSpaces } from "../hooks/useSpaces";
import { getSpaceImageUrl } from "../utils/image";
import { List } from "@raycast/api";

export const SearchBarAccessory = () => {
  const spaces = useSpaces();
  const { setSpaceKey, space: currentSpace } = useCurrentSpace();

  return (
    <List.Dropdown tooltip="Switch Space" storeValue defaultValue={currentSpace.spaceKey} onChange={setSpaceKey}>
      {spaces.map(({ space: { spaceKey, name }, credential }) => (
        <List.Dropdown.Item
          key={spaceKey}
          title={name === spaceKey ? name : `${name} (${spaceKey})`}
          value={spaceKey}
          icon={getSpaceImageUrl(credential)}
        />
      ))}
    </List.Dropdown>
  );
};
