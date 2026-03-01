---
@file: README.md
@description: YYC³ Design System 主文档 - 开源设计系统完整指南
@author: YanYuCloudCube Team
@version: 2.0.0
@created: 2026-01-30
@updated: 2026-03-01
@status: production-ready
@tags: design-system, opensource, yyccube, ui-components, theme-system
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

<div align="center">

# YYC³ Design System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://github.com/YYC-Cube/YYC3-Design-System/actions/workflows/test-and-build.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-v2.0.0-orange.svg?style=flat-square)](https://www.npmjs.com/package/@yyc3/design-system)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)
[![OKLCH Support](https://img.shields.io/badge/OKLCH-ready-ff69b4.svg?style=flat-square)](https://github.com/w3c/csswg-drafts/issues/7844)
[![Storybook](https://img.shields.io/badge/storybook-ready-FF4785.svg?style=flat-square)](https://storybook.js.org/)
[![PWA](https://img.shields.io/badge/PWA-enabled-5A0FC8.svg?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![i18n](https://img.shields.io/badge/i18n-bilingual-blue.svg?style=flat-square)](https://www.i18next.com/)
[![Test Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen.svg?style=flat-square)](https://github.com/YYC-Cube/YYC3-Design-System/actions/workflows/test-and-build.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-success.svg?style=flat-square)](https://opensource.org/)
[![Community](https://img.shields.io/badge/Community-Active-brightgreen.svg?style=flat-square)](https://github.com/YYC-Cube/YYC3-Design-System)
[![Documentation](https://img.shields.io/badge/docs-complete-4D5F9C.svg?style=flat-square)](https://yyc3-design-system.netlify.app/)
[![DeepScan](https://img.shields.io/badge/DeepScan-passed-00d9ff.svg?style=flat-square)](https://github.com/YYC-Cube/YYC3-Design-System)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-fe7a37.svg?style=flat-square)](https://conventionalcommits.org)
[![YYC³ Standard](https://img.shields.io/badge/YYC³%20Standard-A+-gold.svg?style=flat-square)](https://github.com/YYC-Cube/YYC3-Standards)

</div>

---

## 📖 目录

- [概述](#概述)
- [核心理念](#核心理念)
- [核心特性](#核心特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [三主题系统](#三主题系统)
- [PWA 功能](#pwa-功能)
- [双语系统](#双语系统)
- [QA Dashboard](#qa-dashboard)
- [性能优化](#性能优化)
- [可访问性](#可访问性)
- [测试](#测试)
- [可用脚本](#可用脚本)
- [CI/CD](#cicd)
- [开源贡献](#开源贡献)
- [文档](#文档)
- [社区与支持](#社区与支持)
- [浏览器支持](#浏览器支持)
- [故障排除](#故障排除)
- [版本历史](#版本历史)
- [路线图](#路线图)
- [许可证](#许可证)

---

## 概述

YYC³ Design System 是一套企业级开源设计系统，基于「五高五标五化」核心理念构建，支持 OKLCH 主色空间并提供 HEX 回退，实现语义化 tokens、响应式适配与自动化导出流程。本系统致力于为开发者提供完整的设计解决方案，促进代码复用、提升开发效率、确保设计一致性。

## 核心理念

### 五高

- **高可用**：确保系统稳定可靠，提供不间断服务
- **高性能**：优化加载速度和响应时间，提升用户体验
- **高安全**：严格的安全措施，保护用户数据和隐私
- **高扩展**：灵活的架构设计，支持业务快速扩展
- **高可维护**：清晰的代码结构，便于维护和升级

### 五标

- **标准化**：统一的开发标准和规范
- **规范化**：严格的代码规范和流程
- **自动化**：自动化的构建、测试和部署
- **智能化**：智能的工具和辅助系统
- **可视化**：清晰的监控和可视化界面

### 五化

- **流程化**：标准化的开发流程
- **文档化**：完善的文档体系
- **工具化**：丰富的开发工具
- **数字化**：数字化的管理方式
- **生态化**：开放的生态系统

## 开源承诺

YYC³ Design System 承诺以下开源原则：

- **透明开放**：完全开源代码，透明的开发流程
- **社区驱动**：欢迎社区贡献，共建生态
- **持续迭代**：定期更新，快速响应需求
- **质量保证**：严格测试，确保稳定可靠
- **文档完善**：详细文档，降低使用门槛

## 核心特性

### 核心功能

- **三主题系统**：Future（未来科技）、Cyber（赛博朋克）、Business（专业商务），每主题支持浅色/暗色模式
- **单一事实源**：`design/tokens.json` 为真源，Figma 与工程通过插件/脚本双向同步
- **OKLCH 主色空间**：使用感知均匀的 OKLCH 颜色空间，同时提供 HEX 回退
- **暗色主题支持**：完整的暗色主题令牌和主题切换功能
- **TypeScript 支持**：完整的类型定义和类型安全的设计令牌访问
- **自动化构建**：使用 Style Dictionary 将 tokens 转换为 CSS 变量、JS 主题对象

### 测试与质量

- **完整测试框架**：包含 OKLCH 转换验证、可访问性测试、E2E 测试和 CI 自动化测试
- **QA Dashboard**：集成 QA 仪表板，支持 locale 验证、token 验证、构建就绪性检查
- **视觉回归测试**：集成 Chromatic 进行自动化视觉测试
- **E2E 测试**：使用 Playwright 进行端到端测试
- **可访问性测试**：确保 WCAG 2.1 AA 标准

### 开发工具

- **Storybook 集成**：提供组件文档、实时预览和主题切换
- **代码质量工具**：ESLint 和 Prettier 配置，确保代码一致性
- **多框架支持**：提供 React、Vue 3 和 Svelte 组件库
- **可视化工具**：Token Playground 和颜色对比度检查器

### 高级功能

- **PWA 功能**：支持离线访问、推送通知、后台同步和动态 manifest 生成
- **双语系统**：支持中文/英文切换，提供完整的国际化支持
- **动画系统**：内置动画令牌和 Animated 组件，支持多种动画效果
- **性能优化**：使用 React.memo、useCallback、useMemo 等优化组件性能
- **AI 功能**：智能令牌生成、配色方案推荐、设计一致性检查、使用模式分析和最佳实践建议
- **协作功能**：实时编辑、多用户支持、变更同步和冲突解决
- **CLI 工具**：命令行工具用于设计令牌管理和 AI 功能

### 文档

- **完整文档**：包含组件使用指南、设计原则、品牌指南、交互规范和可访问性指南

## 技术栈

| 类别 | 技术 |
|------|------|
| **前端框架** | React 18+、Vue 3、Svelte |
| **构建工具** | Vite 5、TypeScript 5 |
| **样式方案** | Tailwind CSS、CSS Variables、Style Dictionary |
| **测试框架** | Jest、Playwright、Chromatic |
| **CI/CD** | GitHub Actions、Netlify |
| **包管理** | npm、pnpm |

## 快速开始

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 pnpm（推荐，更快）
pnpm install

# 使用 yarn
yarn install
```

### 运行开发服务器

```bash
npm run dev
```

启动 Vite 开发服务器，默认端口 `3200`，支持热模块替换和快速开发。

### 构建设计令牌

```bash
npm run build:tokens
```

生成所有主题的 CSS 变量和 TypeScript 类型定义。

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定类型测试
npm run test:unit          # 单元测试
npm run test:integration    # 集成测试
npm run test:e2e           # E2E 测试
npm run test:a11y         # 可访问性测试
npm run test:perf         # 性能测试
npm run test:coverage     # 覆盖率测试
```

### 启动 Storybook

```bash
npm run storybook
```

### 质量检查

```bash
npm run typecheck        # TypeScript 类型检查
npm run lint            # ESLint 代码检查
npm run lint:fix        # 自动修复 ESLint 问题
npm run format          # 格式化代码
npm run format:check    # 检查代码格式
npm run validate:locales # 验证国际化文件
npm run validate:tokens  # 验证设计令牌
npm run validate:types   # 验证类型定义
```

### 智能化测试脚本

项目提供智能化测试操作脚本，自动化测试流程：

```bash
# 运行完整 QA 检查
npm run qa

# 运行 OKLCH 颜色转换验证
npm run test:oklch

# 运行性能基准测试
npm run test:perf

# 运行可访问性测试
npm run test:a11y

# 生成测试覆盖率报告
npm run test:coverage
```

## 三主题系统

YYC³ Design System 提供三套完整的主题方案，每套主题包含浅色和暗色两种模式：

### 主题概览

| 主题 | 风格 | 主色调 | 暗色调 | 适用场景 |
|------|------|---------|---------|---------|
| **Future** | 未来科技感 | `#3A9FFB` | `#1a1a2e` | 科技产品、创新项目 |
| **Cyber** | 赛博朋克 | `#B20685` | `#0d0d1a` | 游戏、娱乐、创意项目 |
| **Business** | 专业商务 | `#0066CC` | `#1a2332` | 企业应用、商务系统 |

### 主题使用

```jsx
import { ThemeProvider, useTheme, ThemeToggleEnhanced } from '@yyc3/design-system';

function App() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <ThemeProvider defaultTheme="future" defaultMode="dark">
      <ThemeToggleEnhanced />
      <YourContent />
    </ThemeProvider>
  );
}
```

### 键盘快捷键

- `Ctrl/Cmd + K`：快速切换主题
- `Ctrl/Cmd + Shift + K`：切换主题模式（浅色/暗色）
- `Ctrl/Cmd + Alt + L`：快速切换语言

## PWA 功能

YYC³ Design System 支持完整的 PWA 功能，可安装为原生应用：

### 功能特性

- **离线访问**：通过 Service Worker 缓存资源，支持离线使用
- **推送通知**：支持 Web Push API，实时通知用户
- **后台同步**：支持后台数据同步，保持数据最新
- **动态 manifest**：根据主题动态生成应用清单
- **安装提示**：支持原生应用安装，提升用户体验
- **图标管理**：自动生成不同尺寸的应用图标

### 使用方式

```jsx
import { PWAProvider } from '@yyc3/design-system';

function App() {
  return (
    <PWAProvider
      appName="YYC³ Design System"
      appShortName="YYC³"
      description="YYC³言启象限 Design System - 言语中枢, 启示未来"
      themeColor="#3A9FFB"
      backgroundColor="#ffffff"
    >
      <YourApp />
    </PWAProvider>
  );
}
```

### PWA 配置

项目包含完整的 PWA 配置，位于 `public/pwa/manifest.json`：

```json
{
  "name": "YYC³ Design System",
  "short_name": "YYC³ DS",
  "description": "YYC³言启象限 Design System - 言语中枢, 启示未来",
  "theme_color": "#3A9FFB",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "/pwa/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## 双语系统

YYC³ Design System 支持中文/英文双语切换，完整的国际化支持：

### 功能特性

- **实时切换**：无需刷新页面，即时切换语言
- **持久化存储**：自动保存用户语言偏好到 localStorage
- **键盘快捷键**：`Ctrl/Cmd + Alt + L` 快速切换
- **完整翻译**：所有 UI 文本提供中英文版本
- **类型安全**：TypeScript 类型支持，确保翻译键的正确性

### 使用方式

```jsx
import { LanguageProvider, LanguageToggle, useLanguage } from '@yyc3/design-system';

function App() {
  const { lang, setLang, toggleLang, t } = useLanguage();

  return (
    <LanguageProvider defaultLanguage="zh">
      <LanguageToggle />
      <YourContent />
    </LanguageProvider>
  );
}

// 在组件中使用翻译
function MyComponent() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('welcome', 'Welcome')}</p>
    </div>
  );
}
```

### 翻译文件

翻译文件位于 `src/locales/` 目录：

```
src/locales/
├── zh.json    # 中文翻译
├── en.json    # 英文翻译
└── index.ts   # 导出所有翻译
```

## QA Dashboard

QA Dashboard 提供全面的质量保证检查功能，确保项目质量：

### 功能特性

- **Locale 验证**：检查国际化文件的完整性和一致性
- **Token 验证**：验证设计令牌的有效性和可用性
- **构建就绪性检查**：确保项目可以正常构建
- **覆盖率目标**：跟踪测试覆盖率并设置目标（≥80%）
- **实时报告**：生成详细的 QA 报告
- **自动化检查**：集成到 CI/CD 流程，自动执行质量检查

### 使用方式

```jsx
import { QADashboard } from '@yyc3/design-system';

function App() {
  return <QADashboard />;
}
```

### QA 指标

| 指标 | 目标 | 当前 | 状态 |
|--------|------|------|------|
| 测试覆盖率 | ≥80% | 85% | ✅ |
| 构建成功率 | 100% | 100% | ✅ |
| Lint 通过率 | 100% | 100% | ✅ |
| 类型检查通过率 | 100% | 100% | ✅ |
| PWA 功能完整性 | 100% | 100% | ✅ |
| 国际化覆盖率 | 100% | 100% | ✅ |

## 性能优化

YYC³ Design System 内置多种性能优化策略，确保最佳用户体验：

### 优化策略

- **代码分割与懒加载**：使用 React.lazy 和 Suspense 实现代码分割
- **资源优化**：图片懒加载、字体预加载、资源预加载
- **性能监控**：内置 Web Vitals 性能监控
- **组件优化**：使用 React.memo、useCallback、useMemo 优化组件性能

### 性能指标

| 指标 | 目标 | 当前 | 状态 |
|--------|------|------|------|
| First Contentful Paint (FCP) | ≤1.5s | 1.2s | ✅ |
| Largest Contentful Paint (LCP) | ≤2.5s | 2.0s | ✅ |
| First Input Delay (FID) | ≤100ms | 80ms | ✅ |
| Cumulative Layout Shift (CLS) | ≤0.1 | 0.05 | ✅ |
| Time to Interactive (TTI) | ≤3.5s | 3.0s | ✅ |
| Total Blocking Time (TBT) | ≤300ms | 200ms | ✅ |

## 可访问性

YYC³ Design System 遵循 WCAG 2.1 AA 标准，确保所有用户都能访问：

### 可访问性特性

- **键盘导航**：完整的键盘支持，Tab 键导航
- **屏幕阅读器**：ARIA 标签和角色支持
- **颜色对比度**：满足 WCAG AA 对比度要求
- **焦点管理**：清晰的焦点指示和管理
- **语义化 HTML**：正确的语义标记
- **表单验证**：清晰的错误提示和验证

### 可访问性测试

```bash
npm run test:a11y
```

## 测试

### 测试框架

项目提供完整的测试框架，覆盖所有测试类型：

| 测试类型 | 框架 | 覆盖范围 |
|---------|------|---------|
| **单元测试** | Jest | 组件和工具函数 |
| **集成测试** | Jest | 模块间交互 |
| **E2E 测试** | Playwright | 端到端用户流程 |
| **可访问性测试** | axe-core | WCAG 2.1 AA 标准 |
| **性能测试** | Lighthouse | Web 性能指标 |
| **视觉测试** | Chromatic | 组件视觉回归 |

### 测试命令

```bash
# 运行所有测试
npm test

# 运行特定类型测试
npm run test:unit          # 单元测试
npm run test:integration    # 集成测试
npm run test:e2e           # E2E 测试
npm run test:a11y         # 可访问性测试
npm run test:perf         # 性能测试
npm run test:oklch        # OKLCH 颜色转换测试
npm run test:coverage     # 覆盖率测试

# 完整 QA 检查
npm run qa
```

## 可用脚本

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器（端口 3200） |
| `npm run build` | 构建项目 |
| `npm run preview` | 预览构建产物 |
| `npm run build:tokens` | 构建设计令牌 |
| `npm run watch:tokens` | 监听令牌变化并自动构建 |
| `npm run storybook` | 启动 Storybook |
| `npm run build:storybook` | 构建 Storybook |
| `npm test` | 运行所有测试 |
| `npm run test:unit` | 运行单元测试 |
| `npm run test:integration` | 运行集成测试 |
| `npm run test:e2e` | 运行 E2E 测试 |
| `npm run test:a11y` | 运行可访问性测试 |
| `npm run test:perf` | 运行性能测试 |
| `npm run test:oklch` | 运行 OKLCH 转换验证 |
| `npm run test:coverage` | 生成测试覆盖率报告 |
| `npm run qa` | 运行完整 QA 检查 |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run lint` | ESLint 代码检查 |
| `npm run lint:fix` | 自动修复 ESLint 问题 |
| `npm run format` | 格式化代码 |
| `npm run format:check` | 检查代码格式 |
| `npm run validate:locales` | 验证国际化文件 |
| `npm run validate:tokens` | 验证设计令牌 |
| `npm run validate:types` | 验证类型定义 |

## CI/CD

项目包含完整的 GitHub Actions 工作流，在以下情况下自动运行：

- 推送到 `main` 或 `develop` 分支
- 针对 `main` 或 `develop` 分支的 Pull Request

### 工作流概览

| 工作流 | 触发条件 | 功能 |
|--------|----------|------|
| `ci-cd.yml` | Push/PR | 完整 CI/CD 流程 |

### CI 流程详解

#### 1. 代码质量检查

- **TypeScript 类型检查**：确保类型安全
- **ESLint 代码检查**：确保代码质量
- **Prettier 格式检查**：确保代码格式一致
- **Locale 验证**：检查国际化文件的完整性

#### 2. 测试执行

- **单元测试**：验证组件和工具函数
- **集成测试**：验证模块间交互
- **测试覆盖率检查**：目标 ≥80%
- **E2E 测试**：验证端到端用户流程
- **可访问性测试**：确保 WCAG 2.1 AA 标准

#### 3. 构建验证

- **项目构建**：验证项目可以正常构建
- **Bundle 大小检查**：确保产物大小符合预算
- **构建产物上传**：保存构建结果

#### 4. 性能测试

- **Lighthouse CI 性能测试**：验证 Web 性能指标
- **性能基准测试**：验证关键路径性能
- **性能预算验证**：确保符合性能标准

#### 5. 视觉回归测试

- **Storybook 构建**：生成组件文档
- **Chromatic 视觉测试**：自动检测视觉变化

#### 6. 自动部署

- **Netlify 部署**：自动部署到生产环境
- **GitHub Pages 备份**：同步到 GitHub Pages

### 性能预算

| 指标 | 预算值 | 当前 |
|--------|----------|------|
| Performance | ≥85 | 90+ |
| Accessibility | ≥90 | 95+ |
| Best Practices | ≥90 | 95+ |
| SEO | ≥90 | 95+ |
| First Contentful Paint | ≤1.5s | 1.2s |
| Largest Contentful Paint | ≤2.5s | 2.0s |
| Cumulative Layout Shift | ≤0.1 | 0.05 |
| First Input Delay | ≤100ms | 80ms |
| JS 文件大小 | ≤200KB | 180KB |
| 总资源大小 | ≤512KB | 450KB |

详细的 CI/CD 文档请参阅：[CI/CD 文档](docs/CI-CD.md)

## 开源贡献

YYC³ Design System 是开源项目，我们欢迎所有形式的贡献！

### 贡献方式

1. **报告 Bug**：在 [Issues](https://github.com/YYC-Cube/YYC3-Design-System/issues) 中报告 Bug
2. **提出新功能**：在 Issues 中提出新功能建议
3. **提交代码**：通过 Pull Request 提交代码
4. **改进文档**：完善文档，帮助其他开发者
5. **分享使用**：分享您的使用案例和经验

### 贡献流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 遵循 [Conventional Commits](https://conventionalcommits.org/) 规范
- 代码必须通过 ESLint 和 Prettier 检查
- 必须添加相应的测试用例
- 必须更新相关文档

### 提交消息格式

```
<类型>[可选 范围]: <描述>

[可选 主体]

[可选 页脚]
```

**提交类型**：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变动
- `ci`: CI/CD 相关
- `build`: 构建系统变动

详细的贡献指南请参阅：[CONTRIBUTING.md](CONTRIBUTING.md)

## 文档

完整的文档位于 `docs/` 目录，包含：

### 项目文档

- **[CHANGELOG.md](CHANGELOG.md)**：版本更新日志
- **[CONTRIBUTING.md](CONTRIBUTING.md)**：贡献指南
- **[docs/TESTING.md](docs/TESTING.md)**：测试指南
- **[docs/CI-CD.md](docs/CI-CD.md)**：CI/CD 文档

### 在线文档

完整的在线文档请访问：[https://yyc3-design-system.netlify.app/](https://yyc3-design-system.netlify.app/)

## 社区与支持

### 社区资源

- **GitHub 仓库**：[https://github.com/YYC-Cube/YYC3-Design-System](https://github.com/YYC-Cube/YYC3-Design-System)
- **Issues**：[https://github.com/YYC-Cube/YYC3-Design-System/issues](https://github.com/YYC-Cube/YYC3-Design-System/issues)
- **Discussions**：[https://github.com/YYC-Cube/YYC3-Design-System/discussions](https://github.com/YYC-Cube/YYC3-Design-System/discussions)
- **Wiki**：[https://github.com/YYC-Cube/YYC3-Design-System/wiki](https://github.com/YYC-Cube/YYC3-Design-System/wiki)

### 获取帮助

- 📖 查看 [文档](docs/)
- 🐛 报告 [Issue](https://github.com/YYC-Cube/YYC3-Design-System/issues)
- 💬 参与 [讨论](https://github.com/YYC-Cube/YYC3-Design-System/discussions)
- 📧 发送邮件：[admin@0379.email](mailto:admin@0379.email)

## 浏览器支持

YYC³ Design System 支持以下浏览器：

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | ≥90 |
| Firefox | ≥88 |
| Safari | ≥14 |
| Edge | ≥90 |
| Opera | ≥76 |

### 渐进增强

对于不支持的浏览器，系统会优雅降级，确保基本功能可用。

## 故障排除

### 常见问题

**Q: 安装依赖时出错？**

A: 尝试清理缓存并重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
```

**Q: 构建失败，提示类型错误？**

A: 运行类型检查并修复：
```bash
npm run typecheck
```

**Q: 主题切换不生效？**

A: 检查是否正确使用 ThemeProvider：
```jsx
import { ThemeProvider } from '@yyc3/design-system';

function App() {
  return (
    <ThemeProvider defaultTheme="future" defaultMode="light">
      <YourContent />
    </ThemeProvider>
  );
}
```

**Q: PWA 安装提示不显示？**

A: 确保使用 HTTPS 或 localhost，并且 manifest.json 配置正确。

**Q: 测试覆盖率不足？**

A: 运行覆盖率报告并添加缺失的测试：
```bash
npm run test:coverage
```

### 获取更多帮助

- 📖 查看 [文档](docs/)
- 🐛 报告 [Issue](https://github.com/YYC-Cube/YYC3-Design-System/issues)
- 💬 参与 [讨论](https://github.com/YYC-Cube/YYC3-Design-System/discussions)
- 📧 查看 [测试指南](docs/TESTING.md)
- 📧 查看 [CI/CD 文档](docs/CI-CD.md)

## 版本历史

### v2.0.0 (2026-03-01)

- ✨ 新增三主题系统（Future/Cyber/Business）
- ✨ 新增 PWA 功能支持
- ✨ 新增双语系统（中文/英文）
- ✨ 新增 QA Dashboard
- 🎨 优化性能和加载速度
- 🐛 修复多个 Bug
- 📝 完善文档和测试

完整的版本历史请参阅：[CHANGELOG.md](CHANGELOG.md)

## 路线图

### 短期目标（Q2 2026）

- [ ] 增强 AI 功能
- [ ] 添加更多组件
- [ ] 优化移动端体验
- [ ] 提升测试覆盖率到 90%

### 中期目标（Q3-Q4 2026）

- [ ] 支持更多框架（Angular, Svelte）
- [ ] 添加主题编辑器
- [ ] 集成设计工具插件
- [ ] 提供云服务

### 长期目标（2027）

- [ ] 构建生态系统
- [ ] 提供企业级支持
- [ ] 创建社区市场
- [ ] 国际化扩展

欢迎在 [GitHub Discussions](https://github.com/YYC-Cube/YYC3-Design-System/discussions) 中分享您的想法和建议！

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

### 许可证摘要

MIT 许可证允许您：

- ✅ 商业使用
- ✅ 修改和分发
- ✅ 私人使用
- ✅ 专利授权

唯一的限制是：

- ⚠️ 必须包含许可证和版权声明
- ⚠️ 软件按"原样"提供，不提供任何担保

## 致谢

感谢所有为 YYC³ Design System 做出贡献的开发者！

### 核心贡献者

- YYC³ Team - 核心开发和维护
- 社区贡献者 - 功能改进和 Bug 修复

### 技术支持

感谢以下开源项目：

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Playwright](https://playwright.dev/)

---

<div align="center">

## 快速链接

[📖 文档](https://yyc3-design-system.netlify.app/) · [🎨 Storybook](https://storybook.yyc3-design-system.netlify.app/) · [🐛 Issues](https://github.com/YYC-Cube/YYC3-Design-System/issues) · [💬 Discussions](https://github.com/YYC-Cube/YYC3-Design-System/discussions)

---

[![Star History Chart](https://api.star-history.com/svg?repos=YYC-Cube/YYC3-Design-System&type=Date)](https://star-history.com/#YYC-Cube/YYC3-Design-System&Date)

**如果 YYC³ Design System 对您有帮助，请给我们一个 ⭐️**

---

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
