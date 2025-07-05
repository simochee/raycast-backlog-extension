import { launchCommand, LaunchType } from "@raycast/api";
import { getUnreadCounts } from "./utils/unread";

const Command = async () => {
  console.log("[unread-count-fetcher] fetching unread counts");

  const unreadCounts = await getUnreadCounts();

  await launchCommand({
    name: "unread-count",
    type: LaunchType.UserInitiated,
    context: {
      unreadCounts,
    },
  });
};

export default Command;
