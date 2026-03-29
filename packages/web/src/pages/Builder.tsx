import Canvas from "@/components/builder/Canvas";
import PropertyPanel from "@/components/builder/PropertyPanel";
import Sidebar from "@/components/builder/Sidebar";
import Toolbar from "@/components/builder/Toolbar";
import { useBuilderTheme } from "@/hooks/useBuilderTheme";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/stores/builderStore";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type Collision,
  type CollisionDetection,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Element, ElementType } from "@vera/shared";
import { isLayoutElement } from "@vera/shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function layoutIdFromSlotDroppableId(id: string): string | null {
  if (id.startsWith("grid-cell:")) {
    const rest = id.slice("grid-cell:".length);
    const i = rest.lastIndexOf(":");
    if (i === -1) return null;
    return rest.slice(0, i);
  }
  if (id.startsWith("column-cell:")) {
    const rest = id.slice("column-cell:".length);
    const i = rest.lastIndexOf(":");
    if (i === -1) return null;
    return rest.slice(0, i);
  }
  if (id.startsWith("stack-gap:")) {
    const rest = id.slice("stack-gap:".length);
    const i = rest.lastIndexOf(":");
    if (i === -1) return null;
    return rest.slice(0, i);
  }
  if (id.startsWith("container-gap:")) {
    const rest = id.slice("container-gap:".length);
    const i = rest.lastIndexOf(":");
    if (i === -1) return null;
    return rest.slice(0, i);
  }
  return null;
}

function pickNearestRootGapCollision(
  args: Parameters<CollisionDetection>[0],
): Collision | undefined {
  const pointerHits = pointerWithin(args);
  const gaps = pointerHits.filter((c) => String(c.id).startsWith("root-gap:"));
  if (gaps.length === 0) return undefined;
  if (gaps.length === 1) return gaps[0];
  const coords = args.pointerCoordinates;
  if (!coords) return gaps[0];
  let best = gaps[0];
  let bestDist = Infinity;
  for (const g of gaps) {
    const rect = args.droppableRects.get(g.id);
    if (!rect) continue;
    const cy = rect.top + rect.height / 2;
    const dist = Math.abs(coords.y - cy);
    if (dist < bestDist) {
      bestDist = dist;
      best = g;
    }
  }
  return best;
}

/** Root insert strips first; then grid/column only when center targets that slot/layout. */
const layoutSlotCollisionDetection: CollisionDetection = (args) => {
  const rootGap = pickNearestRootGapCollision(args);
  if (rootGap) {
    return [rootGap];
  }

  const centerCollisions = closestCenter(args);
  const pointerHits = pointerWithin(args);
  const slotHit = pointerHits.find((c) => {
    const s = String(c.id);
    return (
      s.startsWith("grid-cell:") ||
      s.startsWith("column-cell:") ||
      s.startsWith("stack-gap:") ||
      s.startsWith("container-gap:")
    );
  });

  if (slotHit) {
    const top = centerCollisions[0];
    const topId = top ? String(top.id) : "";
    const slotLayoutId = layoutIdFromSlotDroppableId(String(slotHit.id));

    const centerTargetsSlot =
      topId.startsWith("grid-cell:") ||
      topId.startsWith("column-cell:") ||
      topId.startsWith("stack-gap:") ||
      topId.startsWith("container-gap:");
    const centerOnLayoutThatOwnsSlot =
      slotLayoutId != null && topId === slotLayoutId;

    if (centerTargetsSlot || centerOnLayoutThatOwnsSlot) {
      return [slotHit];
    }
  }

  if (centerCollisions.length > 0) {
    return centerCollisions;
  }
  return slotHit ? [slotHit] : [];
};

function findElementTypeInTree(
  list: Element[],
  id: string,
): ElementType | null {
  for (const el of list) {
    if (el.id === id) return el.type;
    if (isLayoutElement(el) && el.children?.length) {
      const t = findElementTypeInTree(el.children, id);
      if (t) return t;
    }
  }
  return null;
}

