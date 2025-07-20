import { Action, ActionPanel, Icon, useNavigation } from "@raycast/api";
import { DebugActionPanel } from "./DebugActionPanel";
import type { SpaceCredentials } from "~space/utils/credentials";
import { useCredentials } from "~space/hooks/useCredentials";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { useSpaces } from "~space/hooks/useSpaces";
import { getSpaceImageUrl } from "~common/utils/image";
import { SpaceForm } from "~space/components/SpaceForm";

type Props = {
  children?: React.ReactNode | Promise<React.ReactNode>;
};

export const CommonActionPanel = ({ children }: Props) => {
  const { pop } = useNavigation();
  const { addCredential, updateCredential, removeCredential } = useCredentials();
  const currentSpace = useCurrentSpace();

  const spaces = useSpaces();
  const sortedSpaces = spaces
    .slice()
    .sort(({ space: { spaceKey } }) => (spaceKey === currentSpace.space.spaceKey ? -1 : 1));

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
    if (currentSpace.space.spaceKey === spaceKey) {
      currentSpace.setSpaceKey(sortedSpaces[0]?.space.spaceKey ?? "");
    }
    pop();
  };

  return (
    <ActionPanel>
      <>
        {children}
        <ActionPanel.Section title="Spaces">
          {sortedSpaces.length > 0 && (
            <>
              <ActionPanel.Submenu title="Manage Spaces" icon={Icon.Gear}>
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
          <Action.Push title="Add New Space" icon={Icon.Plus} target={<SpaceForm onSubmit={handleAddSpace} />} />
        </ActionPanel.Section>
        {process.env.NODE_ENV === "development" && <DebugActionPanel />}
      </>
    </ActionPanel>
  );
};
