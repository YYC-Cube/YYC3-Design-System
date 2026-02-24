# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-02-22

### Added
- MVP开发第三阶段：测试和发布准备
- 完整的单元测试套件，覆盖所有核心组件
  - Button组件测试：基础渲染、变体、尺寸、状态、事件、可访问性
  - Input组件测试：类型、验证、受控组件、事件
  - Card组件测试：CardHeader、CardTitle、CardDescription、CardContent、CardFooter
  - Modal组件测试：关闭功能、键盘事件、子组件、可访问性
  - Grid组件测试：列数配置、间距配置、子元素渲染
  - Container组件测试：最大宽度配置、居中布局、响应式行为
  - 主题系统测试：主题切换、持久化、useTheme Hook
- 集成测试：验证组件间的协作和复杂场景
- 性能测试：确保组件渲染和交互性能
- 发布准备：版本管理、CHANGELOG更新

### Changed
- 优化了Vite构建配置，提升代码分割和压缩效率
- 增强了性能监控功能，支持完整的Web Vitals指标
- 更新了项目版本至1.4.0

### Fixed
- 修复了文档站点中Grid和Container组件的链接
- 修复了集成测试中的useTheme导入问题

## [Unreleased]

## [1.3.0] - 2026-02-22

### Added
- MVP开发第二阶段：文档站点和性能监控
- 响应式布局组件：Grid和Container
- 性能监控系统：Web Vitals监控和性能仪表板
- 完整的文档站点：组件文档和设计令牌文档
- 性能优化：代码分割、懒加载、资源压缩

### Changed
- 优化了构建配置，提升了构建效率和产物质量
- 增强了主题系统，支持localStorage持久化

### Fixed
- 修复了Storybook依赖冲突问题
- 修复了VitePress安装失败问题，改用静态HTML文档站点

## [1.2.0] - 2026-02-22

### Added
- MVP开发第一阶段：核心组件和基础架构
- 核心UI组件：Button、Input、Card、Modal
- 主题系统：ThemeProvider和useTheme Hook
- 设计令牌系统：颜色、字体、间距、阴影
- Storybook配置和组件Stories

### Changed
- 重构了项目结构，符合YYC³标准
- 配置了Vite、Tailwind CSS、TypeScript
- 配置了ESLint和Prettier代码规范

### Fixed
- 修复了TypeScript类型定义问题
- 修复了Tailwind CSS配置问题

## [1.1.0] - 2026-02-21

### Added
- 阶段五：性能优化与安全加固
- 性能监控和优化策略
- 安全审计和漏洞修复
- 高可用架构设计

### Changed
- 优化了构建流程
- 增强了代码质量检查

## [1.0.0] - 2026-02-20

### Added
- YYC³ Design System初始版本
- 基础项目结构
- 设计令牌系统
- 核心组件框架
- 文档系统

### Changed
- 建立了完整的开发规范
- 配置了开发工具链

## [0.1.0] - 2026-02-19

### Added
- 项目初始化
- 基础配置
- 开发环境搭建

---

[Unreleased]: https://github.com/yyc3/yyc3-design-system/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/yyc3/yyc3-design-system/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/yyc3/yyc3-design-system/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/yyc3/yyc3-design-system/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/yyc3/yyc3-design-system/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/yyc3/yyc3-design-system/releases/tag/v0.1.0
