import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CredentialsProvider } from "./CredentialsProvider";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CredentialsProvider>{children}</CredentialsProvider>
    </QueryClientProvider>
  );
};
