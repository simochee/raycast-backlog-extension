import { Color, LaunchType, MenuBarExtra, environment, launchCommand } from "@raycast/api";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentSpace } from "./hooks/useCurrentSpace";
import { useSpaces } from "./hooks/useSpaces";
import { getSpaceImageUrl } from "./utils/image";
import { withProviders } from "./utils/providers";
import { getNotificationCount, getNotificationCountCache } from "./utils/notification";
import type { Image, Keyboard } from "@raycast/api";
import type { NotificationCountSchema } from "./utils/notification";
import type { InferOutput } from "valibot";

const Command = () => {
  console.log(`*${environment.commandName}* [Lifecycle] command started`);

  const queryClient = useQueryClient();
  const spaces = useSpaces();
  const currentSpace = useCurrentSpace();

  const [unreadCounts, setUnreadCounts] = useState<Array<InferOutput<typeof NotificationCountSchema>>>(
    getNotificationCountCache()?.spaces || [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const totalCount = Math.max(
    0,
    unreadCounts.reduce((acc, curr) => acc + curr.count, 0),
  );

  const icon: Image.ImageLike = isLoading
    ? { source: "tabler/cloud-down.svg", tintColor: Color.SecondaryText }
    : { source: totalCount > 0 ? "icon-brand.png" : { dark: "icon@dark.png", light: "icon.png" } };

  const openNotification = async (spaceKey: string) => {
    const unreadCount = unreadCounts.find((item) => item.spaceKey === spaceKey);

    if (!unreadCount) return;

    currentSpace.setSpaceKey(spaceKey);

    if (unreadCount.count > 0) {
      await queryClient.invalidateQueries({ queryKey: ["notifications", spaceKey] });

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    await launchCommand({ name: "notifications", type: LaunchType.UserInitiated });
  };

  useEffect(() => {
    setIsLoading(true);

    getNotificationCount(spaces)
      .then(setUnreadCounts)
      .finally(() => setIsLoading(false));
  }, []);

  if (spaces.length === 0) return null;

  return (
    <MenuBarExtra
      isLoading={isLoading}
      icon={icon}
      title={totalCount === 0 ? "No new" : `${totalCount.toLocaleString()} unread`}
    >
      <MenuBarExtra.Section title="Notifications">
        {spaces.map(({ space: { spaceKey, name }, credential }, index) => {
          const unreadCount = unreadCounts.find((item) => spaceKey === item.spaceKey)?.count;
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
              icon={
                isLoading
                  ? { source: "tabler/loader.svg", tintColor: Color.SecondaryText }
                  : getSpaceImageUrl(credential)
              }
              subtitle={
                unreadCount == null || unreadCount === 0
                  ? undefined
                  : unreadCount > 0
                    ? `${unreadCount.toLocaleString()} unread`
                    : "Failure"
              }
              tooltip={`${name} (${spaceKey})`}
              onAction={async () => openNotification(spaceKey)}
              shortcut={shortcut}
            />
          );
        })}
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
};

export default withProviders(Command);
