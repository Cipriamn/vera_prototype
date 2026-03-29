import type { BoxStyleProps, SpacingInset } from "@vera/shared";
import { EMPTY_INSETS } from "@vera/shared";

export function PaddingInsetFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: SpacingInset;
  onChange: (next: SpacingInset) => void;
}) {
  const v = value ?? EMPTY_INSETS;
  const sides: (keyof SpacingInset)[] = ["top", "right", "bottom", "left"];
  return (
    <div>
      <label className="builder-field-label">{label}</label>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {sides.map((side) => (
          <div key={side}>
            <span className="text-[10px] uppercase text-builder-text-muted">
              {side}
            </span>
            <input
              type="number"
              value={v[side]}
              onChange={(e) =>
                onChange({
                  ...v,
                  [side]: parseInt(e.target.value, 10) || 0,
                })
              }
              className="builder-input"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarginAndBorderFields({
  box,
  onChange,
}: {
  box: Partial<BoxStyleProps>;
  onChange: (next: Partial<BoxStyleProps>) => void;
}) {
  const m = box.margin ?? EMPTY_INSETS;
  return (
    <div className="space-y-3 pt-2 border-t border-builder-border">
      <p className="text-xs font-semibold text-builder-text-muted uppercase tracking-wide">
        Margin & border
      </p>
      <PaddingInsetFields
        label="Margin"
        value={m}
        onChange={(margin) => onChange({ ...box, margin })}
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="builder-field-label">Border width</label>
          <input
            type="number"
            value={box.borderWidth ?? 0}
            onChange={(e) =>
              onChange({
                ...box,
                borderWidth: parseInt(e.target.value, 10) || 0,
              })
            }
            min={0}
            className="builder-input"
          />
        </div>
        <div>
          <label className="builder-field-label">Border color</label>
          <input
            type="color"
            value={box.borderColor ?? "#e5e7eb"}
            onChange={(e) => onChange({ ...box, borderColor: e.target.value })}
            className="builder-color-input"
          />
        </div>
      </div>
      <div>
        <label className="builder-field-label">Border style</label>
        <select
          value={box.borderStyle ?? "none"}
          onChange={(e) =>
            onChange({
              ...box,
              borderStyle: e.target.value as BoxStyleProps["borderStyle"],
            })
          }
          className="builder-input"
        >
          <option value="none">None</option>
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>
      <div>
        <label className="builder-field-label">Box shadow</label>
        <input
          type="text"
          value={box.boxShadow ?? "none"}
          onChange={(e) => onChange({ ...box, boxShadow: e.target.value })}
          placeholder="CSS shadow or none"
          className="builder-input font-mono text-xs"
        />
      </div>
    </div>
  );
}
