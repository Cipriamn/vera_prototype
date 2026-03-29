import ButtonBlock from "@/components/elements/ButtonBlock";
import ColumnLayout from "@/components/elements/ColumnLayout";
import ImageBlock from "@/components/elements/ImageBlock";
import TextBlock from "@/components/elements/TextBlock";
import VideoBlock from "@/components/elements/VideoBlock";
import {
  LayoutSlotBlockedOverlay,
  useDisallowedLayoutOverSlot,
} from "@/hooks/useDisallowedLayoutOverSlot";
import { useBuilderStore } from "@/stores/builderStore";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { Element, GridElement } from "@vera/shared";

interface GridLayoutProps {
  element: GridElement;
}

function GridCellInner({
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
        <div className="p-2 bg-gray-100 text-gray-500 text-xs">
          Unknown element
        </div>
      );
  }
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
        relative min-h-[80px] border-2 border-dashed rounded-lg flex items-center justify-center p-1
        ${blocked ? "border-gray-400 bg-gray-100" : isOver ? "border-primary-400 bg-primary-50" : "border-gray-200"}
      `}
    >
      <LayoutSlotBlockedOverlay show={blocked} />
      <span
        className={`text-xs pointer-events-none ${blocked ? "text-gray-500 opacity-40" : "text-gray-400"}`}
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
}: {
  gridId: string;
  cellIndex: number;
  child: Element;
  isChildSelected: boolean;
  onSelectChild: (id: string) => void;
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
        relative min-h-[80px] border-2 border-dashed rounded-lg flex items-center justify-center p-1 cursor-grab active:cursor-grabbing items-stretch
        ${blocked ? "border-gray-400 bg-gray-100" : isOver ? "border-primary-400 bg-primary-50" : "border-gray-200"}
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <LayoutSlotBlockedOverlay show={blocked} />
      <div
        className={`w-full min-h-0 ${blocked ? "opacity-40" : ""} ${isChildSelected ? "ring-2 ring-primary-500 ring-offset-1 rounded" : ""}`}
      >
        <GridCellInner element={child} isSelected={isChildSelected} />
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
}: {
  gridId: string;
  cellIndex: number;
  child: Element | undefined;
  isChildSelected: boolean;
  onSelectChild: (id: string) => void;
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
    />
  );
}

export default function GridLayout({ element }: GridLayoutProps) {
  const props = element.props;
  const { selectedElementId, selectElement } = useBuilderStore();

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : "16px";

  const totalCells = props.columns * props.rows;
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
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gridTemplateRows: `repeat(${props.rows}, minmax(80px, auto))`,
        gap: `${props.gap}px`,
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
          />
        );
      })}
    </div>
  );
}
