import { useNavigation } from "@raycast/api";
import { useQueryClient } from "@tanstack/react-query";
import { SpaceForm } from "./SpaceForm";
import type { SpaceCredentials } from "~space/utils/credentials";
import { cache } from "~common/utils/cache";
import { useCredentials } from "~space/hooks/useCredentials";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { useSpaces } from "~space/hooks/useSpaces";
import { DELAY } from "~common/constants/cache";
import { withProviders } from "~common/utils/providers";

type Props = {
  credential: SpaceCredentials;
};

console.log(withProviders);

export const UpdateSpaceForm = withProviders(({ credential }: Props) => {
  const { pop } = useNavigation();
  const queryClient = useQueryClient();
  const { updateCredential, removeCredential } = useCredentials();
  const currentSpace = useCurrentSpace();

  const spaces = useSpaces();

  const handleUpdateSpace = async (values: SpaceCredentials) => {
    cache.clear();
    await queryClient.invalidateQueries();

    await updateCredential(values);
    await currentSpace.setSpaceKey(values.spaceKey);
    await new Promise((resolve) => setTimeout(resolve, DELAY.NOTIFICATION_UPDATE));

    pop();
  };

  const handleDeleteSpace = async (spaceKey: string) => {
    await removeCredential(spaceKey);
    if (currentSpace.space.spaceKey === spaceKey) {
      await currentSpace.setSpaceKey(spaces[0]?.space.spaceKey ?? "");
    }
    pop();
  };

  return <SpaceForm initialValues={credential} onSubmit={handleUpdateSpace} onDelete={handleDeleteSpace} />;
});
