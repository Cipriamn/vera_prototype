import type { GridElement } from '@vera/shared';

interface GridLayoutProps {
  element: GridElement;
}

export default function GridLayout({ element }: GridLayoutProps) {
  const props = element.props;

  const paddingStyle = props.padding
    ? `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`
    : '16px';

  const totalCells = props.columns * props.rows;

  return (
    <div
      style={{
        padding: paddingStyle,
        backgroundColor: props.backgroundColor === 'transparent' ? undefined : props.backgroundColor,
        display: 'grid',
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gridTemplateRows: `repeat(${props.rows}, minmax(80px, auto))`,
        gap: `${props.gap}px`,
      }}
    >
      {Array.from({ length: totalCells }).map((_, index) => (
        <div
          key={index}
          className="min-h-[80px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center"
        >
          <span className="text-xs text-gray-400">Cell {index + 1}</span>
        </div>
      ))}
    </div>
  );
}
