import { List } from "@raycast/api";
import { CommonActionPanel } from "~common/components/CommonActionPanel";
import { withProviders } from "~common/utils/providers";
import { RepositoryPicker } from "~pull-request/components/RepositoryPicker";

const Command = () => {
  return <RepositoryPicker />;
};

export default withProviders(Command);
