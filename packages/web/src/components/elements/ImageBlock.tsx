import type { ImageElement } from '@vera/shared';

interface ImageBlockProps {
  element: ImageElement;
}

export default function ImageBlock({ element }: ImageBlockProps) {
  const props = element.props;

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : '8px';

  const widthStyle =
    props.width === 'full'
      ? '100%'
      : props.width === 'auto'
        ? 'auto'
        : `${props.width}px`;

  const heightStyle =
    props.height === 'auto' ? 'auto' : `${props.height}px`;

  if (!props.src) {
    return (
      <div
        style={{ padding: paddingStyle }}
        className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg"
      >
        <div className="text-center py-8 px-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Add an image URL in properties</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: paddingStyle }}>
      <img
        src={props.src}
        alt={props.alt}
        style={{
          width: widthStyle,
          height: heightStyle,
          objectFit: props.objectFit,
          borderRadius: `${props.borderRadius}px`,
        }}
        className="max-w-full"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="flex items-center justify-center bg-red-50 border border-red-200 rounded-lg py-8">
              <p class="text-sm text-red-500">Failed to load image</p>
            </div>
          `;
        }}
      />
    </div>
  );
}
