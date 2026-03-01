/**
 * @file 虚拟滚动组件
 * @description 实现固定高度和动态高度的虚拟滚动组件
 * @component VirtualList
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useRef, useMemo, memo } from 'react';
import {
  calculateVirtualScrollState,
  getVisibleItems,
  getItemStyle,
  getContainerStyle,
  calculateDynamicVirtualScrollState,
  getDynamicItemStyle,
} from '../utils/virtual-scroll';

export interface VirtualListProps<T> {
  items: T[];
  itemHeight?: number;
  estimatedItemHeight?: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
  overscan?: number;
  className?: string;
  dynamicHeight?: boolean;
  getItemHeight?: (index: number) => number;
}

export const VirtualList = memo(function VirtualList<T>({
  items,
  itemHeight = 50,
  estimatedItemHeight = 50,
  containerHeight,
  renderItem,
  getItemKey,
  overscan = 5,
  className = '',
  dynamicHeight = false,
  getItemHeight: customGetItemHeight,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  const handleScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const { startIndex, endIndex, offsetY, totalHeight } = useMemo(() => {
    if (dynamicHeight && customGetItemHeight) {
      return calculateDynamicVirtualScrollState(scrollTop, {
        itemCount: items.length,
        estimatedItemHeight,
        containerHeight,
        getItemHeight: customGetItemHeight,
        overscan,
      });
    }

    return calculateVirtualScrollState(scrollTop, {
      itemCount: items.length,
      itemHeight,
      containerHeight,
      overscan,
    });
  }, [
    scrollTop,
    items.length,
    itemHeight,
    estimatedItemHeight,
    containerHeight,
    overscan,
    dynamicHeight,
    customGetItemHeight,
  ]);

  const visibleItems = useMemo(() => {
    return getVisibleItems(items, startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const containerStyle = useMemo(() => {
    return {
      ...getContainerStyle(totalHeight),
      height: `${containerHeight}px`,
    };
  }, [totalHeight, containerHeight]);

  const getItemKeyDefault = (item: T, index: number) => {
    if (typeof item === 'object' && item !== null && 'id' in item) {
      return (item as { id: string | number }).id;
    }
    return index;
  };

  const keyGetter = getItemKey || getItemKeyDefault;

  return (
    <div ref={containerRef} style={containerStyle} onScroll={handleScroll} className={className}>
      <div style={{ position: 'relative', height: `${totalHeight}px` }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          const itemStyle = dynamicHeight
            ? getDynamicItemStyle(actualIndex, [0])
            : getItemStyle(actualIndex, itemHeight);

          return (
            <div key={keyGetter(item, actualIndex)} style={itemStyle}>
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
});

VirtualList.displayName = 'VirtualList';

export interface VirtualGridProps<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  containerHeight: number;
  containerWidth: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
  overscan?: number;
  gap?: number;
  className?: string;
}

export const VirtualGrid = memo(function VirtualGrid<T>({
  items,
  itemHeight,
  itemWidth,
  containerHeight,
  containerWidth,
  renderItem,
  getItemKey,
  overscan = 5,
  gap = 10,
  className = '',
}: VirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const handleScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
    setScrollLeft(event.currentTarget.scrollLeft);
  }, []);

  const columns = useMemo(() => {
    return Math.floor((containerWidth + gap) / (itemWidth + gap));
  }, [containerWidth, itemWidth, gap]);

  const rows = useMemo(() => {
    return Math.ceil(items.length / columns);
  }, [items.length, columns]);

  const { startIndex, endIndex, offsetY, totalHeight } = useMemo(() => {
    return calculateVirtualScrollState(scrollTop, {
      itemCount: rows,
      itemHeight: itemHeight + gap,
      containerHeight,
      overscan,
    });
  }, [scrollTop, rows, itemHeight, containerHeight, overscan, gap]);

  const visibleItems = useMemo(() => {
    const startRow = startIndex;
    const endRow = endIndex;
    const startIndexGlobal = startRow * columns;
    const endIndexGlobal = Math.min((endRow + 1) * columns, items.length);
    return items.slice(startIndexGlobal, endIndexGlobal);
  }, [items, startIndex, endIndex, columns]);

  const containerStyle = useMemo(() => {
    return {
      ...getContainerStyle(totalHeight),
      height: `${containerHeight}px`,
      width: `${containerWidth}px`,
      overflow: 'auto',
    };
  }, [totalHeight, containerHeight, containerWidth]);

  const getItemKeyDefault = (item: T, index: number) => {
    if (typeof item === 'object' && item !== null && 'id' in item) {
      return (item as { id: string | number }).id;
    }
    return index;
  };

  const keyGetter = getItemKey || getItemKeyDefault;

  return (
    <div ref={containerRef} style={containerStyle} onScroll={handleScroll} className={className}>
      <div
        style={{
          position: 'relative' as const,
          height: `${totalHeight}px`,
          width: `${columns * (itemWidth + gap) - gap}px`,
        }}
      >
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex * columns + index;
          const row = Math.floor(actualIndex / columns);
          const col = actualIndex % columns;
          const itemStyle: React.CSSProperties = {
            position: 'absolute' as const,
            top: `${row * (itemHeight + gap)}px`,
            left: `${col * (itemWidth + gap)}px`,
            width: `${itemWidth}px`,
            height: `${itemHeight}px`,
          };

          return (
            <div key={keyGetter(item, actualIndex)} style={itemStyle}>
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
});

VirtualGrid.displayName = 'VirtualGrid';

export default VirtualList;
