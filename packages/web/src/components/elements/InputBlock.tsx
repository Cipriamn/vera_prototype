import { outerStyleFromPaddingAndBox } from "@/lib/outerStyles";
import type { InputElement } from "@vera/shared";

export default function InputBlock({ element }: { element: InputElement }) {
  const p = element.props;
  const outer = outerStyleFromPaddingAndBox(undefined, p, "0");

  return (
    <div style={outer} className="w-full max-w-md space-y-2">
      <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {p.label}
      </label>
      <input
        type={p.inputType}
        placeholder={p.placeholder}
        disabled={p.disabled}
        readOnly
        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
      />
    </div>
  );
}
