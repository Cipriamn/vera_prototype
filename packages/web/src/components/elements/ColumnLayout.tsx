import type { ColumnElement } from '@vera/shared';

interface ColumnLayoutProps {
  element: ColumnElement;
}

export default function ColumnLayout({ element }: ColumnLayoutProps) {
  const props = element.props;

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : '16px';

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor: props.backgroundColor === 'transparent' ? undefined : props.backgroundColor,
        gap: `${props.gap}px`,
      }}
      className={`grid ${gridColsClass[props.columns]}`}
    >
      {Array.from({ length: props.columns }).map((_, index) => (
        <div
          key={index}
          className="min-h-[100px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
        >
          <span className="text-xs text-gray-400">Column {index + 1}</span>
        </div>
      ))}
    </div>
  );
}
