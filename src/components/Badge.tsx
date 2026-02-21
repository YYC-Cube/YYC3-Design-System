import React from 'react';
import { BadgeProps } from '../../types/tokens';
import { useTheme } from '../theme/useTheme';

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  children, 
  className = '',
  'data-testid': dataTestId 
}) => {
  const { tokens } = useTheme();
  const radius = tokens['radius.md'] as string || '0.25rem';

  const getBadgeStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.5rem',
      borderRadius: radius,
      fontSize: tokens['font-size.caption'] as string || '0.875rem',
      fontWeight: '500',
      lineHeight: '1',
      transition: 'all 0.2s ease',
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          backgroundColor: tokens['color.primary'] as string || '#d45a5f',
          color: tokens['color.primary-foreground'] as string || '#fff',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: tokens['color.card'] as string || '#f8f9ef',
          color: tokens['color.card-foreground'] as string || tokens['color.foreground'] as string || '#000',
          border: `1px solid ${tokens['color.muted-foreground'] as string || '#ccc'}`,
        };
      case 'destructive':
        return {
          ...baseStyle,
          backgroundColor: tokens['color.destructive'] as string || '#e05a3f',
          color: tokens['color.destructive-foreground'] as string || '#fff',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: tokens['color.foreground'] as string || '#000',
          border: `1px solid ${tokens['color.muted-foreground'] as string || '#ccc'}`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <span style={getBadgeStyle()} className={className} data-testid={dataTestId}>
      {children}
    </span>
  );
};

export default Badge;
