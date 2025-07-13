import { Backlog, Error } from "backlog-js";
import { getSpaceHost } from "./space";
import type { SpaceCredentials } from "./credentials";

export const getBacklogApi = (credential: SpaceCredentials) => {
  const api = new Backlog({ host: getSpaceHost(credential), apiKey: credential.apiKey });
  const proxied = new Proxy(api, {
    get(target, props, receiver) {
      const methodName = String(props);
      const value = Reflect.get(target, props, receiver);

      if (!/^(?:get|post|put|delete)[A-Z]/.test(methodName)) return value;

      if (typeof value === "function") {
        return new Proxy(value, {
          async apply(targetMethod, thisArgs, argumentsList) {
            try {
              console.log("[Backlog] %s() - pending", methodName);
              const result = await Reflect.apply(targetMethod, thisArgs, argumentsList);
              console.log("[Backlog] %s() - ok", methodName);
              return result;
            } catch (err) {
              if (err instanceof Error.BacklogApiError) {
                console.error("[Backlog] %s() - %s\n%s", methodName, err.status, JSON.stringify(err.response));
              } else {
                console.error("[Backlog] %s - error\n%s", methodName, err);
              }
              throw err;
            }
          },
        });
      }

      return value;
    },
  });

  return proxied;
};
