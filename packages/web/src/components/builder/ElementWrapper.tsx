import AlertBlock from "@/components/elements/AlertBlock";
import BadgeBlock from "@/components/elements/BadgeBlock";
import ButtonBlock from "@/components/elements/ButtonBlock";
import CardBlock from "@/components/elements/CardBlock";
import ColumnLayout from "@/components/elements/ColumnLayout";
import ContainerLayout from "@/components/elements/ContainerLayout";
import GridLayout from "@/components/elements/GridLayout";
import ImageBlock from "@/components/elements/ImageBlock";
import InputBlock from "@/components/elements/InputBlock";
import SeparatorBlock from "@/components/elements/SeparatorBlock";
import StackLayout from "@/components/elements/StackLayout";
import TextBlock from "@/components/elements/TextBlock";
import VideoBlock from "@/components/elements/VideoBlock";
import type { Element } from "@vera/shared";
import { useCallback } from "react";

interface ElementWrapperProps {
  element: Element;
  isSelected: boolean;
}

export function ElementWrapper({ element, isSelected }: ElementWrapperProps) {
  const renderNested = useCallback(
    (child: Element, childSelected: boolean) => (
      <ElementWrapper element={child} isSelected={childSelected} />
    ),
    [],
  );

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
      case "card":
        return <CardBlock element={element} />;
      case "badge":
        return <BadgeBlock element={element} />;
      case "separator":
        return <SeparatorBlock element={element} />;
      case "alert":
        return <AlertBlock element={element} />;
      case "input":
        return <InputBlock element={element} />;
      case "column":
        return <ColumnLayout element={element} renderChild={renderNested} />;
      case "grid":
        return <GridLayout element={element} renderChild={renderNested} />;
      case "stack":
        return <StackLayout element={element} renderChild={renderNested} />;
      case "container":
        return <ContainerLayout element={element} renderChild={renderNested} />;
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
