import { outerStyleFromPaddingAndBox } from "@/lib/outerStyles";
import type { VideoElement } from "@vera/shared";

interface VideoBlockProps {
  element: VideoElement;
}

function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // If it's already an embed URL, return as-is
  if (url.includes("embed") || url.includes("player")) {
    return url;
  }

  return null;
}

function getAspectRatioClass(ratio: string): string {
  switch (ratio) {
    case "16:9":
      return "aspect-video";
    case "4:3":
      return "aspect-[4/3]";
    case "1:1":
      return "aspect-square";
    case "9:16":
      return "aspect-[9/16]";
    default:
      return "aspect-video";
  }
}

export default function VideoBlock({ element }: VideoBlockProps) {
  const props = element.props;

  const outer = outerStyleFromPaddingAndBox(props.padding, props, "8px");

  const embedUrl = getVideoEmbedUrl(props.url);

  if (!props.url || !embedUrl) {
    return (
      <div
        style={outer}
        className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg"
      >
        <div className="text-center py-12 px-4">
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
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            {props.url
              ? "Invalid video URL"
              : "Add a YouTube or Vimeo URL in properties"}
          </p>
        </div>
      </div>
    );
  }

  const autoplayParams = props.autoplay ? "&autoplay=1&mute=1" : "";
  const controlsParams = props.controls ? "" : "&controls=0";
  const fullUrl = `${embedUrl}?${autoplayParams}${controlsParams}`;

  return (
    <div style={outer}>
      <div className={`${getAspectRatioClass(props.aspectRatio)} w-full`}>
        <iframe
          src={fullUrl}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
}
