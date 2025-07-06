import { Keyboard, launchCommand, LaunchProps, LaunchType, MenuBarExtra } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import * as v from "valibot";
import { useSpaces } from "./hooks/useSpaces";
import { withProviders } from "./utils/providers";

const ContextSchema = v.object({
  unreadCounts: v.array(
    v.object({
      spaceKey: v.string(),
      count: v.number(),
    }),
  ),
});

const Command = (props: LaunchProps) => {
  console.log('launching unread-count')
  
  const spaces = useSpaces();

  console.log('spaces fetched');

  const result = v.safeParse(ContextSchema, props.launchContext);

  const [unreadCounts, setUnreadCounts] = useCachedState<{ spaceKey: string; count: number }[]>("unread-counts", []);

  if (result.success) {
    setUnreadCounts(result.output.unreadCounts);
  }

  const totalCount = unreadCounts.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <MenuBarExtra
      icon={{ source: totalCount > 0 ? "icon.png" : { dark: "icon@dark.png", light: "icon.png" } }}
      title={totalCount === 0 ? "No unread" : `${totalCount} unread`}
    >
      {spaces.map(({ space: { spaceKey, name }, credential: { domain, apiKey } }, index) => {
        const unreadCount = unreadCounts.find((space) => spaceKey === space.spaceKey)?.count;
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
            icon={`https://${spaceKey}.${domain}/api/v2/space/image?apiKey=${apiKey}`}
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
