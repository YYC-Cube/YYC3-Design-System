import React from 'react';
import { useTheme } from '../theme/useTheme';

interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  className = '',
}) => {
  const { tokens } = useTheme();
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '0.5rem',
    borderRadius: tokens['radius.lg'] as string || '0.5rem',
    backgroundColor: tokens['color.muted-foreground'] as string || '#ccc',
    overflow: 'hidden',
  };

  const barStyle: React.CSSProperties = {
    width: `${percentage}%`,
    height: '100%',
    borderRadius: tokens['radius.lg'] as string || '0.5rem',
    backgroundColor: tokens['color.primary'] as string || '#d45a5f',
    transition: 'width 0.3s ease',
  };

  return (
    <div style={containerStyle} className={className} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div style={barStyle} />
    </div>
  );
};

export default Progress;
