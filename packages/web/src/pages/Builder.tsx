import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBuilderStore } from '@/stores/builderStore';
import Canvas from '@/components/builder/Canvas';
import Sidebar from '@/components/builder/Sidebar';
import PropertyPanel from '@/components/builder/PropertyPanel';
import Toolbar from '@/components/builder/Toolbar';
import type { ElementType } from '@vera/shared';

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
    })
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
    if (active.data.current?.type === 'sidebar-item') {
      setActiveType(active.data.current.elementType as ElementType);
    }
  }, []);

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Handle drag over for visual feedback
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setActiveType(null);

      if (!over) return;

      // New element from sidebar
      if (active.data.current?.type === 'sidebar-item') {
        const elementType = active.data.current.elementType as ElementType;
        const overId = over.id as string;

        // Determine insert position
        let insertIndex = elements.length;
        let parentId: string | undefined;

        if (overId === 'canvas') {
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

      // Reordering existing elements
      if (active.id !== over.id) {
        const oldIndex = elements.findIndex((el) => el.id === active.id);
        const newIndex = elements.findIndex((el) => el.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newElements = arrayMove(elements, oldIndex, newIndex);
          setElements(newElements.map((el, i) => ({ ...el, order: i })));
        }
      }
    },
    [elements, addElement, setElements]
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
          <Link to="/dashboard" className="text-primary-600 hover:underline mt-2 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
      </DragOverlay>
    </DndContext>
  );
}
