import { Color, LaunchType, MenuBarExtra, environment, launchCommand } from "@raycast/api";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import type { Image } from "@raycast/api";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { useSpaces } from "~space/hooks/useSpaces";
import { getSpaceImageUrl } from "~common/utils/image";
import { withProviders } from "~common/utils/providers";
import { DELAY } from "~common/constants/cache";
import { notificationCountOptions, notificationsOptions } from "~common/utils/queryOptions";
import { ICONS } from "~common/constants/icon";
import { indexToShortcut } from "~common/utils/shortcut";

const Command = () => {
  console.log(`*${environment.commandName}* [Lifecycle] command started`);

  const queryClient = useQueryClient();
  const spaces = useSpaces();
  const currentSpace = useCurrentSpace();

  const results = useQueries({
    queries: spaces.map(({ credential }) => notificationCountOptions(credential)),
  });

  const unreadCounts = spaces.map(({ space, credential }, i) => ({
    space,
    credential,
    count: results[i]?.data?.count || 0,
    isLoading: !results[i]?.isFetched || false,
    hasError: results[i]?.isError || false,
  }));
  const isPending = unreadCounts.some(({ isLoading }) => isLoading);

  console.log("[menu-bar]", { isPending, unreadCounts: JSON.stringify(results) });

  const totalCount = Math.max(
    0,
    unreadCounts.reduce((acc, curr) => acc + curr.count, 0),
  );

  const icon: Image.ImageLike = isPending
    ? { source: ICONS.DOWNLOADING, tintColor: Color.SecondaryText }
    : { source: totalCount > 0 ? "icon-brand.png" : { dark: "icon@dark.png", light: "icon.png" } };

  const openNotification = async (spaceKey: string) => {
    const unreadCount = unreadCounts.find(({ space }) => space.spaceKey === spaceKey);

    if (!unreadCount) return;

    await currentSpace.setSpaceKey(spaceKey);

    if (unreadCount.count > 0) {
      await queryClient.invalidateQueries({ queryKey: notificationsOptions(currentSpace).queryKey });

      await new Promise((resolve) => setTimeout(resolve, DELAY.NOTIFICATION_UPDATE));
    }

    await launchCommand({ name: "notifications", type: LaunchType.UserInitiated });
  };

  if (spaces.length === 0) return null;

  return (
    <MenuBarExtra
      isLoading={isPending}
      icon={icon}
      title={totalCount === 0 ? "No new" : `${totalCount.toLocaleString()} unread`}
    >
      <MenuBarExtra.Section title="Notifications">
        {unreadCounts.map(({ space: { spaceKey, name }, credential, count, isLoading, hasError }, i) => {
          return (
            <MenuBarExtra.Item
              key={spaceKey}
              title={name}
              icon={
                isLoading ? { source: ICONS.LOADING, tintColor: Color.SecondaryText } : getSpaceImageUrl(credential)
              }
              subtitle={hasError ? "Failure" : count > 0 ? `${count.toLocaleString()} unread` : ""}
              tooltip={`${name} (${spaceKey})`}
              onAction={async () => openNotification(spaceKey)}
              shortcut={indexToShortcut(i, ["cmd"])}
            />
          );
        })}
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
};

export default withProviders(Command);
