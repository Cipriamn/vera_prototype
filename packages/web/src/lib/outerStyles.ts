import type { BoxStyleProps, SpacingInset } from "@vera/shared";
import { EMPTY_INSETS, resolveBoxStyle } from "@vera/shared";
import type { CSSProperties } from "react";

/** Padding + margin/border/shadow for element wrappers (builder + preview). */
export function outerStyleFromPaddingAndBox(
  padding: SpacingInset | undefined,
  boxPartial: Partial<BoxStyleProps> | undefined,
  paddingFallback = "8px",
): CSSProperties {
  const box = resolveBoxStyle(boxPartial);
  const p = padding ?? EMPTY_INSETS;
  const padCss =
    padding !== undefined
      ? `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`
      : paddingFallback;

  return {
    padding: padCss,
    margin: `${box.margin.top}px ${box.margin.right}px ${box.margin.bottom}px ${box.margin.left}px`,
    borderWidth: box.borderWidth > 0 ? box.borderWidth : undefined,
    borderStyle: box.borderStyle === "none" ? undefined : box.borderStyle,
    borderColor: box.borderWidth > 0 ? box.borderColor : undefined,
    boxShadow: box.boxShadow === "none" ? undefined : box.boxShadow,
    boxSizing: "border-box",
  };
}
