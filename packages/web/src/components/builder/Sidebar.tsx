import { useDraggable } from '@dnd-kit/core';
import type { ElementType } from '@vera/shared';

interface ElementPaletteItemProps {
  type: ElementType;
  label: string;
  icon: React.ReactNode;
}

function ElementPaletteItem({ type, label, icon }: ElementPaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: 'sidebar-item',
      elementType: type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        p-3 bg-white rounded-lg border border-gray-200 cursor-grab
        hover:border-primary-300 hover:shadow-sm transition-all
        flex flex-col items-center gap-2
        ${isDragging ? 'opacity-50 cursor-grabbing' : ''}
      `}
    >
      <div className="w-8 h-8 flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <span className="text-xs text-gray-600 font-medium">{label}</span>
    </div>
  );
}

const elements: { type: ElementType; label: string; icon: React.ReactNode }[] = [
  {
    type: 'text',
    label: 'Text',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
  },
  {
    type: 'image',
    label: 'Image',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    type: 'video',
    label: 'Video',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: 'button',
    label: 'Button',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
  },
  {
    type: 'column',
    label: 'Columns',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    type: 'grid',
    label: 'Grid',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Elements</h3>

      <div className="grid grid-cols-2 gap-3">
        {elements.map((element) => (
          <ElementPaletteItem
            key={element.type}
            type={element.type}
            label={element.label}
            icon={element.icon}
          />
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Tips</h3>
        <ul className="text-xs text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            Drag elements onto the canvas
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            Click to select and edit properties
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            Drag to reorder elements
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            Use columns for multi-column layouts
          </li>
        </ul>
      </div>
    </div>
  );
}
