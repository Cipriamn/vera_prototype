import { containerMaxWidthToCss } from "@/lib/containerMaxWidth";
import {
  flexAlignItemsToCss,
  flexJustifyToCss,
  gridAlignmentToCss,
} from "@/lib/flexMaps";
import { outerStyleFromPaddingAndBox } from "@/lib/outerStyles";
import { cn } from "@/lib/utils";
import type { Element } from "@vera/shared";
import { resolveBoxStyle } from "@vera/shared";
import { Link } from "react-router-dom";

interface PageInfo {
  id: string;
  slug: string;
  name: string;
}

interface ElementRendererProps {
  element: Element;
  siteSlug?: string;
  pages?: PageInfo[];
}

export function ElementRenderer({
  element,
  siteSlug,
  pages,
}: ElementRendererProps) {
  const renderElement = () => {
    switch (element.type) {
      case "text":
        return <TextPreview element={element} />;
      case "image":
        return <ImagePreview element={element} />;
      case "video":
        return <VideoPreview element={element} />;
      case "button":
        return (
          <ButtonPreview element={element} siteSlug={siteSlug} pages={pages} />
        );
      case "column":
        return (
          <ColumnPreview element={element} siteSlug={siteSlug} pages={pages} />
        );
      case "grid":
        return (
          <GridPreview element={element} siteSlug={siteSlug} pages={pages} />
        );
      case "stack":
        return (
          <StackPreview element={element} siteSlug={siteSlug} pages={pages} />
        );
      case "container":
        return (
          <ContainerPreview
            element={element}
            siteSlug={siteSlug}
            pages={pages}
          />
        );
      case "card":
        return <CardPreview element={element} />;
      case "badge":
        return <BadgePreview element={element} />;
      case "separator":
        return <SeparatorPreview element={element} />;
      case "alert":
        return <AlertPreview element={element} />;
      case "input":
        return <InputPreview element={element} />;
      default:
        return null;
    }
  };

  return <div>{renderElement()}</div>;
}

function TextPreview({ element }: { element: Element }) {
  if (element.type !== "text") return null;
  const props = element.props;

  const fontWeightMap: Record<string, number> = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };

  const outer = outerStyleFromPaddingAndBox(props.padding, props, "8px");

  const maxW =
    props.maxWidth === "none" || props.maxWidth == null
      ? undefined
      : typeof props.maxWidth === "number"
        ? `${props.maxWidth}px`
        : undefined;

  return (
    <div
      style={{
        ...outer,
        fontSize: `${props.fontSize}px`,
        fontFamily: props.fontFamily,
        fontWeight: fontWeightMap[props.fontWeight] || 400,
        color: props.color,
        textAlign: props.textAlign as React.CSSProperties["textAlign"],
        lineHeight: props.lineHeight,
        letterSpacing: `${props.letterSpacing ?? 0}px`,
        textDecoration: props.textDecoration ?? "none",
        textTransform: props.textTransform ?? "none",
        maxWidth: maxW,
      }}
    >
      {props.content}
    </div>
  );
}

function ImagePreview({ element }: { element: Element }) {
  if (element.type !== "image") return null;
  const props = element.props;

  if (!props.src) return null;

  const outer = outerStyleFromPaddingAndBox(props.padding, props, "8px");

  const widthStyle =
    props.width === "full"
      ? "100%"
      : props.width === "auto"
        ? "auto"
        : `${props.width}px`;

  return (
    <div style={outer}>
      <img
        src={props.src}
        alt={props.alt}
        style={{
          width: widthStyle,
          height: props.height === "auto" ? "auto" : `${props.height}px`,
          objectFit: props.objectFit as React.CSSProperties["objectFit"],
          borderRadius: `${props.borderRadius}px`,
        }}
        className="max-w-full"
      />
    </div>
  );
}

function VideoPreview({ element }: { element: Element }) {
  if (element.type !== "video") return null;
  const props = element.props;

  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const youtubeMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url.includes("embed") || url.includes("player") ? url : null;
  };

  const embedUrl = getEmbedUrl(props.url);
  if (!embedUrl) return null;

  const outer = outerStyleFromPaddingAndBox(props.padding, props, "8px");

  const aspectClasses: Record<string, string> = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  return (
    <div style={outer}>
      <div
        className={`${aspectClasses[props.aspectRatio] || "aspect-video"} w-full`}
      >
        <iframe
          src={embedUrl}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
}

