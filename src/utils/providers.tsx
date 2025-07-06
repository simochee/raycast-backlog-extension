import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CredentialsProvider } from "../components/CredentialsProvider";
import type { ComponentType, ReactNode } from "react";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CredentialsProvider>{children}</CredentialsProvider>
    </QueryClientProvider>
  );
};

export const withProviders = <P extends object>(Component: ComponentType<P>): ComponentType<P> => {
  const WrappedComponent = (props: P) => {
    return (
      <Providers>
        <Component {...props} />
      </Providers>
    );
  };

  WrappedComponent.displayName = `withProviders(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
