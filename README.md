# YYC³ Design System

<div align="center">

![YYC³ Design System](public/yyc3-article-cover-05.png)

## YYC³ 设计系统

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://github.com/YYC-Cube/YYC3-Design-System/actions/workflows/test-and-build.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-v1.3.0-orange.svg?style=flat-square)](https://www.npmjs.com/package/@yyc3/design-system)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)
[![OKLCH Support](https://img.shields.io/badge/OKLCH-ready-ff69b4.svg?style=flat-square)](https://github.com/w3c/csswg-drafts/issues/7844)
[![Storybook](https://img.shields.io/badge/storybook-ready-FF4785.svg?style=flat-square)](https://storybook.js.org/)

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fe7a37.svg?style=flat-square)](https://conventionalcommits.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![DeepScan](https://img.shields.io/badge/DeepScan-passed-00d9ff.svg?style=flat-square)](https://github.com/YYC-Cube/YYC3-Design-System)
[![YYC³ Standard](https://img.shields.io/badge/YYC³%20Standard-A+-gold.svg?style=flat-square)](https://github.com/YYC-Cube/YYC3-Standards)

</div>

---

## 概述

YYC³ 设计系统是一套完整的设计令牌系统，支持 OKLch 主色空间并提供 HEX 回退，实现语义化 tokens、响应式适配与自动化导出流程。

### 核心特性

- 单一事实源：`design/tokens.json` 为真源，Figma 与工程通过插件/脚本双向同步
- OKLch 主色空间：使用感知均匀的 OKLch 颜色空间，同时提供 HEX 回退
- 暗色主题支持：完整的暗色主题令牌和主题切换功能
- TypeScript 支持：完整的类型定义和类型安全的设计令牌访问
- 自动化构建：使用 Style Dictionary 将 tokens 转换为 CSS 变量、JS 主题对象
- 完整测试框架：包含 OKLCH 转换验证、可访问性测试、E2E 测试和 CI 自动化测试
- Storybook 集成：提供组件文档、实时预览和主题切换
- 动画系统：内置动画令牌和 Animated 组件，支持多种动画效果
- 性能优化：使用 React.memo、useCallback、useMemo 等优化组件性能
- 代码质量工具：ESLint 和 Prettier 配置，确保代码一致性
- 多框架支持：提供 React、Vue 3 和 Svelte 组件库
- 可视化工具：Token Playground 和颜色对比度检查器
- 视觉回归测试：集成 Chromatic 进行自动化视觉测试
- E2E 测试：使用 Playwright 进行端到端测试
- 完整文档：包含组件使用指南、设计原则、品牌指南、交互规范和可访问性指南
- AI 功能：智能令牌生成、配色方案推荐、设计一致性检查、使用模式分析和最佳实践建议
- 协作功能：实时编辑、多用户支持、变更同步和冲突解决
- CLI 工具：命令行工具用于设计令牌管理和 AI 功能

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行测试

```bash
npm run test:oklch
npm run build:tokens
npm run storybook
```

### 目录结构

```
yyc3-design-system/
├── design/
│   └── tokens.json
├── scripts/
│   ├── build-tokens.js
│   ├── watch-tokens.js
│   ├── generate-oklch-report.js
│   └── test-oklch-to-hex.js
├── tests/
│   └── oklch.test.js
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Radio.tsx
│   │   ├── Switch.tsx
│   │   ├── Progress.tsx
│   │   ├── Spinner.tsx
│   │   ├── Alert.tsx
│   │   ├── Tabs.tsx
│   │   ├── Modal.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Divider.tsx
│   │   ├── Select.tsx
│   │   ├── Animated.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── *.test.tsx
│   ├── theme/
│   │   ├── ThemeProvider.tsx
│   │   ├── useTheme.ts
│   │   └── *.test.tsx
│   ├── utils/
│   │   ├── animations.ts
│   │   ├── performance.ts
│   │   └── *.test.tsx
│   └── types/
│       ├── tokens.ts
│       └── animations.ts
├── .github/
│   └── workflows/
│       ├── test-and-build.yml
│       └── test-and-report-pr-comment.yml
├── .storybook/
│   ├── manager.js
│   ├── preview.js
│   └── yyc-theme.js
├── dist/
│   ├── css/
│   │   └── variables.css
│   └── js/
│       ├── tokens.js
│       └── theme.js
├── public/
│   └── yyc3-article-cover-05.png
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
├── style-dictionary.config.js
└── README.md
```

## 设计令牌

### 颜色系统

```json
{
  "color": {
    "primary": {
      "value": {
        "oklch": "oklch(0.6209 0.1801 348.1385)",
        "hex": "#d45a5f",
        "foreground": "#ffffff"
      },
      "type": "color"
    }
  }
}
```

### 主题系统

设计系统支持浅色和暗色两种主题，通过 ThemeProvider 进行管理。

```jsx
import { ThemeProvider, ThemeToggle, useTheme } from '@yyc3/design-system';

function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <YourContent />
    </ThemeProvider>
  );
}
```

### 动画系统

动画令牌定义了动画的持续时间、缓动函数和关键帧。

```json
{
  "animation": {
    "duration": {
      "fast": { "value": "150ms" },
      "normal": { "value": "300ms" },
      "slow": { "value": "500ms" }
    },
    "easing": {
      "ease-in": { "value": "cubic-bezier(0.4, 0, 1, 1)" },
      "ease-out": { "value": "cubic-bezier(0, 0, 0.2, 1)" }
    }
  }
}
```

使用 Animated 组件：

```jsx
import { Animated } from '@yyc3/design-system';

<Animated animation="fadeIn">
  <div>淡入效果</div>
</Animated>

<Animated animation="slideInUp" trigger="hover">
  <div>悬停滑入</div>
</Animated>
```

### 可用颜色

- `primary` - 主色调
- `background` - 背景色
- `card` - 卡片背景
- `destructive` - 危险操作
- `ring` - 焦点环
- `foreground` - 前景色
- `muted-foreground` - 柔和前景色

### 圆角与阴影

```json
{
  "radius": {
    "default": { "value": "0.5rem", "type": "dimension" },
    "sm": { "value": "0.125rem", "type": "dimension" },
    "md": { "value": "0.25rem", "type": "dimension" },
    "lg": { "value": "0.5rem", "type": "dimension" }
  },
  "shadow": {
    "card": {
      "value": {
        "x": "0px", "y": "6px", "blur": "20px",
        "spread": "-4px", "color_hex": "#d6cbd0"
      },
      "type": "shadow"
    }
  }
}
```

### 排版系统

```json
{
  "typography": {
    "font-sans": {
      "value": "Geist, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      "type": "fontFamily"
    }
  }
}
```

## 使用指南

### 在 CSS 中使用

```css
@import './dist/css/variables.css';

.button {
  background: var(--color-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}
```

### 在 JavaScript 中使用

```javascript
import { colorPrimary, radiusDefault } from './dist/js/tokens.js';

const buttonStyle = {
  background: colorPrimary,
  borderRadius: radiusDefault
};
```

### 在 React 中使用

```jsx
import { ThemeProvider, useTheme } from './theme';
import { Button, Input, Card, Badge, Avatar } from './components';

function App() {
  return (
    <ThemeProvider>
      <Card>
        <CardHeader>
          <CardTitle>用户信息</CardTitle>
        </CardHeader>
        <CardContent>
          <Avatar src="/avatar.jpg" alt="用户头像" />
          <Input placeholder="请输入用户名" />
          <Button>保存</Button>
          <Badge variant="secondary">新用户</Badge>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

function Button({ children, variant = 'default', size = 'default' }) {
  const { tokens } = useTheme();
  return (
    <button 
      style={{ 
        background: tokens[`color.${variant}`] || tokens['color.primary'],
        padding: size === 'lg' ? '0.75rem 1.5rem' : '0.5rem 1rem'
      }}
    >
      {children}
    </button>
  );
}
```

### TypeScript 类型支持

```typescript
import { DesignTokens, ButtonProps, InputProps } from '@yyc3/design-system/types';

const MyComponent: React.FC = () => {
  const { tokens, setTokens } = useTheme();
  
  const handleTokenUpdate = (newTokens: Partial<DesignTokens>) => {
    setTokens(newTokens);
  };

  return <Button variant="destructive" size="lg">删除</Button>;
};
```

## 可用组件

### Button

按钮组件，支持多种变体和尺寸。

```jsx
<Button variant="default">默认按钮</Button>
<Button variant="destructive">危险按钮</Button>
<Button size="lg">大按钮</Button>
<Button disabled>禁用按钮</Button>
```

### Input

输入框组件，支持焦点样式和禁用状态。

```jsx
<Input placeholder="请输入内容" />
<Input disabled placeholder="禁用状态" />
```

### Card

卡片组件，包含 Header、Title 和 Content 子组件。

```jsx
<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
  </CardHeader>
  <CardContent>
    卡片内容
  </CardContent>
</Card>
```

### Badge

徽章组件，支持多种变体。

```jsx
<Badge variant="default">默认</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="destructive">危险</Badge>
<Badge variant="outline">轮廓</Badge>
```

### Avatar

头像组件，支持图片和回退文本。

```jsx
<Avatar src="/avatar.jpg" alt="用户头像" />
<Avatar fallback="AB" alt="用户" />
<Avatar size="lg" fallback="CD" alt="用户" />
```

### Checkbox

复选框组件，支持受控和非受控模式。

```jsx
<Checkbox>记住我</Checkbox>
<Checkbox checked={true} onChange={(checked) => console.log(checked)}>
  同意条款
</Checkbox>
```

### Radio

单选按钮组件，支持分组选择。

```jsx
<Radio name="gender" value="male" checked={true}>男</Radio>
<Radio name="gender" value="female">女</Radio>
```

### Switch

开关组件，用于切换状态。

```jsx
<Switch />
<Switch checked={true} onChange={(checked) => console.log(checked)} />
<Switch disabled />
```

### Progress

进度条组件，显示任务完成进度。

```jsx
<Progress value={30} />
<Progress value={75} max={200} />
```

### Spinner

加载动画组件，用于表示加载状态。

```jsx
<Spinner />
<Spinner size="lg" />
```

### Alert

警告提示组件，支持多种变体。

```jsx
<Alert>这是一条普通消息</Alert>
<Alert variant="destructive">这是一条错误消息</Alert>
<Alert variant="warning">这是一条警告消息</Alert>
<Alert variant="success">这是一条成功消息</Alert>
```

### Tabs

标签页组件，支持内容切换。

```jsx
<Tabs defaultValue="tab1">
  <TabList>
    <Tab value="tab1">标签1</Tab>
    <Tab value="tab2">标签2</Tab>
  </TabList>
  <TabPanel value="tab1">内容1</TabPanel>
  <TabPanel value="tab2">内容2</TabPanel>
</Tabs>
```

### Modal

模态框组件，支持遮罩层和关闭功能。

```jsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <div>模态框内容</div>
</Modal>
```

### Tooltip

工具提示组件，支持多种位置。

```jsx
<Tooltip content="这是提示内容">
  <button>悬停查看提示</button>
</Tooltip>

<Tooltip content="右侧提示" placement="right">
  <button>右侧提示</button>
</Tooltip>
```

### Divider

分割线组件，支持水平和垂直方向。

```jsx
<Divider />
<Divider variant="dashed" />
<Divider orientation="vertical" />
```

### Select

下拉选择组件，支持自定义选项。

```jsx
const options = [
  { value: '1', label: '选项1' },
  { value: '2', label: '选项2' },
];

<Select options={options} placeholder="请选择" />
<Select options={options} value="1" onChange={(value) => console.log(value)} />
```

### Animated

动画容器组件，支持多种动画效果。

```jsx
<Animated animation="fadeIn">
  <div>淡入动画</div>
</Animated>

<Animated animation="slideInUp" trigger="hover">
  <div>悬停滑入</div>
</Animated>

<Animated animation="bounceIn" trigger="click">
  <div>点击弹入</div>
</Animated>
```

### ThemeToggle

主题切换组件，用于在浅色和暗色主题之间切换。

```jsx
<ThemeToggle />
```

## AI 功能

### AITokenGenerator

AI 令牌生成器，根据品牌颜色自动生成完整的设计令牌系统。

```jsx
import { AITokenGenerator } from '@yyc3/design-system';

<AITokenGenerator />
```

### AIColorRecommender

AI 配色方案推荐器，基于色彩理论生成可访问的配色方案。

```jsx
import { AIColorRecommender } from '@yyc3/design-system';

<AIColorRecommender />
```

### AIConsistencyChecker

AI 设计一致性检查器，确保设计令牌遵循一致的模式和标准。

```jsx
import { AIConsistencyChecker } from '@yyc3/design-system';

<AIConsistencyChecker />
```

### AIUsageAnalyzer

AI 使用模式分析器，跟踪和分析令牌使用情况。

```jsx
import { AIUsageAnalyzer } from '@yyc3/design-system';

<AIUsageAnalyzer />
```

### AIBestPractices

AI 最佳实践建议生成器，提供设计系统改进建议。

```jsx
import { AIBestPractices } from '@yyc3/design-system';

<AIBestPractices />
```

## 协作功能

### RealtimeEditor

实时编辑器，支持多用户协作编辑设计令牌。

```jsx
import { RealtimeEditor } from '@yyc3/design-system';

<RealtimeEditor
  initialTokens={tokens}
  onSave={(newTokens) => console.log(newTokens)}
  userId="user-123"
/>
```

### TokenPlayground

令牌可视化工具，实时预览和编辑设计令牌。

```jsx
import { TokenPlayground } from '@yyc3/design-system';

<TokenPlayground />
```

### ColorContrastChecker

颜色对比度检查器，验证文本和背景色的可访问性。

```jsx
import { ColorContrastChecker } from '@yyc3/design-system';

<ColorContrastChecker />
```

## CLI 工具

设计系统提供命令行工具用于设计令牌管理和 AI 功能。

### 一致性检查

```bash
npm run yyc3:check
```

检查设计令牌的一致性，生成详细的报告。

### 使用分析

```bash
npm run yyc3:analyze
```

分析令牌使用模式，提供优化建议。

### 最佳实践建议

```bash
npm run yyc3:best-practices
```

生成设计系统最佳实践建议。

### 令牌生成

```bash
npm run yyc3:generate-tokens -- --color #d45a5f --harmony complementary
```

根据品牌颜色自动生成设计令牌。

### 配色方案推荐

```bash
npm run yyc3:recommend-colors -- --color #d45a5f --mood professional
```

生成可访问的配色方案推荐。

### 完整审计

```bash
npm run yyc3:audit
```

执行完整的设计系统审计，包括一致性检查、使用分析和最佳实践建议。

## 测试

### OKLCH 转换测试

```bash
npm run test:oklch
```

### 构建测试

```bash
npm run build:tokens
```

### Jest 单元测试

```bash
npm test
```

### 可访问性测试

项目集成了 jest-axe 进行可访问性测试，确保所有组件符合 WCAG 标准。

```bash
npm test -- src/components/accessibility.test.tsx
```

### 性能测试

使用 React 性能工具和自定义 hooks 进行性能优化验证。

```typescript
import { useDebounce, useThrottle, useMemoizedCallback } from '@yyc3/design-system/utils';
```

## 可用脚本

| 命令 | 描述 |
|------|------|
| `npm run build:tokens` | 构建设计令牌 |
| `npm run watch:tokens` | 监听令牌变化并自动构建 |
| `npm run test:oklch` | 运行 OKLCH 转换测试 |
| `npm run report:oklch` | 生成 OKLCH 转换报告 |
| `npm test` | 运行 Jest 测试套件 |
| `npm run storybook` | 启动 Storybook 开发服务器 |
| `npm run build-storybook` | 构建 Storybook 静态站点 |
| `npm run dev` | 启动开发环境 |
| `npm run build` | 构建完整项目 |

## CI/CD

项目包含 GitHub Actions 工作流，在以下情况下自动运行：

- 推送到 `main` 分支
- 针对包含令牌变更的 Pull Request

### 工作流

| 工作流 | 触发条件 | 功能 |
|--------|----------|------|
| `test-and-build.yml` | Push/PR | 基础测试与构建 |
| `test-and-report-pr-comment.yml` | Push/PR | PR 评论与 Check 注释 |

### CI 流程

1. 安装依赖
2. 运行 OKLCH 转换测试
3. 运行单元测试
4. 构建设计令牌
5. 生成 OKLCH 报告
6. 上传构建产物
7. 发布 PR 评论
8. 创建 GitHub Check

详细配置请参考 [`.github/workflows/README.md`](.github/workflows/README.md)

## Figma 集成

### 导入令牌到 Figma

1. 安装 Tokens Studio 插件
2. 从 `design/tokens.json` 导入令牌
3. 将令牌绑定到组件样式

### 导出令牌从 Figma

1. 在 Tokens Studio 中更新令牌
2. 导出为 JSON
3. 提交到 `design/tokens.json`

## 设计原则

- 语义化：所有 token 使用语义命名
- 可访问性优先：文本对比度不低于 4.5:1
- 可扩展性：支持主题切换和自定义预设
- 工程化：自动化构建和测试流程

## 可访问性检查清单

- 正文文本对比度 >= 4.5:1
- 焦点样式可见且不依赖颜色区分
- 所有交互控件键盘可达
- 动效时长可配置，默认不超过 200ms
- 语义化 HTML 与 ARIA 标签

## 技术栈

- [React](https://reactjs.org/) - UI 框架
- [Style Dictionary](https://amzn.github.io/style-dictionary/) - 设计令牌构建
- [Storybook](https://storybook.js.org/) - 组件文档
- [Jest](https://jestjs.io/) - 测试框架
- [Culori](https://culorijs.org/) - 颜色转换库

## 贡献指南

我们欢迎所有形式的贡献！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'feat: Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

请遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

## 许可证

[MIT License](LICENSE) - 详见 LICENSE 文件

## 下一步计划

YYC³ Design System 正在持续演进中，以下是我们的递进规划设计方案：

### 阶段一：基础完善 ✅ 已完成

- ✅ TypeScript 完整迁移
- ✅ 完整组件库（26+ 组件）
- ✅ 可访问性测试集成
- ✅ 完整文档体系
- ✅ 测试覆盖率提升（已通过所有类型检查和代码规范检查）
- ✅ AI 组件和工具组件单元测试
- ✅ TokenPlayground 组件单元测试
- ✅ performance.ts 工具函数单元测试
- ✅ GenericComponent、Polymorphic、RealtimeEditor、CSPProvider、CSRFProtection 组件单元测试
- ✅ 所有代码质量检查通过（typecheck 和 lint）

详细的执行计划请参考 [阶段一执行计划](docs/03-YYC3-Design-System-开发实施阶段/001-YYC3-Design-System-阶段一执行计划.md)
详细的阶段一执行总结请参考 [阶段一执行总结](docs/03-YYC3-Design-System-开发实施阶段/执行总结/003-YYC3-Design-System-阶段一执行总结.md)
详细的阶段二执行总结请参考 [阶段二执行总结](docs/03-YYC3-Design-System-开发实施阶段/执行总结/004-YYC3-Design-System-阶段二执行总结.md)
详细的阶段三执行总结请参考 [阶段三执行总结](docs/03-YYC3-Design-System-开发实施阶段/执行总结/005-YYC3-Design-System-阶段三执行总结.md)
详细的阶段四执行总结请参考 [阶段四执行总结](docs/03-YYC3-Design-System-开发实施阶段/执行总结/006-YYC3-Design-System-阶段四执行总结.md)

### 阶段二：功能增强 ✅ 已完成

- ✅ Dark Mode 完整支持
- ✅ 动画系统（Animated 组件和动画令牌）
- ✅ 性能优化（代码分割、懒加载、React.memo、useCallback、useMemo）
- ✅ 主题切换机制（ThemeProvider 和 ThemeToggle）
- ✅ 安全组件（CSPProvider、CSRFProtection、XSSProtection）
- ✅ 性能优化工具（资源优化、图片压缩、懒加载）
- ✅ PWA 支持（Service Worker）

### 阶段三：生态扩展 ✅ 已完成

- ✅ 多框架支持（React、Vue 3、Svelte）
- ✅ 可视化工具（Token Playground、颜色对比度检查器）
- ✅ 自动化测试增强（Visual Regression、E2E with Playwright）
- ✅ 完整设计规范文档
- ✅ Storybook 集成和文档
- ✅ Chromatic 视觉回归测试

### 阶段四：智能化升级 ✅ 已完成

- ✅ AI 辅助设计（AITokenGenerator、AIColorRecommender）
- ✅ 智能组件推荐（AIConsistencyChecker、AIUsageAnalyzer）
- ✅ 实时协作功能（RealtimeEditor、多用户支持、冲突解决）
- ✅ 设计一致性检查（AIBestPractices）
- ✅ CLI 工具（令牌管理、配色推荐、一致性检查、使用分析、最佳实践建议）

### 阶段五：持续优化（进行中）

- 🔄 提升测试覆盖率至 80%+
- ✅ 性能优化和监控（P0 核心监控已完成，P1 构建优化全部完成）
- 🔄 文档完善和国际化
- 🔄 社区反馈和功能迭代
- 🔄 可访问性持续改进
- 🔄 设计令牌自动化流程优化

详细的递进规划设计方案请参考 [递进规划设计方案](docs/05-YYC3-Design-System-规划文档/01-递进规划设计/001-YYC3-Design-System-递进规划设计方案.md)

## 联系方式

- GitHub Issues: [提交问题](https://github.com/YYC-Cube/YYC3-Design-System/issues)
- GitHub Repository: [YYC-Cube/YYC3-Design-System](https://github.com/YYC-Cube/YYC3-Design-System)
- Email: [admin@0379.email](mailto:admin@0379.email)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

*协议最后更新：2026-02-17*

</div>