export default function Builder() {
  const { siteId, pageId } = useParams<{ siteId: string; pageId?: string }>();
  const navigate = useNavigate();
  const {
    site,
    elements,
    isLoading,
    loadSite,
    loadPage,
    addElement,
    addGridChild,
    addColumnChild,
    addFlowChild,
    moveElementToFlowSlot,
    moveElementToGridCell,
    moveElementToColumnSlot,
    moveElementToRoot,
    setElements,
  } = useBuilderStore();

  useEffect(() => {
    if (!site || !pageId) return;

    const isTypingContext = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      return Boolean(
        target.closest("input, textarea, select, [contenteditable='true']"),
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        const { savePage, hasUnsavedChanges, isSaving, currentPage } =
          useBuilderStore.getState();
        if (currentPage && hasUnsavedChanges && !isSaving) {
          void savePage();
        }
        return;
      }

      if (isTypingContext(e.target)) return;

      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) useBuilderStore.getState().redo();
        else useBuilderStore.getState().undo();
        return;
      }

      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        useBuilderStore.getState().redo();
        return;
      }

      if (
        e.key === "Insert" ||
        (mod && e.shiftKey && e.key.toLowerCase() === "a")
      ) {
        e.preventDefault();
        useBuilderStore.getState().addElement("text");
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        const { selectedElementId, deleteElement } = useBuilderStore.getState();
        if (selectedElementId) {
          e.preventDefault();
          deleteElement(selectedElementId);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [site, pageId]);

  const { theme, toggleTheme } = useBuilderTheme();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ElementType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (siteId) {
      loadSite(siteId);
    }
  }, [siteId, loadSite]);

  useEffect(() => {
    if (site && !pageId) {
      // Navigate to homepage if no page specified
      const homepage = site.pages?.find((p) => p.isHomepage);
      if (homepage) {
        navigate(`/builder/${siteId}/${homepage.id}`, { replace: true });
      }
    } else if (siteId && pageId) {
      loadPage(siteId, pageId);
    }
  }, [site, siteId, pageId, navigate, loadPage]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Check if dragging from sidebar (new element)
    if (active.data.current?.type === "sidebar-item") {
      setActiveType(active.data.current.elementType as ElementType);
    } else {
      setActiveType(null);
    }
  }, []);

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Handle drag over for visual feedback
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveType(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setActiveType(null);

      if (!over) return;

      if (active.id === over.id) return;

      // New element from sidebar
      if (active.data.current?.type === "sidebar-item") {
        const elementType = active.data.current.elementType as ElementType;
        const overData = over.data.current;

        if (overData?.type === "grid-cell") {
          addGridChild(
            overData.gridId as string,
            overData.cellIndex as number,
            elementType,
          );
          return;
        }

        if (overData?.type === "column-cell") {
          addColumnChild(
            overData.columnId as string,
            overData.slotIndex as number,
            elementType,
          );
          return;
        }

        if (overData?.type === "stack-gap") {
          addFlowChild(
            overData.stackId as string,
            "stack",
            overData.insertIndex as number,
            elementType,
          );
          return;
        }

        if (overData?.type === "container-gap") {
          addFlowChild(
            overData.containerId as string,
            "container",
            overData.insertIndex as number,
            elementType,
          );
          return;
        }

        if (overData?.type === "root-gap") {
          addElement(elementType, overData.insertIndex as number, undefined);
          return;
        }

        const overId = over.id as string;

        // Determine insert position
        let insertIndex = elements.length;
        const parentId: string | undefined = undefined;

        if (overId === "canvas") {
          insertIndex = elements.length;
        } else {
          const overIndex = elements.findIndex((el) => el.id === overId);
          if (overIndex !== -1) {
            insertIndex = overIndex + 1;
          }
        }

        addElement(elementType, insertIndex, parentId);
        return;
      }

      const activeIdStr = active.id as string;

      if (over.data.current?.type === "root-gap") {
        const insertIndex = over.data.current.insertIndex as number;
        moveElementToRoot(activeIdStr, insertIndex);
        return;
      }

      if (over.data.current?.type === "grid-cell") {
        const { gridId, cellIndex } = over.data.current as {
          gridId: string;
          cellIndex: number;
        };
        moveElementToGridCell(activeIdStr, gridId, cellIndex);
        return;
      }

      if (over.data.current?.type === "column-cell") {
        const { columnId, slotIndex } = over.data.current as {
          columnId: string;
          slotIndex: number;
        };
        moveElementToColumnSlot(activeIdStr, columnId, slotIndex);
        return;
      }

      if (over.data.current?.type === "stack-gap") {
        const { stackId, insertIndex } = over.data.current as {
          stackId: string;
          insertIndex: number;
        };
        moveElementToFlowSlot(activeIdStr, stackId, "stack", insertIndex);
        return;
      }

      if (over.data.current?.type === "container-gap") {
        const { containerId, insertIndex } = over.data.current as {
          containerId: string;
          insertIndex: number;
        };
        moveElementToFlowSlot(
          activeIdStr,
          containerId,
          "container",
          insertIndex,
        );
        return;
      }

      const sortedRoots = [...elements]
        .filter((el) => !el.parentId)
        .sort((a, b) => a.order - b.order);

      const overId = over.id as string;

      if (overId === "canvas") {
        moveElementToRoot(activeIdStr, sortedRoots.length);
        return;
      }

      const overIndex = sortedRoots.findIndex((el) => el.id === overId);
      const activeRootIndex = sortedRoots.findIndex(
        (el) => el.id === activeIdStr,
      );

      if (overIndex === -1) return;

      if (activeRootIndex !== -1) {
        if (activeRootIndex === overIndex) return;
        const newRoots = arrayMove(sortedRoots, activeRootIndex, overIndex).map(
          (el, i) => ({ ...el, order: i }),
        );
        setElements(newRoots);
        return;
      }

      moveElementToRoot(activeIdStr, overIndex);
    },
    [
      elements,
      addElement,
      addGridChild,
      addColumnChild,
      addFlowChild,
      moveElementToFlowSlot,
      moveElementToGridCell,
      moveElementToColumnSlot,
      moveElementToRoot,
      setElements,
    ],
  );

  const sortableRootIds = useMemo(
    () =>
      [...elements]
        .filter((el) => !el.parentId)
        .sort((a, b) => a.order - b.order)
        .map((el) => el.id),
    [elements],
  );

  if (isLoading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center bg-builder-app text-builder-text",
          theme === "dark" && "dark",
        )}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-builder-border border-t-primary-600 dark:border-t-primary-400 mx-auto" />
          <p className="mt-4 text-builder-text-muted">Loading builder...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center bg-builder-app text-builder-text",
          theme === "dark" && "dark",
        )}
      >
        <div className="text-center">
          <p className="text-builder-text-muted">Site not found</p>
          <Link
            to="/dashboard"
            className="text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const existingDragOverlayType =
    activeId && !activeType ? findElementTypeInTree(elements, activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={layoutSlotCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      <div
        className={cn(
          "h-screen flex flex-col bg-builder-app text-builder-text",
          theme === "dark" && "dark",
        )}
      >
        <Toolbar theme={theme} onToggleTheme={toggleTheme} />

        <div className="flex-1 flex overflow-hidden min-h-0">
          <Sidebar />

          <div className="flex-1 overflow-auto p-4 md:p-6 bg-builder-app">
            <SortableContext
              items={sortableRootIds}
              strategy={verticalListSortingStrategy}
            >
              <Canvas />
            </SortableContext>
          </div>

          {/* Right sidebar - Property panel */}
          <PropertyPanel />
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay dropAnimation={null}>
        {activeId && activeType ? (
          <div className={cn(theme === "dark" && "dark")}>
            <div className="rounded-xl border-2 border-primary-500 dark:border-primary-400 bg-builder-surface/95 backdrop-blur-md px-4 py-3 shadow-builder-canvas dark:shadow-builder-canvas-dark opacity-90">
              <span className="text-sm font-medium font-display capitalize text-builder-text">
                {activeType}
              </span>
            </div>
          </div>
        ) : null}
        {existingDragOverlayType && !activeType ? (
          <div className={cn(theme === "dark" && "dark")}>
            <div className="rounded-xl border-2 border-primary-500 dark:border-primary-400 bg-builder-surface/95 backdrop-blur-md px-4 py-3 shadow-builder-canvas dark:shadow-builder-canvas-dark opacity-90">
              <span className="text-sm font-medium font-display capitalize text-builder-text">
                {existingDragOverlayType}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
