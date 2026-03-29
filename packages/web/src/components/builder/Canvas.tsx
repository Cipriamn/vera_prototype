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
        relative z-30 flex-shrink-0 min-h-[24px] -my-2 mx-0 rounded-lg flex items-center justify-center
        transition-colors pointer-events-auto
        ${
          isOver
            ? "bg-primary-100 dark:bg-primary-900/50 ring-2 ring-primary-400 dark:ring-primary-500 ring-inset"
            : "bg-builder-app/80 hover:bg-builder-surface-muted/80"
        }
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
      className={`relative rounded-md ${
        isSelected
          ? "ring-2 ring-primary-500 dark:ring-primary-400 ring-offset-2 ring-offset-builder-canvas"
          : ""
      }`}
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
        min-h-[calc(100vh-8rem)] max-w-5xl mx-auto rounded-2xl border border-builder-border
        bg-builder-canvas shadow-builder-canvas dark:shadow-builder-canvas-dark p-6 md:p-8
        bg-[radial-gradient(rgb(24_24_27/0.06)_1px,transparent_1px)] [background-size:20px_20px]
        dark:bg-[radial-gradient(rgb(244_244_245/0.07)_1px,transparent_1px)]
        ${isOver ? "ring-2 ring-dashed ring-primary-500 dark:ring-primary-400 ring-offset-2 ring-offset-builder-app" : ""}
      `}
    >
      {roots.length === 0 ? (
        <div className="h-full min-h-[320px] flex items-center justify-center text-builder-text-muted">
          <div className="text-center max-w-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-builder-border bg-builder-surface-muted/40">
              <svg
                className="h-7 w-7 text-primary-500 dark:text-primary-400"
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
            </div>
            <p className="text-lg font-semibold font-display text-builder-text">
              Drag elements here
            </p>
            <p className="text-sm mt-2 leading-relaxed">
              Pull blocks from the left palette to start your page.
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
