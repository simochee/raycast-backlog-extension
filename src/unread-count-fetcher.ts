import { launchCommand, LaunchType } from "@raycast/api";
import { getUnreadCounts } from "./utils/unread";

const Command = async () => {
  const unreadCounts = await getUnreadCounts();

  await launchCommand({
    name: "unread-count",
    type: LaunchType.Background,
    context: {
      unreadCounts,
    },
  });
};

export default Command;
