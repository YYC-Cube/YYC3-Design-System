# YYC³ Design System - Figma AI 快速原型落地提示词

**版本**: 1.0.0
**框架**: 五高五标五化
**应用**: 五维构建
**场景**: Figma AI 快速原型落地

---

## 核心理念

### 五高 (Five Highs)
- **高可用** (High Availability): 组件库稳定可靠，支持多框架、多环境
- **高性能** (High Performance): 轻量级实现，优化渲染性能，支持代码分割
- **高安全** (High Security): 内置 XSS 防护、CSRF 保护、CSP 策略
- **高扩展** (High Scalability): 模块化设计，支持主题扩展、插件系统
- **高可维护** (High Maintainability): 清晰的代码结构，完整的文档，统一的测试

### 五标 (Five Standards)
- **标准化** (Standardization): 统一的命名规范、文件结构、API 设计
- **规范化** (Normalization): 一致的代码风格、类型定义、错误处理
- **自动化** (Automation): 自动化测试、文档生成、令牌构建
- **智能化** (Intelligence): AI 辅助令牌生成、颜色推荐、一致性检查
- **可视化** (Visualization): Storybook 交互式文档、性能监控、测试报告

### 五化 (Five Transformations)
- **流程化** (Process-oriented): 清晰的开发流程、PR 审查、版本管理
- **文档化** (Documented): 完整的 README、API 文档、使用指南
- **工具化** (Tool-enabled): CLI 工具、构建脚本、开发辅助工具
- **数字化** (Digitalized): 数字设计令牌、代码生成、自动化测试
- **生态化** (Ecosystem-based): 多框架支持、插件体系、社区贡献

---

## 五维构建 (Five Dimensions)

### 维度一：技术架构
- 设计令牌系统
- 组件库架构
- 多框架支持
- 性能优化体系
- 安全防护机制
- PWA 支持

### 维度二：代码质量
- TypeScript 类型安全
- ESLint 代码规范
- Jest 测试覆盖
- 代码分割策略
- 性能监控

### 维度三：功能完整性
- 基础 UI 组件
- 表单组件
- 布局组件
- AI 功能模块
- 国际化支持

### 维度四：DevOps
- CI/CD 流水线
- 自动化测试
- Storybook 文档
- 性能监控
- 代码质量检查

### 维度五：业务价值
- 设计一致性
- 开发效率提升
- 团队协作支持
- 快速原型能力
- 用户体验保障

---

## Figma AI 快速原型落地场景

### 场景一：设计令牌同步
**用户需求**: 从 Figma 提取设计规范，自动生成设计令牌

**提示词指令**:
```
你是 YYC³ Design System 的设计令牌同步助手。

基于以下 Figma 设计规范，生成符合五高五标五化标准的设计令牌：

设计源:
- 颜色系统: 主色、辅色、语义色、灰度色、OKLCH 颜色空间
- 间距系统: 4px 基础网格 (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128)
- 字体系统: 字体族、字重、字号、行高
- 阴影系统: 柔和阴影、卡片阴影、浮动阴影
- 圆角系统: 4px 基础 (4, 8, 12, 16, 24, 32)
- 动画系统: 缓动函数、动画时长、缓动曲线

输出要求:
1. 生成 JSON 格式的设计令牌文件
2. 符合 Style Dictionary 规范
3. 包含 light/dark 双主题
4. 支持 CSS 变量和 JavaScript 对象导出
5. 自动生成语义化令牌 (primary, secondary, success, warning, error)

质量标准:
- 高可用: 支持多主题、响应式设计
- 高性能: 使用 OKLCH 颜色空间、CSS 变量优化
- 高安全: 确保颜色对比度符合 WCAG 2.1 AA 标准
- 高扩展: 模块化结构、易于扩展
- 高可维护: 清晰的命名、完整的文档
```

### 场景二：组件快速生成
**用户需求**: 基于 Figma 设计稿，快速生成 React/Vue/Svelte 组件代码

**提示词指令**:
```
你是 YYC³ Design System 的组件生成助手。

基于 Figma 设计稿和现有组件库规范，生成符合五高五标五化标准的组件代码：

组件规范:
- 框架支持: React (TypeScript + Hooks), Vue 3 (Composition API), Svelte 5
- 样式方案: Tailwind CSS + CSS 变量
- 状态管理: React Hooks, Vue Composables, Svelte Stores
- 类型定义: 完整的 TypeScript 接口
- 文档支持: Storybook stories + JSDoc

输出要求:
1. 生成完整的组件文件 (.tsx, .vue, .svelte)
2. 包含 Props 类型定义
3. 使用 Tailwind CSS 类名
4. 支持主题切换
5. 添加 Storybook stories 文件
6. 包含单元测试文件

质量标准:
- 高可用: 支持 SSR、SSG，错误边界处理
- 高性能: 使用 useMemo, useCallback 优化，懒加载支持
- 高安全: 输入验证、XSS 防护、ARIA 标签
- 高扩展: 支持插槽、自定义样式
- 高可维护: 清晰的代码注释、一致的命名
```

