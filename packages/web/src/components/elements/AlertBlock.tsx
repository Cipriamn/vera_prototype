import { outerStyleFromPaddingAndBox } from "@/lib/outerStyles";
import { cn } from "@/lib/utils";
import type { AlertElement } from "@vera/shared";

export default function AlertBlock({ element }: { element: AlertElement }) {
  const p = element.props;
  const outer = outerStyleFromPaddingAndBox(
    { top: 16, right: 16, bottom: 16, left: 16 },
    p,
    "16px",
  );

  const tone =
    p.variant === "destructive"
      ? "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
      : "border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100";

  return (
    <div
      style={outer}
      className={cn("rounded-lg border text-sm", tone)}
      role="alert"
    >
      <p className="font-medium leading-none tracking-tight">{p.title}</p>
      <p className="mt-2 leading-relaxed opacity-90">{p.message}</p>
    </div>
  );
}
