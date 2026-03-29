import { useBuilderStore } from "@/stores/builderStore";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Element } from "@vera/shared";
import { Fragment, useMemo } from "react";
import { ElementWrapper } from "./ElementWrapper";

function RootInsertGap({ insertIndex }: { insertIndex: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `root-gap:${insertIndex}`,
    data: { type: "root-gap", insertIndex },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative z-30 flex-shrink-0 min-h-[24px] -my-2 mx-0 rounded-md flex items-center justify-center
        transition-colors pointer-events-auto
        ${isOver ? "bg-primary-100 ring-2 ring-primary-400 ring-inset" : "bg-gray-50/80 hover:bg-gray-100/90"}
      `}
      aria-label={`Insert at position ${insertIndex + 1}`}
    />
  );
}

interface SortableElementProps {
  element: Element;
}

function SortableElement({ element }: SortableElementProps) {
  const { selectedElementId, selectElement } = useBuilderStore();
  const isSelected = selectedElementId === element.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
    data: { type: "builder-element" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      className={`relative ${isSelected ? "ring-2 ring-primary-500 ring-offset-2" : ""}`}
    >
      <ElementWrapper element={element} isSelected={isSelected} />
    </div>
  );
}

export default function Canvas() {
  const { elements, selectElement } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  });

  const roots = useMemo(
    () =>
      [...elements]
        .filter((el) => !el.parentId)
        .sort((a, b) => a.order - b.order),
    [elements],
  );

  const handleCanvasClick = () => {
    selectElement(null);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleCanvasClick}
      className={`
        min-h-[calc(100vh-180px)] bg-white rounded-lg shadow-sm p-4
        ${isOver ? "ring-2 ring-primary-500 ring-dashed" : ""}
      `}
    >
      {roots.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-lg font-medium">Drag elements here</p>
            <p className="text-sm mt-1">
              Start building by dragging elements from the sidebar
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {roots.map((element, i) => (
            <Fragment key={element.id}>
              <RootInsertGap insertIndex={i} />
              <SortableElement element={element} />
            </Fragment>
          ))}
          <RootInsertGap insertIndex={roots.length} />
        </div>
      )}
    </div>
  );
}
