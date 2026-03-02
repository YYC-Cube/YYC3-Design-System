# YYC³ Design System 部署指南

## 📋 目录

- [快速开始](#快速开始)
- [CI/CD 配置](#cicd-配置)
- [手动部署](#手动部署)
- [Docker 部署](#docker-部署)
- [环境变量](#环境变量)
- [故障排除](#故障排除)

---

## 🚀 快速开始

### 1. 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:3200
```

### 2. 构建生产版本

```bash
pnpm build
pnpm preview
```

### 3. 自动部署（推荐）

推送到 `main` 分支将自动触发部署：

```bash
git push origin main
```

GitHub Actions 将自动：
1. 运行测试
2. 执行代码质量检查
3. 构建项目
4. 部署到 GitHub Pages

---

## 🔧 CI/CD 配置

### 工作流概览

| 工作流 | 触发条件 | 功能 |
|--------|----------|------|
| `ci-cd.yml` | Push/PR | 主 CI/CD 流程 |
| `release.yml` | Tag 推送 | 发布到 NPM |
| `docker.yml` | Tag 推送 | Docker 镜像构建 |
| `code-quality.yml` | Push/PR | 代码质量检查 |
| `coverage.yml` | Push/PR | 测试覆盖率 |

### 设置 GitHub Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加：

```bash
# NPM 发布（可选）
NPM_TOKEN=npm_xxxxxxxxxxxxx

# Docker Hub（可选）
DOCKER_USERNAME=your_username
DOCKER_PASSWORD=your_password

# Netlify 预览（可选）
NETLIFY_AUTH_TOKEN=your_token
NETLIFY_SITE_ID=your_site_id

# Chromatic 视觉回归（可选）
CHROMATIC_PROJECT_TOKEN=your_token

# Codecov 覆盖率（可选）
CODECOV_TOKEN=your_token
```

---

## 📦 手动部署

### 部署到 GitHub Pages

```bash
# 1. 构建项目
pnpm build

# 2. 安装 gh-pages
pnpm add -D gh-pages

# 3. 部署到 GitHub Pages
pnpm exec gh-pages -d dist

# 或使用 Git 手动部署
git checkout --orphan gh-pages
git reset --hard
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force
```

### 部署到 Vercel

```bash
# 安装 Vercel CLI
pnpm add -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 部署到 Netlify

```bash
# 安装 Netlify CLI
pnpm add -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod --dir=dist
```

---

## 🐳 Docker 部署

### 构建镜像

```bash
# 构建 Docker 镜像
pnpm docker:build

# 或直接使用 Docker
docker build -t yyc3/design-system:latest .
```

### 运行容器

```bash
# 运行容器
pnpm docker:run

# 或直接使用 Docker
docker run -p 3200:3200 yyc3/design-system:latest
```

### Docker Compose

```bash
# 启动生产环境
docker-compose up -d yyc3-design-system

# 启动开发环境
docker-compose --profile dev up -d yyc3-design-system-dev

# 查看日志
docker-compose logs -f yyc3-design-system

# 停止服务
docker-compose down
```

### 多阶段构建

Dockerfile 使用多阶段构建优化镜像大小：

```dockerfile
# Stage 1: 依赖安装
FROM node:20-alpine AS deps

# Stage 2: 构建
FROM node:20-alpine AS builder

# Stage 3: 运行
FROM node:20-alpine AS runner
```

最终镜像大小约 **150MB**。

---

## 🔐 环境变量

### 必需的环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `PORT` | 服务端口 | `3200` |
| `BASE_URL` | 基础 URL | `/` |

### 可选的环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `API_URL` | API 地址 | - |
| `ANALYTICS_ID` | 分析 ID | - |
| `SENTRY_DSN` | Sentry DSN | - |

### 设置环境变量

```bash
# .env 文件
NODE_ENV=production
PORT=3200
BASE_URL=/

# 或在 docker-compose.yml 中
services:
  app:
    environment:
      - NODE_ENV=production
      - PORT=3200
```

---

## 📊 自动化发布

### 使用发布脚本

```bash
# 自动检测版本类型
pnpm release

# 或指定版本类型
pnpm release:major    # 主版本：1.0.0 → 2.0.0
pnpm release:minor    # 次版本：1.1.0 → 1.2.0
pnpm release:patch    # 补丁版本：1.1.0 → 1.1.1
pnpm release:alpha    # 预览版本：1.1.0 → 1.1.1-alpha.1
```

### 发布流程

1. 更新版本号
2. 生成 CHANGELOG
3. 创建 Git tag
4. 推送到 GitHub
5. 触发 GitHub Actions
6. 自动发布到 NPM

---

## 🔍 故障排除

### 常见问题

#### 1. 部署失败

**问题**: GitHub Actions 部署失败

**解决方案**:
```bash
# 检查构建日志
pnpm build

# 本地测试
pnpm test

# 检查 ESLint
pnpm lint
```

#### 2. 测试超时

**问题**: 测试运行超时

**解决方案**:
```bash
# 增加超时时间
pnpm test -- --testTimeout=30000

# 或跳过特定测试
pnpm test -- --testPathIgnorePatterns=slow-test
```

#### 3. Docker 构建失败

**问题**: Docker 镜像构建失败

**解决方案**:
```bash
# 清理 Docker 缓存
docker system prune -a

# 重新构建
docker build --no-cache -t yyc3/design-system .
```

#### 4. 覆盖率不达标

**问题**: 测试覆盖率低于 80%

**解决方案**:
```bash
# 查看覆盖率报告
pnpm test -- --coverage

# 打开 HTML 报告
open coverage/index.html
```

---

## 📈 性能优化

### Bundle 大小优化

```bash
# 分析 bundle 大小
pnpm build

# 查看统计文件
open dist/stats.html
```

### 加载速度优化

1. **代码分割**: 自动拆分 vendor chunks
2. **Tree Shaking**: 移除未使用代码
3. **压缩**: Gzip + Brotli 双压缩
4. **缓存**: 长期缓存策略

---

## 🎯 最佳实践

### 1. 使用语义化提交

```bash
# 功能
git commit -m "feat: add new button component"

# 修复
git commit -m "fix: resolve button click issue"

# 文档
git commit -m "docs: update README"
```

### 2. 运行本地检查

```bash
# 完整 QA 检查
pnpm qa

# 或单独运行
pnpm typecheck && pnpm lint && pnpm test
```

### 3. 小批量提交

- 频繁提交
- 小改动
- 清晰的提交信息

---

## 📖 参考链接

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Docker 最佳实践](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [NPM 发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-and-modules)

---

*最后更新：2026-03-02*  
*版本：2.0.0*
