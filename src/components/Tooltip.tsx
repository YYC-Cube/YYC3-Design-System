import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../theme/useTheme';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  className = '',
}) => {
  const { tokens } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getPlacementStyles = () => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: (tokens['color.foreground'] as string) || '#000',
      color: (tokens['color.background'] as string) || '#fbfbfc',
      padding: '0.5rem 0.75rem',
      borderRadius: (tokens['radius.sm'] as string) || '0.125rem',
      fontSize: (tokens['font-size.caption'] as string) || '0.875rem',
      whiteSpace: 'nowrap',
      zIndex: 1000,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.2s ease',
      pointerEvents: 'none',
    };

    switch (placement) {
      case 'top':
        return {
          ...baseStyle,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '0.25rem',
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '0.25rem',
        };
      case 'left':
        return {
          ...baseStyle,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '0.25rem',
        };
      case 'right':
        return {
          ...baseStyle,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '0.25rem',
        };
      default:
        return baseStyle;
    }
  };

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  return (
    <div
      style={wrapperStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
      {isVisible && (
        <div style={getPlacementStyles()} role="tooltip">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
