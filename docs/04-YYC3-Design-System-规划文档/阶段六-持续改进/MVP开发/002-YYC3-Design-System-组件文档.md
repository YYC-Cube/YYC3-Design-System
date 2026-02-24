# YYC³ Design System - 组件文档

> 文档版本：1.0.0
> 最后更新：2026-02-22
> 维护者：YYC³ Team

---

## 概述

YYC³ Design System 提供了一套完整的 UI 组件库，帮助开发者快速构建一致、美观的用户界面。

### 特性

- 🎨 **主题化**: 支持亮色和暗色主题
- 📱 **响应式**: 适配各种设备尺寸
- ♿ **可访问性**: 遵循 WCAG 2.1 标准
- 🎯 **类型安全**: 完整的 TypeScript 类型定义
- 🚀 **性能优化**: 轻量级、高性能

---

## Button 组件

### 概述

Button 组件是一个基础按钮组件，支持多种样式和状态。

### API

#### ButtonProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|------|
| variant | 'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link' | 'default' | 按钮样式变体 |
| size | 'default' \| 'sm' \| 'lg' \| 'icon' | 'default' | 按钮尺寸 |
| disabled | boolean | false | 是否禁用 |
| type | 'button' \| 'submit' \| 'reset' | 'button' | 按钮类型 |
| onClick | () => void | - | 点击事件处理函数 |
| children | ReactNode | - | 按钮内容 |
| className | string | '' | 自定义类名 |
| 'data-testid' | string | - | 测试 ID |
| 'aria-label' | string | - | 无障碍标签 |

### 使用示例

#### 基础用法

```tsx
import { Button } from '@yyc3/design-system';

export default function Example() {
  return (
    <Button>点击我</Button>
  );
}
```

#### 不同变体

```tsx
import { Button } from '@yyc3/design-system';

export default function Example() {
  return (
    <div className="flex gap-4">
      <Button variant="default">默认</Button>
      <Button variant="destructive">危险</Button>
      <Button variant="outline">轮廓</Button>
      <Button variant="secondary">次要</Button>
      <Button variant="ghost">幽灵</Button>
      <Button variant="link">链接</Button>
    </div>
  );
}
```

#### 不同尺寸

```tsx
import { Button } from '@yyc3/design-system';

export default function Example() {
  return (
    <div className="flex gap-4 items-center">
      <Button size="sm">小</Button>
      <Button size="default">默认</Button>
      <Button size="lg">大</Button>
    </div>
  );
}
```

#### 禁用状态

```tsx
import { Button } from '@yyc3/design-system';

export default function Example() {
  return (
    <Button disabled>禁用按钮</Button>
  );
}
```

#### 提交表单

```tsx
import { Button } from '@yyc3/design-system';

export default function Example() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('表单提交');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit">提交</Button>
    </form>
  );
}
```

### 最佳实践

1. **使用语义化的按钮类型**
   - 表单提交使用 `type="submit"`
   - 重置表单使用 `type="reset"`
   - 普通按钮使用 `type="button"`

2. **提供清晰的标签**
   - 使用 `aria-label` 为图标按钮提供描述
   - 按钮文本应该简洁明了

3. **合理使用变体**
   - 主要操作使用 `variant="default"`
   - 危险操作使用 `variant="destructive"`
   - 次要操作使用 `variant="secondary"`

---

## Input 组件

### 概述

Input 组件是一个基础输入框组件，支持多种输入类型和验证。

### API

#### InputProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|------|
| type | 'text' \| 'email' \| 'password' \| 'number' | 'text' | 输入类型 |
| label | string | - | 输入框标签 |
| placeholder | string | '' | 占位符文本 |
| disabled | boolean | false | 是否禁用 |
| value | string | - | 输入值 |
| onChange | (value: string) => void | - | 值变化回调 |
| required | boolean | false | 是否必填 |
| name | string | - | 表单字段名称 |
| className | string | '' | 自定义类名 |
| 'data-testid' | string | - | 测试 ID |

### 使用示例

#### 基础用法

```tsx
import { Input } from '@yyc3/design-system';

export default function Example() {
  const [value, setValue] = useState('');

  return (
    <Input
      label="用户名"
      placeholder="请输入用户名"
      value={value}
      onChange={setValue}
    />
  );
}
```

