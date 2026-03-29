import {
  MarginAndBorderFields,
  PaddingInsetFields,
} from "@/components/builder/propertyFields";
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
        <label className="builder-field-label">Content</label>
        <textarea
          value={props.content}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, content: e.target.value },
            })
          }
          rows={3}
          className="builder-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Font Size</label>
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
            className="builder-input"
          />
        </div>
        <div>
          <label className="builder-field-label">Color</label>
          <input
            type="color"
            value={props.color}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, color: e.target.value },
              })
            }
            className="builder-color-input"
          />
        </div>
      </div>

      <div>
        <label className="builder-field-label">Font Weight</label>
        <select
          value={props.fontWeight}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, fontWeight: e.target.value },
            })
          }
          className="builder-input"
        >
          <option value="normal">Normal</option>
          <option value="medium">Medium</option>
          <option value="semibold">Semi Bold</option>
          <option value="bold">Bold</option>
        </select>
      </div>

      <div>
        <label className="builder-field-label">Text Align</label>
        <div className="flex gap-1">
          {(["left", "center", "right", "justify"] as const).map((align) => (
            <button
              key={align}
              onClick={() =>
                updateElement(element.id, {
                  props: { ...props, textAlign: align },
                })
              }
              className={`flex-1 py-1.5 text-xs border rounded-lg transition-colors ${
                props.textAlign === align
                  ? "builder-segment-active"
                  : "builder-segment-inactive"
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Line height</label>
          <input
            type="number"
            step={0.05}
            value={props.lineHeight}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  lineHeight: parseFloat(e.target.value) || 1.5,
                },
              })
            }
            min={0.8}
            max={3}
            className="builder-input"
          />
        </div>
        <div>
          <label className="builder-field-label">Letter spacing (px)</label>
          <input
            type="number"
            value={props.letterSpacing ?? 0}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  letterSpacing: parseInt(e.target.value, 10) || 0,
                },
              })
            }
            className="builder-input"
          />
        </div>
      </div>

      <div>
        <label className="builder-field-label">Font family</label>
        <input
          type="text"
          value={props.fontFamily}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, fontFamily: e.target.value },
            })
          }
          className="builder-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Decoration</label>
          <select
            value={props.textDecoration ?? "none"}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  textDecoration: e.target.value as
                    | "none"
                    | "underline"
                    | "line-through",
                },
              })
            }
            className="builder-input"
          >
            <option value="none">None</option>
            <option value="underline">Underline</option>
            <option value="line-through">Line-through</option>
          </select>
        </div>
        <div>
          <label className="builder-field-label">Transform</label>
          <select
            value={props.textTransform ?? "none"}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  textTransform: e.target.value as
                    | "none"
                    | "uppercase"
                    | "lowercase"
                    | "capitalize",
                },
              })
            }
            className="builder-input"
          >
            <option value="none">None</option>
            <option value="uppercase">Uppercase</option>
            <option value="lowercase">Lowercase</option>
            <option value="capitalize">Capitalize</option>
          </select>
        </div>
      </div>

      <div>
        <label className="builder-field-label">Max width</label>
        <div className="flex gap-2 mt-1">
          <select
            value={
              props.maxWidth === "none" || props.maxWidth == null
                ? "none"
                : "px"
            }
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  maxWidth:
                    e.target.value === "none"
                      ? "none"
                      : typeof props.maxWidth === "number"
                        ? props.maxWidth
                        : 640,
                },
              })
            }
            className="builder-input flex-1"
          >
            <option value="none">None</option>
            <option value="px">Pixels</option>
          </select>
          {typeof props.maxWidth === "number" ? (
            <input
              type="number"
              value={props.maxWidth}
              onChange={(e) =>
                updateElement(element.id, {
                  props: {
                    ...props,
                    maxWidth: parseInt(e.target.value, 10) || 0,
                  },
                })
              }
              className="builder-input w-24"
            />
          ) : null}
        </div>
      </div>

      <PaddingInsetFields
        label="Padding"
        value={props.padding}
        onChange={(padding) =>
          updateElement(element.id, { props: { ...props, padding } })
        }
      />

      <MarginAndBorderFields
        box={props}
        onChange={(box) =>
          updateElement(element.id, { props: { ...props, ...box } })
        }
      />
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
        <label className="builder-field-label">Image URL</label>
        <input
          type="text"
          value={props.src}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, src: e.target.value },
            })
          }
          placeholder="https://example.com/image.jpg"
          className="builder-input"
        />
      </div>

      <div>
        <label className="builder-field-label">Alt Text</label>
        <input
          type="text"
          value={props.alt}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, alt: e.target.value },
            })
          }
          placeholder="Image description"
          className="builder-input"
        />
      </div>

      <div>
        <label className="builder-field-label">Object Fit</label>
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
          className="builder-input"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
        </select>
      </div>

      <div>
        <label className="builder-field-label">Border Radius</label>
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
          className="builder-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Width</label>
          <select
            value={
              props.width === "full"
                ? "full"
                : props.width === "auto"
                  ? "auto"
                  : "px"
            }
            onChange={(e) => {
              const v = e.target.value;
              updateElement(element.id, {
                props: {
                  ...props,
                  width:
                    v === "full"
                      ? "full"
                      : v === "auto"
                        ? "auto"
                        : typeof props.width === "number"
                          ? props.width
                          : 400,
                },
              });
            }}
            className="builder-input"
          >
            <option value="full">Full</option>
            <option value="auto">Auto</option>
            <option value="px">Pixels</option>
          </select>
        </div>
        {typeof props.width === "number" ? (
          <div>
            <label className="builder-field-label">Width (px)</label>
            <input
              type="number"
              value={props.width}
              onChange={(e) =>
                updateElement(element.id, {
                  props: {
                    ...props,
                    width: parseInt(e.target.value, 10) || 100,
                  },
                })
              }
              className="builder-input"
            />
          </div>
        ) : (
          <div>
            <label className="builder-field-label">Height</label>
            <select
              value={props.height === "auto" ? "auto" : "px"}
              onChange={(e) =>
                updateElement(element.id, {
                  props: {
                    ...props,
                    height:
                      e.target.value === "auto"
                        ? "auto"
                        : typeof props.height === "number"
                          ? props.height
                          : 200,
                  },
                })
              }
              className="builder-input"
            >
              <option value="auto">Auto</option>
              <option value="px">Pixels</option>
            </select>
          </div>
        )}
      </div>

      {typeof props.height === "number" ? (
        <div>
          <label className="builder-field-label">Height (px)</label>
          <input
            type="number"
            value={props.height}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  height: parseInt(e.target.value, 10) || 1,
                },
              })
            }
            className="builder-input"
          />
        </div>
      ) : null}

      <PaddingInsetFields
        label="Padding"
        value={props.padding}
        onChange={(padding) =>
          updateElement(element.id, { props: { ...props, padding } })
        }
      />

      <MarginAndBorderFields
        box={props}
        onChange={(box) =>
          updateElement(element.id, { props: { ...props, ...box } })
        }
      />
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
        <label className="builder-field-label">Video URL</label>
        <input
          type="text"
          value={props.url}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, url: e.target.value },
            })
          }
          placeholder="https://youtube.com/watch?v=..."
          className="builder-input"
        />
      </div>

      <div>
        <label className="builder-field-label">Aspect Ratio</label>
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
          className="builder-input"
        >
          <option value="16:9">16:9 (Widescreen)</option>
          <option value="4:3">4:3 (Standard)</option>
          <option value="1:1">1:1 (Square)</option>
          <option value="9:16">9:16 (Vertical)</option>
        </select>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-sm text-builder-text">
          <input
            type="checkbox"
            checked={props.autoplay}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, autoplay: e.target.checked },
              })
            }
            className="builder-checkbox"
          />
          Autoplay
        </label>

        <label className="flex items-center gap-2 text-sm text-builder-text">
          <input
            type="checkbox"
            checked={props.controls}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, controls: e.target.checked },
              })
            }
            className="builder-checkbox"
          />
          Show controls
        </label>
      </div>

      <PaddingInsetFields
        label="Padding"
        value={props.padding}
        onChange={(padding) =>
          updateElement(element.id, { props: { ...props, padding } })
        }
      />

      <MarginAndBorderFields
        box={props}
        onChange={(box) =>
          updateElement(element.id, { props: { ...props, ...box } })
        }
      />
    </div>
  );
}

function ButtonProperties({ element }: { element: Element }) {
  const { updateElement, site } = useBuilderStore();

  if (element.type !== "button") return null;
  const props = element.props;
  const linkType = props.linkType || "external";

  return (
    <div className="space-y-4">
      <div>
        <label className="builder-field-label">Button Text</label>
        <input
          type="text"
          value={props.text}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, text: e.target.value },
            })
          }
          className="builder-input"
        />
      </div>

      <div>
        <label className="builder-field-label">Link Type</label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() =>
              updateElement(element.id, {
                props: { ...props, linkType: "external", pageId: undefined },
              })
            }
            className={`flex-1 py-1.5 text-xs border rounded-lg transition-colors ${
              linkType === "external"
                ? "builder-segment-active"
                : "builder-segment-inactive"
            }`}
          >
            External URL
          </button>
          <button
            type="button"
            onClick={() =>
              updateElement(element.id, {
                props: { ...props, linkType: "page", url: "" },
              })
            }
            className={`flex-1 py-1.5 text-xs border rounded-lg transition-colors ${
              linkType === "page"
                ? "builder-segment-active"
                : "builder-segment-inactive"
            }`}
          >
            Site Page
          </button>
        </div>
      </div>

      {linkType === "external" ? (
        <div>
          <label className="builder-field-label">URL</label>
          <input
            type="text"
            value={props.url}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, url: e.target.value },
              })
            }
            placeholder="https://..."
            className="builder-input"
          />
        </div>
      ) : (
        <div>
          <label className="builder-field-label">Select Page</label>
          <select
            value={props.pageId || ""}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, pageId: e.target.value || undefined },
              })
            }
            className="builder-input"
          >
            <option value="">-- Select a page --</option>
            {site?.pages?.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name} {page.isHomepage ? "(Home)" : ""}
              </option>
            ))}
          </select>
          {!site?.pages?.length && (
            <p className="text-xs text-builder-text-muted mt-1">
              No pages available
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Background</label>
          <input
            type="color"
            value={props.backgroundColor}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, backgroundColor: e.target.value },
              })
            }
            className="builder-color-input"
          />
        </div>
        <div>
          <label className="builder-field-label">Text Color</label>
          <input
            type="color"
            value={props.textColor}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, textColor: e.target.value },
              })
            }
            className="builder-color-input"
          />
        </div>
      </div>

      <div>
        <label className="builder-field-label">Variant</label>
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
          className="builder-input"
        >
          <option value="solid">Solid</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost</option>
        </select>
      </div>

      <div>
        <label className="builder-field-label">Size</label>
        <div className="flex gap-1">
          {(["sm", "md", "lg"] as const).map((size) => (
            <button
              key={size}
              onClick={() =>
                updateElement(element.id, {
                  props: { ...props, size },
                })
              }
              className={`flex-1 py-1.5 text-xs border rounded-lg uppercase transition-colors ${
                props.size === size
                  ? "builder-segment-active"
                  : "builder-segment-inactive"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-builder-text">
        <input
          type="checkbox"
          checked={props.fullWidth}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, fullWidth: e.target.checked },
            })
          }
          className="builder-checkbox"
        />
        Full width
      </label>

      <label className="flex items-center gap-2 text-sm text-builder-text">
        <input
          type="checkbox"
          checked={props.openInNewTab}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, openInNewTab: e.target.checked },
            })
          }
          className="builder-checkbox"
        />
        Open in new tab
      </label>

      <div>
        <label className="builder-field-label">Border radius</label>
        <input
          type="number"
          value={props.borderRadius}
          onChange={(e) =>
            updateElement(element.id, {
              props: {
                ...props,
                borderRadius: parseInt(e.target.value, 10) || 0,
              },
            })
          }
          min={0}
          className="builder-input"
        />
      </div>

      <PaddingInsetFields
        label="Padding"
        value={props.padding}
        onChange={(padding) =>
          updateElement(element.id, { props: { ...props, padding } })
        }
      />

      <MarginAndBorderFields
        box={props}
        onChange={(box) =>
          updateElement(element.id, { props: { ...props, ...box } })
        }
      />
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
        <label className="builder-field-label">Columns</label>
        <div className="flex gap-1 flex-wrap">
          {([1, 2, 3, 4] as const).map((cols) => (
            <button
              key={cols}
              onClick={() =>
                updateElement(element.id, {
                  props: { ...props, columns: cols },
                })
              }
              className={`flex-1 py-1.5 text-xs border rounded-lg transition-colors ${
                props.columns === cols
                  ? "builder-segment-active"
                  : "builder-segment-inactive"
              }`}
            >
              {cols}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="builder-field-label">Gap (px)</label>
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
          className="builder-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Column gap</label>
          <input
            type="number"
            value={props.columnGap ?? props.gap}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  columnGap: parseInt(e.target.value, 10) || 0,
                },
              })
            }
            className="builder-input"
          />
        </div>
        <div>
          <label className="builder-field-label">Row gap</label>
          <input
            type="number"
            value={props.rowGap ?? props.gap}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  rowGap: parseInt(e.target.value, 10) || 0,
                },
              })
            }
            className="builder-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Align items</label>
          <select
            value={props.alignItems ?? "stretch"}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  alignItems: e.target.value as
                    | "start"
                    | "center"
                    | "end"
                    | "stretch",
                },
              })
            }
            className="builder-input"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
            <option value="stretch">Stretch</option>
          </select>
        </div>
        <div>
          <label className="builder-field-label">Justify items</label>
          <select
            value={props.justifyItems ?? "stretch"}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  justifyItems: e.target.value as
                    | "start"
                    | "center"
                    | "end"
                    | "stretch",
                },
              })
            }
            className="builder-input"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
            <option value="stretch">Stretch</option>
          </select>
        </div>
      </div>

      <PaddingInsetFields
        label="Padding"
        value={props.padding}
        onChange={(padding) =>
          updateElement(element.id, { props: { ...props, padding } })
        }
      />

      <div>
        <label className="builder-field-label">Background</label>
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
          className="builder-color-input"
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
          <label className="builder-field-label">Columns</label>
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
            className="builder-input"
          />
        </div>
        <div>
          <label className="builder-field-label">Rows</label>
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
            className="builder-input"
          />
        </div>
      </div>

      <div>
        <label className="builder-field-label">Gap (px)</label>
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
          className="builder-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Column gap</label>
          <input
            type="number"
            value={props.columnGap ?? props.gap}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  columnGap: parseInt(e.target.value, 10) || 0,
                },
              })
            }
            className="builder-input"
          />
        </div>
        <div>
          <label className="builder-field-label">Row gap</label>
          <input
            type="number"
            value={props.rowGap ?? props.gap}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  rowGap: parseInt(e.target.value, 10) || 0,
                },
              })
            }
            className="builder-input"
          />
        </div>
      </div>

      <div>
        <label className="builder-field-label">Min row height (px)</label>
        <input
          type="number"
          value={props.minRowHeight ?? 80}
          onChange={(e) =>
            updateElement(element.id, {
              props: {
                ...props,
                minRowHeight: parseInt(e.target.value, 10) || 0,
              },
            })
          }
          min={0}
          max={400}
          className="builder-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Align items</label>
          <select
            value={props.alignItems ?? "stretch"}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  alignItems: e.target.value as
                    | "start"
                    | "center"
                    | "end"
                    | "stretch",
                },
              })
            }
            className="builder-input"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
            <option value="stretch">Stretch</option>
          </select>
        </div>
        <div>
          <label className="builder-field-label">Justify items</label>
          <select
            value={props.justifyItems ?? "stretch"}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  justifyItems: e.target.value as
                    | "start"
                    | "center"
                    | "end"
                    | "stretch",
                },
              })
            }
            className="builder-input"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
            <option value="stretch">Stretch</option>
          </select>
        </div>
      </div>

      <PaddingInsetFields
        label="Padding"
        value={props.padding}
        onChange={(padding) =>
          updateElement(element.id, { props: { ...props, padding } })
        }
      />

      <div>
        <label className="builder-field-label">Background</label>
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
          className="builder-color-input"
        />
      </div>
    </div>
  );
}

function StackProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();
  if (element.type !== "stack") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Direction</label>
          <select
            value={props.direction}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  direction: e.target.value as "row" | "column",
                },
              })
            }
            className="builder-input"
          >
            <option value="column">Column</option>
            <option value="row">Row</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-builder-text mt-6">
          <input
            type="checkbox"
            checked={props.wrap}
            onChange={(e) =>
              updateElement(element.id, {
                props: { ...props, wrap: e.target.checked },
              })
            }
            className="builder-checkbox"
          />
          Wrap
        </label>
      </div>

      <div>
        <label className="builder-field-label">Gap (px)</label>
        <input
          type="number"
          value={props.gap}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, gap: parseInt(e.target.value, 10) || 0 },
            })
          }
          className="builder-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Align items</label>
          <select
            value={props.alignItems}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  alignItems: e.target.value as typeof props.alignItems,
                },
              })
            }
            className="builder-input"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
            <option value="stretch">Stretch</option>
            <option value="baseline">Baseline</option>
          </select>
        </div>
        <div>
          <label className="builder-field-label">Justify content</label>
          <select
            value={props.justifyContent}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  justifyContent: e.target.value as typeof props.justifyContent,
                },
              })
            }
            className="builder-input"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
            <option value="between">Space between</option>
            <option value="around">Space around</option>
            <option value="evenly">Space evenly</option>
          </select>
        </div>
      </div>

      <PaddingInsetFields
        label="Padding"
        value={props.padding}
        onChange={(padding) =>
          updateElement(element.id, { props: { ...props, padding } })
        }
      />

      <div>
        <label className="builder-field-label">Background</label>
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
          className="builder-color-input"
        />
      </div>
    </div>
  );
}

function ContainerProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();
  if (element.type !== "container") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div>
        <label className="builder-field-label">Max width</label>
        <select
          value={typeof props.maxWidth === "number" ? "custom" : props.maxWidth}
          onChange={(e) => {
            const v = e.target.value;
            updateElement(element.id, {
              props: {
                ...props,
                maxWidth: v === "custom" ? 960 : (v as typeof props.maxWidth),
              },
            });
          }}
          className="builder-input"
        >
          <option value="sm">SM (640)</option>
          <option value="md">MD (768)</option>
          <option value="lg">LG (1024)</option>
          <option value="xl">XL (1280)</option>
          <option value="2xl">2XL (1536)</option>
          <option value="full">Full</option>
          <option value="custom">Custom px</option>
        </select>
      </div>

      {typeof props.maxWidth === "number" ? (
        <div>
          <label className="builder-field-label">Custom width (px)</label>
          <input
            type="number"
            value={props.maxWidth}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  maxWidth: parseInt(e.target.value, 10) || 320,
                },
              })
            }
            className="builder-input"
          />
        </div>
      ) : null}

      <div>
        <label className="builder-field-label">Align</label>
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() =>
                updateElement(element.id, { props: { ...props, align: a } })
              }
              className={`flex-1 py-1.5 text-xs border rounded-lg capitalize ${
                props.align === a
                  ? "builder-segment-active"
                  : "builder-segment-inactive"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <PaddingInsetFields
        label="Padding"
        value={props.padding}
        onChange={(padding) =>
          updateElement(element.id, { props: { ...props, padding } })
        }
      />

      <div>
        <label className="builder-field-label">Background</label>
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
          className="builder-color-input"
        />
      </div>
    </div>
  );
}

function CardProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();
  if (element.type !== "card") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div>
        <label className="builder-field-label">Title</label>
        <input
          type="text"
          value={props.title}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, title: e.target.value },
            })
          }
          className="builder-input"
        />
      </div>
      <div>
        <label className="builder-field-label">Description</label>
        <input
          type="text"
          value={props.description}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, description: e.target.value },
            })
          }
          className="builder-input"
        />
      </div>
      <div>
        <label className="builder-field-label">Content</label>
        <textarea
          value={props.content}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, content: e.target.value },
            })
          }
          rows={3}
          className="builder-input"
        />
      </div>
      <PaddingInsetFields
        label="Padding"
        value={props.padding}
        onChange={(padding) =>
          updateElement(element.id, { props: { ...props, padding } })
        }
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Radius</label>
          <input
            type="number"
            value={props.borderRadius}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  borderRadius: parseInt(e.target.value, 10) || 0,
                },
              })
            }
            className="builder-input"
          />
        </div>
        <div>
          <label className="builder-field-label">Border</label>
          <input
            type="number"
            value={props.borderWidth}
            onChange={(e) =>
              updateElement(element.id, {
                props: {
                  ...props,
                  borderWidth: parseInt(e.target.value, 10) || 0,
                },
              })
            }
            className="builder-input"
          />
        </div>
      </div>
      <div>
        <label className="builder-field-label">Border color</label>
        <input
          type="color"
          value={props.borderColor}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, borderColor: e.target.value },
            })
          }
          className="builder-color-input"
        />
      </div>
      <div>
        <label className="builder-field-label">Shadow</label>
        <input
          type="text"
          value={props.boxShadow}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, boxShadow: e.target.value },
            })
          }
          className="builder-input font-mono text-xs"
        />
      </div>
      <div>
        <label className="builder-field-label">Background</label>
        <input
          type="color"
          value={props.backgroundColor}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, backgroundColor: e.target.value },
            })
          }
          className="builder-color-input"
        />
      </div>
      <MarginAndBorderFields
        box={props}
        onChange={(box) =>
          updateElement(element.id, { props: { ...props, ...box } })
        }
      />
    </div>
  );
}

function BadgeProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();
  if (element.type !== "badge") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div>
        <label className="builder-field-label">Text</label>
        <input
          type="text"
          value={props.text}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, text: e.target.value },
            })
          }
          className="builder-input"
        />
      </div>
      <div>
        <label className="builder-field-label">Variant</label>
        <select
          value={props.variant}
          onChange={(e) =>
            updateElement(element.id, {
              props: {
                ...props,
                variant: e.target.value as typeof props.variant,
              },
            })
          }
          className="builder-input"
        >
          <option value="default">Default</option>
          <option value="secondary">Secondary</option>
          <option value="destructive">Destructive</option>
          <option value="outline">Outline</option>
        </select>
      </div>
      <div>
        <label className="builder-field-label">Size</label>
        <div className="flex gap-1">
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                updateElement(element.id, { props: { ...props, size: s } })
              }
              className={`flex-1 py-1.5 text-xs border rounded-lg uppercase ${
                props.size === s
                  ? "builder-segment-active"
                  : "builder-segment-inactive"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <MarginAndBorderFields
        box={props}
        onChange={(box) =>
          updateElement(element.id, { props: { ...props, ...box } })
        }
      />
    </div>
  );
}

function SeparatorProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();
  if (element.type !== "separator") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div>
        <label className="builder-field-label">Orientation</label>
        <div className="flex gap-1">
          {(["horizontal", "vertical"] as const).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() =>
                updateElement(element.id, {
                  props: { ...props, orientation: o },
                })
              }
              className={`flex-1 py-1.5 text-xs border rounded-lg capitalize ${
                props.orientation === o
                  ? "builder-segment-active"
                  : "builder-segment-inactive"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="builder-field-label">Thickness (px)</label>
        <input
          type="number"
          value={props.thickness}
          onChange={(e) =>
            updateElement(element.id, {
              props: {
                ...props,
                thickness: parseInt(e.target.value, 10) || 1,
              },
            })
          }
          min={1}
          className="builder-input"
        />
      </div>
      <div>
        <label className="builder-field-label">Color</label>
        <input
          type="color"
          value={props.color}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, color: e.target.value },
            })
          }
          className="builder-color-input"
        />
      </div>
      <MarginAndBorderFields
        box={props}
        onChange={(box) =>
          updateElement(element.id, { props: { ...props, ...box } })
        }
      />
    </div>
  );
}

function AlertProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();
  if (element.type !== "alert") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div>
        <label className="builder-field-label">Variant</label>
        <select
          value={props.variant}
          onChange={(e) =>
            updateElement(element.id, {
              props: {
                ...props,
                variant: e.target.value as typeof props.variant,
              },
            })
          }
          className="builder-input"
        >
          <option value="default">Default</option>
          <option value="destructive">Destructive</option>
        </select>
      </div>
      <div>
        <label className="builder-field-label">Title</label>
        <input
          type="text"
          value={props.title}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, title: e.target.value },
            })
          }
          className="builder-input"
        />
      </div>
      <div>
        <label className="builder-field-label">Message</label>
        <textarea
          value={props.message}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, message: e.target.value },
            })
          }
          rows={3}
          className="builder-input"
        />
      </div>
      <MarginAndBorderFields
        box={props}
        onChange={(box) =>
          updateElement(element.id, { props: { ...props, ...box } })
        }
      />
    </div>
  );
}

function InputProperties({ element }: { element: Element }) {
  const { updateElement } = useBuilderStore();
  if (element.type !== "input") return null;
  const props = element.props;

  return (
    <div className="space-y-4">
      <div>
        <label className="builder-field-label">Label</label>
        <input
          type="text"
          value={props.label}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, label: e.target.value },
            })
          }
          className="builder-input"
        />
      </div>
      <div>
        <label className="builder-field-label">Placeholder</label>
        <input
          type="text"
          value={props.placeholder}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, placeholder: e.target.value },
            })
          }
          className="builder-input"
        />
      </div>
      <div>
        <label className="builder-field-label">Input type</label>
        <select
          value={props.inputType}
          onChange={(e) =>
            updateElement(element.id, {
              props: {
                ...props,
                inputType: e.target.value as typeof props.inputType,
              },
            })
          }
          className="builder-input"
        >
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="password">Password</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-builder-text">
        <input
          type="checkbox"
          checked={props.disabled}
          onChange={(e) =>
            updateElement(element.id, {
              props: { ...props, disabled: e.target.checked },
            })
          }
          className="builder-checkbox"
        />
        Disabled
      </label>
      <MarginAndBorderFields
        box={props}
        onChange={(box) =>
          updateElement(element.id, { props: { ...props, ...box } })
        }
      />
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
      <aside className="w-72 shrink-0 border-l border-builder-border bg-builder-surface/90 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="text-center text-builder-text-muted mt-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-builder-border bg-builder-surface-muted/40">
            <svg
              className="h-7 w-7 text-builder-text-muted/70"
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
          </div>
          <p className="text-sm font-medium text-builder-text">
            Nothing selected
          </p>
          <p className="mt-1 text-xs leading-relaxed">
            Click a block on the canvas to edit its properties.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 shrink-0 border-l border-builder-border bg-builder-surface/90 backdrop-blur-sm overflow-y-auto">
      <div className="p-4 border-b border-builder-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold font-display text-builder-text capitalize">
            {selectedElement.type}
          </h3>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => duplicateElement(selectedElement.id)}
            className="flex-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-builder-border bg-builder-surface hover:bg-builder-surface-muted transition-colors"
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => deleteElement(selectedElement.id)}
            className="flex-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
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
        {selectedElement.type === "stack" && (
          <StackProperties element={selectedElement} />
        )}
        {selectedElement.type === "container" && (
          <ContainerProperties element={selectedElement} />
        )}
        {selectedElement.type === "card" && (
          <CardProperties element={selectedElement} />
        )}
        {selectedElement.type === "badge" && (
          <BadgeProperties element={selectedElement} />
        )}
        {selectedElement.type === "separator" && (
          <SeparatorProperties element={selectedElement} />
        )}
        {selectedElement.type === "alert" && (
          <AlertProperties element={selectedElement} />
        )}
        {selectedElement.type === "input" && (
          <InputProperties element={selectedElement} />
        )}
      </div>
    </aside>
  );
}