function ButtonPreview({
  element,
  siteSlug,
  pages,
}: {
  element: Element;
  siteSlug?: string;
  pages?: PageInfo[];
}) {
  if (element.type !== "button") return null;
  const props = element.props;

  const outer = outerStyleFromPaddingAndBox(props.padding, props, "8px");

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const getButtonStyles = () => {
    const base = { borderRadius: `${props.borderRadius}px` };
    switch (props.variant) {
      case "solid":
        return {
          ...base,
          backgroundColor: props.backgroundColor,
          color: props.textColor,
        };
      case "outline":
        return {
          ...base,
          backgroundColor: "transparent",
          color: props.backgroundColor,
          border: `2px solid ${props.backgroundColor}`,
        };
      case "ghost":
        return {
          ...base,
          backgroundColor: "transparent",
          color: props.backgroundColor,
        };
      default:
        return base;
    }
  };

  const buttonClasses = `
    inline-flex items-center justify-center font-medium
    transition-all duration-200 hover:opacity-90
    ${sizeClasses[props.size as keyof typeof sizeClasses]}
    ${props.fullWidth ? "w-full" : ""}
  `;

  const linkType = props.linkType || "external";
  if (linkType === "page" && props.pageId && siteSlug && pages) {
    const targetPage = pages.find((p) => p.id === props.pageId);
    if (targetPage) {
      const pagePath = `/s/${siteSlug}/${targetPage.slug}`;
      return (
        <div style={outer}>
          <Link
            to={pagePath}
            style={getButtonStyles()}
            className={buttonClasses}
          >
            {props.text}
          </Link>
        </div>
      );
    }
  }

  return (
    <div style={outer}>
      <a
        href={props.url}
        target={props.openInNewTab ? "_blank" : undefined}
        rel={props.openInNewTab ? "noopener noreferrer" : undefined}
        style={getButtonStyles()}
        className={buttonClasses}
      >
        {props.text}
      </a>
    </div>
  );
}

