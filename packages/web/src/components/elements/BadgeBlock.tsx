import { outerStyleFromPaddingAndBox } from "@/lib/outerStyles";
import { cn } from "@/lib/utils";
import type { BadgeElement } from "@vera/shared";

export default function BadgeBlock({ element }: { element: BadgeElement }) {
  const p = element.props;
  const outer = outerStyleFromPaddingAndBox(undefined, p, "0");

  const variantClass =
    p.variant === "destructive"
      ? "bg-red-600 text-white border-transparent"
      : p.variant === "outline"
        ? "border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-zinc-100"
        : p.variant === "secondary"
          ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border-transparent"
          : "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 border-transparent";

  const sizeClass =
    p.size === "sm"
      ? "px-2 py-0.5 text-xs"
      : p.size === "lg"
        ? "px-3 py-1 text-sm"
        : "px-2.5 py-0.5 text-xs";

  return (
    <span
      style={outer}
      className={cn(
        "inline-flex items-center rounded-full border font-medium w-fit",
        variantClass,
        sizeClass,
      )}
    >
      {p.text}
    </span>
  );
}
