import {
  isNestedLayoutDisallowedInSlot,
  useBuilderStore,
} from "@/stores/builderStore";
import { useDndContext } from "@dnd-kit/core";
import type { Element, ElementType } from "@vera/shared";
import { isLayoutElement } from "@vera/shared";

function findElementByIdInTree(
  list: Element[],
  id: string,
): Element | undefined {
  for (const el of list) {
    if (el.id === id) return el;
    if (isLayoutElement(el) && el.children?.length) {
      const nested = findElementByIdInTree(el.children, id);
      if (nested) return nested;
    }
  }
  return undefined;
}

/** True while dragging a column/grid — grid/column slots use this for blocked UI. */
export function useDisallowedLayoutOverSlot(): boolean {
  const { active } = useDndContext();
  const elements = useBuilderStore((s) => s.elements);

  if (!active?.data.current) return false;
  const data = active.data.current;

  if (data.type === "sidebar-item") {
    return isNestedLayoutDisallowedInSlot(data.elementType as ElementType);
  }

  if (data.type === "builder-element") {
    const el = findElementByIdInTree(elements, String(active.id));
    return el ? isNestedLayoutDisallowedInSlot(el.type) : false;
  }

  return false;
}

export function LayoutSlotBlockedOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md border-2 border-dashed border-gray-400 bg-gray-200/90"
      aria-hidden
    >
      <span className="text-xs font-medium text-gray-600 px-2 text-center leading-snug">
        Columns and grids can only be placed on the page
      </span>
    </div>
  );
}
