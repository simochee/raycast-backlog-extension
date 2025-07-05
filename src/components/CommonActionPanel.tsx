import { Action, ActionPanel, Color, Icon, useNavigation } from "@raycast/api";
import { useSpaces } from "../hooks/useSpaces";
import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { SpaceForm } from "./SpaceForm";
import { useCredentials } from "../hooks/useCredentials";
import type { SpaceCredentials } from "../utils/credentials";

type Props = {
  children?: React.ReactNode | Promise<React.ReactNode>;
};

export const CommonActionPanel = ({ children }: Props) => {
  const { pop } = useNavigation();
  const { addCredential, updateCredential, removeCredential } = useCredentials();
  const currentSpace = useCurrentSpace();

  const [spaces] = useSpaces();
  const sortedSpaces = spaces?.slice().sort((a) => (a.space.spaceKey === currentSpace.spaceKey ? -1 : 1));

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
              <ActionPanel.Submenu title="Switch" shortcut={{ modifiers: ["cmd"], key: "s" }}>
                {sortedSpaces.map(({ space, domain, apiKey }, index) => (
                  <Action
                    key={space.spaceKey}
                    title={`${space.name} (${space.spaceKey})`}
                    icon={
                      index === 0
                        ? { source: Icon.CheckCircle, tintColor: Color.Green }
                        : `https://${space.spaceKey}.${domain}/api/v2/space/image?apiKey=${apiKey}`
                    }
                    onAction={() => currentSpace.setSpaceKey(space.spaceKey)}
                  />
                ))}
              </ActionPanel.Submenu>
              <ActionPanel.Submenu title="Manage">
                {sortedSpaces.map(({ space, domain, apiKey }) => (
                  <Action.Push
                    key={space.spaceKey}
                    title={`${space.name} (${space.spaceKey})`}
                    icon={`https://${space.spaceKey}.${domain}/api/v2/space/image?apiKey=${apiKey}`}
                    target={
                      <SpaceForm
                        initialValues={{ spaceKey: space.spaceKey, domain: domain, apiKey: apiKey }}
                        onSubmit={handleUpdateSpace}
                        onDelete={handleDeleteSpace}
                      />
                    }
                  />
                ))}
              </ActionPanel.Submenu>
            </>
          )}
          <Action.Push title="Add Space" target={<SpaceForm onSubmit={handleAddSpace} />} />
        </ActionPanel.Section>
        <ActionPanel.Submenu title="Help">
          <Action title="Clear Cached Data" icon={Icon.Check} />
        </ActionPanel.Submenu>
      </>
    </ActionPanel>
  );
};
