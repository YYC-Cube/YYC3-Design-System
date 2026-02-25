---
@file: API.md
@description: YYC3-Design-System API 文档
@author: YanYuCloudCube Team
@version: 1.0.0
@created: 2026-02-25
@updated: 2026-02-25
@status: Active
@tags: API, Documentation, YYC3
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# YYC³ Design System API 文档

## 概述

YYC³ Design System 提供了一套完整的 React 组件库和工具函数，用于快速构建现代化的用户界面。本文档详细介绍了所有可用组件、工具函数和 API。

---

## 目录

- [组件 API](#组件-api)
- [工具函数 API](#工具函数-api)
- [钩子 API](#钩子-api)
- [主题 API](#主题-api)
- [动画 API](#动画-api)
- [性能优化 API](#性能优化-api)
- [类型定义](#类型定义)

---

## 组件 API

### Animated

动画组件，提供预设和自定义动画效果。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| children | ReactNode | - | 需要动画的子元素 |
| animation | AnimationType | 'fadeIn' | 动画类型 |
| duration | number | 300 | 动画持续时间（毫秒） |
| delay | number | 0 | 动画延迟时间（毫秒） |
| easing | string | 'ease-in-out' | 动画缓动函数 |
| className | string | '' | 自定义 CSS 类名 |
| trigger | boolean | true | 是否触发动画 |

#### 动画类型

- `fadeIn` - 淡入
- `fadeOut` - 淡出
- `slideUp` - 向上滑动
- `slideDown` - 向下滑动
- `slideLeft` - 向左滑动
- `slideRight` - 向右滑动
- `scaleUp` - 放大
- `scaleDown` - 缩小
- `rotate` - 旋转
- `bounce` - 弹跳
- `pulse` - 脉冲
- `shake` - 摇晃
- `flip` - 翻转
- `zoomIn` - 缩放进入
- `zoomOut` - 缩放退出

#### 使用示例

```tsx
import { Animated } from '@/components/Animated';

<Animated animation="fadeIn" duration={500}>
  <div>内容</div>
</Animated>
```

---

### AnimatedEnhanced

增强版动画组件，支持更多动画选项。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| children | ReactNode | - | 需要动画的子元素 |
| animation | AnimationType \| CustomAnimationConfig | 'fadeIn' | 动画类型或自定义配置 |
| duration | number | 300 | 动画持续时间（毫秒） |
| delay | number | 0 | 动画延迟时间（毫秒） |
| easing | string | 'ease-in-out' | 动画缓动函数 |
| className | string | '' | 自定义 CSS 类名 |
| trigger | boolean | true | 是否触发动画 |
| infinite | boolean | false | 是否无限循环 |
| iterations | number | 1 | 动画迭代次数 |
| fillMode | 'none' \| 'forwards' \| 'backwards' \| 'both' | 'none' | 动画填充模式 |

#### 使用示例

```tsx
import { AnimatedEnhanced } from '@/components/AnimatedEnhanced';

<AnimatedEnhanced animation="pulse" infinite>
  <div>无限脉冲动画</div>
</AnimatedEnhanced>
```

---

### CustomAnimation

自定义动画组件，支持使用 CSS keyframes。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| children | ReactNode | - | 需要动画的子元素 |
| keyframes | Keyframe[] | [] | 关键帧数组 |
| options | AnimationOptions | {} | 动画选项 |

#### 使用示例

```tsx
import { CustomAnimation } from '@/components/CustomAnimation';

<CustomAnimation
  keyframes={[
    { transform: 'translateX(0)' },
    { transform: 'translateX(100px)' },
    { transform: 'translateX(0)' }
  ]}
  options={{ duration: 1000, iterations: Infinity }}
>
  <div>自定义动画</div>
</CustomAnimation>
```

---

### ThemeEditor

主题编辑器组件，用于可视化自定义主题。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| onSave | (preset: ThemePreset) => void | - | 保存主题时的回调 |
| onExport | (data: string) => void | - | 导出主题时的回调 |
| onImport | (data: string) => void | - | 导入主题时的回调 |
| initialPresetId | string | 'light' | 初始主题预设 ID |
| showPreview | boolean | true | 是否显示预览 |

#### 使用示例

```tsx
import { ThemeEditor } from '@/components/ThemeEditor';

<ThemeEditor
  onSave={(preset) => console.log('主题已保存:', preset)}
  onExport={(data) => console.log('主题已导出:', data)}
  showPreview
/>
```

---

## 工具函数 API

### memoize

记忆化函数，缓存函数结果以提高性能。

#### 签名

```typescript
function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T
```

#### 参数

- `fn` - 需要记忆化的函数
- `keyGenerator` - 可选的缓存键生成函数

#### 使用示例

```typescript
import { memoize } from '@/utils/performance';

const expensiveCalculation = memoize((n: number) => {
  return n * n;
});

console.log(expensiveCalculation(5)); // 首次计算
console.log(expensiveCalculation(5)); // 从缓存返回
```

---

### debounce

防抖函数，延迟执行函数直到停止调用一段时间。

#### 签名

```typescript
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void)
```

#### 参数

- `fn` - 需要防抖的函数
- `delay` - 延迟时间（毫秒）

#### 使用示例

```typescript
import { debounce } from '@/utils/performance';

const handleSearch = debounce((query: string) => {
  console.log('搜索:', query);
}, 300);

handleSearch('test');
```

---

### throttle

节流函数，限制函数执行频率。

#### 签名

```typescript
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void)
```

#### 参数

- `fn` - 需要节流的函数
- `limit` - 时间限制（毫秒）

#### 使用示例

```typescript
import { throttle } from '@/utils/performance';

const handleScroll = throttle((event: Event) => {
  console.log('滚动位置:', event);
}, 100);

window.addEventListener('scroll', handleScroll);
```

---

### measurePerformance

测量函数执行时间。

#### 签名

```typescript
function measurePerformance(
  fn: () => void,
  label?: string
): number
```

#### 参数

- `fn` - 需要测量的函数
- `label` - 可选的标签（未使用）

#### 返回值

执行时间（毫秒）

#### 使用示例

```typescript
import { measurePerformance } from '@/utils/performance';

const time = measurePerformance(() => {
  for (let i = 0; i < 1000000; i++) {}
});

console.log(`执行时间: ${time}ms`);
```

---

### clearPerformanceCache

清除性能缓存。

#### 签名

```typescript
function clearPerformanceCache(): void
```

#### 使用示例

```typescript
import { clearPerformanceCache } from '@/utils/performance';

clearPerformanceCache();
```

---

### getCacheSize

获取缓存大小。

#### 签名

```typescript
function getCacheSize(): number
```

#### 返回值

缓存中的条目数量

#### 使用示例

```typescript
import { getCacheSize } from '@/utils/performance';

const size = getCacheSize();
console.log(`缓存大小: ${size}`);
```

---

## 钩子 API

### useDebounce

防抖钩子。

#### 签名

```typescript
function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T
```

#### 使用示例

```typescript
import { useDebounce } from '@/utils/performance';

const Component = () => {
  const debouncedSearch = useDebounce((query: string) => {
    console.log('搜索:', query);
  }, 300);

  return <input onChange={(e) => debouncedSearch(e.target.value)} />;
};
```

---

### useThrottle

节流钩子。

#### 签名

```typescript
function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): T
```

#### 使用示例

```typescript
import { useThrottle } from '@/utils/performance';

const Component = () => {
  const throttledScroll = useThrottle((event: Event) => {
    console.log('滚动:', event);
  }, 100);

  return <div onScroll={throttledScroll} />;
};
```

---

### useIdleCallback

空闲回调钩子，在浏览器空闲时执行回调。

#### 签名

```typescript
function useIdleCallback<T extends (...args: any[]) => any>(
  fn: T,
  timeout?: number
): T
```

#### 参数

- `fn` - 要执行的函数
- `timeout` - 超时时间（毫秒，默认 2000）

#### 使用示例

```typescript
import { useIdleCallback } from '@/utils/performance';

const Component = () => {
  const idleTask = useIdleCallback(() => {
    console.log('浏览器空闲，执行任务');
  }, 1000);

  return <button onClick={idleTask}>执行任务</button>;
};
```

---

### usePerformanceMonitor

性能监控钩子。

#### 签名

```typescript
function usePerformanceMonitor(
  options?: PerformanceOptions
): {
  getMetrics: () => PerformanceMetrics | undefined;
  reset: () => void;
}
```

#### 使用示例

```typescript
import { usePerformanceMonitor } from '@/utils/performance';

const Component = () => {
  const { getMetrics, reset } = usePerformanceMonitor({
    threshold: 50,
    onThresholdExceeded: (metrics) => {
      console.log('性能警告:', metrics);
    },
  });

  return <div>FPS: {getMetrics()?.fps}</div>;
};
```

---

### useVirtualScroll

虚拟滚动钩子，用于高效渲染大型列表。

#### 签名

```typescript
function useVirtualScroll(
  items: any[],
  itemHeight: number,
  containerHeight: number,
  overscan?: number
): {
  visibleItems: any[];
  offsetY: number;
  totalHeight: number;
  scrollTop: number;
  setScrollTop: (scrollTop: number) => void;
}
```

#### 使用示例

```typescript
import { useVirtualScroll } from '@/utils/performance';

const Component = () => {
  const items = Array.from({ length: 10000 }, (_, i) => i);
  const { visibleItems, offsetY, totalHeight, scrollTop, setScrollTop } = useVirtualScroll(
    items,
    50,
    400
  );

  return (
    <div style={{ height: 400, overflow: 'auto' }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item) => (
          <div key={item} style={{ position: 'absolute', top: item * 50 }}>
            项目 {item}
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

### useLazyLoad

懒加载钩子。

#### 签名

```typescript
function useLazyLoad<T>(
  loader: () => Promise<T>,
  fallback?: React.ReactNode
): {
  Component: React.ComponentType<T> | null;
  loading: boolean;
}
```

#### 使用示例

```typescript
import { useLazyLoad } from '@/utils/performance';

const Component = () => {
  const { Component: HeavyComponent, loading } = useLazyLoad(
    () => import('./HeavyComponent'),
    <div>加载中...</div>
  );

  return loading ? <div>加载中...</div> : <HeavyComponent />;
};
```

---

## 主题 API

### ThemePreset

主题预设类型。

```typescript
interface ThemePreset {
  id: string;
  name: string;
  description: string;
  tokens: DesignTokens;
}
```

### DesignTokens

设计令牌类型。

```typescript
interface DesignTokens {
  'color.background': string;
  'color.foreground': string;
  'color.primary': string;
  'color.primary-light': string;
  'color.primary-dark': string;
  'color.secondary': string;
  'color.secondary-light': string;
  'color.secondary-dark': string;
  'color.success': string;
  'color.warning': string;
  'color.error': string;
  'color.info': string;
  'color.border': string;
  'color.divider': string;
  'color.surface': string;
  'color.surface-variant': string;
  'spacing.xs': number;
  'spacing.sm': number;
  'spacing.md': number;
  'spacing.lg': number;
  'spacing.xl': number;
  'spacing.2xl': number;
  'radius.sm': number;
  'radius.md': number;
  'radius.lg': number;
  'radius.xl': number;
  'radius.full': number;
  'shadow.sm': string;
  'shadow.md': string;
  'shadow.lg': string;
  'shadow.xl': string;
}
```

### ThemeProvider

主题提供者组件。

#### 属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| children | ReactNode | - | 子组件 |
| initialTokens | Partial<DesignTokens> | {} | 初始主题令牌 |

#### 使用示例

```tsx
import { ThemeProvider } from '@/components/ThemeProvider';

<ThemeProvider initialTokens={{ 'color.primary': '#ff0000' }}>
  <App />
</ThemeProvider>
```

---

### useTheme

主题钩子。

#### 签名

```typescript
function useTheme(): {
  tokens: DesignTokens;
  setTokens: (tokens: Partial<DesignTokens>) => void;
  resetTokens: () => void;
}
```

#### 使用示例

```typescript
import { useTheme } from '@/components/ThemeProvider';

const Component = () => {
  const { tokens, setTokens, resetTokens } = useTheme();

  return (
    <div>
      <button onClick={() => setTokens({ 'color.primary': '#00ff00' })}>
        更改主题
      </button>
      <button onClick={resetTokens}>
        重置主题
      </button>
    </div>
  );
};
```

---

## 动画 API

### AnimationType

动画类型枚举。

```typescript
type AnimationType =
  | 'fadeIn'
  | 'fadeOut'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleUp'
  | 'scaleDown'
  | 'rotate'
  | 'bounce'
  | 'pulse'
  | 'shake'
  | 'flip'
  | 'zoomIn'
  | 'zoomOut';
```

### CustomAnimationConfig

自定义动画配置。

```typescript
interface CustomAnimationConfig {
  keyframes: Keyframe[];
  duration?: number;
  delay?: number;
  easing?: string;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}
```

### Keyframe

关键帧类型。

```typescript
type Keyframe = {
  [property: string]: string | number;
};
```

---

## 性能优化 API

### PerformanceMetrics

性能指标类型。

```typescript
interface PerformanceMetrics {
  fps: number;
  memory?: number;
  longTasks: number[];
  renderTime: number;
}
```

### PerformanceOptions

性能选项类型。

```typescript
interface PerformanceOptions {
  sampleInterval?: number;
  threshold?: number;
  onThresholdExceeded?: (metrics: PerformanceMetrics) => void;
}
```

### PerformanceMonitor

性能监控类。

#### 方法

- `start()` - 开始监控
- `stop()` - 停止监控
- `getMetrics()` - 获取性能指标
- `reset()` - 重置监控

#### 使用示例

```typescript
import { PerformanceMonitor } from '@/utils/performance';

const monitor = new PerformanceMonitor({
  sampleInterval: 1000,
  threshold: 50,
  onThresholdExceeded: (metrics) => {
    console.log('性能警告:', metrics);
  },
});

monitor.start();

const metrics = monitor.getMetrics();
console.log('FPS:', metrics.fps);

monitor.stop();
```

---

### batchDOMUpdates

批量 DOM 更新函数。

#### 签名

```typescript
function batchDOMUpdates<T>(
  updates: Array<() => T>
): T[]
```

#### 使用示例

```typescript
import { batchDOMUpdates } from '@/utils/performance';

batchDOMUpdates([
  () => document.getElementById('el1').textContent = '更新1',
  () => document.getElementById('el2').textContent = '更新2',
]);
```

---

### preloadImage

预加载单个图片。

#### 签名

```typescript
function preloadImage(src: string): Promise<HTMLImageElement>
```

#### 使用示例

```typescript
import { preloadImage } from '@/utils/performance';

preloadImage('/image.jpg').then((img) => {
  document.body.appendChild(img);
});
```

---

### preloadImages

预加载多个图片。

#### 签名

```typescript
function preloadImages(srcs: string[]): Promise<HTMLImageElement[]>
```

#### 使用示例

```typescript
import { preloadImages } from '@/utils/performance';

preloadImages(['/img1.jpg', '/img2.jpg']).then((images) => {
  images.forEach(img => document.body.appendChild(img));
});
```

---

## 类型定义

### AnimationType

动画类型枚举。

```typescript
type AnimationType =
  | 'fadeIn'
  | 'fadeOut'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleUp'
  | 'scaleDown'
  | 'rotate'
  | 'bounce'
  | 'pulse'
  | 'shake'
  | 'flip'
  | 'zoomIn'
  | 'zoomOut';
```

---

### PerformanceMetrics

性能指标接口。

```typescript
interface PerformanceMetrics {
  fps: number;
  memory?: number;
  longTasks: number[];
  renderTime: number;
}
```

---

### PerformanceOptions

性能选项接口。

```typescript
interface PerformanceOptions {
  sampleInterval?: number;
  threshold?: number;
  onThresholdExceeded?: (metrics: PerformanceMetrics) => void;
}
```

---

### ThemePreset

主题预设接口。

```typescript
interface ThemePreset {
  id: string;
  name: string;
  description: string;
  tokens: DesignTokens;
}
```

---

### DesignTokens

设计令牌接口。

```typescript
interface DesignTokens {
  'color.background': string;
  'color.foreground': string;
  'color.primary': string;
  'color.primary-light': string;
  'color.primary-dark': string;
  'color.secondary': string;
  'color.secondary-light': string;
  'color.secondary-dark': string;
  'color.success': string;
  'color.warning': string;
  'color.error': string;
  'color.info': string;
  'color.border': string;
  'color.divider': string;
  'color.surface': string;
  'color.surface-variant': string;
  'spacing.xs': number;
  'spacing.sm': number;
  'spacing.md': number;
  'spacing.lg': number;
  'spacing.xl': number;
  'spacing.2xl': number;
  'radius.sm': number;
  'radius.md': number;
  'radius.lg': number;
  'radius.xl': number;
  'radius.full': number;
  'shadow.sm': string;
  'shadow.md': string;
  'shadow.lg': string;
  'shadow.xl': string;
}
```

---

### CustomAnimationConfig

自定义动画配置接口。

```typescript
interface CustomAnimationConfig {
  keyframes: Keyframe[];
  duration?: number;
  delay?: number;
  easing?: string;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}
```

---

### Keyframe

关键帧接口。

```typescript
type Keyframe = {
  [property: string]: string | number;
};
```

---

## 完整示例

### 使用动画组件

```tsx
import { Animated, AnimatedEnhanced, CustomAnimation } from '@/components/Animated';

function App() {
  return (
    <div>
      <Animated animation="fadeIn" duration={500}>
        <h1>欢迎使用 YYC³ Design System</h1>
      </Animated>

      <AnimatedEnhanced animation="pulse" infinite>
        <button>脉冲按钮</button>
      </AnimatedEnhanced>

      <CustomAnimation
        keyframes={[
          { transform: 'translateX(0)' },
          { transform: 'translateX(100px)' },
          { transform: 'translateX(0)' }
        ]}
        options={{ duration: 1000, iterations: Infinity }}
      >
        <div>自定义动画元素</div>
      </CustomAnimation>
    </div>
  );
}
```

### 使用主题系统

```tsx
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';
import { ThemeEditor } from '@/components/ThemeEditor';

function App() {
  return (
    <ThemeProvider>
      <ThemeContent />
    </ThemeProvider>
  );
}

function ThemeContent() {
  const { tokens } = useTheme();

  return (
    <div style={{ color: tokens['color.foreground'], backgroundColor: tokens['color.background'] }}>
      <h1>主题示例</h1>
      <ThemeEditor showPreview />
    </div>
  );
}
```

### 使用性能优化

```tsx
import { useDebounce, useThrottle, usePerformanceMonitor } from '@/utils/performance';

function App() {
  const { getMetrics } = usePerformanceMonitor();

  const handleSearch = useDebounce((query: string) => {
    console.log('搜索:', query);
  }, 300);

  const handleScroll = useThrottle((event: Event) => {
    console.log('滚动:', event);
  }, 100);

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      <div onScroll={handleScroll} style={{ height: 400, overflow: 'auto' }}>
        <div style={{ height: 2000 }}>滚动内容</div>
      </div>
      <div>FPS: {getMetrics()?.fps}</div>
    </div>
  );
}
```

---

## 支持

如有问题或建议，请联系 YYC³ 团队。

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
