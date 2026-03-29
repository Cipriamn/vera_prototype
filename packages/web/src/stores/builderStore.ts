import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Site, Page, Element, ElementType } from '@vera/shared';
import { api } from '@/utils/api';

// Default props for new elements
const defaultProps: Record<ElementType, Record<string, unknown>> = {
  text: {
    content: 'Click to edit text',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: 'normal',
    color: '#1f2937',
    textAlign: 'left',
    lineHeight: 1.5,
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
  },
  image: {
    src: '',
    alt: '',
    width: 'full',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: 0,
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
  },
  video: {
    url: '',
    aspectRatio: '16:9',
    autoplay: false,
    controls: true,
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
  },
  button: {
    text: 'Click me',
    linkType: 'external',
    url: '#',
    pageId: undefined,
    openInNewTab: false,
    variant: 'solid',
    size: 'md',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    borderRadius: 8,
    fullWidth: false,
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
  },
  column: {
    columns: 2,
    gap: 16,
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    backgroundColor: 'transparent',
  },
  grid: {
    columns: 3,
    rows: 2,
    gap: 16,
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    backgroundColor: 'transparent',
  },
};

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
  deletePage: (pageId: string) => Promise<boolean>;

  addElement: (type: ElementType, index?: number, parentId?: string) => void;
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
      console.error('Failed to load site:', error);
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
      console.error('Failed to load page:', error);
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
      console.error('Failed to save page:', error);
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
      console.error('Failed to create page:', error);
      return null;
    }
  },

  deletePage: async (pageId: string) => {
    const { site, currentPage } = get();
    if (!site) return false;

    try {
      await api.delete(`/sites/${site.id}/pages/${pageId}`);

      // Update site pages list
      set({
        site: {
          ...site,
          pages: site.pages?.filter((p) => p.id !== pageId) || [],
        },
        // Clear current page if it was deleted
        currentPage: currentPage?.id === pageId ? null : currentPage,
      });

      return true;
    } catch (error) {
      console.error('Failed to delete page:', error);
      return false;
    }
  },

  addElement: (type: ElementType, index?: number, parentId?: string) => {
    const { elements } = get();
    const newElement: Element = {
      id: uuidv4(),
      type,
      props: { ...defaultProps[type] },
      parentId,
      order: index ?? elements.length,
      ...(type === 'column' || type === 'grid' ? { children: [] } : {}),
    } as Element;

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

  updateElement: (id: string, updates: Partial<Element>) => {
    const { elements } = get();
    set({
      elements: elements.map((el) =>
        el.id === id ? ({ ...el, ...updates } as Element) : el
      ),
      hasUnsavedChanges: true,
    });
  },

  deleteElement: (id: string) => {
    const { elements, selectedElementId } = get();
    set({
      elements: elements.filter((el) => el.id !== id),
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
    const newElement: Element = {
      ...JSON.parse(JSON.stringify(element)),
      id: uuidv4(),
      order: elementIndex + 1,
    };

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
      console.error('Failed to publish site:', error);
    }
  },

  unpublishSite: async () => {
    const { site } = get();
    if (!site) return;

    try {
      const response = await api.post(`/sites/${site.id}/unpublish`);
      set({ site: response.data.data });
    } catch (error) {
      console.error('Failed to unpublish site:', error);
    }
  },
}));
