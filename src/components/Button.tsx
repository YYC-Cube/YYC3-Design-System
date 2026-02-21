import React from 'react';
import { ButtonProps } from '../../types/tokens';
import { useTheme } from '../theme/useTheme';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
  type = 'button',
  onClick,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  className = '',
}) => {
  const { tokens } = useTheme();
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          background: tokens['color.primary'] as string || '#d45a5f',
          color: tokens['color.primary-foreground'] as string || '#ffffff',
        };
      case 'destructive':
        return {
          background: tokens['color.destructive'] as string || '#e05a3f',
          color: tokens['color.destructive-foreground'] as string || '#ffffff',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: tokens['color.primary'] as string || '#d45a5f',
          border: `1px solid ${tokens['color.primary'] as string || '#d45a5f'}`,
        };
      case 'secondary':
        return {
          background: tokens['color.card'] as string || '#f8f9ef',
          color: tokens['color.foreground'] as string || '#777777',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: tokens['color.primary'] as string || '#d45a5f',
        };
      case 'link':
        return {
          background: 'transparent',
          color: tokens['color.primary'] as string || '#d45a5f',
          textDecoration: 'underline',
          padding: 0,
        };
      default:
        return {
          background: tokens['color.primary'] as string || '#d45a5f',
          color: tokens['color.primary-foreground'] as string || '#ffffff',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const radius = tokens['radius.default'] as string || '0.5rem';

  const sizeStyles = {
    default: { padding: '0.5rem 1rem', fontSize: tokens['font-size.body'] as string || '1rem' },
    sm: { padding: '0.25rem 0.75rem', fontSize: tokens['font-size.caption'] as string || '0.875rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: tokens['font-size.heading-2'] as string || '1.5rem' },
    icon: { padding: '0.5rem', fontSize: tokens['font-size.body'] as string || '1rem' },
  };

  const btnStyle: React.CSSProperties = {
    ...variantStyles,
    borderRadius: radius,
    ...(variant === 'link' ? {} : sizeStyles[size]),
    border: variant === 'outline' ? variantStyles.border : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: tokens['typography.font-sans'] as string || 'system-ui',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    fontWeight: 500,
  };

  return (
    <button
      type={type}
      style={btnStyle}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
