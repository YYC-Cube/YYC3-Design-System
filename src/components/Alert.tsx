import React from 'react';
import { useTheme } from '../theme/useTheme';

interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info' | 'error';
  title?: string;
  message?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  'data-testid'?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  title,
  message,
  children,
  onClose,
  className = '',
  'data-testid': dataTestId,
}) => {
  const { tokens } = useTheme();
  const alertRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
      case 'info':
        return {
          backgroundColor: (tokens['color.background'] as string) || '#fbfbfc',
          borderColor: (tokens['color.primary'] as string) || '#d45a5f',
          color: (tokens['color.foreground'] as string) || '#000',
        };
      case 'destructive':
      case 'error':
        return {
          backgroundColor: (tokens['color.destructive'] as string) || '#e05a3f',
          borderColor: (tokens['color.destructive'] as string) || '#e05a3f',
          color: (tokens['color.destructive-foreground'] as string) || '#fff',
        };
      case 'warning':
        return {
          backgroundColor: '#fff3cd',
          borderColor: '#ffc107',
          color: '#856404',
        };
      case 'success':
        return {
          backgroundColor: '#d4edda',
          borderColor: '#28a745',
          color: '#155724',
        };
      default:
        return {
          backgroundColor: (tokens['color.background'] as string) || '#fbfbfc',
          borderColor: (tokens['color.primary'] as string) || '#d45a5f',
          color: (tokens['color.foreground'] as string) || '#000',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const radius = (tokens['radius.md'] as string) || '0.25rem';

  const alertStyle: React.CSSProperties = {
    padding: '1rem',
    borderRadius: radius,
    borderLeft: `4px solid ${variantStyles.borderColor}`,
    backgroundColor: variantStyles.backgroundColor,
    color: variantStyles.color,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const getIcon = () => {
    switch (variant) {
      case 'destructive':
      case 'error':
        return '⚠️';
      case 'warning':
        return '⚡';
      case 'success':
        return '✓';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      ref={alertRef}
      style={alertStyle}
      className={className}
      role="alert"
      data-testid={dataTestId}
      onKeyDown={onClose ? handleKeyDown : undefined}
      tabIndex={onClose ? 0 : undefined}
    >
      <span style={{ fontSize: '1.25rem' }}>{getIcon()}</span>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{title}</div>}
        {message && <div>{message}</div>}
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: variantStyles.color,
          }}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
