import type { CardElement } from "@vera/shared";
import { resolveBoxStyle } from "@vera/shared";

export default function CardBlock({ element }: { element: CardElement }) {
  const p = element.props;
  const box = resolveBoxStyle(p);
  const pad = p.padding;

  return (
    <div
      style={{
        margin: `${box.margin.top}px ${box.margin.right}px ${box.margin.bottom}px ${box.margin.left}px`,
        padding: `${pad.top}px ${pad.right}px ${pad.bottom}px ${pad.left}px`,
        borderRadius: p.borderRadius,
        border:
          p.borderWidth > 0
            ? `${p.borderWidth}px solid ${p.borderColor}`
            : undefined,
        boxShadow: p.boxShadow === "none" ? undefined : p.boxShadow,
        backgroundColor: p.backgroundColor,
      }}
      className="text-left"
    >
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {p.title}
        </h3>
        {p.description ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {p.description}
          </p>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {p.content}
      </p>
    </div>
  );
}