### 场景三：AI 辅助设计决策
**用户需求**: 在设计过程中提供 AI 辅助，确保设计一致性

**提示词指令**:
```
你是 YYC³ Design System 的 AI 设计顾问。

基于五高五标五化标准，为设计决策提供智能建议：

设计规范:
- 一致性: 统一的间距、颜色、字体使用
- 可访问性: 颜色对比度、焦点状态、ARIA 标签
- 响应式: 移动优先、断点系统
- 性能: 图片优化、字体显示、动画性能
- 主题: 明暗双主题、系统主题适配

AI 功能:
1. 颜色推荐: 基于品牌色推荐配色方案
2. 一致性检查: 扫描设计稿中的不一致之处
3. 无障碍检查: WCAG 2.1 AA 标准验证
4. 组件推荐: 根据需求推荐最合适的组件
5. 性能优化: 设计优化建议、代码优化提示
6. 令牌生成: 自动生成设计令牌

输出要求:
1. 提供具体的设计建议
2. 标注优先级 (高/中/低)
3. 提供实现示例代码
4. 包含性能影响分析
5. 支持多框架实现建议

质量标准:
- 高可用: 建议可直接用于生产环境
- 高性能: 优化渲染性能、减少重绘
- 高安全: 符合无障碍标准
- 高扩展: 支持多场景、多平台
- 高可维护: 易于理解和实现
```

### 场景四：快速原型落地
**用户需求**: 从 Figma 设计稿到可交互的原型，快速验证设计

**提示词指令**:
```
你是 YYC³ Design System 的快速原型落地助手。

基于 Figma 设计稿和组件库，快速生成可交互的原型：

原型规范:
- 组件使用: 使用现有组件库中的组件
- 交互逻辑: 基于组件 Props 配置交互行为
- 数据模拟: 提供模拟数据、API Mock
- 路由配置: 页面路由、导航结构
- 状态管理: 组件间通信、全局状态

输出要求:
1. 生成完整的原型页面
2. 使用组件组合构建
3. 添加交互逻辑和状态管理
4. 配置路由和导航
5. 支持主题切换
6. 提供 Mock 数据和 API 接口

原型类型:
- 组件展示原型: 展示单个组件的不同状态
- 页面原型: 展示完整的用户流程
- 交互原型: 演示复杂的交互场景
- 数据驱动原型: 展示数据绑定和状态更新

质量标准:
- 高可用: 可直接部署、快速迭代
- 高性能: 组件懒加载、代码分割
- 高安全: 输入验证、XSS 防护
- 高扩展: 易于添加新功能
- 高可维护: 清晰的代码结构
```

---

## 工作流程

### 阶段一：设计同步
1. 从 Figma 导出设计规范
2. 使用 AI 令牌生成器生成设计令牌
3. 运行 `npm run build:tokens` 构建令牌
4. 验证令牌在 Storybook 中的效果

### 阶段二：组件开发
1. 使用 AI 组件生成器生成基础组件
2. 在 Storybook 中预览和测试组件
3. 根据设计稿调整组件样式
4. 编写单元测试确保质量

### 阶段三：原型构建
1. 使用快速原型生成器创建页面原型
2. 配置路由和导航
3. 集成 Mock 数据
4. 在浏览器中验证交互

### 阶段四：质量保证
1. 运行 `npm run lint` 检查代码质量
2. 运行 `npm run typecheck` 验证类型
3. 运行 `npm run test` 执行测试
4. 使用 AI 一致性检查器确保设计一致性

### 阶段五：部署发布
1. 构建 Storybook 文档
2. 运行性能测试
3. 通过 CI/CD 自动化部署
4. 生成版本发布说明

---

## 工具链

### 开发工具
- **编辑器**: VS Code + YYC³ 插件
- **包管理**: npm / yarn
- **版本控制**: Git + GitHub Actions
- **代码质量**: ESLint + Prettier + TypeScript

