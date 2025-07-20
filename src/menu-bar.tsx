import { Color, LaunchType, MenuBarExtra, environment, launchCommand } from "@raycast/api";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Image, Keyboard } from "@raycast/api";
import type { NotificationCountSchema } from "~notification/utils/notification";
import type { InferOutput } from "valibot";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { useSpaces } from "~space/hooks/useSpaces";
import { getSpaceImageUrl } from "~common/utils/image";
import { withProviders } from "~common/utils/providers";
import { getNotificationCount, getNotificationCountCache } from "~notification/utils/notification";
import { DELAY } from "~common/constants/cache";
import { notificationsOptions } from "~common/utils/queryOptions";
import { ICONS } from "~common/constants/icon";

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
    ? { source: ICONS.DOWNLOADING, tintColor: Color.SecondaryText }
    : { source: totalCount > 0 ? "icon-brand.png" : { dark: "icon@dark.png", light: "icon.png" } };

  const openNotification = async (spaceKey: string) => {
    const unreadCount = unreadCounts.find((item) => item.spaceKey === spaceKey);

    if (!unreadCount) return;

    await currentSpace.setSpaceKey(spaceKey);

    if (unreadCount.count > 0) {
      await queryClient.invalidateQueries({ queryKey: notificationsOptions(currentSpace).queryKey });

      await new Promise((resolve) => setTimeout(resolve, DELAY.NOTIFICATION_UPDATE));
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
                isLoading ? { source: ICONS.LOADING, tintColor: Color.SecondaryText } : getSpaceImageUrl(credential)
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
