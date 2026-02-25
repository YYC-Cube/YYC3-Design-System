import * as React from 'react';

export interface VirtualGridProps<T = unknown> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  height?: number;
  className?: string;
  'data-testid'?: string;
}

export const VirtualGrid = <T extends Record<string, unknown>>({
  items,
  renderItem,
  itemHeight = 50,
  height = 400,
  className = '',
  'data-testid': dataTestId,
}: VirtualGridProps<T>) => {
  const visibleCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, 0);
  const endIndex = Math.min(items.length, startIndex + visibleCount);
  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      className={className}
      data-testid={dataTestId}
      style={{
        height,
        overflow: 'auto',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: items.length * itemHeight,
          position: 'relative',
        }}
      >
        {visibleItems.map((item, index) => (
          <div
            key={(item as any).id || index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
};
