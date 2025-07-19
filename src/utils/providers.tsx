import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { CredentialsProvider } from "../components/CredentialsProvider";
import { cache } from "./cache";

const queryClient = new QueryClient();
const asyncStoragePersister = createAsyncStoragePersister({
  storage: {
    getItem: cache.get,
    setItem: cache.set,
    removeItem(key) {
      cache.remove(key);
    },
  },
});
persistQueryClient({ queryClient, persister: asyncStoragePersister });

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CredentialsProvider>{children}</CredentialsProvider>
    </QueryClientProvider>
  );
};

export const withProviders = <TProps extends object>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<TProps> => {
  const WrappedComponent = (props: TProps) => {
    return (
      <Providers>
        <Component {...props} />
      </Providers>
    );
  };

  WrappedComponent.displayName = `withProviders(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
