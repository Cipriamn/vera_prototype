import { useBuilderStore } from "@/stores/builderStore";
import type { TextElement } from "@vera/shared";
import { useEffect, useLayoutEffect, useRef } from "react";

interface TextBlockProps {
  element: TextElement;
  isEditing?: boolean;
}

export default function TextBlock({ element, isEditing }: TextBlockProps) {
  const { updateElement } = useBuilderStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const props = element.props;

  // Never render props.content as React children on a contentEditable node — each
  // store update reconciles the text node and resets the caret. Sync from props
  // only when this element is not focused (e.g. edits from the property panel).
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (document.activeElement === el) return;
    const next = props.content ?? "";
    if (el.textContent !== next) {
      el.textContent = next;
    }
  }, [props.content, element.id]);

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditing]);

  const handleInput = () => {
    if (contentRef.current) {
      updateElement(element.id, {
        props: { ...props, content: contentRef.current.innerText },
      });
    }
  };

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : "8px";

  const fontWeightMap: Record<string, number> = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };

  return (
    <div
      ref={contentRef}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onInput={handleInput}
      style={{
        fontSize: `${props.fontSize}px`,
        fontFamily: props.fontFamily,
        fontWeight: fontWeightMap[props.fontWeight] || 400,
        color: props.color,
        textAlign: props.textAlign,
        lineHeight: props.lineHeight,
        padding: paddingStyle,
        outline: "none",
        minHeight: "24px",
      }}
      className={`${isEditing ? "cursor-text" : "cursor-pointer"}`}
    />
  );
}
