# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- AI 功能：智能令牌生成器（AITokenGenerator）
- AI 功能：配色方案推荐器（AIColorRecommender）
- AI 功能：设计一致性检查器（AIConsistencyChecker）
- AI 功能：使用模式分析器（AIUsageAnalyzer）
- AI 功能：最佳实践建议生成器（AIBestPractices）
- 协作功能：实时编辑器（RealtimeEditor）
- 协作功能：多用户管理器（MultiUserManager）
- 协作功能：变更同步管理器（ChangeSyncManager）
- 协作功能：冲突解决器（ConflictResolver）
- CLI 工具：一致性检查命令（yyc3:check）
- CLI 工具：使用分析命令（yyc3:analyze）
- CLI 工具：最佳实践建议命令（yyc3:best-practices）
- CLI 工具：令牌生成命令（yyc3:generate-tokens）
- CLI 工具：配色方案推荐命令（yyc3:recommend-colors）
- CLI 工具：完整审计命令（yyc3:audit）
- CI/CD 工作流：AI 审计任务集成
- CI/CD 工作流：E2E 测试任务集成
- CI/CD 工作流：安全扫描任务集成
- CI/CD 工作流：自动化部署配置

### Changed
- 更新 README.md 添加 AI 功能和协作功能文档
- 更新核心特性列表
- 更新 CLI 工具文档
- 更新 CI/CD 工作流配置

### Documentation
- 创建 AI 功能文档（docs/AI功能文档.md）
- 创建协作指南（docs/协作指南.md）
- 更新 README.md 添加 AI 功能和协作功能说明

## [1.3.0] - 2026-02-18

### Added
- 多框架支持：React、Vue 3 和 Svelte 组件库
- Vue 3 组件：Button, Input, Card, Badge, Avatar
- Svelte 组件：Button, Input, Card, Badge, Avatar
- Token Playground 可视化工具组件
- 颜色对比度检查器组件
- 可视化工具集成到 Storybook
- 视觉回归测试集成（Chromatic）
- E2E 测试集成（Playwright）
- 完整的 CI/CD 工作流配置
- 组件使用指南文档
- 设计原则文档
- 品牌指南文档
- 交互规范文档
- 可访问性指南文档

### Changed
- 更新 README.md 添加多框架支持和可视化工具
- 更新核心特性列表
- 更新文档结构

### Documentation
- 创建完整的组件使用指南（docs/COMPONENT_USAGE.md）
- 创建设计原则文档（docs/DESIGN_PRINCIPLES.md）
- 创建品牌指南文档（docs/BRAND_GUIDE.md）
- 创建交互规范文档（docs/INTERACTION_GUIDELINES.md）
- 创建可访问性指南文档（docs/ACCESSIBILITY_GUIDE.md）

## [1.2.0] - 2026-02-18

### Added
- 暗色主题支持和主题切换功能
- 动画系统和 Animated 组件
- 10个新组件：Checkbox, Radio, Switch, Progress, Spinner, Alert, Tabs, Modal, Tooltip, Divider, Select
- ThemeToggle 主题切换组件
- 可访问性测试集成（jest-axe）
- 性能优化工具（useDebounce, useThrottle, useMemoizedCallback）
- 动画令牌系统
- 动画工具函数（fadeIn, fadeOut, slideInUp 等）
- Storybook 主题切换支持
- 组件性能优化（useCallback, useMemo）
- 完整的可访问性测试覆盖

### Changed
- 优化 ThemeProvider 性能，使用 useCallback 和 useMemo
- 优化 Animated 组件性能
- 优化 Select 组件性能
- 更新所有组件以支持主题切换
- 改进 Storybook 配置以支持主题预览

### Fixed
- 修复主题切换时的状态管理问题
- 修复动画组件的重复渲染问题
- 修复可访问性测试中的主题上下文问题

### Documentation
- 更新 README.md 添加新组件文档
- 添加动画系统使用指南
- 添加主题切换使用指南
- 添加可访问性测试文档
- 添加性能优化文档

## [1.1.0] - 2026-02-18

### Added
- TypeScript 类型定义和类型安全支持
- 核心组件：Input, Card, Badge, Avatar
- ESLint 和 Prettier 代码质量工具配置
- Jest 测试框架配置和测试支持
- 组件单元测试覆盖

### Changed
- 修复令牌引用方法，使用扁平化键名访问
- 迁移现有组件到 TypeScript
- 更新测试以支持 TypeScript
- 改进主题提供器的令牌访问方式

### Fixed
- 修复 TypeScript 编译错误
- 修复 Jest 测试配置问题
- 修复组件令牌访问错误

## [1.0.0] - 2026-02-17

### Added
- 初始版本发布
- 设计令牌系统
- OKLch 颜色空间支持
- Style Dictionary 构建流程
- Button 组件
- ThemeProvider 和 useTheme hooks
- Storybook 集成
- CI/CD 工作流
- OKLCH 转换测试
- 设计令牌文档

### Features
- 单一事实源设计令牌系统
- 自动化构建和导出流程
- 完整的测试框架
- 组件文档和实时预览
- GitHub Actions 集成

### Documentation
- README.md 项目文档
- 设计令牌使用指南
- 组件使用示例
- 贡献指南

---

## 版本说明

- **Added**: 新增功能
- **Changed**: 现有功能的变更
- **Deprecated**: 即将移除的功能
- **Removed**: 已移除的功能
- **Fixed**: Bug 修复
- **Security**: 安全性修复
