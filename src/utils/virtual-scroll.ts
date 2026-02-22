/**
 * @file 虚拟滚动核心逻辑
 * @description 实现虚拟滚动的核心算法和工具函数
 * @module utils/virtual-scroll
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useState, useEffect, useCallback } from 'react';

export interface VirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  scrollingDelay?: number;
}

export interface VirtualScrollState {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  visibleCount: number;
  totalHeight: number;
}

export const calculateVirtualScrollState = (
  scrollTop: number,
  options: VirtualScrollOptions
): VirtualScrollState => {
  const {
    itemCount,
    itemHeight,
    containerHeight,
    overscan = 5,
  } = options;

  const totalHeight = itemCount * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  const visibleCount = endIndex - startIndex + 1;
  const offsetY = startIndex * itemHeight;

  return {
    startIndex,
    endIndex,
    offsetY,
    visibleCount,
    totalHeight,
  };
};

export const getVisibleItems = <T,>(
  items: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  return items.slice(startIndex, endIndex + 1);
};

export const getItemStyle = (
  index: number,
  itemHeight: number
): React.CSSProperties => {
  return {
    position: 'absolute',
    top: `${index * itemHeight}px`,
    left: 0,
    right: 0,
    height: `${itemHeight}px`,
  };
};

export const getContainerStyle = (
  totalHeight: number
): React.CSSProperties => {
  return {
    position: 'relative',
    height: `${totalHeight}px`,
    overflow: 'auto',
  };
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

export const useVirtualScroll = (options: VirtualScrollOptions) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [state, setState] = useState<VirtualScrollState>(() =>
    calculateVirtualScrollState(0, options)
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = event.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
    },
    []
  );

  useEffect(() => {
    const newState = calculateVirtualScrollState(scrollTop, options);
    setState(newState);
  }, [scrollTop, options]);

  return {
    scrollTop,
    state,
    handleScroll,
  };
};

export interface DynamicItemHeightOptions {
  itemCount: number;
  estimatedItemHeight: number;
  containerHeight: number;
  getItemHeight: (index: number) => number;
  overscan?: number;
}

export interface DynamicVirtualScrollState {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  visibleCount: number;
  totalHeight: number;
  itemPositions: number[];
}

export const calculateDynamicVirtualScrollState = (
  scrollTop: number,
  options: DynamicItemHeightOptions
): DynamicVirtualScrollState => {
  const {
    itemCount,
    estimatedItemHeight,
    containerHeight,
    getItemHeight,
    overscan = 5,
  } = options;

  const itemPositions: number[] = [];
  let currentPosition = 0;

  for (let i = 0; i < itemCount; i++) {
    itemPositions.push(currentPosition);
    currentPosition += getItemHeight(i);
  }

  const totalHeight = currentPosition;

  let startIndex = 0;
  for (let i = 0; i < itemCount; i++) {
    if (itemPositions[i] > scrollTop - estimatedItemHeight * overscan) {
      startIndex = Math.max(0, i - overscan);
      break;
    }
  }

  let endIndex = itemCount - 1;
  for (let i = startIndex; i < itemCount; i++) {
    if (itemPositions[i] > scrollTop + containerHeight) {
      endIndex = Math.min(itemCount - 1, i + overscan);
      break;
    }
  }

  const visibleCount = endIndex - startIndex + 1;
  const offsetY = itemPositions[startIndex];

  return {
    startIndex,
    endIndex,
    offsetY,
    visibleCount,
    totalHeight,
    itemPositions,
  };
};

export const getDynamicItemStyle = (
  index: number,
  itemPositions: number[]
): React.CSSProperties => {
  return {
    position: 'absolute',
    top: `${itemPositions[index]}px`,
    left: 0,
    right: 0,
  };
};

export default {
  calculateVirtualScrollState,
  getVisibleItems,
  getItemStyle,
  getContainerStyle,
  debounce,
  throttle,
  useVirtualScroll,
  calculateDynamicVirtualScrollState,
  getDynamicItemStyle,
};
