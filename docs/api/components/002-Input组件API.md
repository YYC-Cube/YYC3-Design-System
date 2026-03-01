---
@file: Input 组件 API
@description: Input 组件 API 文档
@author: YanYuCloudCube Team
@version: 1.0.0
@created: 2026-02-28
@updated: 2026-02-28
@status: Active
@tags: api, components, input
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# Input 组件 API

## 概述

Input 组件提供一致的输入框样式和行为，支持多种类型、尺寸和状态。它基于 YYC³ Design System 的设计令牌构建，支持主题切换和响应式设计。

## 安装

```bash
npm install @yyc3/design-system
```

## 导入

```typescript
import { Input } from '@yyc3/design-system';
```

## Props

### InputProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|------|
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'` | 输入框的类型 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 输入框的尺寸 |
| `variant` | `'default' \| 'filled' \| 'outlined'` | `'default'` | 输入框的视觉变体 |
| `placeholder` | `string` | - | 占位符文本 |
| `value` | `string \| number` | - | 输入框的值（受控） |
| `defaultValue` | `string \| number` | - | 输入框的默认值（非受控） |
| `disabled` | `boolean` | `false` | 是否禁用输入框 |
| `required` | `boolean` | `false` | 是否为必填项 |
| `error` | `boolean` | `false` | 是否显示错误状态 |
| `helperText` | `string` | - | 辅助文本 |
| `label` | `string` | - | 标签文本 |
| `leftIcon` | `React.ReactNode` | - | 左侧图标 |
| `rightIcon` | `React.ReactNode` | - | 右侧图标 |
| `fullWidth` | `boolean` | `false` | 输入框是否占满容器宽度 |
| `onChange` | `(value: string) => void` | - | 值变化时的回调函数 |
| `onBlur` | `(e: FocusEvent) => void` | - | 失去焦点时的回调函数 |
| `onFocus` | `(e: FocusEvent) => void` | - | 获得焦点时的回调函数 |
| `className` | `string` | - | 自定义 CSS 类名 |
| `id` | `string` | - | 输入框的 ID |
| `name` | `string` | - | 输入框的名称 |
| `autoComplete` | `string` | - | 自动完成属性 |
| `maxLength` | `number` | - | 最大字符长度 |
| `min` | `number` | - | 最小值（type="number" 时） |
| `max` | `number` | - | 最大值（type="number" 时） |
| `step` | `number` | - | 步长（type="number" 时） |

## 示例

### 基础使用

```tsx
import { Input } from '@yyc3/design-system';

function Example() {
  return <Input placeholder="请输入内容" />;
}
```

### 受控组件

```tsx
function Example() {
  const [value, setValue] = useState('');

  return (
    <Input
      value={value}
      onChange={setValue}
      placeholder="受控输入框"
    />
  );
}
```

### 带标签

```tsx
function Example() {
  return <Input label="用户名" placeholder="请输入用户名" />;
}
```

### 带图标

```tsx
import { Input } from '@yyc3/design-system';
import { Search, Mail, Lock, Eye, EyeOff } from 'lucide-react';

function Example() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <Input
        leftIcon={<Search size={16} />}
        placeholder="搜索..."
      />
      <Input
        leftIcon={<Mail size={16} />}
        placeholder="邮箱"
        type="email"
      />
      <Input
        leftIcon={<Lock size={16} />}
        rightIcon={
          showPassword ? (
            <EyeOff size={16} onClick={() => setShowPassword(!showPassword)} />
          ) : (
            <Eye size={16} onClick={() => setShowPassword(!showPassword)} />
          )
        }
        type={showPassword ? 'text' : 'password'}
        placeholder="密码"
      />
    </div>
  );
}
```

### 错误状态

```tsx
function Example() {
  return (
    <Input
      label="邮箱"
      placeholder="example@yyc3.com"
      error
      helperText="请输入有效的邮箱地址"
    />
  );
}
```

### 尺寸变体

```tsx
function Example() {
  return (
    <div className="space-y-4">
      <Input size="sm" placeholder="小尺寸" />
      <Input size="md" placeholder="中尺寸" />
      <Input size="lg" placeholder="大尺寸" />
    </div>
  );
}
```

### 视觉变体

```tsx
function Example() {
  return (
    <div className="space-y-4">
      <Input variant="default" placeholder="默认变体" />
      <Input variant="filled" placeholder="填充变体" />
      <Input variant="outlined" placeholder="轮廓变体" />
    </div>
  );
}
```

### 数字输入

```tsx
function Example() {
  return (
    <Input
      type="number"
      label="数量"
      min={0}
      max={100}
      step={1}
      placeholder="0-100"
    />
  );
}
```

### 全宽输入框

```tsx
function Example() {
  return <Input fullWidth placeholder="全宽输入框" />;
}
```

### 表单集成

```tsx
function Example() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('表单提交');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="username"
        label="用户名"
        required
        placeholder="请输入用户名"
      />
      <Input
        name="email"
        label="邮箱"
        type="email"
        required
        placeholder="example@yyc3.com"
      />
      <Input
        name="password"
        label="密码"
        type="password"
        required
        minLength={8}
        placeholder="至少 8 位字符"
      />
      <button type="submit">提交</button>
    </form>
  );
}
```

## 样式自定义

### 使用 className

```tsx
function Example() {
  return (
    <Input className="shadow-lg focus:shadow-xl" />
  );
}
```

### 使用 Tailwind 类

```tsx
function Example() {
  return (
    <Input className="bg-gradient-to-r from-gray-50 to-gray-100" />
  );
}
```

## 验证

### 基础验证

```tsx
function Example() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError('请输入有效的邮箱地址');
    } else {
      setError('');
    }
  };

  return (
    <Input
      label="邮箱"
      type="email"
      value={email}
      onChange={setEmail}
      error={!!error}
      helperText={error}
      placeholder="example@yyc3.com"
    />
  );
}
```

## 可访问性

### 键盘导航

- `Tab`: 焦点移到下一个可聚焦元素
- `Shift + Tab`: 焦点移到上一个可聚焦元素

### ARIA 属性

组件自动处理以下 ARIA 属性：

- `aria-invalid`: 当输入框有错误时设置为 `true`
- `aria-required`: 当输入框为必填时设置为 `true`
- `aria-describedby`: 关联辅助文本

### 最佳实践

1. **提供清晰的标签**: 始终为输入框提供标签
2. **使用适当的输入类型**: 使用语义化的 `type` 属性
3. **提供辅助文本**: 为复杂输入框提供说明
4. **即时验证反馈**: 在用户输入时提供验证反馈
5. **错误信息具体化**: 提供清晰的错误信息说明如何修正

## 性能优化

Input 组件已使用 `React.memo` 进行优化，仅在 props 变化时重新渲染。

```typescript
export const Input = memo(function Input({ /* ... */ }) {
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

- [Textarea](./003-Textarea组件API.md)
- [Select](./004-Select组件API.md)
- [Checkbox](./005-Checkbox组件API.md)
- [Radio](./006-Radio组件API.md)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
