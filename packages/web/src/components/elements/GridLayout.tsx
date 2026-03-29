import {
  LayoutSlotBlockedOverlay,
  useDisallowedLayoutOverSlot,
} from "@/hooks/useDisallowedLayoutOverSlot";
import { gridAlignmentToCss } from "@/lib/flexMaps";
import { useBuilderStore } from "@/stores/builderStore";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { Element, GridElement } from "@vera/shared";

interface GridLayoutProps {
  element: GridElement;
  renderChild: (element: Element, isSelected: boolean) => React.ReactNode;
}

function GridEmptyCell({
  gridId,
  cellIndex,
}: {
  gridId: string;
  cellIndex: number;
}) {
  const disallowed = useDisallowedLayoutOverSlot();
  const { setNodeRef, isOver } = useDroppable({
    id: `grid-cell:${gridId}:${cellIndex}`,
    data: {
      type: "grid-cell",
      gridId,
      cellIndex,
    },
  });

  const blocked = isOver && disallowed;

  return (
    <div
      ref={setNodeRef}
      className={`
        relative min-h-[80px] border-2 border-dashed rounded-xl flex items-center justify-center p-1 transition-colors
        ${
          blocked
            ? "border-zinc-400 dark:border-zinc-500 bg-builder-surface-muted"
            : isOver
              ? "border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/35"
              : "border-builder-border bg-builder-surface-muted/40"
        }
      `}
    >
      <LayoutSlotBlockedOverlay show={blocked} />
      <span
        className={`text-xs pointer-events-none font-medium ${blocked ? "text-builder-text-muted opacity-40" : "text-builder-text-muted"}`}
      >
        Cell {cellIndex + 1}
      </span>
    </div>
  );
}

function GridFilledCell({
  gridId,
  cellIndex,
  child,
  isChildSelected,
  onSelectChild,
  renderChild,
}: {
  gridId: string;
  cellIndex: number;
  child: Element;
  isChildSelected: boolean;
  onSelectChild: (id: string) => void;
  renderChild: (element: Element, isSelected: boolean) => React.ReactNode;
}) {
  const disallowed = useDisallowedLayoutOverSlot();
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `grid-cell:${gridId}:${cellIndex}`,
    data: {
      type: "grid-cell",
      gridId,
      cellIndex,
    },
  });

  const {
    setNodeRef: setDragRef,
    attributes,
    listeners,
    isDragging,
  } = useDraggable({
    id: child.id,
    data: { type: "builder-element" },
  });

  const setCombinedRef = (node: HTMLDivElement | null) => {
    setDropRef(node);
    setDragRef(node);
  };

  const blocked = isOver && disallowed;

  return (
    <div
      ref={setCombinedRef}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onSelectChild(child.id);
      }}
      className={`
        relative min-h-[80px] border-2 border-dashed rounded-xl flex items-center justify-center p-1 cursor-grab active:cursor-grabbing items-stretch transition-colors
        ${
          blocked
            ? "border-zinc-400 dark:border-zinc-500 bg-builder-surface-muted"
            : isOver
              ? "border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/35"
              : "border-builder-border bg-builder-surface-muted/40"
        }
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <LayoutSlotBlockedOverlay show={blocked} />
      <div
        className={`w-full min-h-0 ${blocked ? "opacity-40" : ""} ${isChildSelected ? "ring-2 ring-primary-500 dark:ring-primary-400 ring-offset-2 ring-offset-builder-canvas rounded-md" : ""}`}
      >
        {renderChild(child, isChildSelected)}
      </div>
    </div>
  );
}

function GridDropCell({
  gridId,
  cellIndex,
  child,
  isChildSelected,
  onSelectChild,
  renderChild,
}: {
  gridId: string;
  cellIndex: number;
  child: Element | undefined;
  isChildSelected: boolean;
  onSelectChild: (id: string) => void;
  renderChild: (element: Element, isSelected: boolean) => React.ReactNode;
}) {
  if (!child) {
    return <GridEmptyCell gridId={gridId} cellIndex={cellIndex} />;
  }
  return (
    <GridFilledCell
      gridId={gridId}
      cellIndex={cellIndex}
      child={child}
      isChildSelected={isChildSelected}
      onSelectChild={onSelectChild}
      renderChild={renderChild}
    />
  );
}

export default function GridLayout({ element, renderChild }: GridLayoutProps) {
  const props = element.props;
  const { selectedElementId, selectElement } = useBuilderStore();

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : "16px";

  const totalCells = props.columns * props.rows;
  const children = element.children ?? [];
  const columnGap = props.columnGap ?? props.gap;
  const rowGap = props.rowGap ?? props.gap;
  const minRow = props.minRowHeight ?? 80;
  const alignItems = props.alignItems ?? "stretch";
  const justifyItems = props.justifyItems ?? "stretch";

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor:
          props.backgroundColor === "transparent"
            ? undefined
            : props.backgroundColor,
        display: "grid",
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gridTemplateRows: `repeat(${props.rows}, minmax(${minRow}px, auto))`,
        columnGap: `${columnGap}px`,
        rowGap: `${rowGap}px`,
        alignItems: gridAlignmentToCss(alignItems),
        justifyItems: gridAlignmentToCss(justifyItems),
      }}
    >
      {Array.from({ length: totalCells }).map((_, index) => {
        const child = children.find((c) => c.order === index);
        return (
          <GridDropCell
            key={index}
            gridId={element.id}
            cellIndex={index}
            child={child}
            isChildSelected={child ? selectedElementId === child.id : false}
            onSelectChild={(id) => selectElement(id)}
            renderChild={renderChild}
          />
        );
      })}
    </div>
  );
}
