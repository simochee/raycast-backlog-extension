import { Keyboard, launchCommand, LaunchProps, LaunchType, MenuBarExtra } from "@raycast/api";
import { useCachedPromise, useCachedState, usePromise } from "@raycast/utils";
import * as v from "valibot";
import { getUnreadCounts } from "./utils/unread";
import { useSpaces } from "./hooks/useSpaces";

const ContextSchema = v.object({
  unreadCounts: v.array(
    v.object({
      spaceKey: v.string(),
      count: v.number(),
    }),
  ),
});

const Command = (props: LaunchProps) => {
  const [spaces] = useSpaces();

  const result = v.safeParse(ContextSchema, props.launchContext);

  const [unreadCounts, setUnreadCounts] = useCachedState<{ spaceKey: string; count: number }[]>("unread-counts", []);

  if (result.success) {
    setUnreadCounts(result.output.unreadCounts);
  }

  const totalCount = unreadCounts.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <MenuBarExtra
      icon={{ source: { dark: "icon-white.png", light: "icon-black.png" } }}
      title={totalCount === 0 ? "All read" : `${totalCount} unread`}
    >
      {spaces?.map(({ space, domain, apiKey }, index) => {
        const unraedCount = unreadCounts.find(({ spaceKey }) => spaceKey === space.spaceKey)?.count;
        const shortcut: Keyboard.Shortcut | undefined = index === 0
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
                          : undefined
        
        return (
          <MenuBarExtra.Item
            key={space.spaceKey}
            icon={`https://${space.spaceKey}.${domain}/api/v2/space/image?apiKey=${apiKey}`}
            title={space.name}
            subtitle={unraedCount ? `(${unraedCount} unread)` : undefined}
            tooltip={`${space.name} (${space.spaceKey})`}
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

export default Command;
