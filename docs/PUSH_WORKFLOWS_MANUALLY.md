---
@file: 工作流文件手动推送指南
@description: 使用 PAT 或 SSH 手动推送工作流文件
@author: YanYuCloudCube Team
@version: 1.0.0
@created: 2026-02-25
@updated: 2026-02-25
@status: active
@tags: github, workflow, manual
---

# 手动推送工作流文件指南

## 状态

当前代码已成功推送到 GitHub（不包含工作流文件）。

工作流文件位于 `.github/workflows-backup/` 目录，需要手动推送。

---

## 快速推送命令

### 方式 1：使用 Personal Access Token（推荐）

```bash
# 1. 创建 PAT（访问：https://github.com/settings/tokens）
# 2. 复制 Token
# 3. 执行以下命令：

git remote set-url origin https://YOUR_TOKEN@github.com/YYC-Cube/YYC3-Design-System.git
mkdir -p .github/workflows
cp -r .github/workflows-backup/* .github/workflows/
git add .github/workflows
git commit -m "chore: 恢复 CI/CD 工作流文件

- 添加 ci-pipeline.yml（类型检查、构建、测试）
- 添加 security-scan.yml（安全扫描）
- 代码已推送，仅添加工作流文件"
git push origin main
```

### 方式 2：使用 SSH 密钥（最安全）

```bash
# 1. 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/github_yyc3

# 2. 添加公钥到 GitHub（复制 ~/.ssh/github_yyc3.pub 内容）
#    访问：https://github.com/settings/keys

# 3. 配置 Git 使用 SSH
git remote set-url origin git@github.com:YYC-Cube/YYC3-Design-System.git

# 4. 恢复并推送工作流文件
mkdir -p .github/workflows
cp -r .github/workflows-backup/* .github/workflows/
git add .github/workflows
git commit -m "chore: 恢复 CI/CD 工作流文件"
git push origin main
```

---

## 验证推送

推送成功后，访问：

1. **GitHub Actions**: https://github.com/YYC-Cube/YYC3-Design-System/actions
2. **查看工作流**: 应该能看到新的 workflow 运行
3. **验证状态**: 等待 workflow 完成（约 3-5 分钟）

---

## 完成后

推送成功后，可以清理备份：

```bash
rm -rf .github/workflows-backup
```

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
