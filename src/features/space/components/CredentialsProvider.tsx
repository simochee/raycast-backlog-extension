import { useCredentials } from "../../../hooks/useCredentials";
import { SpaceForm } from "./SpaceForm";

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
