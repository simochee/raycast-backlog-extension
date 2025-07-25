import { List } from "@raycast/api";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { useSpaces } from "~space/hooks/useSpaces";
import { getSpaceImageUrl } from "~common/utils/image";

export const SearchBarAccessory = () => {
  const spaces = useSpaces();
  const { setSpaceKey, space: currentSpace } = useCurrentSpace();

  return (
    <List.Dropdown tooltip="Switch Space" defaultValue={currentSpace.spaceKey} onChange={setSpaceKey}>
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
