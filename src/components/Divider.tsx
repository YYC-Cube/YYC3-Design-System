import React from 'react';
import { useTheme } from '../theme/useTheme';
import { DividerProps } from '../../types/tokens';

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  className = '',
}) => {
  const { tokens } = useTheme();

  const dividerStyle: React.CSSProperties = {
    border: 'none',
    borderColor: tokens['color.muted-foreground'] as string || '#ccc',
  };

  if (orientation === 'horizontal') {
    dividerStyle.width = '100%';
    dividerStyle.height = variant === 'solid' ? '1px' : '0';
    dividerStyle.borderTop = variant === 'solid' ? '1px solid' : '1px dashed';
    dividerStyle.margin = '1rem 0';
  } else {
    dividerStyle.height = '100%';
    dividerStyle.width = variant === 'solid' ? '1px' : '0';
    dividerStyle.borderLeft = variant === 'solid' ? '1px solid' : '1px dashed';
    dividerStyle.margin = '0 1rem';
  }

  return <div style={dividerStyle} className={className} role="separator" />;
};

export default Divider;
