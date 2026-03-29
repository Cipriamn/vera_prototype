import type { ButtonElement } from '@vera/shared';

interface ButtonBlockProps {
  element: ButtonElement;
}

export default function ButtonBlock({ element }: ButtonBlockProps) {
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
    const base = {
      borderRadius: `${props.borderRadius}px`,
    };

    switch (props.variant) {
      case 'solid':
        return {
          ...base,
          backgroundColor: props.backgroundColor,
          color: props.textColor,
          border: 'none',
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: props.backgroundColor,
          border: `2px solid ${props.backgroundColor}`,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: props.backgroundColor,
          border: 'none',
        };
      default:
        return base;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation in builder mode
    e.preventDefault();
  };

  return (
    <div style={{ padding: paddingStyle }}>
      <a
        href={props.url}
        onClick={handleClick}
        target={props.openInNewTab ? '_blank' : undefined}
        rel={props.openInNewTab ? 'noopener noreferrer' : undefined}
        style={getButtonStyles()}
        className={`
          inline-flex items-center justify-center font-medium
          transition-all duration-200 hover:opacity-90
          ${sizeClasses[props.size]}
          ${props.fullWidth ? 'w-full' : ''}
        `}
      >
        {props.text}
      </a>
    </div>
  );
}
