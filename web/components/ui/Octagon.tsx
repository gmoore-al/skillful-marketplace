import { CSSProperties, ReactNode } from "react";

/**
 * A clip-path octagon frame. Pass any background — image, color, video.
 * Children are positioned over the clipped area.
 */
export function Octagon({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`clip-octagon overflow-hidden ${className}`} style={style}>
      {children}
    </div>
  );
}
