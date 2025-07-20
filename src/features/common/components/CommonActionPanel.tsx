import { Action, ActionPanel, Alert, Color, Icon, confirmAlert, useNavigation } from "@raycast/api";
import { useQueryClient } from "@tanstack/react-query";
import { DebugActionPanel } from "./DebugActionPanel";
import type { SpaceCredentials } from "~space/utils/credentials";
import { useCredentials } from "~space/hooks/useCredentials";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { useSpaces } from "~space/hooks/useSpaces";
import { getSpaceImageUrl } from "~common/utils/image";
import { SpaceForm } from "~space/components/SpaceForm";
import { cache } from "~common/utils/cache";
import { ICONS } from "~common/constants/icon";
import { DELAY } from "~common/constants/cache";

type Props = {
  children?: React.ReactNode | Promise<React.ReactNode>;
};

export const CommonActionPanel = ({ children }: Props) => {
  const { pop } = useNavigation();
  const queryClient = useQueryClient();
  const { addCredential, updateCredential, removeCredential } = useCredentials();
  const currentSpace = useCurrentSpace();

  const spaces = useSpaces();
  const sortedSpaces = spaces
    .slice()
    .sort(({ space: { spaceKey } }) => (spaceKey === currentSpace.space.spaceKey ? -1 : 1));

  const handleAddSpace = async (values: SpaceCredentials) => {
    await addCredential(values);

    await currentSpace.setSpaceKey(values.spaceKey);

    await new Promise((resolve) => setTimeout(resolve, DELAY.NOTIFICATION_UPDATE));

    pop();
  };

  const handleUpdateSpace = async (values: SpaceCredentials) => {
    await updateCredential(values);
    pop();
  };

  const handleDeleteSpace = async (spaceKey: string) => {
    await removeCredential(spaceKey);
    if (currentSpace.space.spaceKey === spaceKey) {
      await currentSpace.setSpaceKey(sortedSpaces[0]?.space.spaceKey ?? "");
    }
    pop();
  };

  const handleClearCache = async () => {
    if (
      await confirmAlert({
        icon: { source: ICONS.DOWNLOADING, tintColor: Color.SecondaryText },
        title: "Refresh All Data",
        message: "Are you sure you want to clear the cache?",
        primaryAction: {
          title: "Confirm",
          style: Alert.ActionStyle.Destructive,
        },
      })
    ) {
      cache.clear();
      await queryClient.invalidateQueries();
    }
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
        <ActionPanel.Section title="Advanced">
          <Action
            title="Refresh All"
            shortcut={{ modifiers: ["cmd", "shift"], key: "r" }}
            onAction={handleClearCache}
          />
        </ActionPanel.Section>
        {process.env.NODE_ENV === "development" && <DebugActionPanel />}
      </>
    </ActionPanel>
  );
};
