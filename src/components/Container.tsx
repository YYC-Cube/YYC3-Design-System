import React from 'react';
import { cn } from '@/utils/cn';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  children?: React.ReactNode;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth = 'lg', children, ...props }, ref) => {
    const maxWidths = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      full: '100%',
      none: 'none',
    };

    const containerStyle: React.CSSProperties = {
      width: '100%',
      maxWidth: maxWidths[maxWidth],
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
    };

    return (
      <div ref={ref} className={cn('container', className)} style={containerStyle} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
