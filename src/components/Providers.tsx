import { CredentialsProvider } from "./CredentialsProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CredentialsProvider>{children}</CredentialsProvider>
    </QueryClientProvider>
  );
};
