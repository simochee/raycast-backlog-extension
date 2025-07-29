import { environment } from "@raycast/api";
import { Backlog, Error } from "backlog-js";
import { getSpaceHost } from "./space";
import type { SpaceCredentials } from "./credentials";
import * as v from "valibot";

const BacklogApiErrorSchema = v.object({
  _status: v.number(),
  _body: v.object({
    errors: v.array(v.object({ message: v.string() })),
  }),
});

export const getBacklogApi = (credential: SpaceCredentials) => {
  const api = new Backlog({ host: getSpaceHost(credential), apiKey: credential.apiKey });

  return new Proxy(api, {
    get(target, props, receiver) {
      const methodName = String(props);
      const value = Reflect.get(target, props, receiver);

      if (!/^(?:get|post|put|delete)[A-Z]/.test(methodName)) return value;

      const log = (message: string, level: "log" | "warn" | "error" = "log") => {
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
              const parsed = v.safeParse(BacklogApiErrorSchema, err);

              if (parsed.success) {
                if (typeof err === "object" && err != null) {
                  // @ts-expect-error
                  err.name = "BacklogApiError";
                  // @ts-expect-error
                  err.message = parsed.output._body.errors.map(({ message }) => message).join("\n\n");
                }

                log(`${parsed.output._status}\n${JSON.stringify(parsed.output._body)}`, "warn");
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
