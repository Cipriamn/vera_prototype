export type ElementType =
  | "text"
  | "image"
  | "video"
  | "button"
  | "column"
  | "grid"
  | "stack"
  | "container"
  | "card"
  | "badge"
  | "separator"
  | "alert"
  | "input";

export interface SpacingInset {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const EMPTY_INSETS: SpacingInset = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export function insetToCss(
  v: SpacingInset | undefined,
  fallback: string,
): string {
  if (!v) return fallback;
  return `${v.top}px ${v.right}px ${v.bottom}px ${v.left}px`;
}

export interface BoxStyleProps {
  margin: SpacingInset;
  borderWidth: number;
  borderColor: string;
  borderStyle: "none" | "solid" | "dashed" | "dotted";
  boxShadow: string;
}

export const DEFAULT_BOX_STYLE: BoxStyleProps = {
  margin: { ...EMPTY_INSETS },
  borderWidth: 0,
  borderColor: "#e5e7eb",
  borderStyle: "none",
  boxShadow: "none",
};

export function resolveBoxStyle(
  props: Partial<BoxStyleProps> | undefined,
): BoxStyleProps {
  if (!props) return { ...DEFAULT_BOX_STYLE, margin: { ...EMPTY_INSETS } };
  return {
    margin: props.margin ?? { ...EMPTY_INSETS },
    borderWidth: props.borderWidth ?? 0,
    borderColor: props.borderColor ?? DEFAULT_BOX_STYLE.borderColor,
    borderStyle: props.borderStyle ?? "none",
    boxShadow: props.boxShadow ?? "none",
  };
}

export type GridAlignment = "start" | "center" | "end" | "stretch";

export interface BaseElement {
  id: string;
  type: ElementType;
  parentId?: string;
  order: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  props: {
    content: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    color: string;
    textAlign: "left" | "center" | "right" | "justify";
    lineHeight: number;
    padding: SpacingInset;
    letterSpacing: number;
    textDecoration: "none" | "underline" | "line-through";
    textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
    maxWidth: number | "none";
  } & BoxStyleProps;
}

export interface ImageElement extends BaseElement {
  type: "image";
  props: {
    src: string;
    alt: string;
    width: "auto" | "full" | number;
    height: "auto" | number;
    objectFit: "cover" | "contain" | "fill" | "none";
    borderRadius: number;
    padding: SpacingInset;
  } & BoxStyleProps;
}

export interface VideoElement extends BaseElement {
  type: "video";
  props: {
    url: string;
    aspectRatio: "16:9" | "4:3" | "1:1" | "9:16";
    autoplay: boolean;
    controls: boolean;
    padding: SpacingInset;
  } & BoxStyleProps;
}

export interface ButtonElement extends BaseElement {
  type: "button";
  props: {
    text: string;
    linkType: "external" | "page";
    url: string;
    pageId?: string;
    openInNewTab: boolean;
    variant: "solid" | "outline" | "ghost";
    size: "sm" | "md" | "lg";
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
    fullWidth: boolean;
    padding: SpacingInset;
  } & BoxStyleProps;
}

export interface ColumnElement extends BaseElement {
  type: "column";
  props: {
    columns: 1 | 2 | 3 | 4;
    gap: number;
    columnGap: number;
    rowGap: number;
    alignItems: GridAlignment;
    justifyItems: GridAlignment;
    padding: SpacingInset;
    backgroundColor: string;
  };
  children: Element[];
}

export interface GridElement extends BaseElement {
  type: "grid";
  props: {
    columns: number;
    rows: number;
    gap: number;
    columnGap: number;
    rowGap: number;
    minRowHeight: number;
    alignItems: GridAlignment;
    justifyItems: GridAlignment;
    padding: SpacingInset;
    backgroundColor: string;
  };
  children: Element[];
}

export type FlexAlignItems =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "baseline";

export type FlexJustifyContent =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface StackElement extends BaseElement {
  type: "stack";
  props: {
    direction: "row" | "column";
    wrap: boolean;
    gap: number;
    alignItems: FlexAlignItems;
    justifyContent: FlexJustifyContent;
    padding: SpacingInset;
    backgroundColor: string;
  };
  children: Element[];
}

export type ContainerMaxWidth =
  | number
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full";

export interface ContainerElement extends BaseElement {
  type: "container";
  props: {
    maxWidth: ContainerMaxWidth;
    align: "left" | "center" | "right";
    padding: SpacingInset;
    backgroundColor: string;
  };
  children: Element[];
}

export interface CardElement extends BaseElement {
  type: "card";
  props: {
    title: string;
    description: string;
    content: string;
    padding: SpacingInset;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
    boxShadow: string;
    backgroundColor: string;
  } & BoxStyleProps;
}

export interface BadgeElement extends BaseElement {
  type: "badge";
  props: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    size: "sm" | "md" | "lg";
  } & BoxStyleProps;
}

