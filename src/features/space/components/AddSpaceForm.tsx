import { Alert, confirmAlert, useNavigation } from "@raycast/api";
import { useQueryClient } from "@tanstack/react-query";
import { SpaceForm } from "./SpaceForm";
import type { SpaceCredentials } from "~space/utils/credentials";
import { useCredentials } from "~space/hooks/useCredentials";
import { cache } from "~common/utils/cache";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";
import { DELAY } from "~common/constants/cache";
import { withProviders } from "~common/utils/providers";

export const AddSpaceForm = withProviders(() => {
  const { pop } = useNavigation();
  const queryClient = useQueryClient();
  const currentSpace = useCurrentSpace();
  const { credentials, addCredential } = useCredentials();

  const handleSubmit = async (values: SpaceCredentials) => {
    const credential = credentials.find(({ spaceKey }) => spaceKey === values.spaceKey);

    if (credential) {
      if (
        await confirmAlert({
          title: "Space already exists",
          message: "Do you want to update the space?",
          primaryAction: {
            title: "Cancel",
            style: Alert.ActionStyle.Cancel,
          },
          dismissAction: {
            title: "Confirm",
            style: Alert.ActionStyle.Destructive,
          },
        })
      ) {
        return;
      }

      cache.clear();
      await queryClient.invalidateQueries();
    }

    await addCredential(values);
    await currentSpace.setSpaceKey(values.spaceKey);
    await new Promise((resolve) => setTimeout(resolve, DELAY.NOTIFICATION_UPDATE));

    pop();
  };

  return <SpaceForm onSubmit={handleSubmit} />;
});
