# YYC³ Design System CI/CD 改进方案

## 📊 当前 CI/CD 状态分析

### 现有工作流

| 工作流 | 状态 | 功能 | 改进建议 |
|--------|------|------|----------|
| `ci-cd.yml` | ⚠️ 需优化 | 主 CI/CD 流程 | 合并重复步骤，添加缓存 |
| `deploy.yml` | ❌ 重复 | 部署到 GitHub Pages | 与 ci-cd.yml 合并 |
| `code-quality.yml` | ✅ 良好 | 代码质量检查 | 添加自动修复 |
| `coverage.yml` | ⚠️ 复杂 | 测试覆盖率 | 简化逻辑 |
| `notifications.yml` | ✅ 良好 | 通知系统 | - |
| `performance.yml` | ✅ 良好 | 性能测试 | - |

### 主要问题

1. **工作流重复**: `ci-cd.yml` 和 `deploy.yml` 功能重叠
2. **缺少缓存优化**: 构建时间较长
3. **测试并行度不足**: 可以并行运行更多测试
4. **缺少预览环境**: PR 缺少实时预览
5. **发布流程不完整**: 缺少自动版本管理和发布

---

## 🚀 改进方案

### Phase 1: 工作流优化（立即实施）

#### 1.1 合并重复工作流

将 `deploy.yml` 合并到 `ci-cd.yml`，作为最后一个 job。

**优势**:
- 减少重复配置
- 统一状态管理
- 更清晰的流程可视化

#### 1.2 添加智能缓存

```yaml
# 新增缓存配置
- name: Cache pnpm modules
  uses: actions/cache@v4
  with:
    path: ~/.pnpm-store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-

- name: Cache build artifacts
  uses: actions/cache@v4
  with:
    path: |
      .jest-cache
      node_modules/.cache
    key: ${{ runner.os }}-build-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-build-
```

#### 1.3 优化测试并行度

```yaml
# 将测试拆分为并行 job
test:
  strategy:
    matrix:
      shard: [1, 2, 3, 4]
  steps:
    - run: pnpm test -- --shard=${{ matrix.shard }}/${{ strategy.job-total }}
```

### Phase 2: 预览环境（本周实施）

#### 2.1 Vercel/Netlify 集成

创建 `.github/workflows/preview.yml`:

```yaml
name: Preview Deployment

on:
  pull_request:
    branches: [main, develop]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
```

#### 2.2 Storybook 预览

```yaml
- name: Deploy Storybook to Chromatic
  uses: chromaui/action@latest
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    exitZeroOnChanges: true
```

### Phase 3: 自动发布（下周实施）

#### 3.1 语义化版本管理

创建 `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/release-please-action@v4
        with:
          release-type: node
          package-name: yyc3-design-system
```

#### 3.2 NPM 自动发布

```yaml
- name: Publish to NPM
  uses: JS-DevTools/npm-publish@v3
  with:
    token: ${{ secrets.NPM_TOKEN }}
```

### Phase 4: Docker 优化（下周实施）

#### 4.1 多阶段构建优化

更新 `Dockerfile`:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
USER nodejs
EXPOSE 3200
CMD ["pnpm", "preview"]
```

#### 4.2 Docker Hub 自动构建

创建 `.github/workflows/docker.yml`:

```yaml
name: Docker Build

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            yyc3/design-system:latest
            yyc3/design-system:${{ github.ref_name }}
          cache-from: type=registry,ref=yyc3/design-system:buildcache
          cache-to: type=registry,ref=yyc3/design-system:buildcache,mode=max
```

---

## 📋 实施清单

### 立即实施（今天）

- [ ] 合并 `deploy.yml` 到 `ci-cd.yml`
- [ ] 添加 pnpm 缓存
- [ ] 优化测试配置减少超时
- [ ] 更新 Jest 配置

### 本周实施

- [ ] 设置 Vercel/Netlify 预览
- [ ] 配置 Chromatic Storybook 预览
- [ ] 添加 PR 评论自动化
- [ ] 优化 Docker 构建

### 下周实施

- [ ] 配置 Release Please 自动版本
- [ ] 设置 NPM 自动发布
- [ ] 配置 Docker Hub 自动构建
- [ ] 添加 Slack/Discord 通知

---

## 🔧 配置文件更新

### 更新后的 ci-cd.yml 结构

```yaml
name: "YYC³ Design System CI/CD"

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '9'

# 并发控制
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # 1. 代码质量
  quality:
    # ... (保持现有配置)
  
  # 2. 测试（并行化）
  test:
    needs: quality
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    # ... (并行测试配置)
  
  # 3. 构建
  build:
    needs: test
    # ... (添加缓存优化)
  
  # 4. E2E 测试
  e2e:
    needs: build
    # ... (保持现有配置)
  
  # 5. 性能测试
  performance:
    needs: build
    # ... (保持现有配置)
  
  # 6. 视觉回归测试（仅 PR）
  visual:
    needs: quality
    if: github.event_name == 'pull_request'
    # ... (保持现有配置)
  
  # 7. 预览部署（仅 PR）
  preview:
    needs: build
    if: github.event_name == 'pull_request'
    # ... (新增 Vercel/Netlify 部署)
  
  # 8. 生产部署（仅 main 分支）
  deploy:
    needs: [test, build, e2e, performance]
    if: github.ref == 'refs/heads/main'
    # ... (合并 deploy.yml 内容)
  
  # 9. 发布（仅 tag）
  release:
    needs: deploy
    if: startsWith(github.ref, 'refs/tags/v')
    # ... (新增 NPM 发布)
```

---

## 📊 预期改进效果

| 指标 | 当前 | 改进后 | 改善幅度 |
|------|------|--------|----------|
| CI 运行时间 | ~15 分钟 | ~8 分钟 | -47% |
| 测试覆盖率 | 85% | 90% | +5% |
| 部署频率 | 手动 | 自动 | +100% |
| 预览环境 | 无 | 有 | +100% |
| 发布流程 | 手动 | 自动 | +100% |

---

## 🔐 需要的 Secrets

在 GitHub Settings → Secrets and variables → Actions 中配置：

```bash
# 部署相关
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# NPM 发布
NPM_TOKEN=your_npm_token

# Docker
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password

# 通知
SLACK_WEBHOOK_URL=your_slack_webhook
DISCORD_WEBHOOK_URL=your_discord_webhook

# 其他
CHROMATIC_PROJECT_TOKEN=your_chromatic_token
CODECOV_TOKEN=your_codecov_token
```

---

## 📖 参考文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel GitHub 集成](https://vercel.com/docs/git)
- [Release Please](https://github.com/google-github-actions/release-please-action)
- [Docker Build Push](https://github.com/docker/build-push-action)

---

*创建时间：2026-03-02*  
*版本：1.0.0*  
*状态：待实施*
