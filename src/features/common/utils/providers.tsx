import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { ErrorBoundary } from "react-error-boundary";
import { Detail } from "@raycast/api";
import { CredentialsProvider } from "../../space/components/CredentialsProvider";
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
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary fallback={<Detail markdown="# Fatal Error" />} onReset={reset}>
            <CredentialsProvider>{children}</CredentialsProvider>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
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