#### 不同类型

```tsx
import { Input } from '@yyc3/design-system';

export default function Example() {
  return (
    <div className="space-y-4">
      <Input type="text" label="文本" placeholder="请输入文本" />
      <Input type="email" label="邮箱" placeholder="请输入邮箱" />
      <Input type="password" label="密码" placeholder="请输入密码" />
      <Input type="number" label="年龄" placeholder="请输入年龄" />
    </div>
  );
}
```

#### 必填验证

```tsx
import { Input } from '@yyc3/design-system';

export default function Example() {
  return (
    <Input
      label="邮箱"
      type="email"
      placeholder="请输入邮箱"
      required
    />
  );
}
```

#### 禁用状态

```tsx
import { Input } from '@yyc3/design-system';

export default function Example() {
  return (
    <Input
      label="用户名"
      placeholder="请输入用户名"
      disabled
    />
  );
}
```

### 最佳实践

1. **提供清晰的标签**
   - 使用 `label` 属性提供输入框的描述
   - 标签应该简洁明了

2. **使用合适的输入类型**
   - 邮箱使用 `type="email"`
   - 密码使用 `type="password"`
   - 数字使用 `type="number"`

3. **提供占位符**
   - 使用 `placeholder` 提供输入示例
   - 占位符应该简洁明了

4. **实现验证**
   - 使用 `required` 标记必填字段
   - 在 `onChange` 中实现自定义验证

---

## Card 组件

### 概述

Card 组件用于内容分组和展示，支持标题、内容和页脚。

### API

#### CardProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|------|
| children | ReactNode | - | 卡片内容 |
| className | string | '' | 自定义类名 |
| 'data-testid' | string | - | 测试 ID |

#### CardHeaderProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|------|
| children | ReactNode | - | 标题内容 |
| className | string | '' | 自定义类名 |

#### CardTitleProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|------|
| children | ReactNode | - | 标题文本 |
| className | string | '' | 自定义类名 |

#### CardContentProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|------|
| children | ReactNode | - | 内容 |
| className | string | '' | 自定义类名 |

#### CardFooterProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|------|
| children | ReactNode | - | 页脚内容 |
| className | string | '' | 自定义类名 |

### 使用示例

#### 基础用法

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@yyc3/design-system';

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>卡片标题</CardTitle>
      </CardHeader>
      <CardContent>
        <p>这是卡片的内容区域。</p>
      </CardContent>
    </Card>
  );
}
```

#### 带页脚

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@yyc3/design-system';

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>卡片标题</CardTitle>
      </CardHeader>
      <CardContent>
        <p>这是卡片的内容区域。</p>
      </CardContent>
      <CardFooter>
        <Button>确认</Button>
      </CardFooter>
    </Card>
  );
}
```

#### 多个卡片

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@yyc3/design-system';

export default function Example() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>卡片 1</CardTitle>
        </CardHeader>
        <CardContent>
          <p>这是第一个卡片。</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>卡片 2</CardTitle>
        </CardHeader>
        <CardContent>
          <p>这是第二个卡片。</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>卡片 3</CardTitle>
        </CardHeader>
        <CardContent>
          <p>这是第三个卡片。</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 最佳实践

1. **合理使用卡片**
   - 将相关内容分组到同一个卡片中
   - 避免卡片嵌套过深

2. **提供清晰的标题**
   - 使用 `CardTitle` 提供卡片标题
   - 标题应该简洁明了

3. **使用页脚放置操作**
   - 使用 `CardFooter` 放置操作按钮
   - 主要操作放在右侧

---

## Modal 组件

### 概述

Modal 组件是一个模态框组件，用于弹出对话框。

### API

#### ModalProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|------|
| isOpen | boolean | false | 是否打开 |
| onClose | () => void | - | 关闭回调 |
| children | ReactNode | - | 模态框内容 |
| className | string | '' | 自定义类名 |

### 使用示例

#### 基础用法

