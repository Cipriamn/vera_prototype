export type ElementType =
  | 'text'
  | 'image'
  | 'video'
  | 'button'
  | 'column'
  | 'grid';

export interface BaseElement {
  id: string;
  type: ElementType;
  parentId?: string;
  order: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  props: {
    content: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    lineHeight: number;
    padding: { top: number; right: number; bottom: number; left: number };
  };
}

export interface ImageElement extends BaseElement {
  type: 'image';
  props: {
    src: string;
    alt: string;
    width: 'auto' | 'full' | number;
    height: 'auto' | number;
    objectFit: 'cover' | 'contain' | 'fill' | 'none';
    borderRadius: number;
    padding: { top: number; right: number; bottom: number; left: number };
  };
}

export interface VideoElement extends BaseElement {
  type: 'video';
  props: {
    url: string;
    aspectRatio: '16:9' | '4:3' | '1:1' | '9:16';
    autoplay: boolean;
    controls: boolean;
    padding: { top: number; right: number; bottom: number; left: number };
  };
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  props: {
    text: string;
    linkType: 'external' | 'page';
    url: string;
    pageId?: string;
    openInNewTab: boolean;
    variant: 'solid' | 'outline' | 'ghost';
    size: 'sm' | 'md' | 'lg';
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
    fullWidth: boolean;
    padding: { top: number; right: number; bottom: number; left: number };
  };
}

export interface ColumnElement extends BaseElement {
  type: 'column';
  props: {
    columns: 2 | 3 | 4;
    gap: number;
    padding: { top: number; right: number; bottom: number; left: number };
    backgroundColor: string;
  };
  children: Element[];
}

export interface GridElement extends BaseElement {
  type: 'grid';
  props: {
    columns: number;
    rows: number;
    gap: number;
    padding: { top: number; right: number; bottom: number; left: number };
    backgroundColor: string;
  };
  children: Element[];
}

export type Element =
  | TextElement
  | ImageElement
  | VideoElement
  | ButtonElement
  | ColumnElement
  | GridElement;

export type LayoutElement = ColumnElement | GridElement;

export function isLayoutElement(element: Element): element is LayoutElement {
  return element.type === 'column' || element.type === 'grid';
}

export const DEFAULT_ELEMENT_PROPS: Record<ElementType, Partial<Element['props']>> = {
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
