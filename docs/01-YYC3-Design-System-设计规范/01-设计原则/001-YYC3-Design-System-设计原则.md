/**
 * @file 设计原则
 * @description YYC³ 设计系统设计原则，基于五高五标五化核心理念
 * @module docs/design-principles
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 * @updated 2026-02-18
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

# 设计原则

> YYC³ Design System - 设计原则
> 版本: 1.0.0
> 更新日期: 2026-02-18

---

## 目录

- [核心理念](#核心理念)
- [设计原则](#设计原则)
- [视觉层次](#视觉层次)
- [色彩系统](#色彩系统)
- [排版系统](#排版系统)
- [间距系统](#间距系统)
- [交互原则](#交互原则)

---

## 核心理念

YYC³ 设计系统基于「五高五标五化」核心理念构建：

- **五高**：高可用、高性能、高安全、高扩展、高可维护
- **五标**：标准化、规范化、自动化、智能化、可视化
- **五化**：流程化、文档化、工具化、数字化、生态化

---

## 设计原则

### 1. 清晰性 (Clarity)

设计应该清晰易懂，用户能够快速理解界面内容和功能。

#### 实践指南

- 使用简洁的语言和图标
- 避免不必要的装饰元素
- 确保文本对比度符合 WCAG AA 标准
- 使用一致的视觉语言

```tsx
// ✅ 好的设计
<Button variant="primary">提交表单</Button>

// ❌ 不好的设计
<Button variant="primary" style={{ fontSize: '0.8rem', opacity: 0.8 }}>
  请点击此处以提交您的表单数据
</Button>
```

### 2. 一致性 (Consistency)

在整个产品中保持一致的视觉和交互模式。

#### 实践指南

- 使用统一的设计令牌
- 遵循相同的交互模式
- 保持组件行为的一致性
- 使用标准化的命名约定

```tsx
// ✅ 好的设计 - 使用设计令牌
const buttonStyle = {
  padding: tokens.spacing.md,
  borderRadius: tokens.radius.md,
  backgroundColor: tokens.color.primary,
};

// ❌ 不好的设计 - 硬编码值
const buttonStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '0.25rem',
  backgroundColor: '#d45a5f',
};
```

### 3. 效率性 (Efficiency)

设计应该帮助用户高效地完成任务。

#### 实践指南

- 减少用户操作步骤
- 提供智能默认值
- 支持键盘快捷键
- 优化加载和响应时间

```tsx
// ✅ 好的设计 - 支持键盘操作
<Input
  type="email"
  placeholder="请输入邮箱"
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }}
/>

// ❌ 不好的设计 - 只支持鼠标操作
<Input type="email" placeholder="请输入邮箱" />
<Button onClick={handleSubmit}>提交</Button>
```

### 4. 可访问性 (Accessibility)

确保所有用户，包括有障碍的用户，都能使用产品。

#### 实践指南

- 遵循 WCAG 2.1 AA 标准
- 提供适当的 ARIA 属性
- 支持键盘导航
- 确保颜色对比度符合标准

```tsx
// ✅ 好的设计 - 完整的可访问性支持
<Button
  variant="primary"
  aria-label="提交表单"
  disabled={isSubmitting}
>
  {isSubmitting ? '提交中...' : '提交'}
</Button>

// ❌ 不好的设计 - 缺少可访问性支持
<Button variant="primary">提交</Button>
```

### 5. 可扩展性 (Scalability)

设计应该能够适应未来的需求和变化。

#### 实践指南

- 使用模块化的组件设计
- 避免过度耦合
- 支持主题定制
- 提供灵活的 API

```tsx
// ✅ 好的设计 - 可扩展的组件
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ❌ 不好的设计 - 不易扩展
interface ButtonProps {
  variant?: string;
  size?: string;
  hasIcon?: boolean;
}
```

---

## 视觉层次

### 层级结构

使用大小、颜色、间距和对比度来建立清晰的视觉层次。

```
H1 - 标题 (32px, 粗体, 主色)
  └─ H2 - 副标题 (24px, 半粗体, 次要色)
      └─ H3 - 小标题 (20px, 中等, 中性色)
          └─ Body - 正文 (16px, 常规, 文本色)
              └─ Caption - 说明 (14px, 细体, 弱化色)
```

### 使用指南

```tsx
// 标题层级
<h1>主标题 - 32px</h1>
<h2>副标题 - 24px</h2>
<h3>小标题 - 20px</h3>
<p>正文 - 16px</p>
<small>说明文字 - 14px</small>

// 使用设计令牌
const typography = tokens.typography;
<h1 style={{ fontSize: typography['font-size-4xl'] }}>主标题</h1>
<p style={{ fontSize: typography['font-size-base'] }}>正文</p>
```

---

## 色彩系统

### 色彩原则

1. **功能性**：颜色应该传达明确的意义
2. **对比度**：确保足够的对比度以提高可读性
3. **一致性**：在整个产品中保持一致的颜色使用
4. **可访问性**：遵循 WCAG 颜色对比度标准

### 色彩使用

```tsx
// 主色 - 用于主要操作和强调
<Button variant="primary">主要操作</Button>

// 次要色 - 用于次要操作
<Button variant="secondary">次要操作</Button>

// 危险色 - 用于破坏性操作
<Button variant="destructive">删除</Button>

// 中性色 - 用于文本和背景
<p style={{ color: tokens.color.foreground }}>正文文本</p>
<div style={{ backgroundColor: tokens.color.background }}>背景</div>
```

### 对比度要求

- **正常文本**：至少 4.5:1 (AA 级别)
- **大文本**：至少 3:1 (AA 级别)
- **图形元素**：至少 3:1 (AA 级别)

---

## 排版系统

### 字体选择

```typescript
const typography = {
  'font-sans': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'font-serif': 'Georgia, Cambria, "Times New Roman", Times, serif',
  'font-mono': 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
};
```

### 字体大小

```typescript
const fontSize = {
  xs: '0.75rem',   // 12px
  sm: '0.875rem',  // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',  // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
};
```

### 行高

```typescript
const lineHeight = {
  none: '1',
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
  loose: '2',
};
```

---

## 间距系统

### 间距原则

1. **一致性**：使用统一的间距单位
2. **节奏感**：建立清晰的视觉节奏
3. **呼吸感**：留出足够的空白空间
4. **对齐**：保持元素的对齐和平衡

### 间距单位

```typescript
const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
};
```

### 使用示例

```tsx
// 组件内部间距
const cardStyle = {
  padding: spacing[6],  // 24px
  gap: spacing[4],      // 16px
};

// 元素之间的间距
<div style={{ marginBottom: spacing[4] }}>
  <Button>按钮1</Button>
</div>
<div style={{ marginBottom: spacing[4] }}>
  <Button>按钮2</Button>
</div>
```

---

## 交互原则

### 反馈

为用户的每个操作提供及时、清晰的反馈。

```tsx
// ✅ 好的设计 - 提供加载状态
<Button disabled={isLoading} onClick={handleSubmit}>
  {isLoading ? <Spinner /> : '提交'}
</Button>

// ✅ 好的设计 - 提供成功/错误反馈
<Alert variant={error ? 'destructive' : 'success'}>
  {error ? '操作失败，请重试' : '操作成功'}
</Alert>
```

### 控制

让用户感觉对界面有完全的控制权。

```tsx
// ✅ 好的设计 - 提供取消选项
<Dialog>
  <DialogContent>
    <h2>确认删除</h2>
    <p>此操作无法撤销，确定要删除吗？</p>
    <DialogActions>
      <Button variant="outline" onClick={handleCancel}>取消</Button>
      <Button variant="destructive" onClick={handleConfirm}>删除</Button>
    </DialogActions>
  </DialogContent>
</Dialog>
```

### 容错

预防错误，并提供清晰的错误恢复路径。

```tsx
// ✅ 好的设计 - 表单验证
<Input
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  helperText={emailError ? '请输入有效的邮箱地址' : 'example@domain.com'}
/>

// ✅ 好的设计 - 错误边界
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

### 效率

减少用户完成任务所需的步骤和时间。

```tsx
// ✅ 好的设计 - 智能默认值
<Input
  type="date"
  defaultValue={new Date().toISOString().split('T')[0]}
/>

// ✅ 好的设计 - 自动完成
<Input
  type="text"
  placeholder="搜索..."
  suggestions={searchSuggestions}
  onSuggestionSelect={handleSelect}
/>
```

---

## 最佳实践

### 1. 使用设计令牌

```tsx
// ✅ 好的设计
const style = {
  padding: tokens.spacing[4],
  borderRadius: tokens.radius.md,
  backgroundColor: tokens.color.primary,
};

// ❌ 不好的设计
const style = {
  padding: '1rem',
  borderRadius: '0.25rem',
  backgroundColor: '#d45a5f',
};
```

### 2. 保持组件简单

```tsx
// ✅ 好的设计 - 单一职责
const Button = ({ variant, size, children, onClick }) => {
  return <button className={`btn-${variant} btn-${size}`} onClick={onClick}>
    {children}
  </button>;
};

// ❌ 不好的设计 - 职责过多
const Button = ({ variant, size, children, onClick, isLoading, hasIcon, ... }) => {
  return (
    <div className="button-container">
      {isLoading && <Spinner />}
      {hasIcon && <Icon />}
      <button onClick={onClick}>{children}</button>
    </div>
  );
};
```

### 3. 支持主题定制

```tsx
// ✅ 好的设计 - 支持主题
const { tokens } = useTheme();
const style = {
  backgroundColor: tokens.color.primary,
};

// ❌ 不好的设计 - 硬编码颜色
const style = {
  backgroundColor: '#d45a5f',
};
```

### 4. 提供可访问性支持

```tsx
// ✅ 好的设计 - 完整的可访问性
<button
  aria-label="关闭对话框"
  aria-pressed={isPressed}
  disabled={isDisabled}
  onClick={handleClick}
>
  <CloseIcon />
</button>

// ❌ 不好的设计 - 缺少可访问性
<button onClick={handleClick}>
  <CloseIcon />
</button>
```

---

**文档版本**: 1.0.0  
**最后更新**: 2026-02-18  
**维护者**: YYC³ Team
