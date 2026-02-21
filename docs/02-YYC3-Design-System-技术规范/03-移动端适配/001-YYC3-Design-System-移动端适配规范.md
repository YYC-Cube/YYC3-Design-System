/**
 * @file 移动端适配规范
 * @description YYC³ 设计系统移动端适配规范，确保跨设备一致性体验
 * @module docs/mobile-adaptation
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 * @updated 2026-02-18
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

# YYC³ 设计系统移动端适配规范

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

**创建日期**：2026-02-18
**作者**：YYC³ Team
**版本**：1.0.0
**更新日期**：2026-02-18

---

## 概述

本规范基于 YYC³ 团队「五高五标五化」核心要求，为设计系统移动端适配提供统一标准，确保跨设备一致性体验。

## 核心原则

### 五高原则

#### 高可用
- 响应式设计适配所有设备
- 离线功能支持
- 优雅降级策略
- 网络状态感知

#### 高性能
- 图片懒加载和优化
- 代码分割和按需加载
- 减少网络请求
- 优化渲染性能

#### 高安全
- 触摸事件安全处理
- 设备指纹识别
- 移动端特定漏洞防护
- 安全的本地存储

#### 高扩展
- 支持多种屏幕尺寸
- 适配不同输入方式
- 支持设备特性检测
- 渐进式增强

#### 高可维护
- 统一的断点系统
- 可复用的响应式组件
- 清晰的适配规则
- 完整的测试覆盖

## 响应式断点

### 断点定义

```typescript
// src/tokens/breakpoints.ts
export const breakpoints = {
  xs: '0px',      // 超小屏幕（手机竖屏）
  sm: '576px',    // 小屏幕（手机横屏）
  md: '768px',    // 中等屏幕（平板竖屏）
  lg: '992px',    // 大屏幕（平板横屏）
  xl: '1200px',   // 超大屏幕（桌面）
  xxl: '1600px'   // 超超大屏幕（大桌面）
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  xxl: `@media (min-width: ${breakpoints.xxl})`
} as const;
```

### 断点使用

```typescript
// 使用 CSS-in-JS
import { breakpoints } from '@/tokens/breakpoints';

const containerStyle = {
  padding: '16px',
  [breakpoints.md]: {
    padding: '24px'
  },
  [breakpoints.lg]: {
    padding: '32px'
  }
};

// 使用 styled-components
import styled from 'styled-components';

const Container = styled.div`
  padding: 16px;

  @media (min-width: ${breakpoints.md}) {
    padding: 24px;
  }

  @media (min-width: ${breakpoints.lg}) {
    padding: 32px;
  }
`;
```

## 触摸交互

### 触摸事件处理

```typescript
// src/hooks/useTouch.ts
import { useState, useRef, useCallback } from 'react';

interface TouchHandlers {
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  onTap?: (e: React.TouchEvent) => void;
  onSwipeLeft?: (e: React.TouchEvent) => void;
  onSwipeRight?: (e: React.TouchEvent) => void;
  onSwipeUp?: (e: React.TouchEvent) => void;
  onSwipeDown?: (e: React.TouchEvent) => void;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
  isSwiping: boolean;
}

export function useTouch(handlers: TouchHandlers) {
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isSwiping: false
  });

  const touchStateRef = useRef(touchState);
  touchStateRef.current = touchState;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isSwiping: false
    });
    handlers.onTouchStart?.(e);
  }, [handlers]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStateRef.current.startX);
    const deltaY = Math.abs(touch.clientY - touchStateRef.current.startY);
    
    if (deltaX > 10 || deltaY > 10) {
      setTouchState(prev => ({ ...prev, isSwiping: true }));
    }
    
    handlers.onTouchMove?.(e);
  }, [handlers]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStateRef.current.startX;
    const deltaY = touch.clientY - touchStateRef.current.startY;
    const deltaTime = Date.now() - touchStateRef.current.startTime;
    
    if (!touchStateRef.current.isSwiping && deltaTime < 300) {
      handlers.onTap?.(e);
    } else if (touchStateRef.current.isSwiping && deltaTime < 500) {
      const minDistance = 50;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > minDistance) {
          handlers.onSwipeRight?.(e);
        } else if (deltaX < -minDistance) {
          handlers.onSwipeLeft?.(e);
        }
      } else {
        if (deltaY > minDistance) {
          handlers.onSwipeDown?.(e);
        } else if (deltaY < -minDistance) {
          handlers.onSwipeUp?.(e);
        }
      }
    }
    
    handlers.onTouchEnd?.(e);
  }, [handlers]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
}
```

### 触摸优化

```typescript
// 防止双击缩放
const preventDoubleTapZoom = (e: React.TouchEvent) => {
  e.preventDefault();
};

// 延迟点击（防止误触）
const delayedClick = (callback: () => void, delay: number = 300) => {
  let timer: NodeJS.Timeout;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(callback, delay);
  };
};

// 触摸反馈
const useTouchFeedback = () => {
  const [isPressed, setIsPressed] = useState(false);

  return {
    isPressed,
    onTouchStart: () => setIsPressed(true),
    onTouchEnd: () => setIsPressed(false),
    style: {
      transform: isPressed ? 'scale(0.95)' : 'scale(1)',
      transition: 'transform 0.1s'
    }
  };
};
```

## 响应式组件

### 响应式容器

```typescript
// src/components/Container.tsx
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  maxWidth = 'lg'
}) => {
  const breakpoint = useBreakpoint();
  
  const maxWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%'
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: maxWidths[maxWidth],
    margin: '0 auto',
    padding: `0 ${breakpoint === 'xs' ? '16px' : '24px'}`
  };

  return (
    <div style={containerStyle} className={className}>
      {children}
    </div>
  );
};
```

### 响应式网格

```typescript
// src/components/Grid.tsx
interface GridProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  gap = '16px'
}) => {
  const breakpoint = useBreakpoint();
  const currentCols = cols[breakpoint] || cols.xs || 1;

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${currentCols}, 1fr)`,
    gap
  };

  return <div style={gridStyle}>{children}</div>;
};
```

### 响应式按钮

```typescript
// src/components/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick
}) => {
  const breakpoint = useBreakpoint();
  const touchFeedback = useTouchFeedback();

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' }
  };

  const buttonStyle: React.CSSProperties = {
    ...sizes[size],
    width: fullWidth ? '100%' : 'auto',
    minWidth: breakpoint === 'xs' ? '120px' : 'auto',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '8px',
    ...touchFeedback.style
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onTouchStart={touchFeedback.onTouchStart}
      onTouchEnd={touchFeedback.onTouchEnd}
    >
      {children}
    </button>
  );
};
```

## 移动端优化

### 图片优化

```typescript
// src/utils/image.ts
export function getResponsiveImageUrl(
  baseUrl: string,
  width: number,
  quality: number = 80
): string {
  return `${baseUrl}?w=${width}&q=${quality}`;
}

export function getOptimalImageWidth(): number {
  const { innerWidth } = window;
  const dpr = window.devicePixelRatio || 1;
  
  if (innerWidth < 576) return 375 * dpr;
  if (innerWidth < 768) return 667 * dpr;
  if (innerWidth < 992) return 768 * dpr;
  if (innerWidth < 1200) return 1024 * dpr;
  return 1920 * dpr;
}

export function createResponsiveImageSrcSet(baseUrl: string): string {
  const widths = [375, 667, 768, 1024, 1920];
  return widths
    .map(width => `${getResponsiveImageUrl(baseUrl, width)} ${width}w`)
    .join(', ');
}
```

### 懒加载

```typescript
// src/hooks/useLazyLoad.ts
import { useState, useEffect, useRef } from 'react';

export function useLazyLoad(threshold: number = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  return [elementRef, isVisible] as const;
}

// 使用示例
export const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  const [ref, isVisible] = useLazyLoad();

  return (
    <img
      ref={ref}
      src={isVisible ? src : ''}
      alt={alt}
      loading="lazy"
    />
  );
};
```

### 性能优化

```typescript
// 防抖和节流
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用示例
export const SearchInput = () => {
  const [value, setValue] = useState('');
  const debouncedSearch = debounce((query: string) => {
    console.log('Searching:', query);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  return <input value={value} onChange={handleChange} />;
};
```

## 离线支持

### Service Worker

```typescript
// public/sw.js
const CACHE_NAME = 'yyc3-design-system-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

### 离线检测

```typescript
// src/hooks/useOnlineStatus.ts
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// 使用示例
export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '16px',
      backgroundColor: '#ff6b6b',
      color: 'white',
      textAlign: 'center'
    }}>
      您当前处于离线状态，部分功能可能不可用
    </div>
  );
};
```

## 最佳实践

### 1. 响应式设计
- 使用相对单位（rem, em, %）
- 定义清晰的断点系统
- 移动优先设计策略
- 渐进式增强

### 2. 触摸优化
- 增加触摸目标大小（至少 44x44px）
- 提供触摸反馈
- 防止误触和双击缩放
- 支持手势操作

### 3. 性能优化
- 图片懒加载和优化
- 代码分割和按需加载
- 减少网络请求
- 优化渲染性能

### 4. 可访问性
- 支持屏幕阅读器
- 提供键盘导航
- 确保颜色对比度
- 添加 ARIA 属性

### 5. 离线支持
- 实现 Service Worker
- 提供离线提示
- 缓存关键资源
- 优雅降级

## 参考资源

- [响应式设计](https://web.dev/responsive-web-design-basics/)
- [移动端最佳实践](https://web.dev/mobile/)
- [PWA 指南](https://web.dev/progressive-web-apps/)
- [YYC³ 标准规范](https://github.com/yyc3/standards)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

*文档最后更新：2026-02-18*

</div>