function ColumnPreview({
  element,
  siteSlug,
  pages,
}: {
  element: Element;
  siteSlug?: string;
  pages?: PageInfo[];
}) {
  if (element.type !== "column") return null;
  const props = element.props;

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : "16px";

  const slotCount = props.columns;
  const children = element.children ?? [];
  const columnGap = props.columnGap ?? props.gap;
  const rowGap = props.rowGap ?? props.gap;
  const alignItems = props.alignItems ?? "stretch";
  const justifyItems = props.justifyItems ?? "stretch";

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor:
          props.backgroundColor === "transparent"
            ? undefined
            : props.backgroundColor,
        display: "grid",
        gridTemplateColumns: `repeat(${slotCount}, 1fr)`,
        columnGap: `${columnGap}px`,
        rowGap: `${rowGap}px`,
        alignItems: gridAlignmentToCss(alignItems),
        justifyItems: gridAlignmentToCss(justifyItems),
      }}
    >
      {Array.from({ length: slotCount }).map((_, index) => {
        const child = children.find((c) => c.order === index);
        return (
          <div key={index} className="min-w-0">
            {child ? (
              <ElementRenderer
                element={child}
                siteSlug={siteSlug}
                pages={pages}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function GridPreview({
  element,
  siteSlug,
  pages,
}: {
  element: Element;
  siteSlug?: string;
  pages?: PageInfo[];
}) {
  if (element.type !== "grid") return null;
  const props = element.props;

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : "16px";

  const totalCells = props.columns * props.rows;
  const children = element.children ?? [];
  const columnGap = props.columnGap ?? props.gap;
  const rowGap = props.rowGap ?? props.gap;
  const minRow = props.minRowHeight ?? 80;
  const alignItems = props.alignItems ?? "stretch";
  const justifyItems = props.justifyItems ?? "stretch";

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor:
          props.backgroundColor === "transparent"
            ? undefined
            : props.backgroundColor,
        display: "grid",
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gridTemplateRows: `repeat(${props.rows}, minmax(${minRow}px, auto))`,
        columnGap: `${columnGap}px`,
        rowGap: `${rowGap}px`,
        alignItems: gridAlignmentToCss(alignItems),
        justifyItems: gridAlignmentToCss(justifyItems),
      }}
    >
      {Array.from({ length: totalCells }).map((_, index) => {
        const child = children.find((c) => c.order === index);
        return (
          <div key={index} className="min-w-0">
            {child ? (
              <ElementRenderer
                element={child}
                siteSlug={siteSlug}
                pages={pages}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function StackPreview({
  element,
  siteSlug,
  pages,
}: {
  element: Element;
  siteSlug?: string;
  pages?: PageInfo[];
}) {
  if (element.type !== "stack") return null;
  const p = element.props;
  const children = [...(element.children ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  const paddingStyle = p.padding
    ? `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`
    : "8px";

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor:
          p.backgroundColor === "transparent" ? undefined : p.backgroundColor,
        display: "flex",
        flexDirection: p.direction === "row" ? "row" : "column",
        flexWrap: p.wrap ? "wrap" : "nowrap",
        gap: `${p.gap}px`,
        alignItems: flexAlignItemsToCss(p.alignItems),
        justifyContent: flexJustifyToCss(p.justifyContent),
      }}
    >
      {children.map((child) => (
        <div key={child.id} className="min-w-0">
          <ElementRenderer element={child} siteSlug={siteSlug} pages={pages} />
        </div>
      ))}
    </div>
  );
}

function ContainerPreview({
  element,
  siteSlug,
  pages,
}: {
  element: Element;
  siteSlug?: string;
  pages?: PageInfo[];
}) {
  if (element.type !== "container") return null;
  const p = element.props;
  const children = [...(element.children ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  const paddingStyle = p.padding
    ? `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`
    : "16px";

  const maxW = containerMaxWidthToCss(p.maxWidth);
  const margin =
    p.align === "center" ? "0 auto" : p.align === "right" ? "0 0 0 auto" : "0";

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor:
          p.backgroundColor === "transparent" ? undefined : p.backgroundColor,
      }}
    >
      <div
        style={{
          maxWidth: maxW,
          width: "100%",
          margin,
        }}
        className="flex flex-col gap-4"
      >
        {children.map((child) => (
          <div key={child.id} className="min-w-0 w-full">
            <ElementRenderer
              element={child}
              siteSlug={siteSlug}
              pages={pages}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardPreview({ element }: { element: Element }) {
  if (element.type !== "card") return null;
  const p = element.props;
  const box = resolveBoxStyle(p);

  return (
    <div
      style={{
        margin: `${box.margin.top}px ${box.margin.right}px ${box.margin.bottom}px ${box.margin.left}px`,
        padding: `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`,
        borderRadius: p.borderRadius,
        border:
          p.borderWidth > 0
            ? `${p.borderWidth}px solid ${p.borderColor}`
            : undefined,
        boxShadow: p.boxShadow === "none" ? undefined : p.boxShadow,
        backgroundColor: p.backgroundColor,
      }}
      className="text-left"
    >
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {p.title}
        </h3>
        {p.description ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {p.description}
          </p>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {p.content}
      </p>
    </div>
  );
}

function BadgePreview({ element }: { element: Element }) {
  if (element.type !== "badge") return null;
  const p = element.props;
  const outer = outerStyleFromPaddingAndBox(undefined, p, "0");

  const variantClass =
    p.variant === "destructive"
      ? "bg-red-600 text-white border-transparent"
      : p.variant === "outline"
        ? "border border-zinc-300 dark:border-zinc-600 bg-transparent text-zinc-900 dark:text-zinc-100"
        : p.variant === "secondary"
          ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border-transparent"
          : "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 border-transparent";

  const sizeClass =
    p.size === "sm"
      ? "px-2 py-0.5 text-xs"
      : p.size === "lg"
        ? "px-3 py-1 text-sm"
        : "px-2.5 py-0.5 text-xs";

  return (
    <span
      style={outer}
      className={cn(
        "inline-flex items-center rounded-full border font-medium w-fit",
        variantClass,
        sizeClass,
      )}
    >
      {p.text}
    </span>
  );
}

function SeparatorPreview({ element }: { element: Element }) {
  if (element.type !== "separator") return null;
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
    <div style={outer} className="w-full" role="separator">
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

function AlertPreview({ element }: { element: Element }) {
  if (element.type !== "alert") return null;
  const p = element.props;
  const outer = outerStyleFromPaddingAndBox(
    { top: 16, right: 16, bottom: 16, left: 16 },
    p,
    "16px",
  );

  const tone =
    p.variant === "destructive"
      ? "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
      : "border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-100";

  return (
    <div
      style={outer}
      className={cn("rounded-lg border text-sm", tone)}
      role="alert"
    >
      <p className="font-medium leading-none tracking-tight">{p.title}</p>
      <p className="mt-2 leading-relaxed opacity-90">{p.message}</p>
    </div>
  );
}

function InputPreview({ element }: { element: Element }) {
  if (element.type !== "input") return null;
  const p = element.props;
  const outer = outerStyleFromPaddingAndBox(undefined, p, "0");

  return (
    <div style={outer} className="w-full max-w-md space-y-2">
      <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {p.label}
      </label>
      <input
        type={p.inputType}
        placeholder={p.placeholder}
        disabled={p.disabled}
        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
      />
    </div>
  );
}
