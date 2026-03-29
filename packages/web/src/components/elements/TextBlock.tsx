import { outerStyleFromPaddingAndBox } from "@/lib/outerStyles";
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

  const outer = outerStyleFromPaddingAndBox(props.padding, props, "8px");

  const fontWeightMap: Record<string, number> = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };

  const maxW =
    props.maxWidth === "none" || props.maxWidth == null
      ? undefined
      : typeof props.maxWidth === "number"
        ? `${props.maxWidth}px`
        : undefined;

  return (
    <div style={outer}>
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
          letterSpacing: `${props.letterSpacing ?? 0}px`,
          textDecoration: props.textDecoration ?? "none",
          textTransform: props.textTransform ?? "none",
          maxWidth: maxW,
          outline: "none",
          minHeight: "24px",
        }}
        className={`${isEditing ? "cursor-text" : "cursor-pointer"}`}
      />
    </div>
  );
}
