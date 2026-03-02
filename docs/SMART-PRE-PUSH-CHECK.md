# 智能远程提交前检测系统

> **YYC³ 五高五标五化标准** - 多维度代码质量保障

## 概述

智能远程提交前检测系统是 YYC³ 项目的重要组成部分，确保所有推送到远程仓库的代码都符合高质量标准。该系统通过 8 个维度的全面检查，保障代码质量、安全性和项目标准的遵循。

## 检测维度

### 1️⃣ 环境检查
- ✅ Node.js 版本验证
- ✅ 依赖项完整性检查
- ✅ 必要文件存在性验证（package.json, tsconfig.json, vite.config.ts, README.md）

### 2️⃣ Git 状态检查
- ✅ 当前分支信息
- ✅ 工作区状态检测
- ✅ 远程同步状态
- ✅ 未提交更改提醒

### 3️⃣ 代码质量检查
- ✅ TypeScript 类型检查（tsc --noEmit）
- ✅ ESLint 代码规范检查
- ✅ Prettier 代码格式检查

### 4️⃣ 测试检查
- ✅ 单元测试验证
- ✅ 测试覆盖率检查（可选）
- ✅ E2E 测试验证（可选）

### 5️⃣ 性能检查
- ✅ 构建时间监控
- ✅ 包大小检查
- ✅ 性能基准验证

### 6️⃣ 安全检查
- ✅ 依赖漏洞扫描（pnpm audit）
- ✅ 敏感信息检测（密码、密钥、token）
- ✅ 配置文件安全性验证

### 7️⃣ 文档检查
- ✅ README.md 完整性验证
- ✅ 必要章节检查（概述、功能特性、快速开始、技术栈）
- ✅ 多语言文档一致性检查

### 8️⃣ YYC³ 标准检查
- ✅ 项目命名规范验证（yyc3- 前缀）
- ✅ 端口配置检查（3200-3500 默认范围）
- ✅ 文件头注释覆盖率（@file, @description, @author）

## 使用方式

### 自动触发

在执行 `git push` 时，系统会自动运行完整检测：

```bash
git push origin main
```

### 手动运行

#### 完整检测（推荐）
```bash
pnpm prepush
```

#### 快速模式
跳过性能检查、E2E 测试等耗时操作：

```bash
pnpm prepush --fast
```

#### 自定义跳过
```bash
# 跳过测试检查
pnpm prepush --skip-tests

# 跳过覆盖率检查
pnpm prepush --skip-coverage

# 跳过 E2E 测试
pnpm prepush --skip-e2e

# 组合使用
pnpm prepush --fast --skip-e2e
```

## 检测结果

### 成功示例

```
╔══════════════════════════════════════════════════════════╗
║           YYC³ 智能远程提交前检测系统                    ║
║        Five-High/Five-Standard/Five-Implementation         ║
╚══════════════════════════════════════════════════════════╝

📊 检测报告

✅ 通过: 15
⚠️ 警告: 0
❌ 失败: 0
ℹ️ 总耗时: 45.23s

✅ 所有检测通过！可以安全推送到远程仓库。

╔══════════════════════════════════════════════════════════╗
║              符合 YYC³ 五高五标五化标准                    ║
╚══════════════════════════════════════════════════════════╝
```

### 失败示例

```
📊 检测报告

✅ 通过: 10
⚠️ 警告: 1
❌ 失败: 1
ℹ️ 总耗时: 16.63s

⚠️ 警告详情
⚠️ [security] 依赖漏洞扫描
  存在漏洞

❌ 失败详情
❌ [testing] 单元测试
  测试失败

🎯 最终结果

❌ 检测失败！请修复上述问题后再推送。

💡 提示: 使用 --fast 跳过性能检查
💡 提示: 使用 --skip-tests 跳过测试检查
💡 提示: 使用 --skip-coverage 跳过覆盖率检查
💡 提示: 使用 --skip-e2e 跳过 E2E 测试
```

## 配置选项

