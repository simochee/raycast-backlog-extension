import { ActionPanel, Action, Alert, confirmAlert, Form } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import type { SpaceCredentials } from "../utils/credentials";
import { getSpaceWithCache } from "../utils/space";

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
          const space = await getSpaceWithCache({ spaceKey: values.spaceKey, domain, apiKey: values.apiKey });

          onSubmit({ ...values, domain });

          return;
        } catch {
          // try next domain
        }
      }

      throw new Error("Space not found");
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
      title: "Delete Space",
      message: "Are you sure you want to delete this space?",
      primaryAction: {
        title: "Delete",
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
          <Action.SubmitForm title="Add Space" onSubmit={handleSubmit} />
          {onDelete && <Action title="Delete Space" onAction={handleDelete} />}
        </ActionPanel>
      }
    >
      {initialValues ? (
        <Form.Description title="Space Key" text={initialValues.spaceKey} />
      ) : (
        <Form.TextField title="Space Key" {...itemProps.spaceKey} />
      )}
      <Form.TextField title="API Key" {...itemProps.apiKey} />
    </Form>
  );
};
