import type { SpaceCredentials } from "../utils/credentials";
import { getSpaceHost } from "../utils/space";
import { ActionPanel, Action, Alert, confirmAlert, Form } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { Backlog } from "backlog-js";

type Props = {
  initialValues?: SpaceCredentials;
  onSubmit(values: SpaceCredentials): void;
  onDelete?(spaceKey: string): void;
};

type FormSchema = {
  spaceKey: string;
  apiKey: string;
};

export const SpaceForm = ({ initialValues, onSubmit, onDelete }: Props) => {
  const { handleSubmit, itemProps } = useForm<FormSchema>({
    async onSubmit(values) {
      const backlogDomains = ["backlog.com", "backlog.jp"] as const;

      for (const domain of backlogDomains) {
        try {
          // check if the space key and api key are valid
          const api = new Backlog({ host: getSpaceHost({ spaceKey: values.spaceKey, domain }), apiKey: values.apiKey });
          await api.getSpace();

          onSubmit({ ...values, domain });

          return;
        } catch {
          // try next domain
        }
      }

      throw new Error("Unable to connect to Backlog space. Please verify your Space Key and API Key.");
    },
    initialValues,
    validation: {
      spaceKey: FormValidation.Required,
      apiKey: FormValidation.Required,
    },
  });

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
      actions={
        <ActionPanel>
          <Action.SubmitForm title={initialValues ? "Save Changes" : "Add Space"} onSubmit={handleSubmit} />
          {onDelete && <Action title="Remove Space" onAction={handleDelete} />}
        </ActionPanel>
      }
    >
      {initialValues ? (
        <Form.Description title="Space Key" text={initialValues.spaceKey} />
      ) : (
        <Form.TextField title="Space Key" placeholder="example" {...itemProps.spaceKey} />
      )}
      <Form.TextField title="API Key" placeholder="Enter your Backlog API key" {...itemProps.apiKey} />
    </Form>
  );
};
