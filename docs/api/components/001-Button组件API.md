---
@file: Button 组件 API
@description: Button 组件 API 文档
@author: YanYuCloudCube Team
@version: 1.0.0
@created: 2026-02-28
@updated: 2026-02-28
@status: Active
@tags: api, components, button
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# Button 组件 API

## 概述

Button 组件提供一致的按钮样式和行为，支持多种变体、尺寸和状态。它是基于 YYC³ Design System 的设计令牌构建的，支持主题切换和响应式设计。

## 安装

```bash
npm install @yyc3/design-system
```

## 导入

```typescript
import { Button } from '@yyc3/design-system';
```

## Props

### ButtonProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive'` | `'primary'` | 按钮的视觉变体 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 按钮的尺寸 |
| `disabled` | `boolean` | `false` | 是否禁用按钮 |
| `loading` | `boolean` | `false` | 是否显示加载状态 |
| `fullWidth` | `boolean` | `false` | 按钮是否占满容器宽度 |
| `leftIcon` | `React.ReactNode` | - | 左侧图标 |
| `rightIcon` | `React.ReactNode` | - | 右侧图标 |
| `onClick` | `() => void` | - | 点击事件处理函数 |
| `children` | `React.ReactNode` | - | 按钮内容 |
| `className` | `string` | - | 自定义 CSS 类名 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 按钮的 HTML 类型 |
| `asChild` | `boolean` | `false` | 是否作为子元素渲染（使用 Radix UI Slot） |

## 示例

### 基础使用

```tsx
import { Button } from '@yyc3/design-system';

function Example() {
  return <Button>点击我</Button>;
}
```

### 变体

```tsx
function Example() {
  return (
    <div className="flex gap-4">
      <Button variant="primary">主要按钮</Button>
      <Button variant="secondary">次要按钮</Button>
      <Button variant="ghost">幽灵按钮</Button>
      <Button variant="destructive">删除</Button>
    </div>
  );
}
```

### 尺寸

```tsx
function Example() {
  return (
    <div className="flex items-center gap-4">
      <Button size="sm">小按钮</Button>
      <Button size="md">中按钮</Button>
      <Button size="lg">大按钮</Button>
    </div>
  );
}
```

### 禁用状态

```tsx
function Example() {
  return (
    <Button disabled>禁用的按钮</Button>
  );
}
```

### 加载状态

```tsx
function Example() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <Button loading onClick={handleClick}>
      {loading ? '加载中...' : '提交'}
    </Button>
  );
}
```

### 带图标

```tsx
import { Button } from '@yyc3/design-system';
import { Plus, Save, Trash2 } from 'lucide-react';

function Example() {
  return (
    <div className="flex gap-4">
      <Button leftIcon={<Plus size={16} />}>添加</Button>
      <Button rightIcon={<Save size={16} />}>保存</Button>
      <Button 
        variant="destructive"
        rightIcon={<Trash2 size={16} />}
      >
        删除
      </Button>
    </div>
  );
}
```

### 全宽按钮

```tsx
function Example() {
  return (
    <Button fullWidth>全宽按钮</Button>
  );
}
```

### 作为链接使用

```tsx
function Example() {
  return (
    <Button asChild>
      <a href="https://yyc3.com">链接按钮</a>
    </Button>
  );
}
```

### 主题感知

```tsx
function Example() {
  return (
    <Button variant="primary">
      主题感知按钮
    </Button>
  );
}
```

## 样式自定义

### 使用 className

```tsx
function Example() {
  return (
    <Button className="shadow-lg hover:shadow-xl">
      自定义样式
    </Button>
  );
}
```

### 使用 Tailwind 类

```tsx
function Example() {
  return (
    <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
      渐变按钮
    </Button>
  );
}
```

## 可访问性

### 键盘导航

- `Tab`: 焦点移到下一个可聚焦元素
- `Shift + Tab`: 焦点移到上一个可聚焦元素
- `Enter` / `Space`: 激活按钮

### ARIA 属性

组件自动处理以下 ARIA 属性：

- `aria-disabled`: 当按钮被禁用时设置为 `true`
- `aria-busy`: 当按钮处于加载状态时设置为 `true`

### 最佳实践

1. **提供清晰的标签**: 确保按钮文本清楚地描述其功能
2. **避免连续使用多个主要按钮**: 在表单中只使用一个主要操作
3. **为重要操作提供确认机制**: 对于破坏性操作，使用确认对话框
4. **使用适当的按钮变体**: 使用 `destructive` 变体表示危险操作

## 性能优化

Button 组件已使用 `React.memo` 进行优化，仅在 props 变化时重新渲染。

```typescript
export const Button = memo(function Button({ /* ... */ }) {
  // 组件实现
});
```

## 浏览器支持

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)
- 移动浏览器 (iOS Safari, Chrome Mobile)

## 相关组件

- [IconButton](./002-IconButton组件API.md)
- [ButtonGroup](./003-ButtonGroup组件API.md)
- [LoadingButton](./004-LoadingButton组件API.md)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
