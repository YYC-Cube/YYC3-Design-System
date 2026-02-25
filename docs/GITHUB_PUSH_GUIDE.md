---
@file: GitHub 推送指南
@description: 解决 GitHub OAuth workflow 权限问题
@author: YanYuCloudCube Team
@version: 1.0.0
@created: 2026-02-25
@updated: 2026-02-25
@status: active
@tags: github, troubleshooting, workflow
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# GitHub 推送指南 - 解决 OAuth Workflow 权限问题

## 问题描述

当前推送到 GitHub 时遇到以下错误：

```
error: failed to push some refs to 'https://github.com/YYC-Cube/YYC3-Design-System.git'
! [remote rejected] main -> main (refusing to allow an OAuth App to create or update workflow `.github/workflows/ci-pipeline.yml` without `workflow` scope)
```

**原因**：GitHub OAuth 应用缺少 `workflow` 权限，无法更新 `.github/workflows/` 目录下的文件。

---

## 解决方案

### 方案 1：更新 OAuth 应用权限（推荐）

#### 步骤

1. **访问 GitHub 设置**
   - 访问：https://github.com/settings/apps
   - 找到用于 Trae IDE 的 OAuth 应用

2. **更新权限**
   - 点击 OAuth 应用进入详情
   - 在 "OAuth Tokens & Redirects" 部分找到权限设置
   - 添加 `workflow` 权限
   - 点击 "Update" 或 "Save" 保存

3. **重新授权**
   - 退出并重新登录 Trae IDE
   - 重新授权 GitHub 账号
   - 确保新权限生效

4. **重试推送**
   ```bash
   git push origin main
   ```

#### 权限说明

| 权限 | 说明 | 用途 |
|--------|------|------|
| `repo` | 完整仓库访问 | 读写代码、创建 PR |
| `workflow` | 工作流文件管理 | 更新 `.github/workflows/` 文件 |

---

### 方案 2：使用 Personal Access Token（PAT）

#### 步骤

1. **创建 Personal Access Token**
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token" (classic)
   - 或 "Generate new token" (fine-grained)

2. **设置权限**
   - Token name: `YYC3-Design-System-Development`
   - Expiration: 选择合适的过期时间（建议 90 天）
   - Scopes:
     - `repo` (Full control of private repositories)
     - `workflow` (Update GitHub Action workflows)

3. **复制 Token**
   - 生成后立即复制（只显示一次）
   - 妥善保存

4. **配置 Git 使用 PAT**
   ```bash
   # 方式 1：临时使用（推荐）
   git remote set-url origin https://YOUR_TOKEN@github.com/YYC-Cube/YYC3-Design-System.git
   git push origin main

   # 方式 2：使用 Git Credential Manager
   git credential-store
   # 输入用户名：YOUR_GITHUB_USERNAME
   # 输入密码：YOUR_PAT_TOKEN
   ```

5. **清理远程 URL（可选）**
   ```bash
   # 推送完成后，恢复原始 URL 以安全存储 Token
   git remote set-url origin https://github.com/YYC-Cube/YYC3-Design-System.git
   ```

#### Fine-grained Token 配置（推荐）

1. 访问：https://github.com/settings/tokens?type=beta
2. 点击 "Generate new token (fine-grained)"
3. 配置：
   - Token name: `YYC3-Design-System-Development`
   - Expiration: `90 days`
   - Repository access: `Only select repositories`
   - Select repositories: `YYC3-Design-System`
   - Repository permissions:
     - `Contents`: Read and write
     - `Commit statuses`: Read and write
     - `Deployments`: Read and write
     - `Workflows`: Read and write

---

### 方案 3：使用 SSH 密钥（最安全）

#### 步骤

