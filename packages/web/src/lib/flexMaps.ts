import type { FlexAlignItems, FlexJustifyContent } from "@vera/shared";

export function flexAlignItemsToCss(v: FlexAlignItems): string {
  const map: Record<FlexAlignItems, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
    baseline: "baseline",
  };
  return map[v];
}

export function flexJustifyToCss(v: FlexJustifyContent): string {
  const map: Record<FlexJustifyContent, string> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
  };
  return map[v];
}

export function gridAlignmentToCss(v: string): string {
  const map: Record<string, string> = {
    start: "start",
    center: "center",
    end: "end",
    stretch: "stretch",
  };
  return map[v] ?? "stretch";
}
