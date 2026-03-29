import Canvas from "@/components/builder/Canvas";
import PropertyPanel from "@/components/builder/PropertyPanel";
import Sidebar from "@/components/builder/Sidebar";
import Toolbar from "@/components/builder/Toolbar";
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
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const layoutSlotCollisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args);
  const slotHit = pointerHits.find((c) => {
    const s = String(c.id);
    return s.startsWith("grid-cell:") || s.startsWith("column-cell:");
  });
  if (slotHit) {
    return [slotHit];
  }
  return closestCenter(args);
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
    moveElementToGridCell,
    moveElementToColumnSlot,
    moveElementToRoot,
    setElements,
  } = useBuilderStore();

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
      moveElementToGridCell,
      moveElementToColumnSlot,
      moveElementToRoot,
      setElements,
    ],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading builder...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Site not found</p>
          <Link
            to="/dashboard"
            className="text-primary-600 hover:underline mt-2 inline-block"
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
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Toolbar */}
        <Toolbar />

        {/* Main builder area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Elements palette */}
          <Sidebar />

          {/* Canvas */}
          <div className="flex-1 overflow-auto p-4">
            <SortableContext
              items={elements.map((el) => el.id)}
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
      <DragOverlay>
        {activeId && activeType && (
          <div className="bg-white border-2 border-primary-500 rounded-lg p-4 shadow-lg opacity-80">
            <span className="text-sm font-medium capitalize">{activeType}</span>
          </div>
        )}
        {existingDragOverlayType && (
          <div className="bg-white border-2 border-primary-500 rounded-lg p-4 shadow-lg opacity-80">
            <span className="text-sm font-medium capitalize">
              {existingDragOverlayType}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
