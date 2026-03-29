import { Link } from 'react-router-dom';
import type { Element } from '@vera/shared';

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

export function ElementRenderer({ element, siteSlug, pages }: ElementRendererProps) {
  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return <TextPreview element={element} />;
      case 'image':
        return <ImagePreview element={element} />;
      case 'video':
        return <VideoPreview element={element} />;
      case 'button':
        return <ButtonPreview element={element} siteSlug={siteSlug} pages={pages} />;
      case 'column':
        return <ColumnPreview element={element} siteSlug={siteSlug} pages={pages} />;
      case 'grid':
        return <GridPreview element={element} siteSlug={siteSlug} pages={pages} />;
      default:
        return null;
    }
  };

  return <div>{renderElement()}</div>;
}

function TextPreview({ element }: { element: Element }) {
  if (element.type !== 'text') return null;
  const props = element.props;

  const fontWeightMap: Record<string, number> = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  };

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : '8px';

  return (
    <div
      style={{
        fontSize: `${props.fontSize}px`,
        fontFamily: props.fontFamily,
        fontWeight: fontWeightMap[props.fontWeight] || 400,
        color: props.color,
        textAlign: props.textAlign as React.CSSProperties['textAlign'],
        lineHeight: props.lineHeight,
        padding: paddingStyle,
      }}
    >
      {props.content}
    </div>
  );
}

function ImagePreview({ element }: { element: Element }) {
  if (element.type !== 'image') return null;
  const props = element.props;

  if (!props.src) return null;

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : '8px';

  const widthStyle =
    props.width === 'full'
      ? '100%'
      : props.width === 'auto'
        ? 'auto'
        : `${props.width}px`;

  return (
    <div style={{ padding: paddingStyle }}>
      <img
        src={props.src}
        alt={props.alt}
        style={{
          width: widthStyle,
          height: props.height === 'auto' ? 'auto' : `${props.height}px`,
          objectFit: props.objectFit as React.CSSProperties['objectFit'],
          borderRadius: `${props.borderRadius}px`,
        }}
        className="max-w-full"
      />
    </div>
  );
}

function VideoPreview({ element }: { element: Element }) {
  if (element.type !== 'video') return null;
  const props = element.props;

  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    const youtubeMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url.includes('embed') || url.includes('player') ? url : null;
  };

  const embedUrl = getEmbedUrl(props.url);
  if (!embedUrl) return null;

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : '8px';

  const aspectClasses: Record<string, string> = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]',
  };

  return (
    <div style={{ padding: paddingStyle }}>
      <div className={`${aspectClasses[props.aspectRatio] || 'aspect-video'} w-full`}>
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

function ButtonPreview({ element, siteSlug, pages }: { element: Element; siteSlug?: string; pages?: PageInfo[] }) {
  if (element.type !== 'button') return null;
  const props = element.props;

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : '8px';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const getButtonStyles = () => {
    const base = { borderRadius: `${props.borderRadius}px` };
    switch (props.variant) {
      case 'solid':
        return { ...base, backgroundColor: props.backgroundColor, color: props.textColor };
      case 'outline':
        return { ...base, backgroundColor: 'transparent', color: props.backgroundColor, border: `2px solid ${props.backgroundColor}` };
      case 'ghost':
        return { ...base, backgroundColor: 'transparent', color: props.backgroundColor };
      default:
        return base;
    }
  };

  const buttonClasses = `
    inline-flex items-center justify-center font-medium
    transition-all duration-200 hover:opacity-90
    ${sizeClasses[props.size as keyof typeof sizeClasses]}
    ${props.fullWidth ? 'w-full' : ''}
  `;

  // Handle internal page link
  const linkType = props.linkType || 'external';
  if (linkType === 'page' && props.pageId && siteSlug && pages) {
    const targetPage = pages.find(p => p.id === props.pageId);
    if (targetPage) {
      const pagePath = `/s/${siteSlug}/${targetPage.slug}`;
      return (
        <div style={{ padding: paddingStyle }}>
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

  // External link
  return (
    <div style={{ padding: paddingStyle }}>
      <a
        href={props.url}
        target={props.openInNewTab ? '_blank' : undefined}
        rel={props.openInNewTab ? 'noopener noreferrer' : undefined}
        style={getButtonStyles()}
        className={buttonClasses}
      >
        {props.text}
      </a>
    </div>
  );
}

function ColumnPreview({ element, siteSlug, pages }: { element: Element; siteSlug?: string; pages?: PageInfo[] }) {
  if (element.type !== 'column') return null;
  const props = element.props;

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : '16px';

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor: props.backgroundColor === 'transparent' ? undefined : props.backgroundColor,
        display: 'grid',
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gap: `${props.gap}px`,
      }}
    >
      {element.children?.map((child) => (
        <ElementRenderer key={child.id} element={child} siteSlug={siteSlug} pages={pages} />
      ))}
    </div>
  );
}

function GridPreview({ element, siteSlug, pages }: { element: Element; siteSlug?: string; pages?: PageInfo[] }) {
  if (element.type !== 'grid') return null;
  const props = element.props;

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : '16px';

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor: props.backgroundColor === 'transparent' ? undefined : props.backgroundColor,
        display: 'grid',
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gap: `${props.gap}px`,
      }}
    >
      {element.children?.map((child) => (
        <ElementRenderer key={child.id} element={child} siteSlug={siteSlug} pages={pages} />
      ))}
    </div>
  );
}
