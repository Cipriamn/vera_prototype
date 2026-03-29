import ButtonBlock from "@/components/elements/ButtonBlock";
import ColumnLayout from "@/components/elements/ColumnLayout";
import GridLayout from "@/components/elements/GridLayout";
import ImageBlock from "@/components/elements/ImageBlock";
import TextBlock from "@/components/elements/TextBlock";
import VideoBlock from "@/components/elements/VideoBlock";
import type { Element } from "@vera/shared";

interface ElementWrapperProps {
  element: Element;
  isSelected: boolean;
}

export function ElementWrapper({ element, isSelected }: ElementWrapperProps) {
  const renderElement = () => {
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
          <div className="p-4 bg-builder-surface-muted text-builder-text-muted text-sm rounded-lg border border-builder-border">
            Unknown element type
          </div>
        );
    }
  };

  return (
    <div className="relative group">
      {renderElement()}

      {isSelected && (
        <div className="absolute -top-2 -left-2 z-10 rounded-md bg-primary-600 dark:bg-primary-500 px-2 py-0.5 text-[10px] font-semibold font-display uppercase tracking-wide text-white shadow-sm">
          {element.type}
        </div>
      )}

      <div className="absolute top-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="flex rounded-lg border border-builder-border bg-builder-surface shadow-md overflow-hidden pointer-events-auto">
          <button
            type="button"
            className="p-1.5 hover:bg-builder-surface-muted text-builder-text-muted"
            title="Drag handle"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
