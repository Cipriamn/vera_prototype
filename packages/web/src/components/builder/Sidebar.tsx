import { PALETTE_ENTRIES } from "@/builder/elementMeta";
import { useDraggable } from "@dnd-kit/core";
import type { ElementType } from "@vera/shared";

interface ElementPaletteItemProps {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
}

function ElementPaletteItem({ type, label, icon }: ElementPaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: "sidebar-item",
      elementType: type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        p-3 rounded-xl border border-builder-border cursor-grab bg-builder-surface
        hover:border-primary-400/60 dark:hover:border-primary-500/50
        hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all
        flex flex-col items-center gap-2
        ${isDragging ? "opacity-50 cursor-grabbing scale-[0.98]" : ""}
      `}
    >
      <div className="w-8 h-8 flex items-center justify-center text-builder-text-muted">
        {icon}
      </div>
      <span className="text-xs text-builder-text font-medium">{label}</span>
    </div>
  );
}

const byCategory = {
  content: PALETTE_ENTRIES.filter((e) => e.category === "content"),
  ui: PALETTE_ENTRIES.filter((e) => e.category === "ui"),
  layout: PALETTE_ENTRIES.filter((e) => e.category === "layout"),
};

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-builder-border bg-builder-surface/90 backdrop-blur-sm p-4 overflow-y-auto">
      <h3 className="text-xs font-semibold font-display uppercase tracking-wider text-builder-text-muted mb-3">
        Elements
      </h3>

      <div className="space-y-5">
        <div>
          <p className="text-[10px] font-semibold uppercase text-builder-text-muted/80 mb-2">
            Content
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {byCategory.content.map((element) => (
              <ElementPaletteItem
                key={element.type}
                type={element.type}
                label={element.label}
                icon={element.icon}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase text-builder-text-muted/80 mb-2">
            UI
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {byCategory.ui.map((element) => (
              <ElementPaletteItem
                key={element.type}
                type={element.type}
                label={element.label}
                icon={element.icon}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase text-builder-text-muted/80 mb-2">
            Layout
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {byCategory.layout.map((element) => (
              <ElementPaletteItem
                key={element.type}
                type={element.type}
                label={element.label}
                icon={element.icon}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-builder-border bg-builder-surface-muted/50 p-3">
        <h3 className="text-xs font-semibold font-display text-builder-text mb-2">
          Quick tips
        </h3>
        <ul className="text-xs text-builder-text-muted space-y-2 leading-relaxed">
          <li className="flex gap-2">
            <span className="text-primary-500 dark:text-primary-400 shrink-0">
              →
            </span>
            Drag blocks onto the canvas
          </li>
          <li className="flex gap-2">
            <span className="text-primary-500 dark:text-primary-400 shrink-0">
              →
            </span>
            Click to select and edit properties
          </li>
          <li className="flex gap-2">
            <span className="text-primary-500 dark:text-primary-400 shrink-0">
              →
            </span>
            Drag to reorder on the page
          </li>
          <li className="flex gap-2">
            <span className="text-primary-500 dark:text-primary-400 shrink-0">
              →
            </span>
            Stack &amp; container for flexible layouts
          </li>
        </ul>
      </div>
    </aside>
  );
}
