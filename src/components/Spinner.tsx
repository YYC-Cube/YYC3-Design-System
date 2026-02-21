import React from 'react';
import { useTheme } from '../theme/useTheme';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const { tokens } = useTheme();

  const sizeStyles = {
    sm: { width: '1rem', height: '1rem', borderWidth: '2px' },
    md: { width: '1.5rem', height: '1.5rem', borderWidth: '3px' },
    lg: { width: '2rem', height: '2rem', borderWidth: '4px' },
  };

  const spinnerStyle: React.CSSProperties = {
    ...sizeStyles[size],
    borderRadius: '50%',
    border: `solid ${tokens['color.muted-foreground'] as string || '#ccc'}`,
    borderTopColor: tokens['color.primary'] as string || '#d45a5f',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={spinnerStyle} className={className} role="status" aria-label="Loading">
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