```tsx
import { useState } from 'react';
import { Modal, Button } from '@yyc3/design-system';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>打开模态框</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>模态框标题</h2>
        <p>这是模态框的内容。</p>
        <Button onClick={() => setIsOpen(false)}>关闭</Button>
      </Modal>
    </div>
  );
}
```

#### 带标题和内容

```tsx
import { useState } from 'react';
import { Modal, Button, Card } from '@yyc3/design-system';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>打开模态框</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Card>
          <h2>模态框标题</h2>
          <p>这是模态框的内容。</p>
          <Button onClick={() => setIsOpen(false)}>关闭</Button>
        </Card>
      </Modal>
    </div>
  );
}
```

#### 确认对话框

```tsx
import { useState } from 'react';
import { Modal, Button, Card } from '@yyc3/design-system';

export default function Example() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    console.log('确认操作');
    setIsOpen(false);
  };

  return (
    <div>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        删除
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Card>
          <h2>确认删除</h2>
          <p>确定要删除此项目吗？此操作不可恢复。</p>
          <div className="flex gap-4 justify-end">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              确认删除
            </Button>
          </div>
        </Card>
      </Modal>
    </div>
  );
}
```

### 最佳实践

1. **提供关闭方式**
   - 使用 ESC 键关闭
   - 点击遮罩关闭
   - 提供关闭按钮

2. **限制模态框内容**
   - 模态框内容应该简洁明了
   - 避免在模态框中放置过多内容

3. **使用语义化标记**
   - 使用 `role="dialog"` 标记模态框
   - 使用 `aria-modal="true"` 标记模态状态

---

## 主题系统

### 概述

YYC³ Design System 提供了完整的主题系统，支持亮色和暗色主题。

### API

#### ThemeProvider

| 属性 | 类型 | 默认值 | 描述 |
|------|------|---------|------|
| children | ReactNode | - | 子组件 |
| initial | 'light' \| 'dark' | - | 初始主题 |

#### useTheme

返回值类型：

| 属性 | 类型 | 描述 |
|------|------|------|
| tokens | DesignTokens | 当前主题令牌 |
| setTokens | (tokens: Partial<DesignTokens>) => void | 设置主题令牌 |
| mode | 'light' \| 'dark' | 当前主题模式 |
| setMode | (mode: 'light' \| 'dark') => void | 设置主题模式 |

### 使用示例

#### 使用主题提供者

```tsx
import { ThemeProvider } from '@yyc3/design-system';

export default function App() {
  return (
    <ThemeProvider initial="light">
      {/* 应用内容 */}
    </ThemeProvider>
  );
}
```

#### 使用主题 Hook

```tsx
import { useTheme } from '@yyc3/design-system';

export default function Example() {
  const { tokens, mode, setMode } = useTheme();

  return (
    <div>
      <p>当前主题：{mode}</p>
      <Button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
        切换主题
      </Button>
    </div>
  );
}
```

#### 使用主题令牌

```tsx
import { useTheme } from '@yyc3/design-system';

export default function Example() {
  const { tokens } = useTheme();

  return (
    <div style={{ color: tokens['color.primary'] }}>
      使用主题颜色
    </div>
  );
}
```

### 最佳实践

1. **使用主题令牌**
   - 使用 `tokens` 对象访问主题令牌
   - 避免硬编码颜色值

2. **提供主题切换**
   - 提供主题切换按钮
   - 保存用户的主题偏好

3. **支持系统主题**
   - 检测系统主题偏好
   - 自动切换到系统主题

---

## 常见问题

### Q: 如何自定义组件样式？

A: 可以通过 `className` 属性添加自定义类名，或使用内联样式。

### Q: 如何实现表单验证？

A: 在 `onChange` 回调中实现自定义验证逻辑，或使用表单库。

### Q: 如何实现响应式布局？

A: 使用 Tailwind CSS 的响应式类名，或使用 Grid 和 Container 组件。

### Q: 如何实现国际化？

A: 使用 i18n 库（如 react-i18next）实现多语言支持。

---

## 贡献指南

欢迎贡献代码和文档！请查看 [贡献指南](../../README.md) 了解更多信息。

---

**文档维护者**: YYC³ Team
**最后更新**: 2026-02-22
**版本**: 1.0.0