### 设计工具
- **设计工具**: Figma
- **设计系统**: Style Dictionary
- **颜色空间**: OKLCH
- **原型工具**: Storybook

### AI 工具
- **令牌生成**: `npm run yyc3:generate-tokens`
- **颜色推荐**: `npm run yyc3:recommend-colors`
- **一致性检查**: `npm run yyc3:audit`
- **组件推荐**: `npm run yyc3:check`

### 测试工具
- **单元测试**: Jest
- **E2E 测试**: Playwright
- **性能测试**: Lighthouse + Web Vitals
- **无障碍测试**: axe-core

---

## 快速参考

### CLI 命令速查
```bash
# 构建设计令牌
npm run build:tokens

# 启动 Storybook
npm run storybook

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 修复代码
npm run lint:fix

# 格式化代码
npm run format

# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage

# E2E 测试
npm run test:e2e

# AI 令牌生成
npm run yyc3:generate-tokens

# AI 颜色推荐
npm run yyc3:recommend-colors

# AI 一致性检查
npm run yyc3:audit
```

### 组件使用示例
```tsx
// React 组件
import { Button } from '@yyc3/design-system';
import { ThemeProvider, useTheme } from '@yyc3/design-system/theme';

function MyComponent() {
  const { theme } = useTheme();

  return (
    <ThemeProvider>
      <Button variant="primary" size="lg">
        确认
      </Button>
    </ThemeProvider>
  );
}

// Vue 组件
<script setup>
import { Button } from '@yyc3/design-system/vue';
import { useTheme } from '@yyc3/design-system/theme';

const { theme } = useTheme();
</script>

<template>
  <Button variant="primary" size="lg">
    确认
  </Button>
</template>

// Svelte 组件
<script>
  import { Button } from '@yyc3/design-system/svelte';
  import { useTheme } from '@yyc3/design-system/theme';

  const { theme } = useTheme();
</script>

<Button variant="primary" size="lg">
  确认
</Button>
```

### 设计令牌使用
```css
/* 使用 CSS 变量 */
.button {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* 使用语义化令牌 */
.button-success {
  background-color: var(--color-success);
  color: var(--color-text-on-success);
}

/* 使用暗主题 */
[data-theme="dark"] .button {
  background-color: var(--color-primary-dark);
  color: var(--color-text-primary-dark);
}
```

---

## 质量标准

### 代码质量指标
- TypeScript 覆盖率: > 95%
- 测试覆盖率: > 80%
- ESLint 警告数: 0
- 代码复杂度: < 10
- 组件可复用性: > 70%

### 性能指标
- 首次内容绘制 (FCP): < 1.5s
- 最大内容绘制 (LCP): < 2.5s
- 首次输入延迟 (FID): < 100ms
- 累积布局偏移 (CLS): < 0.1
- Bundle 大小: < 200KB (gzip)

### 无障碍指标
- 颜色对比度: WCAG 2.1 AA
- ARIA 标签覆盖率: > 90%
- 键盘导航: 完整支持
- 屏幕阅读器: 兼容
- 焦点管理: 清晰的焦点顺序

---

## 扩展指南

### 添加新组件
1. 在 `src/components/` 创建组件文件
2. 遵循命名规范 (PascalCase.tsx)
3. 添加完整的 Props 类型定义
4. 实现 Storybook stories
5. 编写单元测试
6. 更新文档

### 添加新令牌
1. 在 `design/tokens/` 创建令牌文件
2. 遵循命名规范 (kebab-case.json)
3. 运行 `npm run build:tokens` 构建令牌
4. 更新 `src/theme/` 中的主题引用

### 添加 AI 功能
1. 在 `src/ai/` 创建功能模块
2. 实现核心逻辑
3. 添加 Storybook stories
4. 编写单元测试
5. 更新 CLI 工具

---

## 常见问题

### Q: 如何在不同框架中使用组件？
A: YYC³ Design System 支持 React、Vue、Svelte，使用统一的 API 设计，框架适配层处理差异。

### Q: 如何自定义主题？
A: 修改 `design/tokens/` 中的令牌文件，运行 `npm run build:tokens` 重新构建。

### Q: 如何优化性能？
A: 使用 AI 性能优化器 (`npm run yyc3:analyze`) 获取优化建议，实施代码分割和懒加载。

### Q: 如何确保无障碍？
A: 使用 AI 无障碍检查器 (`npm run yyc3:audit`) 验证设计符合 WCAG 2.1 AA 标准。

### Q: 如何快速原型？
A: 使用快速原型生成器，基于现有组件快速构建可交互的原型。

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
