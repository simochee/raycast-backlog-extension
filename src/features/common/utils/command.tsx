import { withProviders } from "./providers";
import type { LaunchProps } from "@raycast/api";
import { UpdateSpaceForm } from "~space/components/UpdateSpaceForm";
import { AddSpaceForm } from "~space/components/AddSpaceForm";

export const withCommand = <TProps extends LaunchProps>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<TProps> => {
  const WrappedComponent = (props: TProps) => {
    if (props.arguments.action === "add-space") {
      return <AddSpaceForm />;
    } else if (props.arguments.action === "update-space") {
      return <UpdateSpaceForm credential={JSON.parse(props.arguments.credential)} />;
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withCommand(${Component.displayName || Component.name})`;

  return withProviders(WrappedComponent);
};
