import ButtonBlock from "@/components/elements/ButtonBlock";
import GridLayout from "@/components/elements/GridLayout";
import ImageBlock from "@/components/elements/ImageBlock";
import TextBlock from "@/components/elements/TextBlock";
import VideoBlock from "@/components/elements/VideoBlock";
import {
  LayoutSlotBlockedOverlay,
  useDisallowedLayoutOverSlot,
} from "@/hooks/useDisallowedLayoutOverSlot";
import { useBuilderStore } from "@/stores/builderStore";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { ColumnElement, Element } from "@vera/shared";

interface ColumnLayoutProps {
  element: ColumnElement;
}

function ColumnCellInner({
  element,
  isSelected,
}: {
  element: Element;
  isSelected: boolean;
}) {
  switch (element.type) {
    case "text":
      return <TextBlock element={element} isEditing={isSelected} />;
    case "image":
      return <ImageBlock element={element} />;
    case "video":
      return <VideoBlock element={element} />;
    case "button":
      return <ButtonBlock element={element} />;
    case "column":
      return <ColumnLayout element={element} />;
    case "grid":
      return <GridLayout element={element} />;
    default:
      return (
        <div className="p-2 rounded-md border border-builder-border bg-builder-surface-muted text-builder-text-muted text-xs">
          Unknown element
        </div>
      );
  }
}

function ColumnEmptySlot({
  columnId,
  slotIndex,
}: {
  columnId: string;
  slotIndex: number;
}) {
  const disallowed = useDisallowedLayoutOverSlot();
  const { setNodeRef, isOver } = useDroppable({
    id: `column-cell:${columnId}:${slotIndex}`,
    data: {
      type: "column-cell",
      columnId,
      slotIndex,
    },
  });

  const blocked = isOver && disallowed;

  return (
    <div
      ref={setNodeRef}
      className={`
        relative min-h-[100px] border-2 border-dashed rounded-xl flex items-center justify-center p-1 transition-colors
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
        Column {slotIndex + 1}
      </span>
    </div>
  );
}

function ColumnFilledSlot({
  columnId,
  slotIndex,
  child,
  isChildSelected,
  onSelectChild,
}: {
  columnId: string;
  slotIndex: number;
  child: Element;
  isChildSelected: boolean;
  onSelectChild: (id: string) => void;
}) {
  const disallowed = useDisallowedLayoutOverSlot();
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `column-cell:${columnId}:${slotIndex}`,
    data: {
      type: "column-cell",
      columnId,
      slotIndex,
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
        relative min-h-[100px] border-2 border-dashed rounded-xl flex items-center justify-center p-1 cursor-grab active:cursor-grabbing items-stretch transition-colors
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
        <ColumnCellInner element={child} isSelected={isChildSelected} />
      </div>
    </div>
  );
}

function ColumnDropSlot({
  columnId,
  slotIndex,
  child,
  isChildSelected,
  onSelectChild,
}: {
  columnId: string;
  slotIndex: number;
  child: Element | undefined;
  isChildSelected: boolean;
  onSelectChild: (id: string) => void;
}) {
  if (!child) {
    return <ColumnEmptySlot columnId={columnId} slotIndex={slotIndex} />;
  }
  return (
    <ColumnFilledSlot
      columnId={columnId}
      slotIndex={slotIndex}
      child={child}
      isChildSelected={isChildSelected}
      onSelectChild={onSelectChild}
    />
  );
}

export default function ColumnLayout({ element }: ColumnLayoutProps) {
  const props = element.props;
  const { selectedElementId, selectElement } = useBuilderStore();

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : "16px";

  const slotCount = props.columns;
  const children = element.children ?? [];

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor:
          props.backgroundColor === "transparent"
            ? undefined
            : props.backgroundColor,
        display: "grid",
        gridTemplateColumns: `repeat(${slotCount}, 1fr)`,
        gap: `${props.gap}px`,
      }}
    >
      {Array.from({ length: slotCount }).map((_, index) => {
        const child = children.find((c) => c.order === index);
        return (
          <ColumnDropSlot
            key={index}
            columnId={element.id}
            slotIndex={index}
            child={child}
            isChildSelected={child ? selectedElementId === child.id : false}
            onSelectChild={(id) => selectElement(id)}
          />
        );
      })}
    </div>
  );
}
