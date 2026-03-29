import { isLayoutType } from "@/builder/elementMeta";
import { api } from "@/utils/api";
import type {
  ColumnElement,
  Element,
  ElementType,
  GridElement,
  LayoutElement,
  Page,
  Site,
} from "@vera/shared";
import { cloneDefaultElementProps, isLayoutElement } from "@vera/shared";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

function pluckElement(
  list: Element[],
  id: string,
): { next: Element[]; found: Element | null } {
  let found: Element | null = null;
  const next: Element[] = [];
  for (const el of list) {
    if (el.id === id) {
      found = el;
      continue;
    }
    if (isLayoutElement(el) && el.children?.length) {
      const { next: ch, found: inner } = pluckElement(el.children, id);
      if (inner) {
        found = inner;
        next.push({ ...(el as LayoutElement), children: ch } as Element);
        continue;
      }
    }
    next.push(el);
  }
  return { next, found };
}

function containsDescendantId(node: Element, searchId: string): boolean {
  if (!isLayoutElement(node) || !node.children?.length) return false;
  for (const c of node.children) {
    if (c.id === searchId) return true;
    if (containsDescendantId(c, searchId)) return true;
  }
  return false;
}

export function isNestedLayoutDisallowedInSlot(type: ElementType): boolean {
  return type === "column" || type === "grid";
}

function insertIntoGridAtCell(
  list: Element[],
  gridId: string,
  cellIndex: number,
  node: Element,
): Element[] {
  return list.map((el) => {
    if (el.id === gridId && el.type === "grid") {
      const grid = el as GridElement;
      const without = (grid.children ?? []).filter(
        (c) => c.order !== cellIndex,
      );
      const updated = { ...node, order: cellIndex };
      const children = [...without, updated].sort((a, b) => a.order - b.order);
      return { ...grid, children };
    }
    if (isLayoutElement(el) && el.children?.length) {
      return {
        ...(el as LayoutElement),
        children: insertIntoGridAtCell(el.children, gridId, cellIndex, node),
      } as Element;
    }
    return el;
  });
}

function insertIntoColumnAtSlot(
  list: Element[],
  columnId: string,
  slotIndex: number,
  node: Element,
): Element[] {
  return list.map((el) => {
    if (el.id === columnId && el.type === "column") {
      const col = el as ColumnElement;
      const without = (col.children ?? []).filter((c) => c.order !== slotIndex);
      const updated = { ...node, order: slotIndex };
      const children = [...without, updated].sort((a, b) => a.order - b.order);
      return { ...col, children };
    }
    if (isLayoutElement(el) && el.children?.length) {
      return {
        ...(el as LayoutElement),
        children: insertIntoColumnAtSlot(
          el.children,
          columnId,
          slotIndex,
          node,
        ),
      } as Element;
    }
    return el;
  });
}

type FlowLayoutType = "stack" | "container";

function mapFlowUpdate(
  list: Element[],
  flowId: string,
  flowType: FlowLayoutType,
  fn: (children: Element[]) => Element[],
): Element[] {
  return list.map((el) => {
    if (el.id === flowId && el.type === flowType) {
      const cur = [...((el as LayoutElement).children ?? [])];
      return { ...(el as LayoutElement), children: fn(cur) } as Element;
    }
    if (isLayoutElement(el) && el.children?.length) {
      return {
        ...(el as LayoutElement),
        children: mapFlowUpdate(el.children, flowId, flowType, fn),
      } as Element;
    }
    return el;
  });
}

function addToFlowAt(
  elements: Element[],
  flowId: string,
  flowType: FlowLayoutType,
  insertIndex: number,
  newNode: Element,
): Element[] {
  return mapFlowUpdate(elements, flowId, flowType, (children) => {
    const sorted = [...children].sort((a, b) => a.order - b.order);
    const without = sorted.filter((c) => c.id !== newNode.id);
    const clamped = Math.max(0, Math.min(insertIndex, without.length));
    const merged = [
      ...without.slice(0, clamped),
      newNode,
      ...without.slice(clamped),
    ];
    return merged.map((c, i) => ({ ...c, order: i }));
  });
}

function remapSubtreeIds(el: Element): Element {
  const base = { ...el, id: uuidv4() };
  if (isLayoutElement(base) && base.children?.length) {
    return {
      ...base,
      children: base.children.map(remapSubtreeIds),
    } as Element;
  }
  return base;
}

interface BuilderState {
  site: Site | null;
  currentPage: Page | null;
  elements: Element[];
  selectedElementId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;