1. **生成 SSH 密钥**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/github_yyc3
   ```

2. **添加到 GitHub**
   - 复制公钥：`cat ~/.ssh/github_yyc3.pub`
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥内容
   - 添加密钥

3. **配置 Git 使用 SSH**
   ```bash
   # 修改远程 URL 为 SSH
   git remote set-url origin git@github.com:YYC-Cube/YYC3-Design-System.git

   # 推送
   git push origin main
   ```

4. **测试 SSH 连接**
   ```bash
   ssh -T git@github.com
   # 成功会显示：Hi username! You've successfully authenticated...
   ```

---

## 临时解决方案

### 暂时移除工作流文件

如果需要立即推送，可以暂时移除工作流文件：

```bash
# 备份工作流文件
mkdir -p .github/workflows-backup
cp -r .github/workflows/* .github/workflows-backup/

# 移除工作流文件
git rm -r .github/workflows/
git commit -m "chore: 暂时移除工作流文件以推送"

# 推送
git push origin main

# 推送后恢复工作流文件
mkdir -p .github/workflows
cp -r .github/workflows-backup/* .github/workflows/
git add .github/workflows/
git commit -m "chore: 恢复工作流文件"
git push origin main
```

**注意**：这只是临时方案，建议尽快使用上述任一方案解决权限问题。

---

## 推送验证

### 推送成功标志

```bash
$ git push origin main
Enumerating objects: 783, done.
Counting objects: 100% (783/783), done.
Delta compression using up to 8 threads.
Compressing objects: 100% (465/465), done.
Writing objects: 100% (465/465), 1.80 MiB | 2.79 MiB/s, done.
Total 465 (delta 465), reused 0 (delta 0), pack-reused 0 (from 0)
To https://github.com/YYC-Cube/YYC3-Design-System.git
 * [new branch]      main -> main
```

### 验证推送结果

```bash
# 查看远程状态
git status

# 应该显示：
# Your branch is up to date with 'origin/main'.

# 或：
# Your branch is ahead of 'origin/main' by 0 commits.
```

---

## CI/CD 验证

推送成功后，验证 CI/CD 流程：

### 1. 查看 GitHub Actions

访问：https://github.com/YYC-Cube/YYC3-Design-System/actions

**预期**：
- 看到新的 workflow 运行
- `ci-pipeline` 工作流应该自动触发
- 所有 job（typecheck、build、test）应该通过

### 2. 检查 workflow 状态

```bash
# 使用 GitHub CLI 检查
gh run list --workflow=ci-pipeline

# 或查看最新运行
gh run view --workflow=ci-pipeline
```

### 3. 验证构建产物

访问：https://github.com/YYC-Cube/YYC3-Design-System/actions

**预期**：
- `typecheck` job 应该通过
- `build` job 应该通过
- `test` job 应该通过
- 构建产物应该上传成功

---

## 常见问题（FAQ）

### Q1: 为什么需要 workflow 权限？

**A**: GitHub Actions 工作流文件（`.github/workflows/*.yml`）可以执行任意代码，包括创建 PR、修改仓库等。为了安全，GitHub 要求单独的 `workflow` 权限来管理这些文件。

### Q2: 使用 PAT 安全吗？

**A**: 是的，只要妥善管理：
- ✅ 设置合理的过期时间（90 天）
- ✅ 限制访问的仓库（仅 YYC3-Design-System）
- ✅ 使用 Fine-grained Token（推荐）
- ✅ 定期轮换 Token
- ❌ 不要将 Token 提交到代码库
- ❌ 不要在公开位置分享 Token

### Q3: SSH 和 HTTPS 哪个更好？

**A**: 各有优缺点：

| 方式 | 优点 | 缺点 |
|------|------|------|
| SSH | 更安全、无需每次输入凭据 | 需要配置 SSH 密钥 |
| HTTPS | 简单、无需配置 | 需要 Token 或 OAuth 权限 |

**推荐**：长期开发使用 SSH，临时使用 PAT。

### Q4: 推送失败但代码正确？

**A**: 检查以下几点：
1. 确认权限配置正确
2. 尝试使用 PAT 或 SSH
3. 检查网络连接
4. 查看 GitHub Status 页面（https://www.githubstatus.com/）
5. 确认仓库设置没有限制推送

---

## 总结

### 推荐解决方案优先级

1. **更新 OAuth 应用权限** - 最简单，推荐先尝试
2. **使用 Fine-grained PAT** - 更安全，推荐长期使用
3. **使用 SSH 密钥** - 最安全，推荐专业开发
4. **暂时移除工作流** - 临时方案，不推荐

### 推送成功后的检查清单

- [ ] 推送成功，无错误
- [ ] GitHub Actions workflow 自动触发
- [ ] 所有 CI job 通过
- [ ] 构建产物上传成功
- [ ] README.md 中的链接可访问
- [ ] 下一步开发计划已同步

---

<div align="center">

> **祝推送顺利！** 🚀

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
