/**
 * @file 品牌指南
 * @description YYC³ 设计系统品牌指南，包含品牌标识、色彩系统、排版系统等
 * @module docs/brand-guide
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 * @updated 2026-02-18
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

# 品牌指南

> YYC³ Design System - 品牌指南
> 版本: 1.0.0
> 更新日期: 2026-02-18

---

## 目录

- [品牌概述](#品牌概述)
- [品牌标识](#品牌标识)
- [色彩系统](#色彩系统)
- [排版系统](#排版系统)
- [图形元素](#图形元素)
- [语音语调](#语音语调)
- [应用示例](#应用示例)

---

## 品牌概述

### 品牌名称

**YYC³** (YanYuCloudCube)

### 品牌标语

> **言启象限 | 语枢未来**  
> ***Words Initiate Quadrants, Language Serves as Core for the Future***  
> **万象归元于云枢 | 深栈智启新纪元**  
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

### 品牌愿景

通过语言和智能技术，开启新的技术象限，构建以语言为核心的未来生态系统。

### 品牌价值观

- **创新**：持续探索前沿技术
- **开放**：拥抱开源和协作
- **智能**：以AI驱动产品发展
- **可靠**：提供稳定可信赖的解决方案
- **包容**：服务多样化的用户群体

---

## 品牌标识

### Logo 使用规范

#### Logo 版本

1. **完整版 Logo**
   - 包含品牌名称和图标
   - 适用于主要展示场景

2. **简化版 Logo**
   - 仅包含品牌名称
   - 适用于空间受限的场景

3. **图标版 Logo**
   - 仅包含品牌图标
   - 适用于小型应用场景

#### Logo 尺寸

```typescript
const logoSizes = {
  xs: '24px',    // 24x24
  sm: '32px',    // 32x32
  md: '48px',    // 48x48
  lg: '64px',    // 64x64
  xl: '96px',    // 96x96
  '2xl': '128px', // 128x128
};
```

#### Logo 保护空间

Logo 周围应保留至少 Logo 高度 25% 的空白区域。

```
┌─────────────────────────┐
│                       │
│   ┌─────────────┐     │
│   │             │     │
│   │    LOGO     │     │
│   │             │     │
│   └─────────────┘     │
│                       │
└─────────────────────────┘
```

#### Logo 使用禁忌

- ❌ 不要拉伸或压缩 Logo
- ❌ 不要改变 Logo 的颜色
- ❌ 不要在 Logo 周围添加装饰元素
- ❌ 不要将 Logo 旋转或倾斜
- ❌ 不要使用低分辨率的 Logo
- ❌ 不要在复杂背景上使用 Logo

---

## 色彩系统

### 主色调

#### 品牌主色

```typescript
const brandColors = {
  primary: {
    hex: '#d45a5f',
    oklch: 'oklch(0.62 0.18 25.5)',
    name: 'YYC³ Red',
    usage: '主要操作、强调元素、品牌标识',
  },
};
```

#### 辅助色

```typescript
const secondaryColors = {
  blue: {
    hex: '#4a90d4',
    oklch: 'oklch(0.60 0.15 250)',
    name: 'YYC³ Blue',
    usage: '信息展示、链接、辅助操作',
  },
  green: {
    hex: '#4a9d4a',
    oklch: 'oklch(0.60 0.15 140)',
    name: 'YYC³ Green',
    usage: '成功状态、确认操作',
  },
  yellow: {
    hex: '#d4a54a',
    oklch: 'oklch(0.75 0.15 85)',
    name: 'YYC³ Yellow',
    usage: '警告状态、注意提示',
  },
  red: {
    hex: '#e05a3f',
    oklch: 'oklch(0.55 0.20 25)',
    name: 'YYC³ Red',
    usage: '错误状态、危险操作',
  },
};
```

### 中性色

```typescript
const neutralColors = {
  white: {
    hex: '#ffffff',
    oklch: 'oklch(1 0 0)',
    name: 'White',
    usage: '背景、高亮区域',
  },
  gray: {
    50: { hex: '#f8f9fa', oklch: 'oklch(0.98 0.002 264)' },
    100: { hex: '#f1f3f5', oklch: 'oklch(0.96 0.003 264)' },
    200: { hex: '#e9ecef', oklch: 'oklch(0.92 0.004 264)' },
    300: { hex: '#dee2e6', oklch: 'oklch(0.87 0.005 264)' },
    400: { hex: '#ced4da', oklch: 'oklch(0.80 0.006 264)' },
    500: { hex: '#adb5bd', oklch: 'oklch(0.70 0.008 264)' },
    600: { hex: '#868e96', oklch: 'oklch(0.58 0.010 264)' },
    700: { hex: '#495057', oklch: 'oklch(0.45 0.012 264)' },
    800: { hex: '#343a40', oklch: 'oklch(0.35 0.014 264)' },
    900: { hex: '#212529', oklch: 'oklch(0.25 0.016 264)' },
  },
};
```

### 色彩使用原则

1. **主色优先**：主色应占据视觉焦点的 60-70%
2. **辅助色点缀**：辅助色用于强调和区分，占比 20-30%
3. **中性色平衡**：中性色用于背景和文本，占比 10-20%
4. **对比度要求**：确保文本和背景的对比度符合 WCAG AA 标准

---

## 排版系统

### 字体家族

```typescript
const typography = {
  sans: {
    family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    usage: '正文、UI 元素、标题',
  },
  serif: {
    family: 'Georgia, Cambria, "Times New Roman", Times, serif',
    usage: '长篇阅读、引用、特殊场景',
  },
  mono: {
    family: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    usage: '代码、数据、技术文档',
  },
};
```

### 字体大小

```typescript
const fontSize = {
  display: {
    '4xl': '2.25rem',  // 36px - 主标题
    '3xl': '1.875rem', // 30px - 副标题
    '2xl': '1.5rem',   // 24px - 小标题
  },
  body: {
    xl: '1.25rem',   // 20px - 大正文
    lg: '1.125rem',  // 18px - 中正文
    base: '1rem',    // 16px - 标准正文
    sm: '0.875rem',  // 14px - 小正文
    xs: '0.75rem',   // 12px - 说明文字
  },
};
```

### 字重

```typescript
const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
```

### 行高

```typescript
const lineHeight = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
};
```

---

## 图形元素

### 图标风格

- **线性图标**：用于次要操作和指示
- **填充图标**：用于主要操作和强调
- **双色图标**：用于品牌标识和特殊场景

### 图标尺寸

```typescript
const iconSizes = {
  xs: '16px',
  sm: '20px',
  md: '24px',
  lg: '32px',
  xl: '48px',
};
```

### 图标使用原则

1. **一致性**：整个产品中使用相同风格的图标
2. **清晰度**：确保图标在小尺寸下仍然清晰可辨
3. **语义化**：使用符合用户认知的图标
4. **可访问性**：为图标提供适当的 ARIA 标签

---

## 语音语调

### 语调特征

- **专业**：使用准确、专业的语言
- **友好**：保持亲切、平易近人的态度
- **简洁**：避免冗长、复杂的表达
- **积极**：使用积极、建设性的语言

### 语言风格

#### 正面示例

```
✅ "您的操作已成功完成"
✅ "我们建议您先保存当前内容"
✅ "需要帮助吗？"
```

#### 负面示例

```
❌ "操作成功"
❌ "你必须先保存"
❌ "有问题吗？"
```

### 文案原则

1. **用户中心**：从用户的角度出发
2. **行动导向**：使用动词引导用户行动
3. **避免技术术语**：使用用户易懂的语言
4. **提供上下文**：确保用户理解当前状态

---

## 应用示例

### 网页应用

```tsx
// 头部导航
<header style={{ backgroundColor: brandColors.primary.hex }}>
  <Logo size="md" />
  <nav>
    <a href="/products">产品</a>
    <a href="/solutions">解决方案</a>
    <a href="/about">关于我们</a>
  </nav>
</header>

// 主要操作
<Button variant="primary" style={{ backgroundColor: brandColors.primary.hex }}>
  开始使用
</Button>

// 成功状态
<Alert variant="success" style={{ backgroundColor: secondaryColors.green.hex }}>
  操作成功完成
</Alert>
```

### 移动应用

```tsx
// 欢迎页面
<View style={{ backgroundColor: neutralColors.gray[50].hex }}>
  <Logo size="xl" />
  <Text style={{ fontSize: fontSize.display['3xl'], fontWeight: fontWeight.bold }}>
    欢迎使用 YYC³
  </Text>
  <Text style={{ fontSize: fontSize.body.base, color: neutralColors.gray[600].hex }}>
    开启智能新纪元
  </Text>
  <Button variant="primary">立即开始</Button>
</View>
```

### 文档网站

```tsx
// 文档标题
<h1 style={{ 
  fontSize: fontSize.display['4xl'], 
  fontWeight: fontWeight.bold,
  color: neutralColors.gray[900].hex 
}}>
  YYC³ Design System
</h1>

// 代码示例
<pre style={{ 
  backgroundColor: neutralColors.gray[900].hex,
  color: neutralColors.gray[100].hex,
  fontFamily: typography.mono.family
}}>
  npm install yyc3-design-system
</pre>
```

---

## 品牌资源

### 资源下载

- [Logo 文件包](./assets/logo.zip)
- [图标库](./assets/icons.zip)
- [字体文件](./assets/fonts.zip)
- [色彩规范](./assets/colors.pdf)

### 使用许可

YYC³ 品牌资产受版权保护。未经授权，不得修改、分发或用于商业用途。

---

## 联系方式

如有品牌相关问题，请联系：

- 邮箱：<admin@0379.email>
- 官网：https://yyc3.com
- GitHub：https://github.com/yyc3

---

**文档版本**: 1.0.0  
**最后更新**: 2026-02-18  
**维护者**: YYC³ Team
