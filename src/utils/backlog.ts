import { environment } from "@raycast/api";
import { Backlog, Error } from "backlog-js";
import { getSpaceHost } from "./space";
import type { SpaceCredentials } from "./credentials";

export const getBacklogApi = (credential: SpaceCredentials) => {
  const api = new Backlog({ host: getSpaceHost(credential), apiKey: credential.apiKey });

  return new Proxy(api, {
    get(target, props, receiver) {
      const methodName = String(props);
      const value = Reflect.get(target, props, receiver);

      if (!/^(?:get|post|put|delete)[A-Z]/.test(methodName)) return value;

      const log = (message: string, level: "log" | "error" = "log") => {
        console[level](`*${environment.commandName}* [Backlog] ${credential.spaceKey} > ${methodName}() - ${message}`);
      };

      if (typeof value === "function") {
        return new Proxy(value, {
          async apply(targetMethod, thisArgs, argumentsList) {
            try {
              log("pending");
              const result = await Reflect.apply(targetMethod, thisArgs, argumentsList);
              log("ok");
              return result;
            } catch (err) {
              if (err instanceof Error.BacklogApiError) {
                log(`${err.status}\n${JSON.stringify(err.response)}`, "error");
              } else {
                log(`Unknown error\n${err}`, "error");
              }
              throw err;
            }
          },
        });
      }

      return value;
    },
  });
};
