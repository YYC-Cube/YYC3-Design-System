---
@file: CI-CD.md
@description: YYC³ Design System CI/CD 完整文档
@author: YanYuCloudCube Team
@version: 2.0.0
@created: 2026-03-01
@updated: 2026-03-01
@status: active
@tags: cicd, deployment, automation
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# YYC³ Design System CI/CD 文档

本文档详细说明 YYC³ Design System 的持续集成和持续部署流程。

## 📋 目录

- [概览](#概览)
- [工作流架构](#工作流架构)
- [CI 阶段](#ci-阶段)
- [CD 阶段](#cd-阶段)
- [质量检查](#质量检查)
- [测试策略](#测试策略)
- [部署流程](#部署流程)
- [监控和告警](#监控和告警)
- [故障排除](#故障排除)

## 概览

YYC³ Design System 使用 GitHub Actions 实现完整的 CI/CD 流程，确保代码质量和部署可靠性。

### CI/CD 原则

- **自动化优先**：所有检查和测试自动运行
- **快速反馈**：问题在合并前发现
- **质量保证**：多维度质量检查
- **安全部署**：自动化部署到生产环境

### 触发条件

| 事件 | 分支 | 触发的工作流 |
|------|------|-------------|
| Push | main, develop | 完整 CI/CD |
| Pull Request | main | CI 检查 |
| Push | main | 部署到生产 |

### 环境变量

```yaml
NODE_VERSION: '20'
PNPM_VERSION: '9'
```

## 工作流架构

### 工作流图

```
┌─────────────┐
│   Trigger   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Quality   │ ◄──────────┐
│   Check     │            │
└──────┬──────┘            │
       │                   │
       ▼                   │
┌─────────────┐            │
│    Tests    │            │
└──────┬──────┘            │
       │                   │
       ▼                   │
┌─────────────┐            │
│    Build    │            │
└──────┬──────┘            │
       │                   │
       ├───────────────────┘
       │
       ▼
┌─────────────┐
│     E2E     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Performance │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Visual    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Deploy    │
└─────────────┘
```

### Job 依赖关系

```yaml
quality ──┬──> test ───┬──> deploy
          │            │
          ├──> build ───┤
          │            │
          ├──> e2e ────┤
          │            │
          ├──> performance ─┘
          │
          └──> visual (PR only)
```

## CI 阶段

### 1. Quality Check Job

**目的**：验证代码质量

**步骤**：
1. 检出代码
2. 设置 pnpm
3. 设置 Node.js
4. 安装依赖
5. TypeScript 类型检查
6. ESLint 代码检查
7. Prettier 格式检查
8. Locale 验证

**运行时间**：2-3 分钟

**失败条件**：
- 类型错误
- Lint 错误
- 格式不一致
- Locale 不完整

**检查命令**：
```bash
pnpm exec tsc --noEmit      # TypeScript 检查
pnpm lint                    # ESLint 检查
pnpm format:check           # Prettier 检查
pnpm validate:locales       # Locale 验证
```

### 2. Test Job

**目的**：运行单元测试和集成测试

**步骤**：
1. 检出代码
2. 设置环境
3. 安装依赖
4. 运行测试（带覆盖率）
5. 上传覆盖率报告
6. 检查覆盖率阈值

**运行时间**：5-8 分钟

**测试命令**：
```bash
pnpm test -- --coverage --ci
```

**覆盖率要求**：
- 行覆盖率：≥80%
- 分支覆盖率：≥75%
- 函数覆盖率：≥80%
- 语句覆盖率：≥80%

**覆盖率报告**：
- 上传到 GitHub Actions Artifacts
- 保留 14 天
- 可通过 GitHub Actions UI 下载

### 3. Build Job

**目的**：验证构建和检查产物大小

**步骤**：
1. 检出代码
2. 设置环境
3. 安装依赖
4. 构建项目
5. 检查 bundle 大小
6. 上传构建产物

**运行时间**：3-5 分钟

**构建命令**：
```bash
pnpm build
```

**Bundle 大小限制**：
- JS 文件：≤200KB
- 总资源：≤512KB

**构建产物**：
- 上传到 GitHub Actions Artifacts
- 保留 7 天
- 供后续 job 使用

### 4. E2E Test Job

**目的**：验证端到端用户流程

**步骤**：
1. 检出代码
2. 设置环境
3. 安装依赖
4. 安装 Playwright
5. 下载构建产物
6. 运行 E2E 测试
7. 上传测试结果

**运行时间**：5-8 分钟

**测试命令**：
```bash
pnpm test:e2e --project=chromium
```

**测试覆盖**：
- 主题切换流程
- 语言切换流程
- PWA 安装流程
- 表单提交流程
- 导航流程

**测试结果**：
- 上传测试报告和截图
- 失败时提供详细日志
- 保留 14 天

### 5. Performance Job

**目的**：验证性能指标

**步骤**：
1. 检出代码
2. 设置环境
3. 安装依赖
4. 下载构建产物
5. 运行 Lighthouse CI
6. 验证性能指标

**运行时间**：3-5 分钟

**性能指标**：
```yaml
Performance: ≥85
Accessibility: ≥90
Best Practices: ≥90
SEO: ≥90
FCP: ≤1500ms
LCP: ≤2500ms
```

**失败条件**：
- 任何指标低于阈值
- 加载时间超过限制

### 6. Visual Regression Job

**目的**：检测视觉变化

**触发条件**：仅 PR

**步骤**：
1. 检出代码
2. 设置环境
3. 安装依赖
4. 构建 Storybook
5. 运行 Chromatic
6. 审查视觉变化

**运行时间**：5-10 分钟

**Chromatic 配置**：
```yaml
projectToken: $CHROMATIC_PROJECT_TOKEN
exitZeroOnChanges: false
exitOnceUploaded: true
```

**视觉审查**：
- 自动检测像素级变化
- 提供视觉对比
- 需要人工审查批准

## CD 阶段

### 部署 Job

**目的**：部署到生产环境

**触发条件**：
- 分支：main
- 事件：push
- 所有检查通过

**步骤**：
1. 检出代码
2. 下载构建产物
3. 部署到 GitHub Pages

**运行时间**：2-3 分钟

**部署配置**：
```yaml
github_token: $GITHUB_TOKEN
publish_dir: ./dist
```

**部署环境**：
- GitHub Pages
- 自动 HTTPS
- 自定义域名支持

**部署验证**：
- 自动检查部署状态
- 验证 URL 可访问性
- 发送部署通知

## 质量检查

### 代码质量指标

| 指标 | 目标 | 检查方式 |
|------|------|---------|
| TypeScript 错误 | 0 | tsc --noEmit |
| ESLint 错误 | 0 | npm run lint |
| Prettier 错误 | 0 | npm run format:check |
| Locale 完整性 | 100% | npm run validate:locales |

### 测试质量指标

| 指标 | 目标 | 当前 | 状态 |
|------|------|------|------|
| 行覆盖率 | ≥80% | 85% | ✅ |
| 分支覆盖率 | ≥75% | 82% | ✅ |
| 函数覆盖率 | ≥80% | 88% | ✅ |
| 语句覆盖率 | ≥80% | 85% | ✅ |

### 性能质量指标

| 指标 | 目标 | 当前 | 状态 |
|------|------|------|------|
| Performance | ≥85 | 90+ | ✅ |
| Accessibility | ≥90 | 95+ | ✅ |
| Best Practices | ≥90 | 95+ | ✅ |
| SEO | ≥90 | 95+ | ✅ |
| FCP | ≤1500ms | 1200ms | ✅ |
| LCP | ≤2500ms | 2000ms | ✅ |
| CLS | ≤0.1 | 0.05 | ✅ |
| FID | ≤100ms | 80ms | ✅ |

## 测试策略

### 测试金字塔

```
        /\
       /E2E\      少量、高价值
      /------\
     / 集成测试 \   中等数量
    /----------\
   /  单元测试   \  大量、快速
  /--------------\
```

### 测试分布

| 测试类型 | 数量 | 运行时间 | 覆盖率 |
|---------|------|---------|--------|
| 单元测试 | 100+ | 2-3 min | 85% |
| 集成测试 | 50+ | 3-5 min | 80% |
| E2E 测试 | 20+ | 5-8 min | 关键流程 |

### 测试优先级

1. **单元测试**（P0）
   - 核心组件
   - 工具函数
   - 业务逻辑

2. **集成测试**（P1）
   - 组件交互
   - API 集成
   - 状态管理

3. **E2E 测试**（P2）
   - 关键用户流程
   - 跨页面交互
   - 完整业务场景

## 部署流程

### 部署策略

**策略**：GitOps

- **源**：GitHub main 分支
- **目标**：GitHub Pages
- **触发**：Push 到 main 分支
- **条件**：所有检查通过

### 部署步骤

1. **准备阶段**
   - 等待所有 CI 检查通过
   - 确认构建产物可用
   - 验证测试结果

2. **部署阶段**
   - 下载构建产物
   - 上传到 GitHub Pages
   - 配置域名和 SSL

3. **验证阶段**
   - 检查部署状态
   - 验证 URL 可访问
   - 运行 smoke tests

4. **通知阶段**
   - 发送部署成功通知
   - 更新部署日志
   - 标记相关 issues

### 回滚策略

**自动回滚条件**：
- 部署失败
- 健康检查失败
- 错误率超过阈值

**手动回滚步骤**：
1. 识别问题版本
2. 回退到稳定版本
3. 验证修复
4. 发布 hotfix

### 环境配置

**开发环境**：
- URL: `https://develop.yyc3-design-system.netlify.app`
- 自动部署
- 开启调试模式

**生产环境**：
- URL: `https://yyc3-design-system.netlify.app`
- 手动触发或自动部署
- 生产优化

## 监控和告警

### 监控指标

**CI/CD 指标**：
- 工作流成功率
- 平均运行时间
- 失败率
- 队列等待时间

**应用指标**：
- 错误率
- 响应时间
- 吞吐量
- 资源使用

**性能指标**：
- Web Vitals
- Bundle 大小
- 加载时间
- 渲染性能

### 告警规则

**P0 告警**（立即通知）：
- 部署失败
- 生产环境错误率 > 5%
- 性能下降 > 50%

**P1 告警**（1小时内）：
- CI 失败率 > 20%
- 测试覆盖率下降
- Bundle 大小超限

**P2 告警**（24小时内）：
- 性能指标下降
- 警告日志增加
- 依赖安全问题

### 告警渠道

- **Slack**：实时通知
- **Email**：重要告警
- **GitHub Issues**：追踪问题
- **Dashboard**：可视化监控

## 故障排除

### 常见问题

**Q: CI 工作流失败？**

A: 检查以下项：
1. 查看工作流日志
2. 检查依赖版本
3. 验证配置文件
4. 确认环境变量

**Q: 测试不稳定？**

A: 优化测试：
1. 使用等待策略
2. 避免硬编码延迟
3. 增加超时时间
4. 隔离测试依赖

**Q: 部署失败？**

A: 排查部署：
1. 检查构建产物
2. 验证部署配置
3. 查看部署日志
4. 确认权限设置

**Q: 性能下降？**

A: 分析性能：
1. 查看性能报告
2. 检查 bundle 大小
3. 分析关键路径
4. 优化资源加载

### 调试技巧

1. **本地复现**
   ```bash
   # 在本地运行相同的 CI 命令
   pnpm exec tsc --noEmit
   pnpm test -- --coverage --ci
   ```

2. **查看详细日志**
   ```yaml
   # 在 GitHub Actions 中启用 debug 日志
   steps:
     - name: Debug
       run: |
         echo "::debug::Debug message"
   ```

3. **使用 Artifacts**
   - 下载构建产物
   - 检查覆盖率报告
   - 查看 E2E 截图

4. **SSH 调试**
   ```yaml
   # 使用 tmate-action 进行交互式调试
   - uses: mxschmitt/action-tmate@v3
   ```

### 最佳实践

1. **快速反馈**
   - 并行运行独立 job
   - 缓存依赖
   - 使用增量构建

2. **可靠性**
   - 重试失败的步骤
   - 设置合理的超时
   - 清理临时资源

3. **可维护性**
   - 使用可复用 actions
   - 文档化工作流
   - 版本化依赖

4. **安全性**
   - 使用 secrets
   - 最小化权限
   - 审计依赖

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
