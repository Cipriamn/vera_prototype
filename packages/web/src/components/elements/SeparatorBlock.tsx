import { outerStyleFromPaddingAndBox } from "@/lib/outerStyles";
import type { SeparatorElement } from "@vera/shared";

export default function SeparatorBlock({
  element,
}: {
  element: SeparatorElement;
}) {
  const p = element.props;
  const outer = outerStyleFromPaddingAndBox(undefined, p, "0");

  if (p.orientation === "vertical") {
    return (
      <span
        style={{
          ...outer,
          display: "inline-block",
          width: p.thickness,
          minHeight: "1.5rem",
          backgroundColor: p.color,
          verticalAlign: "middle",
        }}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  return (
    <div
      style={outer}
      className="w-full"
      role="separator"
      aria-orientation="horizontal"
    >
      <div
        style={{
          height: p.thickness,
          width: "100%",
          backgroundColor: p.color,
          borderRadius: 1,
        }}
      />
    </div>
  );
}
