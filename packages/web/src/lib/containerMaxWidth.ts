import type { ContainerMaxWidth } from "@vera/shared";

const TOKEN_PX: Record<Exclude<ContainerMaxWidth, number>, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  full: 99999,
};

export function containerMaxWidthToCss(maxWidth: ContainerMaxWidth): string {
  if (typeof maxWidth === "number") return `${maxWidth}px`;
  if (maxWidth === "full") return "100%";
  return `${TOKEN_PX[maxWidth]}px`;
}
