/* eslint-disable @typescript-eslint/no-explicit-any */

const promiseCache = new Map<string, Promise<any>>();

/**
 * Deduplicates promise execution based on method and arguments.
 * Automatically generates a key from the method name and arguments.
 *
 * @param method - The method to call
 * @param args - Arguments to pass to the method
 * @returns Promise that resolves to the result
 */
export const dedupe = async <TMethod extends (...args: Array<any>) => Promise<any>, TArgs extends Parameters<TMethod>>(
  method: TMethod,
  ...args: TArgs
): Promise<Awaited<ReturnType<TMethod>>> => {
  // Generate key from method name and arguments
  const methodName = method.name || "anonymous";
  const key = `${methodName}:${JSON.stringify(args)}`;

  // Check if there's already a promise with this key
  const existingPromise = promiseCache.get(key);
  if (existingPromise) {
    return existingPromise as Promise<Awaited<ReturnType<TMethod>>>;
  }

  // Create new promise and cache it
  const newPromise = method(...args).finally(() => {
    // Remove from cache when promise completes (either resolves or rejects)
    promiseCache.delete(key);
  });

  promiseCache.set(key, newPromise);
  return newPromise;
};
