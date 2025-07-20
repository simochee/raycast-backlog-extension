import { Action, ActionPanel, Alert, Color, Form, Toast, confirmAlert, showToast } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { useMemo, useState } from "react";
import type { SpaceCredentials } from "~space/utils/credentials";
import { getBacklogApi } from "~space/utils/backlog";
import { getSpaceHost } from "~space/utils/space";
import { ICONS } from "~common/constants/icon";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, itemProps, values } = useForm<FormSchema>({
    async onSubmit({ spaceHost, apiKey }) {
      try {
        setIsSubmitting(true);

        const [, , spaceKey = initialValues?.spaceKey, domain = initialValues?.domain] =
          hostRegex.exec(spaceHost) || [];

        if (!spaceKey || (domain !== "backlog.com" && domain !== "backlog.jp")) {
          throw new Error("Invalid space host");
        }

        if (initialValues && initialValues.apiKey === apiKey) {
          await showToast({
            title: "No changes",
            message: "The API key is the same as the existing one.",
            style: Toast.Style.Failure,
          });
          return;
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
      } finally {
        setIsSubmitting(false);
      }
    },
    initialValues,
    validation: {
      spaceHost: (value) => {
        if (initialValues) return;

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
      isLoading={isSubmitting}
      navigationTitle={initialValues ? "Edit Space" : "Add Space"}
      searchBarAccessory={
        spaceHost ? (
          <Form.LinkAccessory target={`https://${spaceHost}/EditApiSettings.action`} text="Get API Key" />
        ) : null
      }
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title={initialValues ? "Save Changes" : "Add Space"}
            icon={{ source: initialValues ? ICONS.UPDATE_FORM : ICONS.ADD_FORM, tintColor: Color.Green }}
            onSubmit={handleSubmit}
          />
          {onDelete && (
            <Action
              title="Remove Space"
              icon={{ source: ICONS.DELETE_FORM, tintColor: Color.Red }}
              onAction={handleDelete}
            />
          )}
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
