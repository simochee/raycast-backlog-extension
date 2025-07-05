import { Action, ActionPanel, Form } from "@raycast/api"
import { FormValidation, useForm } from '@raycast/utils'
import { SpaceCredentials } from "../types/space";
import { getSpaceWithCache } from "../utils/space";

type Props = {
  initialValues?: SpaceCredentials;
  onSubmit(values: SpaceCredentials): void;
}

type FormSchema = {
  spaceKey: string;
  apiKey: string;
}

export const SpaceForm = ({ initialValues, onSubmit }: Props) => {
  const { handleSubmit, itemProps } = useForm<FormSchema>({
    async onSubmit(values) {
      const backlogDomains = ['backlog.com', 'backlog.jp'] as const;

      for (const domain of backlogDomains) {
        try {
          await getSpaceWithCache(values.spaceKey, domain, values.apiKey);

          onSubmit({ ...values, domain });

          return;
        } catch {
          // try next domain
        }
      }

      throw new Error('Space not found');
    },
    initialValues,
    validation: {
      spaceKey: FormValidation.Required,
      apiKey: FormValidation.Required,
    },
  })
  
  return (
    <Form actions={
      <ActionPanel>
        <Action.SubmitForm title="Add Space" onSubmit={handleSubmit} />
      </ActionPanel>
    }>
      {initialValues ? (
        <Form.Description title="Space Key" text={initialValues.spaceKey} />
      ) : (
      <Form.TextField title="Space Key" {...itemProps.spaceKey} />
      )}
      <Form.TextField title="API Key" {...itemProps.apiKey} />
    </Form>
  )
}