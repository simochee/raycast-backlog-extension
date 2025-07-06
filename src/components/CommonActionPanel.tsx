import React from "react";
import { Action, ActionPanel, Color, Icon, useNavigation } from "@raycast/api";
import { useSpaces } from "../hooks/useSpaces";
import { useCurrentSpace } from "../hooks/useCurrentSpace";
import { SpaceForm } from "./SpaceForm";
import { useCredentials } from "../hooks/useCredentials";
import type { SpaceCredentials } from "../utils/credentials";
import { getSpaceHost } from "../utils/space";
import type { ReactNode } from "react";

type Props = {
  children?: ReactNode | Promise<ReactNode>;
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
              <ActionPanel.Submenu title="Switch" shortcut={{ modifiers: ["cmd"], key: "s" }}>
                {sortedSpaces.map(({ space: { spaceKey, name }, credential }, index) => (
                  <Action
                    key={spaceKey}
                    title={`${name} (${spaceKey})`}
                    icon={
                      index === 0
                        ? { source: Icon.CheckCircle, tintColor: Color.Green }
                        : `https://${getSpaceHost(credential)}/api/v2/space/image?apiKey=${credential.apiKey}`
                    }
                    onAction={() => currentSpace.setSpaceKey(spaceKey)}
                  />
                ))}
              </ActionPanel.Submenu>
              <ActionPanel.Submenu title="Manage">
                {sortedSpaces.map(({ space: { spaceKey, name }, credential }) => (
                  <Action.Push
                    key={spaceKey}
                    title={`${name} (${spaceKey})`}
                    icon={`https://${getSpaceHost(credential)}/api/v2/space/image?apiKey=${credential.apiKey}`}
                    target={
                      <SpaceForm initialValues={credential} onSubmit={handleUpdateSpace} onDelete={handleDeleteSpace} />
                    }
                  />
                ))}
              </ActionPanel.Submenu>
            </>
          )}
          <Action.Push title="Add Space" target={<SpaceForm onSubmit={handleAddSpace} />} />
        </ActionPanel.Section>
        <ActionPanel.Submenu title="Help">
          <Action title="Clear Cache" icon={Icon.Check} />
        </ActionPanel.Submenu>
      </>
    </ActionPanel>
  );
};
