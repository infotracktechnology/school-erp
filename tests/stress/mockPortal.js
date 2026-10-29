import * as React from "react";

export const Portal = React.forwardRef((props, ref) => {
  const { container, ...portalProps } = props;
  return React.createElement("div", { ...portalProps, ref, "data-radix-portal": "" }, props.children);
});
Portal.displayName = "Portal";

export const Root = Portal;