  // Actions
  loadSite: (siteId: string) => Promise<void>;
  loadPage: (siteId: string, pageId: string) => Promise<void>;
  savePage: () => Promise<void>;
  createPage: (name: string) => Promise<string | null>;
  deletePage: (
    pageId: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  updatePageDetails: (input: {
    name: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    isHomepage: boolean;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;

  addElement: (type: ElementType, index?: number, parentId?: string) => void;
  addGridChild: (gridId: string, cellIndex: number, type: ElementType) => void;
  addColumnChild: (
    columnId: string,
    slotIndex: number,
    type: ElementType,
  ) => void;
  addFlowChild: (
    flowId: string,
    flowType: FlowLayoutType,
    insertIndex: number,
    type: ElementType,
  ) => void;
  moveElementToFlowSlot: (
    elementId: string,
    flowId: string,
    flowType: FlowLayoutType,
    insertIndex: number,
  ) => void;
  moveElementToGridCell: (
    elementId: string,
    gridId: string,
    cellIndex: number,
  ) => void;
  moveElementToColumnSlot: (
    elementId: string,
    columnId: string,
    slotIndex: number,
  ) => void;
  moveElementToRoot: (elementId: string, insertIndex: number) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElement: (id: string) => void;
  moveElement: (id: string, newIndex: number, newParentId?: string) => void;
  duplicateElement: (id: string) => void;

  selectElement: (id: string | null) => void;
  setElements: (elements: Element[]) => void;

  publishSite: () => Promise<void>;
  unpublishSite: () => Promise<void>;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  site: null,
  currentPage: null,
  elements: [],
  selectedElementId: null,
  isLoading: false,
  isSaving: false,
  hasUnsavedChanges: false,

  loadSite: async (siteId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/sites/${siteId}`);
      set({ site: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Failed to load site:", error);
      set({ isLoading: false });
    }
  },

  loadPage: async (siteId: string, pageId: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/sites/${siteId}/pages/${pageId}`);
      const page = response.data.data;
      set({
        currentPage: page,
        elements: page.elements || [],
        isLoading: false,
        hasUnsavedChanges: false,
      });
    } catch (error) {
      console.error("Failed to load page:", error);
      set({ isLoading: false });
    }
  },

  savePage: async () => {
    const { site, currentPage, elements } = get();
    if (!site || !currentPage) return;

    set({ isSaving: true });
    try {
      await api.put(`/sites/${site.id}/pages/${currentPage.id}`, {
        elements,
      });
      set({ isSaving: false, hasUnsavedChanges: false });
    } catch (error) {
      console.error("Failed to save page:", error);
      set({ isSaving: false });
    }
  },

  createPage: async (name: string) => {
    const { site } = get();
    if (!site) return null;

    try {
      const response = await api.post(`/sites/${site.id}/pages`, { name });
      const newPage = response.data.data;

      // Update site with new page
      set({
        site: {
          ...site,
          pages: [...(site.pages || []), newPage],
        },
      });

      return newPage.id;
    } catch (error) {
      console.error("Failed to create page:", error);
      return null;
    }
  },

  deletePage: async (pageId: string) => {
    const { site, currentPage } = get();
    if (!site) {
      return { ok: false as const, error: "No site loaded" };
    }

    try {
      await api.delete(`/sites/${site.id}/pages/${pageId}`);

      set({
        site: {
          ...site,
          pages: site.pages?.filter((p) => p.id !== pageId) || [],
        },
        currentPage: currentPage?.id === pageId ? null : currentPage,
      });

      return { ok: true as const };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete page";
      console.error("Failed to delete page:", error);
      return { ok: false as const, error: message };
    }
  },

  updatePageDetails: async (input) => {
    const { site, currentPage } = get();
    if (!site || !currentPage) {
      return { ok: false as const, error: "No page loaded" };
    }

    try {
      const response = await api.put(
        `/sites/${site.id}/pages/${currentPage.id}`,
        {
          name: input.name.trim(),
          slug: input.slug.trim(),
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
          isHomepage: input.isHomepage,
        },
      );
      const updated = response.data.data;

      await get().loadSite(site.id);

      const prev = get().currentPage;
      set({
        currentPage:
          prev && prev.id === updated.id
            ? {
                ...prev,
                name: updated.name,
                slug: updated.slug,
                metaTitle: updated.metaTitle ?? null,
                metaDescription: updated.metaDescription ?? null,
                isHomepage: updated.isHomepage,
                updatedAt: updated.updatedAt,
              }
            : prev,
      });

      return { ok: true as const };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update page";
      console.error("Failed to update page details:", error);
      return { ok: false as const, error: message };
    }
  },

  addElement: (type: ElementType, index?: number, parentId?: string) => {
    const { elements } = get();
    const newElement = {
      id: uuidv4(),
      type,
      props: cloneDefaultElementProps(type),
      parentId,
      order: index ?? elements.length,
      ...(isLayoutType(type) ? { children: [] } : {}),
    } as unknown as Element;

    let newElements: Element[];
    if (index !== undefined) {
      newElements = [
        ...elements.slice(0, index),
        newElement,
        ...elements.slice(index),
      ].map((el, i) => ({ ...el, order: i }));
    } else {
      newElements = [...elements, newElement];
    }

    set({
      elements: newElements,
      selectedElementId: newElement.id,
      hasUnsavedChanges: true,
    });
  },

  addGridChild: (gridId: string, cellIndex: number, type: ElementType) => {
    if (isNestedLayoutDisallowedInSlot(type)) return;

    const { elements } = get();
    const newChild = {
      id: uuidv4(),
      type,
      props: cloneDefaultElementProps(type),
      order: cellIndex,
      ...(isLayoutType(type) ? { children: [] } : {}),
    } as unknown as Element;

    const newElements = insertIntoGridAtCell(
      elements,
      gridId,
      cellIndex,
      newChild,
    );

    set({
      elements: newElements,
      selectedElementId: newChild.id,
      hasUnsavedChanges: true,
    });
  },

  addColumnChild: (columnId: string, slotIndex: number, type: ElementType) => {
    if (isNestedLayoutDisallowedInSlot(type)) return;

    const { elements } = get();
    const newChild = {
      id: uuidv4(),
      type,
      props: cloneDefaultElementProps(type),
      order: slotIndex,
      ...(isLayoutType(type) ? { children: [] } : {}),
    } as unknown as Element;

    const newElements = insertIntoColumnAtSlot(
      elements,
      columnId,
      slotIndex,
      newChild,
    );

    set({
      elements: newElements,
      selectedElementId: newChild.id,
      hasUnsavedChanges: true,
    });
  },

  addFlowChild: (
    flowId: string,
    flowType: FlowLayoutType,
    insertIndex: number,
    type: ElementType,
  ) => {
    if (isNestedLayoutDisallowedInSlot(type)) return;

    const { elements } = get();
    const newChild = {
      id: uuidv4(),
      type,
      props: cloneDefaultElementProps(type),
      order: insertIndex,
      ...(isLayoutType(type) ? { children: [] } : {}),
    } as unknown as Element;

    const newElements = addToFlowAt(
      elements,
      flowId,
      flowType,
      insertIndex,
      newChild,
    );

    set({
      elements: newElements,
      selectedElementId: newChild.id,
      hasUnsavedChanges: true,
    });
  },

  moveElementToFlowSlot: (
    elementId: string,
    flowId: string,
    flowType: FlowLayoutType,
    insertIndex: number,
  ) => {
    if (elementId === flowId) return;

    const { elements } = get();
    const { next: without, found } = pluckElement(elements, elementId);
    if (!found) return;

    if (isNestedLayoutDisallowedInSlot(found.type)) return;

    if (isLayoutElement(found) && containsDescendantId(found, flowId)) return;

    const inserted = addToFlowAt(without, flowId, flowType, insertIndex, {
      ...found,
      order: insertIndex,
    });

    set({
      elements: inserted,
      selectedElementId: elementId,
      hasUnsavedChanges: true,
    });
  },

  moveElementToGridCell: (
    elementId: string,
    gridId: string,
    cellIndex: number,
  ) => {
    if (elementId === gridId) return;

    const { elements } = get();
    const { next: without, found } = pluckElement(elements, elementId);
    if (!found) return;

    if (isNestedLayoutDisallowedInSlot(found.type)) return;

    if (isLayoutElement(found) && containsDescendantId(found, gridId)) return;

    const inserted = insertIntoGridAtCell(without, gridId, cellIndex, {
      ...found,
      order: cellIndex,
    });

    set({
      elements: inserted,
      selectedElementId: elementId,
      hasUnsavedChanges: true,
    });
  },

  moveElementToColumnSlot: (
    elementId: string,
    columnId: string,
    slotIndex: number,
  ) => {
    if (elementId === columnId) return;

    const { elements } = get();
    const { next: without, found } = pluckElement(elements, elementId);
    if (!found) return;

    if (isNestedLayoutDisallowedInSlot(found.type)) return;

    if (isLayoutElement(found) && containsDescendantId(found, columnId)) return;

    const inserted = insertIntoColumnAtSlot(without, columnId, slotIndex, {
      ...found,
      order: slotIndex,
    });

    set({
      elements: inserted,
      selectedElementId: elementId,
      hasUnsavedChanges: true,
    });
  },

  moveElementToRoot: (elementId: string, insertIndex: number) => {
    const { elements } = get();
    const { next: without, found } = pluckElement(elements, elementId);
    if (!found) return;

    const roots = [...without].sort((a, b) => a.order - b.order);
    const clamped = Math.max(0, Math.min(insertIndex, roots.length));
    const nextRoots = [
      ...roots.slice(0, clamped),
      { ...found, parentId: undefined, order: clamped },
      ...roots.slice(clamped),
    ].map((el, i) => ({ ...el, order: i }));

    set({
      elements: nextRoots,
      selectedElementId: elementId,
      hasUnsavedChanges: true,
    });
  },

  updateElement: (id: string, updates: Partial<Element>) => {
    const { elements } = get();

    const tryPatchChildren = (
      list: Element[],
    ): { next: Element[]; hit: boolean } => {
      let hit = false;
      const next = list.map((el) => {
        if (el.id === id) {
          hit = true;
          return { ...el, ...updates } as Element;
        }
        if (isLayoutElement(el) && el.children?.length) {
          const { next: ch, hit: childHit } = tryPatchChildren(el.children);
          if (childHit) {
            hit = true;
            return { ...(el as LayoutElement), children: ch } as Element;
          }
        }
        return el;
      });
      return { next, hit };
    };

    const { next, hit } = tryPatchChildren(elements);
    if (!hit) return;

    set({
      elements: next,
      hasUnsavedChanges: true,
    });
  },

  deleteElement: (id: string) => {
    const { elements, selectedElementId } = get();

    const removeFromTree = (
      list: Element[],
      targetId: string,
    ): { next: Element[]; removed: boolean } => {
      let removed = false;
      const next: Element[] = [];
      for (const el of list) {
        if (el.id === targetId) {
          removed = true;
          continue;
        }
        if (isLayoutElement(el) && el.children?.length) {
          const { next: ch, removed: childRemoved } = removeFromTree(
            el.children,
            targetId,
          );
          if (childRemoved) {
            removed = true;
            next.push({ ...(el as LayoutElement), children: ch } as Element);
            continue;
          }
        }
        next.push(el);
      }
      return { next, removed };
    };

    const { next, removed } = removeFromTree(elements, id);
    if (!removed) return;

    set({
      elements: next,
      selectedElementId: selectedElementId === id ? null : selectedElementId,
      hasUnsavedChanges: true,
    });
  },

  moveElement: (id: string, newIndex: number, newParentId?: string) => {
    const { elements } = get();
    const elementIndex = elements.findIndex((el) => el.id === id);
    if (elementIndex === -1) return;

    const element = elements[elementIndex];
    const newElements = [...elements];
    newElements.splice(elementIndex, 1);
    newElements.splice(newIndex, 0, { ...element, parentId: newParentId });

    set({
      elements: newElements.map((el, i) => ({ ...el, order: i })),
      hasUnsavedChanges: true,
    });
  },

  duplicateElement: (id: string) => {
    const { elements } = get();
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    const elementIndex = elements.findIndex((el) => el.id === id);
    const newElement = remapSubtreeIds(
      JSON.parse(JSON.stringify(element)) as Element,
    );
    newElement.order = elementIndex + 1;

    const newElements = [
      ...elements.slice(0, elementIndex + 1),
      newElement,
      ...elements.slice(elementIndex + 1),
    ].map((el, i) => ({ ...el, order: i }));

    set({
      elements: newElements,
      selectedElementId: newElement.id,
      hasUnsavedChanges: true,
    });
  },

  selectElement: (id: string | null) => {
    set({ selectedElementId: id });
  },

  setElements: (elements: Element[]) => {
    set({ elements, hasUnsavedChanges: true });
  },

  publishSite: async () => {
    const { site } = get();
    if (!site) return;

    try {
      const response = await api.post(`/sites/${site.id}/publish`);
      set({ site: response.data.data });
    } catch (error) {
      console.error("Failed to publish site:", error);
    }
  },

  unpublishSite: async () => {
    const { site } = get();
    if (!site) return;

    try {
      const response = await api.post(`/sites/${site.id}/unpublish`);
      set({ site: response.data.data });
    } catch (error) {
      console.error("Failed to unpublish site:", error);
    }
  },
}));
