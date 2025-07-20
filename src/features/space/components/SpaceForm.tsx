import { Action, ActionPanel, Alert, Form, Toast, confirmAlert, showToast } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { useMemo } from "react";
import type { SpaceCredentials } from "~space/utils/credentials";
import { getBacklogApi } from "~space/utils/backlog";
import { getSpaceHost } from "~space/utils/space";

type Props = {
  initialValues?: SpaceCredentials;
  onSubmit: (values: SpaceCredentials) => void;
  onDelete?: (spaceKey: string) => void;
};

type FormSchema = {
  spaceHost: string;
  apiKey: string;
};

const hostRegex = /(([a-z0-9-]+)\.(backlog\.(?:com|jp)))/;

export const SpaceForm = ({ initialValues, onSubmit, onDelete }: Props) => {
  const { handleSubmit, itemProps, values } = useForm<FormSchema>({
    async onSubmit({ spaceHost, apiKey }) {
      const [, , spaceKey, domain] = hostRegex.exec(spaceHost) || [];

      if (!spaceKey || (domain !== "backlog.com" && domain !== "backlog.jp")) {
        throw new Error("Invalid space host");
      }

      const credential: SpaceCredentials = { spaceKey, domain, apiKey };

      try {
        // check if the space key and api key are valid
        const api = getBacklogApi(credential);
        await api.getSpace();

        onSubmit(credential);
      } catch {
        showToast({
          style: Toast.Style.Failure,
          title: "Invalid Space Key or API Key",
          message: "Please check your Space Key and API Key and try again.",
        });
      }
    },
    initialValues,
    validation: {
      spaceHost: (value) => {
        if (!value) return "The item is required";

        const host = hostRegex.exec(value);

        if (!host) return "Invalid space domain";
      },
      apiKey: FormValidation.Required,
    },
  });

  const spaceHost = useMemo(() => hostRegex.exec(values.spaceHost)?.[1], [values.spaceHost]);

  const handleDelete = async () => {
    if (!initialValues) {
      return;
    }

    await confirmAlert({
      title: "Remove Space",
      message: "Are you sure you want to remove this space configuration?",
      primaryAction: {
        title: "Remove",
        style: Alert.ActionStyle.Destructive,
        onAction() {
          onDelete?.(initialValues.spaceKey);
        },
      },
    });
  };

  return (
    <Form
      navigationTitle={initialValues ? "Edit Space" : "Add Space"}
      searchBarAccessory={
        spaceHost ? (
          <Form.LinkAccessory target={`https://${spaceHost}/EditApiSettings.action`} text="Get API Key" />
        ) : null
      }
      actions={
        <ActionPanel>
          <Action.SubmitForm title={initialValues ? "Save Changes" : "Add Space"} onSubmit={handleSubmit} />
          {onDelete && <Action title="Remove Space" onAction={handleDelete} />}
        </ActionPanel>
      }
    >
      {initialValues ? (
        <Form.Description title="Space Host" text={getSpaceHost(initialValues)} />
      ) : (
        <Form.TextField
          title="Space Domain"
          placeholder="example.backlog.com"
          {...itemProps.spaceHost}
          info="The domain of your Backlog space."
        />
      )}
      <Form.TextField title="API Key" placeholder="Your Backlog API key" {...itemProps.apiKey} />
    </Form>
  );
};
