import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CredentialsProvider } from "./CredentialsProvider";

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
