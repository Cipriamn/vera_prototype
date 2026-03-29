import { useBuilderStore } from "@/stores/builderStore";
import type { Element } from "@vera/shared";
import { isLayoutElement } from "@vera/shared";

function findElementDeep(list: Element[], id: string): Element | undefined {
  for (const el of list) {
    if (el.id === id) return el;
    if (isLayoutElement(el) && el.children?.length) {
      const found = findElementDeep(el.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

function TextProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();

  if (element.type !== "text") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          value={props.content}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, content: e.target.value },
            })
          }
          rows={3}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <input
            type="number"
            value={props.fontSize}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, fontSize: parseInt(e.target.value) || 16 },
              })
            }
            min={8}
            max={120}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            type="color"
            value={props.color}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, color: e.target.value },
              })
            }
            className="w-full h-8 border border-gray-200 rounded-md cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Font Weight
        </label>
        <select
          value={props.fontWeight}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, fontWeight: e.target.value },
            })
          }
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="normal">Normal</option>
          <option value="medium">Medium</option>
          <option value="semibold">Semi Bold</option>
          <option value="bold">Bold</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Text Align
        </label>
        <div className="flex gap-1">
          {(["left", "center", "right", "justify"] as const).map((align) => (
            <button
              key={align}
              onClick={() =>
                updateElement(element.id, {
                  props: { ...props, textAlign: align },
                })
              }
              className={`flex-1 py-1.5 text-xs border rounded ${
                props.textAlign === align
                  ? "bg-primary-100 border-primary-300 text-primary-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();

  if (element.type !== "image") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="text"
          value={props.src}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, src: e.target.value },
            })
          }
          placeholder="https://example.com/image.jpg"
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Alt Text
        </label>
        <input
          type="text"
          value={props.alt}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, alt: e.target.value },
            })
          }
          placeholder="Image description"
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Object Fit
        </label>
        <select
          value={props.objectFit}
          onChange={(e) =>
            updateElement(element.id, {
              props: {
                ...props,
                objectFit: e.target.value as
                  | "cover"
                  | "contain"
                  | "fill"
                  | "none",
              },
            })
          }
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Border Radius
        </label>
        <input
          type="number"
          value={props.borderRadius}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, borderRadius: parseInt(e.target.value) || 0 },
            })
          }
          min={0}
          max={100}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}

function VideoProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();

  if (element.type !== "video") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Video URL
        </label>
        <input
          type="text"
          value={props.url}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, url: e.target.value },
            })
          }
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Aspect Ratio
        </label>
        <select
          value={props.aspectRatio}
          onChange={(e) =>
            updateElement(element.id, {
              props: {
                ...props,
                aspectRatio: e.target.value as "16:9" | "4:3" | "1:1" | "9:16",
              },
            })
          }
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="16:9">16:9 (Widescreen)</option>
          <option value="4:3">4:3 (Standard)</option>
          <option value="1:1">1:1 (Square)</option>
          <option value="9:16">9:16 (Vertical)</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.autoplay}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, autoplay: e.target.checked },
              })
            }
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Autoplay
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.controls}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, controls: e.target.checked },
              })
            }
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Show Controls
        </label>
      </div>
    </div>
  );
}

function ButtonProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();

  if (element.type !== "button") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Button Text
        </label>
        <input
          type="text"
          value={props.text}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, text: e.target.value },
            })
          }
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Link URL
        </label>
        <input
          type="text"
          value={props.url}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, url: e.target.value },
            })
          }
          placeholder="https://..."
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Background
          </label>
          <input
            type="color"
            value={props.backgroundColor}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, backgroundColor: e.target.value },
              })
            }
            className="w-full h-8 border border-gray-200 rounded-md cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Text Color
          </label>
          <input
            type="color"
            value={props.textColor}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, textColor: e.target.value },
              })
            }
            className="w-full h-8 border border-gray-200 rounded-md cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Variant
        </label>
        <select
          value={props.variant}
          onChange={(e) =>
            updateElement(element.id, {
              props: {
                ...props,
                variant: e.target.value as "solid" | "outline" | "ghost",
              },
            })
          }
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="solid">Solid</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Size
        </label>
        <div className="flex gap-1">
          {(["sm", "md", "lg"] as const).map((size) => (
            <button
              key={size}
              onClick={() =>
                updateElement(element.id, {
                  props: { ...props, size },
                })
              }
              className={`flex-1 py-1.5 text-xs border rounded uppercase ${
                props.size === size
                  ? "bg-primary-100 border-primary-300 text-primary-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.fullWidth}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, fullWidth: e.target.checked },
            })
          }
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        Full Width
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.openInNewTab}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, openInNewTab: e.target.checked },
            })
          }
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        Open in New Tab
      </label>
    </div>
  );
}

function ColumnProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();

  if (element.type !== "column") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Columns
        </label>
        <div className="flex gap-1">
          {([2, 3, 4] as const).map((cols) => (
            <button
              key={cols}
              onClick={() =>
                updateElement(element.id, {
                  props: { ...props, columns: cols },
                })
              }
              className={`flex-1 py-1.5 text-xs border rounded ${
                props.columns === cols
                  ? "bg-primary-100 border-primary-300 text-primary-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cols} cols
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Gap (px)
        </label>
        <input
          type="number"
          value={props.gap}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, gap: parseInt(e.target.value) || 0 },
            })
          }
          min={0}
          max={100}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Background
        </label>
        <input
          type="color"
          value={
            props.backgroundColor === "transparent"
              ? "#ffffff"
              : props.backgroundColor
          }
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, backgroundColor: e.target.value },
            })
          }
          className="w-full h-8 border border-gray-200 rounded-md cursor-pointer"
        />
      </div>
    </div>
  );
}

function GridProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();

  if (element.type !== "grid") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Columns
          </label>
          <input
            type="number"
            value={props.columns}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, columns: parseInt(e.target.value) || 1 },
              })
            }
            min={1}
            max={12}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Rows
          </label>
          <input
            type="number"
            value={props.rows}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, rows: parseInt(e.target.value) || 1 },
              })
            }
            min={1}
            max={12}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Gap (px)
        </label>
        <input
          type="number"
          value={props.gap}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, gap: parseInt(e.target.value) || 0 },
            })
          }
          min={0}
          max={100}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Background
        </label>
        <input
          type="color"
          value={
            props.backgroundColor === "transparent"
              ? "#ffffff"
              : props.backgroundColor
          }
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, backgroundColor: e.target.value },
            })
          }
          className="w-full h-8 border border-gray-200 rounded-md cursor-pointer"
        />
      </div>
    </div>
  );
}

export default function PropertyPanel() {
  const { elements, selectedElementId, deleteElement, duplicateElement } =
    useBuilderStore();
  const selectedElement = selectedElementId
    ? findElementDeep(elements, selectedElementId)
    : undefined;

  if (!selectedElement) {
    return (
      <div className="w-72 bg-gray-50 border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 mt-8">
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
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
          <p className="mt-4 text-sm">
            Select an element to edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-gray-50 border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900 capitalize">
            {selectedElement.type} Properties
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => duplicateElement(selectedElement.id)}
            className="flex-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50"
          >
            Duplicate
          </button>
          <button
            onClick={() => deleteElement(selectedElement.id)}
            className="flex-1 px-2 py-1 text-xs bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="p-4">
        {selectedElement.type === "text" && (
          <TextProperties element={selectedElement} />
        )}
        {selectedElement.type === "image" && (
          <ImageProperties element={selectedElement} />
        )}
        {selectedElement.type === "video" && (
          <VideoProperties element={selectedElement} />
        )}
        {selectedElement.type === "button" && (
          <ButtonProperties element={selectedElement} />
        )}
        {selectedElement.type === "column" && (
          <ColumnProperties element={selectedElement} />
        )}
        {selectedElement.type === "grid" && (
          <GridProperties element={selectedElement} />
        )}
      </div>
    </div>
  );
}
