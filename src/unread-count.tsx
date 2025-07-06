import { Keyboard, launchCommand, LaunchType, MenuBarExtra } from "@raycast/api";
import { useSpaces } from "./hooks/useSpaces";
import { withProviders } from "./utils/providers";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Backlog } from "backlog-js";
import { getSpaceHost } from "./utils/space";
import { getSpaceImageUrl } from "./utils/image";

const Command = () => {
  const spaces = useSpaces();

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
  });

  const totalCount = data?.reduce((acc, curr) => acc + curr.count, 0) ?? 0;

  return (
    <MenuBarExtra
      icon={{ source: totalCount > 0 ? "icon.png" : { dark: "icon@dark.png", light: "icon.png" } }}
      title={totalCount === 0 ? "No unread" : `${totalCount} unread`}
    >
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
            icon={getSpaceImageUrl(credential)}
            title={name}
            subtitle={unreadCount ? `${unreadCount} unread` : undefined}
            tooltip={`${name} (${spaceKey})`}
            onAction={() => {
              launchCommand({ name: "notifications", type: LaunchType.UserInitiated });
            }}
            shortcut={shortcut}
          />
        );
      })}
    </MenuBarExtra>
  );
};

export default withProviders(Command);
