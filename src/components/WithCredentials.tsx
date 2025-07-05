import { useCredentials } from "../hooks/useCredentials";
import { SpaceForm } from "./SpaceForm";

type Props = {
  children: React.ReactNode | Promise<React.ReactNode>;
};

export const WithCredentials = ({ children }: Props) => {
  const { credentials, addCredential } = useCredentials();

  if (credentials.length === 0) {
    return <SpaceForm onSubmit={addCredential} />;
  }

  return <>{children}</>;
};
