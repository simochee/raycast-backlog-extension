import { SpaceForm } from "./SpaceForm";
import { useCredentials } from "~space/hooks/useCredentials";

type Props = {
  children: React.ReactNode;
};

export const CredentialsProvider = ({ children }: Props) => {
  const { credentials, addCredential } = useCredentials();

  if (credentials.length === 0) {
    return <SpaceForm onSubmit={addCredential} />;
  }

  return <>{children}</>;
};
