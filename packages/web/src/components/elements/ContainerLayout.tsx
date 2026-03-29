import { containerMaxWidthToCss } from "@/lib/containerMaxWidth";
import { useBuilderStore } from "@/stores/builderStore";
import { useDndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import type { ContainerElement, Element } from "@vera/shared";
import { Fragment } from "react";

const CONTAINER_GAP_PX = 14;

function ContainerInsertGap({
  containerId,
  insertIndex,
}: {
  containerId: string;
  insertIndex: number;
}) {
  const { active } = useDndContext();
  const isDragging = active != null;

  const { setNodeRef, isOver } = useDroppable({
    id: `container-gap:${containerId}:${insertIndex}`,
    data: { type: "container-gap", containerId, insertIndex },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ height: CONTAINER_GAP_PX, minHeight: CONTAINER_GAP_PX }}
      className={`
        relative z-[1] w-full shrink-0 rounded-md flex items-center justify-center
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

function ContainerDraggableChild({
  child,
  isChildSelected,
  onSelectChild,
  renderChild,
}: {
  child: Element;
  isChildSelected: boolean;
  onSelectChild: (id: string) => void;
  renderChild: (element: Element, isSelected: boolean) => React.ReactNode;
}) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: child.id,
    data: { type: "builder-element" },
  });

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
        relative min-h-[48px] w-full rounded-xl border-2 border-dashed border-builder-border bg-builder-surface-muted/40 p-1 cursor-grab active:cursor-grabbing transition-colors
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <div
        className={`w-full min-h-0 ${isChildSelected ? "ring-2 ring-primary-500 dark:ring-primary-400 ring-offset-2 ring-offset-builder-canvas rounded-md" : ""}`}
      >
        {renderChild(child, isChildSelected)}
      </div>
    </div>
  );
}

interface ContainerLayoutProps {
  element: ContainerElement;
  renderChild: (element: Element, isSelected: boolean) => React.ReactNode;
}

export default function ContainerLayout({
  element,
  renderChild,
}: ContainerLayoutProps) {
  const p = element.props;
  const { selectedElementId, selectElement } = useBuilderStore();
  const children = [...(element.children ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  const paddingStyle = p.padding
    ? `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`
    : "16px";

  const maxW = containerMaxWidthToCss(p.maxWidth);
  const margin =
    p.align === "center" ? "0 auto" : p.align === "right" ? "0 0 0 auto" : "0";

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor:
          p.backgroundColor === "transparent" ? undefined : p.backgroundColor,
      }}
    >
      <div
        style={{
          maxWidth: maxW,
          width: "100%",
          margin,
        }}
        className="flex flex-col gap-0"
      >
        <ContainerInsertGap containerId={element.id} insertIndex={0} />
        {children.map((child, i) => (
          <Fragment key={child.id}>
            <ContainerDraggableChild
              child={child}
              isChildSelected={selectedElementId === child.id}
              onSelectChild={(id) => selectElement(id)}
              renderChild={renderChild}
            />
            <ContainerInsertGap containerId={element.id} insertIndex={i + 1} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
