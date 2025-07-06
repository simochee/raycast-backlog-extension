import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { CredentialsProvider } from "../components/CredentialsProvider";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { cache } from "./cache";
import { LocalStorage } from "@raycast/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    }
  }
});
const asyncStoragePersister = createAsyncStoragePersister({
  storage: {
    getItem: cache.get,
    setItem: cache.set,
    removeItem(key) { cache.remove(key) },
  },
})
persistQueryClient({ queryClient, persister: asyncStoragePersister })

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CredentialsProvider>{children}</CredentialsProvider>
    </QueryClientProvider>
  );
};

export const withProviders = <P extends object>(Component: React.ComponentType<P>): React.ComponentType<P> => {
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