### 命令行参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `--fast` | 快速模式，跳过耗时检查 | `pnpm prepush --fast` |
| `--skip-tests` | 跳过所有测试检查 | `pnpm prepush --skip-tests` |
| `--skip-coverage` | 跳过测试覆盖率检查 | `pnpm prepush --skip-coverage` |
| `--skip-e2e` | 跳过 E2E 测试检查 | `pnpm prepush --skip-e2e` |

### Git 钩子配置

脚本已自动配置到 `.husky/pre-push`，在每次 `git push` 时自动运行。

如需临时跳过钩子检查（不推荐）：

```bash
git push --no-verify
```

## 常见问题

### Q1: 如何解决"依赖漏洞扫描"警告？

```bash
# 查看详细漏洞信息
pnpm audit

# 自动修复可修复的漏洞
pnpm audit fix

# 手动更新有漏洞的包
pnpm update <package-name>
```

### Q2: 单元测试失败如何处理？

```bash
# 查看详细测试失败信息
pnpm test

# 运行特定测试文件
pnpm test -- <test-file>

# 调试模式运行测试
pnpm test:watch
```

### Q3: 构建时间过长怎么办？

```bash
# 分析构建性能
pnpm build --mode development

# 优化依赖项
pnpm build:analyze
```

### Q4: 如何临时跳过某些检查？

```bash
# 快速模式（推荐用于频繁提交）
pnpm prepush --fast

# 跳过特定检查
pnpm prepush --skip-tests
pnpm prepush --skip-coverage
pnpm prepush --skip-e2e
```

## YYC³ 标准说明

### 五高 (Five Highs)
- **高可用**: 通过完整的测试套件确保系统可用性
- **高性能**: 构建时间和包大小监控
- **高安全**: 依赖漏洞扫描和敏感信息检测
- **高扩展**: 代码质量检查确保可维护性
- **高可维护**: 代码规范和文档完整性验证

### 五标 (Five Standards)
- **标准化**: 统一的命名规范和端口配置
- **规范化**: 代码格式和注释标准
- **自动化**: 自动化测试和检查流程
- **智能化**: 智能检测和问题提示
- **可视化**: 彩色输出和清晰的报告格式

### 五化 (Five Transformations)
- **流程化**: 标准化的 Git 工作流
- **文档化**: 文档完整性检查
- **工具化**: 自动化工具链集成
- **数字化**: 量化的检测指标
- **生态化**: 与现有工具生态集成

## 最佳实践

### 1. 开发流程
```bash
# 1. 开发功能
git checkout -b feature/new-feature

# 2. 提交前检查
pnpm precommit

# 3. 本地验证
pnpm prepush --fast

# 4. 完整检测
pnpm prepush

# 5. 推送到远程
git push origin feature/new-feature
```

### 2. CI/CD 集成

在 CI/CD 流程中集成检测脚本：

```yaml
# .github/workflows/ci.yml
- name: YYC³ Smart Pre-Push Check
  run: pnpm prepush
```

### 3. 团队协作

- 所有团队成员应遵循相同的检测标准
- 失败的检查应在推送前修复
- 使用快速模式进行频繁的本地验证
- 完整检测应在合并前执行

## 维护和更新

### 添加新的检测维度

编辑 `scripts/smart-pre-push-check.js`，在 `SmartPrePushChecker` 类中添加新方法：

```javascript
async checkNewDimension() {
  header('9️⃣ 新维度检查');
  // 实现检测逻辑
  this.addResult('new-dimension', '检测名称', true);
}
```

### 修改检测规则

调整现有检查的阈值和规则：

```javascript
// 修改构建时间阈值
if (buildTime > 120) { // 120秒
  // 警告逻辑
}
```

## 技术架构

### 核心组件
- **SmartPrePushChecker 类**: 主检测控制器
- **异步检测流程**: 并行执行独立检查
- **结果聚合**: 统一的结果报告系统
- **彩色输出**: 增强的终端体验

### 依赖项
- Node.js 原生模块 (child_process, fs, path)
- pnpm 包管理器
- Git 命令行工具
- TypeScript 编译器
- ESLint / Prettier

## 性能指标

- **快速模式**: ~15-20 秒
- **完整模式**: ~45-60 秒
- **内存占用**: < 100MB
- **并发检测**: 支持 8 个维度并行检查

## 许可证

MIT License - YYC³ Team

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
