import { Action, ActionPanel, Alert, Color, confirmAlert } from "@raycast/api";
import { useQueryClient } from "@tanstack/react-query";
import { DebugActionPanel } from "./DebugActionPanel";
import { useSpaces } from "~space/hooks/useSpaces";
import { getSpaceImageUrl } from "~common/utils/image";
import { cache } from "~common/utils/cache";
import { ICONS } from "~common/constants/icon";
import { indexToShortcut } from "~common/utils/shortcut";
import { AddSpaceForm } from "~space/components/AddSpaceForm";
import { UpdateSpaceForm } from "~space/components/UpdateSpaceForm";

type Props = {
  children?: React.ReactNode | Promise<React.ReactNode>;
};

export const CommonActionPanel = ({ children }: Props) => {
  const queryClient = useQueryClient();
  const spaces = useSpaces();

  const handleClearCache = async () => {
    if (
      await confirmAlert({
        icon: { source: ICONS.REFRESH, tintColor: Color.SecondaryText },
        title: "Refresh All Data",
        message: "Are you sure you want to clear the cache?",
        primaryAction: {
          title: "Confirm",
          style: Alert.ActionStyle.Destructive,
        },
      })
    ) {
      cache.clear();
      await queryClient.resetQueries();
      await queryClient.invalidateQueries();
    }
  };

  return (
    <ActionPanel>
      <>
        {children}
        <ActionPanel.Section title="Spaces">
          {spaces.length > 0 && (
            <>
              <ActionPanel.Submenu
                title="Manage Spaces"
                icon={{ source: ICONS.MANAGE_SPACES, tintColor: Color.SecondaryText }}
                shortcut={{ modifiers: ["ctrl", "shift"], key: "m" }}
              >
                {spaces.map(({ space: { spaceKey, name }, credential }, i) => (
                  <Action.Push
                    key={spaceKey}
                    title={`${name} (${spaceKey})`}
                    icon={getSpaceImageUrl(credential)}
                    shortcut={indexToShortcut(i, ["cmd"])}
                    target={<UpdateSpaceForm credential={credential} />}
                  />
                ))}
              </ActionPanel.Submenu>
            </>
          )}
          <Action.Push
            title="Add Other Space"
            icon={{ source: ICONS.ADD_SPACE, tintColor: Color.SecondaryText }}
            shortcut={{ modifiers: ["ctrl", "shift"], key: "n" }}
            target={<AddSpaceForm />}
          />
        </ActionPanel.Section>
        <ActionPanel.Section title="Advanced">
          <Action
            title="Refresh All"
            icon={{ source: ICONS.REFRESH, tintColor: Color.SecondaryText }}
            shortcut={{ modifiers: ["cmd", "shift"], key: "r" }}
            onAction={handleClearCache}
          />
        </ActionPanel.Section>
        {process.env.NODE_ENV === "development" && <DebugActionPanel />}
      </>
    </ActionPanel>
  );
};
