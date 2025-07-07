import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { useSpaces } from "./hooks/useSpaces";
import { getSpaceImageUrl } from "./utils/image";
import { withProviders } from "./utils/providers";
import { getSpaceHost } from "./utils/space";
import { Color, Icon, Keyboard, launchCommand, LaunchType, MenuBarExtra } from "@raycast/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Backlog } from "backlog-js";

const Command = () => {
  const spaces = useSpaces();
  const currentSpace = useCurrentSpace();

  const { data } = useSuspenseQuery({
    queryKey: ["unread-counts"],
    queryFn: async () =>
      Promise.all(
        spaces.map(async ({ space, credential }) => {
          const api = new Backlog({ host: getSpaceHost(credential), apiKey: credential.apiKey });
          const { count } = await api.getNotificationsCount({ alreadyRead: false, resourceAlreadyRead: false });

          return { space, count };
        }),
      ),
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 1, // 1 minute
  });

  const totalCount = data?.reduce((acc, curr) => acc + curr.count, 0) ?? 0;

  if (spaces.length === 0) return null;

  return (
    <MenuBarExtra
      icon={{ source: totalCount > 0 ? "icon-brand.png" : { dark: "icon@dark.png", light: "icon.png" } }}
      title={totalCount === 0 ? "No unread" : `${totalCount} unread`}
    >
      <MenuBarExtra.Section title="Spaces">
        {spaces.map(({ space: { spaceKey, name }, credential }, index) => {
          const unreadCount = data?.find(({ space }) => spaceKey === space.spaceKey)?.count;
          const shortcut: Keyboard.Shortcut | undefined =
            index === 0
              ? { modifiers: ["cmd"], key: "1" }
              : index === 1
                ? { modifiers: ["cmd"], key: "2" }
                : index === 2
                  ? { modifiers: ["cmd"], key: "3" }
                  : index === 3
                    ? { modifiers: ["cmd"], key: "4" }
                    : index === 4
                      ? { modifiers: ["cmd"], key: "5" }
                      : index === 5
                        ? { modifiers: ["cmd"], key: "6" }
                        : index === 6
                          ? { modifiers: ["cmd"], key: "7" }
                          : index === 7
                            ? { modifiers: ["cmd"], key: "8" }
                            : index === 8
                              ? { modifiers: ["cmd"], key: "9" }
                              : undefined;

          return (
            <MenuBarExtra.Item
              key={spaceKey}
              title={name}
              icon={getSpaceImageUrl(credential)}
              subtitle={unreadCount ? `${unreadCount} unread` : undefined}
              tooltip={`${name} (${spaceKey})`}
              onAction={() => {
                currentSpace.setSpaceKey(spaceKey);
                launchCommand({ name: "notifications", type: LaunchType.UserInitiated });
              }}
              shortcut={shortcut}
            />
          );
        })}
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Recent Issues"
          icon={{ source: Icon.BulletPoints, tintColor: Color.SecondaryText }}
          onAction={() => launchCommand({ name: "recent-issues", type: LaunchType.UserInitiated })}
        />
        <MenuBarExtra.Item
          title="Recent Projects"
          icon={{ source: Icon.Switch, tintColor: Color.SecondaryText }}
          onAction={() => launchCommand({ name: "recent-projects", type: LaunchType.UserInitiated })}
        />
        <MenuBarExtra.Item
          title="Recent Wikis"
          icon={{ source: Icon.Document, tintColor: Color.SecondaryText }}
          onAction={() => launchCommand({ name: "recent-wikis", type: LaunchType.UserInitiated })}
        />
        <MenuBarExtra.Item
          title="Notifications"
          icon={{ source: Icon.Bell, tintColor: Color.SecondaryText }}
          onAction={() => launchCommand({ name: "notifications", type: LaunchType.UserInitiated })}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
};

export default withProviders(Command);
