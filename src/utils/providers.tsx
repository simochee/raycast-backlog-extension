import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CredentialsProvider } from "../components/CredentialsProvider";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CredentialsProvider>{children}</CredentialsProvider>
    </QueryClientProvider>
  );
};

export const withProviders = <P extends object>(Component: React.ComponentType<P>): React.ComponentType<P> => {
  const WrappedComponent = (props: P) => {
    console.log(Component.displayName, 'rendering with providers');
    
    return (
      <Providers>
        <Component {...props} />
      </Providers>
    );
  };

  WrappedComponent.displayName = `withProviders(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
