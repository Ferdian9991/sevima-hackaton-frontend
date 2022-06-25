import React, { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

export const Mobile = React.forwardRef((props, ref) => {
  const isMobile = useMediaQuery({ maxWidth: 950 });
  const mobileId = useMemo(
    () =>
      Math.random()
        .toString(36)
        .replace("0.", "__mobile__" || ""),
    [isMobile]
  );

  return isMobile ? (
    <div ref={ref} id={mobileId} {...props}>
      {props.children}
    </div>
  ) : null;
});

export const Desktop = React.forwardRef((props, ref) => {
  const isDesktop = useMediaQuery({ minWidth: 950 });
  const desktopId = useMemo(
    () =>
      Math.random()
        .toString(36)
        .replace("0.", "__desktop__" || ""),
    [isDesktop]
  );
  return isDesktop ? (
    <div ref={ref} id={desktopId} {...props}>
      {props.children}
    </div>
  ) : null;
});
