import { useCredentials } from "../hooks/useCredentials";
import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { useSpaces } from "../hooks/useSpaces";
import { cache } from "../utils/cache";
import type { SpaceCredentials } from "../utils/credentials";
import { getSpaceImageUrl } from "../utils/image";
import { SpaceForm } from "./SpaceForm";
import { Action, ActionPanel, Color, Icon, useNavigation } from "@raycast/api";

type Props = {
  children?: React.ReactNode | Promise<React.ReactNode>;
};

export const CommonActionPanel = ({ children }: Props) => {
  const { pop } = useNavigation();
  const { addCredential, updateCredential, removeCredential } = useCredentials();
  const currentSpace = useCurrentSpace();

  const spaces = useSpaces();
  const sortedSpaces = spaces.slice().sort(({ space: { spaceKey } }) => (spaceKey === currentSpace.spaceKey ? -1 : 1));

  const handleAddSpace = async (values: SpaceCredentials) => {
    await addCredential(values);
    // currentSpace.setSpaceKey(values.spaceKey);
    pop();
  };

  const handleUpdateSpace = async (values: SpaceCredentials) => {
    await updateCredential(values);
    pop();
  };

  const handleDeleteSpace = async (spaceKey: string) => {
    await removeCredential(spaceKey);
    if (currentSpace.spaceKey === spaceKey) {
      currentSpace.setSpaceKey(sortedSpaces?.[0]?.space.spaceKey ?? "");
    }
    pop();
  };

  return (
    <ActionPanel>
      <>
        {children}
        <ActionPanel.Section title="Spaces">
          {sortedSpaces && sortedSpaces.length > 0 && (
            <>
              <ActionPanel.Submenu title="Switch Space" shortcut={{ modifiers: ["cmd"], key: "s" }}>
                {sortedSpaces.map(({ space: { spaceKey, name }, credential }, index) => (
                  <Action
                    key={spaceKey}
                    title={`${name} (${spaceKey})`}
                    icon={
                      index === 0 ? { source: Icon.CheckCircle, tintColor: Color.Green } : getSpaceImageUrl(credential)
                    }
                    onAction={() => currentSpace.setSpaceKey(spaceKey)}
                  />
                ))}
              </ActionPanel.Submenu>
              <ActionPanel.Submenu title="Manage Spaces">
                {sortedSpaces.map(({ space: { spaceKey, name }, credential }) => (
                  <Action.Push
                    key={spaceKey}
                    title={`Edit ${name} (${spaceKey})`}
                    icon={getSpaceImageUrl(credential)}
                    target={
                      <SpaceForm initialValues={credential} onSubmit={handleUpdateSpace} onDelete={handleDeleteSpace} />
                    }
                  />
                ))}
              </ActionPanel.Submenu>
            </>
          )}
          <Action.Push title="Add New Space" target={<SpaceForm onSubmit={handleAddSpace} />} />
        </ActionPanel.Section>
        <ActionPanel.Section title="Tools">
          <Action title="Clear Cache" icon={Icon.Trash} onAction={() => cache.clear()} />
        </ActionPanel.Section>
      </>
    </ActionPanel>
  );
};
