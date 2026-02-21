/**
 * @file 组件使用指南
 * @description YYC³ 设计系统组件使用指南，提供React、Vue、Svelte组件的使用示例
 * @module docs/component-usage
 * @author YYC³
 * @version 1.3.0
 * @created 2026-02-18
 * @updated 2026-02-18
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

# 组件使用指南

> YYC³ Design System - 组件使用指南
> 版本: 1.3.0
> 更新日期: 2026-02-18

---

## 目录

- [快速开始](#快速开始)
- [React 组件](#react-组件)
- [Vue 组件](#vue-组件)
- [Svelte 组件](#svelte-组件)
- [主题系统](#主题系统)
- [最佳实践](#最佳实践)

---

## 快速开始

### 安装

```bash
npm install yyc3-design-system
```

### React 示例

```tsx
import { Button, Card, Input } from 'yyc3-design-system';
import { ThemeProvider } from 'yyc3-design-system/theme';

function App() {
  return (
    <ThemeProvider>
      <Card>
        <h1>欢迎使用 YYC³ Design System</h1>
        <Input placeholder="请输入内容" />
        <Button variant="primary">提交</Button>
      </Card>
    </ThemeProvider>
  );
}
```

### Vue 示例

```vue
<template>
  <ThemeProvider>
    <Card>
      <h1>欢迎使用 YYC³ Design System</h1>
      <Input v-model="inputValue" placeholder="请输入内容" />
      <Button variant="primary" @click="handleSubmit">提交</Button>
    </Card>
  </ThemeProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button, Card, Input } from 'yyc3-design-system/vue';
import { ThemeProvider } from 'yyc3-design-system/vue';

const inputValue = ref('');

const handleSubmit = () => {
  console.log('提交:', inputValue.value);
};
</script>
```

### Svelte 示例

```svelte
<script lang="ts">
  import { Button, Card, Input } from 'yyc3-design-system/svelte';
  import { ThemeProvider } from 'yyc3-design-system/svelte';

  let inputValue = '';

  const handleSubmit = () => {
    console.log('提交:', inputValue);
  };
</script>

<ThemeProvider>
  <Card>
    <h1>欢迎使用 YYC³ Design System</h1>
    <Input bind:value={inputValue} placeholder="请输入内容" />
    <Button variant="primary" on:click={handleSubmit}>提交</Button>
  </Card>
</ThemeProvider>
```

---

## React 组件

### Button

按钮组件，支持多种变体和尺寸。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| variant | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | 按钮变体 |
| size | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | 按钮尺寸 |
| disabled | `boolean` | `false` | 是否禁用 |
| onClick | `(event: MouseEvent) => void` | - | 点击事件处理 |
| children | `ReactNode` | - | 按钮内容 |

#### 示例

```tsx
import { Button } from 'yyc3-design-system';

<Button variant="default">默认按钮</Button>
<Button variant="destructive">危险按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="link">链接按钮</Button>

<Button size="sm">小按钮</Button>
<Button size="default">默认按钮</Button>
<Button size="lg">大按钮</Button>

<Button disabled>禁用按钮</Button>
```

### Input

输入框组件，支持多种输入类型。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| type | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url'` | `'text'` | 输入类型 |
| placeholder | `string` | `''` | 占位文本 |
| disabled | `boolean` | `false` | 是否禁用 |
| value | `string` | - | 输入值 |
| onChange | `(value: string) => void` | - | 值变化处理 |

#### 示例

```tsx
import { Input } from 'yyc3-design-system';

<Input type="text" placeholder="请输入文本" />
<Input type="email" placeholder="请输入邮箱" />
<Input type="password" placeholder="请输入密码" />
<Input type="number" placeholder="请输入数字" />
<Input disabled placeholder="禁用输入框" />
```

### Card

卡片组件，用于内容分组和展示。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| children | `ReactNode` | - | 卡片内容 |

#### 示例

```tsx
import { Card, CardHeader, CardTitle, CardContent } from 'yyc3-design-system';

<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
  </CardHeader>
  <CardContent>
    <p>这是卡片内容</p>
  </CardContent>
</Card>
```

### Badge

徽章组件，用于显示状态或标签。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| variant | `'default' \| 'secondary' \| 'destructive' \| 'outline'` | `'default'` | 徽章变体 |
| children | `ReactNode` | - | 徽章内容 |

#### 示例

```tsx
import { Badge } from 'yyc3-design-system';

<Badge variant="default">默认徽章</Badge>
<Badge variant="secondary">次要徽章</Badge>
<Badge variant="destructive">危险徽章</Badge>
<Badge variant="outline">轮廓徽章</Badge>
```

### Avatar

头像组件，用于显示用户头像或占位符。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| src | `string` | - | 头像图片URL |
| alt | `string` | `''` | 替代文本 |
| size | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 头像尺寸 |
| fallback | `string` | - | 占位文本 |

#### 示例

```tsx
import { Avatar } from 'yyc3-design-system';

<Avatar src="/avatar.jpg" alt="用户头像" size="sm" />
<Avatar src="/avatar.jpg" alt="用户头像" size="md" />
<Avatar src="/avatar.jpg" alt="用户头像" size="lg" />
<Avatar src="/avatar.jpg" alt="用户头像" size="xl" />
<Avatar fallback="YY" size="md" />
```

### ThemeToggle

主题切换组件，用于在浅色和深色主题之间切换。

#### Props

无

#### 示例

```tsx
import { ThemeToggle } from 'yyc3-design-system';

<ThemeToggle />
```

---

## Vue 组件

### Button

Vue 版本的按钮组件，API 与 React 版本一致。

#### Props

```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}
```

#### Events

```typescript
{
  click: (event: MouseEvent) => void;
}
```

#### 示例

```vue
<template>
  <Button variant="default" @click="handleClick">默认按钮</Button>
  <Button variant="destructive">危险按钮</Button>
  <Button size="lg">大按钮</Button>
  <Button disabled>禁用按钮</Button>
</template>

<script setup lang="ts">
import { Button } from 'yyc3-design-system/vue';

const handleClick = (event: MouseEvent) => {
  console.log('按钮被点击', event);
};
</script>
```

### Input

Vue 版本的输入框组件。

#### Props

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  modelValue?: string;
}
```

#### Events

```typescript
{
  'update:modelValue': (value: string) => void;
}
```

#### 示例

```vue
<template>
  <Input v-model="inputValue" type="text" placeholder="请输入内容" />
  <Input v-model="emailValue" type="email" placeholder="请输入邮箱" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Input } from 'yyc3-design-system/vue';

const inputValue = ref('');
const emailValue = ref('');
</script>
```

---

## Svelte 组件

### Button

Svelte 版本的按钮组件。

#### Props

```typescript
export let variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'default';
export let size: 'default' | 'sm' | 'lg' | 'icon' = 'default';
export let disabled: boolean = false;
```

#### Events

```typescript
onclick: (event: MouseEvent) => void;
```

#### 示例

```svelte
<script lang="ts">
  import { Button } from 'yyc3-design-system/svelte';

  const handleClick = (event: MouseEvent) => {
    console.log('按钮被点击', event);
  };
</script>

<Button variant="default" on:click={handleClick}>默认按钮</Button>
<Button variant="destructive">危险按钮</Button>
<Button size="lg">大按钮</Button>
<Button disabled>禁用按钮</Button>
```

### Input

Svelte 版本的输入框组件。

#### Props

```typescript
export let type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
export let placeholder: string = '';
export let disabled: boolean = false;
export let value: string = '';
```

#### Events

```typescript
oninput: (event: Event) => void;
```

#### 示例

```svelte
<script lang="ts">
  import { Input } from 'yyc3-design-system/svelte';

  let inputValue = '';
  let emailValue = '';
</script>

<Input bind:value={inputValue} type="text" placeholder="请输入内容" />
<Input bind:value={emailValue} type="email" placeholder="请输入邮箱" />
```

---

## 主题系统

### 使用 ThemeProvider

所有组件必须在 ThemeProvider 内部使用才能正确应用主题。

#### React

```tsx
import { ThemeProvider } from 'yyc3-design-system/theme';

<ThemeProvider initial="light">
  <App />
</ThemeProvider>
```

#### Vue

```vue
<template>
  <ThemeProvider initial="light">
    <App />
  </ThemeProvider>
</template>

<script setup lang="ts">
import { ThemeProvider } from 'yyc3-design-system/vue';
</script>
```

#### Svelte

```svelte
<script lang="ts">
  import { ThemeProvider } from 'yyc3-design-system/svelte';
</script>

<ThemeProvider initial="light">
  <App />
</ThemeProvider>
```

### 主题切换

使用 ThemeToggle 组件或 useTheme hook 进行主题切换。

#### React

```tsx
import { useTheme } from 'yyc3-design-system/theme';

function MyComponent() {
  const { mode, setMode } = useTheme();

  return (
    <div>
      <p>当前主题: {mode}</p>
      <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </div>
  );
}
```

#### Vue

```vue
<template>
  <div>
    <p>当前主题: {{ mode }}</p>
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from 'yyc3-design-system/vue';

const { mode, setMode } = useTheme();

const toggleTheme = () => {
  setMode(mode.value === 'light' ? 'dark' : 'light');
};
</script>
```

---

## 最佳实践

### 1. 组件组合

优先使用组件组合而非复杂的 props。

```tsx
<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="输入内容" />
    <Button>提交</Button>
  </CardContent>
</Card>
```

### 2. 语义化 HTML

使用语义化的 HTML 标签。

```tsx
<Button as="a" href="/link">链接按钮</Button>
```

### 3. 可访问性

确保所有交互元素都有适当的 ARIA 属性。

```tsx
<Button aria-label="关闭对话框" onClick={handleClose}>
  <CloseIcon />
</Button>
```

### 4. 性能优化

对于大型列表，使用虚拟滚动或分页。

```tsx
import { useVirtual } from 'react-virtual';

const virtualRow = useVirtual({
  size: items.length,
  parentRef,
});
```

### 5. 错误处理

为表单输入添加适当的错误处理。

```tsx
<Input
  value={value}
  onChange={handleChange}
  error={error}
  helperText={error ? '请输入有效的值' : ''}
/>
```

---

## 获取帮助

- 查看 [Storybook](http://localhost:6006) 了解更多组件示例
- 查看 [API 文档](./API.md) 了解详细的 API 说明
- 提交 [Issue](https://github.com/yyc3/yyc3-design-system/issues) 报告问题

---

**文档版本**: 1.3.0  
**最后更新**: 2026-02-18  
**维护者**: YYC³ Team