export interface SeparatorElement extends BaseElement {
  type: "separator";
  props: {
    orientation: "horizontal" | "vertical";
    thickness: number;
    color: string;
  } & BoxStyleProps;
}

export interface AlertElement extends BaseElement {
  type: "alert";
  props: {
    variant: "default" | "destructive";
    title: string;
    message: string;
  } & BoxStyleProps;
}

export interface InputElement extends BaseElement {
  type: "input";
  props: {
    label: string;
    placeholder: string;
    disabled: boolean;
    inputType: "text" | "email" | "password";
  } & BoxStyleProps;
}

export type Element =
  | TextElement
  | ImageElement
  | VideoElement
  | ButtonElement
  | ColumnElement
  | GridElement
  | StackElement
  | ContainerElement
  | CardElement
  | BadgeElement
  | SeparatorElement
  | AlertElement
  | InputElement;

export type LayoutElement =
  | ColumnElement
  | GridElement
  | StackElement
  | ContainerElement;

export function isLayoutElement(element: Element): element is LayoutElement {
  return (
    element.type === "column" ||
    element.type === "grid" ||
    element.type === "stack" ||
    element.type === "container"
  );
}

/** Deep-clone default props for creating new nodes (avoids shared object mutation). */
export function cloneDefaultElementProps(
  type: ElementType,
): Record<string, unknown> {
  return JSON.parse(JSON.stringify(DEFAULT_ELEMENT_PROPS[type])) as Record<
    string,
    unknown
  >;
}

export const DEFAULT_ELEMENT_PROPS: Record<
  ElementType,
  Record<string, unknown>
> = {
  text: {
    content: "Click to edit text",
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "normal",
    color: "#1f2937",
    textAlign: "left",
    lineHeight: 1.5,
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
    letterSpacing: 0,
    textDecoration: "none",
    textTransform: "none",
    maxWidth: "none",
    ...DEFAULT_BOX_STYLE,
  },
  image: {
    src: "",
    alt: "",
    width: "full",
    height: "auto",
    objectFit: "cover",
    borderRadius: 0,
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
    ...DEFAULT_BOX_STYLE,
  },
  video: {
    url: "",
    aspectRatio: "16:9",
    autoplay: false,
    controls: true,
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
    ...DEFAULT_BOX_STYLE,
  },
  button: {
    text: "Click me",
    linkType: "external",
    url: "#",
    pageId: undefined,
    openInNewTab: false,
    variant: "solid",
    size: "md",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    borderRadius: 8,
    fullWidth: false,
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
    ...DEFAULT_BOX_STYLE,
  },
  column: {
    columns: 2,
    gap: 16,
    columnGap: 16,
    rowGap: 16,
    alignItems: "stretch",
    justifyItems: "stretch",
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    backgroundColor: "transparent",
  },
  grid: {
    columns: 3,
    rows: 2,
    gap: 16,
    columnGap: 16,
    rowGap: 16,
    minRowHeight: 80,
    alignItems: "stretch",
    justifyItems: "stretch",
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    backgroundColor: "transparent",
  },
  stack: {
    direction: "column",
    wrap: false,
    gap: 12,
    alignItems: "stretch",
    justifyContent: "start",
    padding: { top: 8, right: 8, bottom: 8, left: 8 },
    backgroundColor: "transparent",
  },
  container: {
    maxWidth: "lg",
    align: "center",
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    backgroundColor: "transparent",
  },
  card: {
    ...DEFAULT_BOX_STYLE,
    title: "Card title",
    description: "Short description",
    content: "Card body content.",
    padding: { top: 24, right: 24, bottom: 24, left: 24 },
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.08)",
    backgroundColor: "#ffffff",
  },
  badge: {
    text: "Badge",
    variant: "default",
    size: "md",
    ...DEFAULT_BOX_STYLE,
  },
  separator: {
    orientation: "horizontal",
    thickness: 1,
    color: "#e5e7eb",
    ...DEFAULT_BOX_STYLE,
  },
  alert: {
    variant: "default",
    title: "Heads up",
    message: "You can customize this alert in the properties panel.",
    ...DEFAULT_BOX_STYLE,
  },
  input: {
    label: "Label",
    placeholder: "Placeholder",
    disabled: false,
    inputType: "text",
    ...DEFAULT_BOX_STYLE,
  },
};
