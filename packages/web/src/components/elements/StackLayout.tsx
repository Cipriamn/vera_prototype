import { flexAlignItemsToCss, flexJustifyToCss } from "@/lib/flexMaps";
import { useBuilderStore } from "@/stores/builderStore";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useDndContext } from "@dnd-kit/core";
import type { Element, StackElement } from "@vera/shared";
import { Fragment } from "react";

interface StackLayoutProps {
  element: StackElement;
  renderChild: (element: Element, isSelected: boolean) => React.ReactNode;
}

function StackInsertGap({
  stackId,
  insertIndex,
  direction,
  gapPx,
}: {
  stackId: string;
  insertIndex: number;
  direction: "row" | "column";
  gapPx: number;
}) {
  const { active } = useDndContext();
  const isDragging = active != null;

  const { setNodeRef, isOver } = useDroppable({
    id: `stack-gap:${stackId}:${insertIndex}`,
    data: { type: "stack-gap", stackId, insertIndex },
  });

  const row = direction === "row";
  const g = Math.max(8, gapPx);

  return (
    <div
      ref={setNodeRef}
      style={
        row
          ? {
              width: g,
              minWidth: g,
              minHeight: 40,
              flex: "0 0 auto",
            }
          : { height: g, minHeight: g, width: "100%" }
      }
      className={`
        relative z-[1] shrink-0 rounded-md flex items-center justify-center
        transition-[background-color,border-color] duration-150 border border-dashed
        ${
          !isDragging
            ? "pointer-events-none border-transparent bg-transparent"
            : isOver
              ? "pointer-events-auto bg-primary-100/90 dark:bg-primary-900/50 border-primary-400/70 dark:border-primary-500/60"
              : "pointer-events-auto border-transparent bg-builder-surface-muted/20"
        }
      `}
      aria-hidden={!isDragging}
    />
  );
}

function StackDraggableChild({
  child,
  isChildSelected,
  onSelectChild,
  direction,
  renderChild,
}: {
  child: Element;
  isChildSelected: boolean;
  onSelectChild: (id: string) => void;
  direction: "row" | "column";
  renderChild: (element: Element, isSelected: boolean) => React.ReactNode;
}) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: child.id,
    data: { type: "builder-element" },
  });

  const row = direction === "row";

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onSelectChild(child.id);
      }}
      className={`
        relative min-h-[48px] rounded-xl border-2 border-dashed border-builder-border bg-builder-surface-muted/40 p-1 cursor-grab active:cursor-grabbing transition-colors
        ${row ? "min-w-[80px] flex-1" : "w-full"}
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <div
        className={`min-h-0 ${row ? "h-full" : "w-full"} ${isChildSelected ? "ring-2 ring-primary-500 dark:ring-primary-400 ring-offset-2 ring-offset-builder-canvas rounded-md" : ""}`}
      >
        {renderChild(child, isChildSelected)}
      </div>
    </div>
  );
}

export default function StackLayout({
  element,
  renderChild,
}: StackLayoutProps) {
  const p = element.props;
  const { selectedElementId, selectElement } = useBuilderStore();
  const children = [...(element.children ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  const paddingStyle = p.padding
    ? `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`
    : "8px";

  const direction = p.direction ?? "column";

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor:
          p.backgroundColor === "transparent" ? undefined : p.backgroundColor,
        display: "flex",
        flexDirection: direction === "row" ? "row" : "column",
        flexWrap: p.wrap ? "wrap" : "nowrap",
        gap: 0,
        alignItems: flexAlignItemsToCss(p.alignItems),
        justifyContent: flexJustifyToCss(p.justifyContent),
      }}
    >
      <StackInsertGap
        stackId={element.id}
        insertIndex={0}
        direction={direction}
        gapPx={p.gap}
      />
      {children.map((child, i) => (
        <Fragment key={child.id}>
          <StackDraggableChild
            child={child}
            isChildSelected={selectedElementId === child.id}
            onSelectChild={(id) => selectElement(id)}
            direction={direction}
            renderChild={renderChild}
          />
          <StackInsertGap
            stackId={element.id}
            insertIndex={i + 1}
            direction={direction}
            gapPx={p.gap}
          />
        </Fragment>
      ))}
    </div>
  );
}
