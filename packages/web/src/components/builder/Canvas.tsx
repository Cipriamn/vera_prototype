import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderStore } from '@/stores/builderStore';
import { ElementWrapper } from './ElementWrapper';
import type { Element } from '@vera/shared';

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
  } = useSortable({ id: element.id });

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
      className={`relative ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
    >
      <ElementWrapper element={element} isSelected={isSelected} />
    </div>
  );
}

export default function Canvas() {
  const { elements, selectElement } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  const handleCanvasClick = () => {
    selectElement(null);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleCanvasClick}
      className={`
        min-h-[calc(100vh-180px)] bg-white rounded-lg shadow-sm p-4
        ${isOver ? 'ring-2 ring-primary-500 ring-dashed' : ''}
      `}
    >
      {elements.length === 0 ? (
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
        <div className="space-y-2">
          {elements
            .filter((el) => !el.parentId)
            .sort((a, b) => a.order - b.order)
            .map((element) => (
              <SortableElement key={element.id} element={element} />
            ))}
        </div>
      )}
    </div>
  );
}
