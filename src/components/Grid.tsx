import React from 'react';
import { cn } from '@/utils/cn';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
  gap?: number | string;
  children?: React.ReactNode;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 1, children, ...props }, ref) => {
    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: typeof gap === 'number' ? `${gap * 0.25}rem` : gap,
    };

    return (
      <div
        ref={ref}
        className={cn('grid', className)}
        style={gridStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';
