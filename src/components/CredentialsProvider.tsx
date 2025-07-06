import React from "react";
import { useCredentials } from "../hooks/useCredentials";
import { SpaceForm } from "./SpaceForm";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const CredentialsProvider = ({ children }: Props) => {
  const { credentials, addCredential } = useCredentials();

  if (credentials.length === 0) {
    return <SpaceForm onSubmit={addCredential} />;
  }

  return <>{children}</>;
};
