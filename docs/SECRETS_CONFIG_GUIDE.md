---
@file: GitHub Secrets 配置指南
@description: YYC3-Design-System CI/CD 工作流所需的 GitHub Secrets 配置方法和获取指南
@author: YYC³
@version: 1.0.0
@created: 2025-01-30
@updated: 2025-01-30
@status: Active
@tags: github, secrets, ci-cd, configuration
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# GitHub Secrets 配置指南

## 概述

本文档详细说明了 YYC3-Design-System CI/CD 工作流所需的 GitHub Secrets 配置方法和获取步骤。

## Secrets 列表

| Secret 名称 | 必需 | 用途 | 优先级 |
|-------------|------|------|--------|
| `CHROMATIC_PROJECT_TOKEN` | 可选 | Chromatic 视觉测试 | 中 |
| `CODECOV_TOKEN` | 可选 | Codecov 覆盖率报告 | 中 |
| `SLACK_WEBHOOK_URL` | 可选 | Slack 通知 | 低 |
| `DISCORD_WEBHOOK_URL` | 可选 | Discord 通知 | 低 |
| `EMAIL_USERNAME` | 可选 | 邮件通知 | 低 |
| `EMAIL_PASSWORD` | 可选 | 邮件通知 | 低 |
| `EMAIL_RECIPIENT` | 可选 | 邮件通知 | 低 |
| `SNYK_TOKEN` | 可选 | Snyk 安全扫描 | 中 |

---

## 1. CHROMATIC_PROJECT_TOKEN

### 用途
Chromatic 用于组件视觉测试和快照比较。

### 获取方法

#### 步骤 1：注册 Chromatic
1. 访问 [https://www.chromatic.com/](https://www.chromatic.com/)
2. 使用 GitHub 账号登录
3. 点击 "Add your first project"

#### 步骤 2：关联仓库
1. 选择 GitHub 仓库：`YYC-Cube/YYC3-Design-System`
2. 选择分支：`main`
3. 选择框架：React
4. 点击 "Continue"

#### 步骤 3：获取 Project Token
1. Chromatic 会生成一个项目令牌
2. 格式：`chpt_xxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
3. 复制该令牌

### 配置示例

```bash
# 在 GitHub 仓库设置中添加
Name: CHROMATIC_PROJECT_TOKEN
Value: chpt_12345678-1234-1234-1234-1234567890ab
```

### 工作流使用
```yaml
- name: Publish to Chromatic
  uses: chromaui/action@v1
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 2. CODECOV_TOKEN

### 用途
Codecov 用于代码覆盖率报告和历史对比。

### 获取方法

#### 步骤 1：注册 Codecov
1. 访问 [https://codecov.io/](https://codecov.io/)
2. 使用 GitHub 账号登录
3. 点击 "Add new repository"

#### 步骤 2：关联仓库
1. 搜索并选择：`YYC-Cube/YYC3-Design-System`
2. 点击 "Setup repository"

#### 步骤 3：获取 Token
1. 在设置页面找到 "Upload Token"
2. 复制该令牌
3. 格式：`长字符串，如 12345678-1234-1234-1234-1234567890ab`

### 配置示例

```bash
# 在 GitHub 仓库设置中添加
Name: CODECOV_TOKEN
Value: 12345678-1234-1234-1234-1234567890ab
```

### 工作流使用
```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
    files: ./coverage/coverage-final.json
```

---

## 3. SLACK_WEBHOOK_URL

### 用途
Slack 用于接收 CI/CD 流水线的成功/失败通知。

### 获取方法

#### 步骤 1：创建 Slack 应用
1. 访问 [https://api.slack.com/apps](https://api.slack.com/apps)
2. 点击 "Create New App"
3. 选择 "From scratch"
4. 输入应用名称：`YYC3 CI/CD Bot`
5. 选择工作空间

#### 步骤 2：创建 Incoming Webhook
1. 进入 "Incoming Webhooks" 页面
2. 点击 "Add New Webhook to Workspace"
3. 选择要接收通知的频道（如 `#ci-cd-notifications`）
4. 点击 "Allow"
5. 复制 Webhook URL

### 配置示例

```bash
# 在 GitHub 仓库设置中添加
Name: SLACK_WEBHOOK_URL
Value: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

### 工作流使用
```yaml
- name: Send Slack notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'CI/CD Pipeline completed'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 4. DISCORD_WEBHOOK_URL

### 用途
Discord 用于接收 CI/CD 流水线的通知（带颜色标识）。

### 获取方法

#### 步骤 1：创建 Discord 频道
1. 在 Discord 服务器中创建或选择一个频道
2. 点击频道设置（齿轮图标）

#### 步骤 2：创建 Webhook
1. 进入 "Integrations" 页面
2. 点击 "Create Webhook"
3. 输入 Webhook 名称：`YYC3 CI/CD`
4. 选择头像（可选）
5. 点击 "Copy Webhook URL"
6. 点击 "Save"

### 配置示例

```bash
# 在 GitHub 仓库设置中添加
Name: DISCORD_WEBHOOK_URL
Value: https://discord.com/api/webhooks/123456789012345678/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 工作流使用
```yaml
- name: Send Discord notification
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK_URL }}
    status: ${{ job.status }}
    title: CI/CD Pipeline
    color: ${{ github.event.workflow_run.conclusion == 'success' && '0x57F287' || '0xED4245' }}
```

---

## 5. EMAIL_USERNAME

### 用途
用于发送邮件通知的 SMTP 用户名。

### 获取方法

#### 选项 1：使用 Gmail
1. 启用两步验证
2. 生成应用专用密码
3. 访问 [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. 创建新密码（选择"邮件"）
5. 复制生成的 16 位密码

#### 选项 2：使用其他邮件服务
- **QQ 邮箱**：开启 SMTP 服务，获取授权码
- **163 邮箱**：开启 SMTP 服务，获取授权码
- **Outlook**：使用应用密码

### 配置示例

```bash
# 在 GitHub 仓库设置中添加
Name: EMAIL_USERNAME
Value: your-email@gmail.com
```

---

## 6. EMAIL_PASSWORD

### 用途
用于发送邮件通知的 SMTP 密码（应用专用密码）。

### 获取方法

#### Gmail 应用专用密码
1. 访问 [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. 输入应用名称：`YYC3 CI/CD`
3. 点击"生成"
4. 复制 16 位密码（格式：`xxxx xxxx xxxx xxxx`）

#### 其他邮箱
- **QQ 邮箱**：在设置中开启 SMTP，获取授权码
- **163 邮箱**：在设置中开启 SMTP，获取授权码

### 配置示例

```bash
# 在 GitHub 仓库设置中添加
Name: EMAIL_PASSWORD
Value: abcd efgh ijkl mnop
```

### 工作流使用
```yaml
- name: Send email notification
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 587
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: CI/CD Pipeline Notification
    to: ${{ secrets.EMAIL_RECIPIENT }}
```

---

## 7. EMAIL_RECIPIENT

### 用途
接收邮件通知的邮箱地址。

### 配置示例

```bash
# 在 GitHub 仓库设置中添加
Name: EMAIL_RECIPIENT
Value: admin@0379.email
```

---

## 8. SNYK_TOKEN

### 用途
Snyk 用于安全漏洞扫描和依赖审计。

### 获取方法

#### 步骤 1：注册 Snyk
1. 访问 [https://snyk.io/](https://snyk.io/)
2. 使用 GitHub 账号登录
3. 点击 "Add your first project"

#### 步骤 2：获取 API Token
1. 进入账户设置
2. 找到 "General" → "API Token"
3. 点击 "Reveal token" 或 "Generate new token"
4. 复制该令牌
5. 格式：`长字符串，如 12345678-1234-1234-1234-1234567890ab`

### 配置示例

```bash
# 在 GitHub 仓库设置中添加
Name: SNYK_TOKEN
Value: 12345678-1234-1234-1234-1234567890ab
```

### 工作流使用
```yaml
- name: Run Snyk security scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high
```

---

## GitHub Secrets 配置步骤

### 方法 1：通过 GitHub 网页界面

1. 进入仓库页面：`https://github.com/YYC-Cube/YYC3-Design-System`
2. 点击 `Settings` 标签
3. 在左侧菜单中找到 `Secrets and variables` → `Actions`
4. 点击 `New repository secret` 按钮
5. 输入 `Name`（如 `SLACK_WEBHOOK_URL`）
6. 输入 `Value`（对应的值）
7. 点击 `Add secret`

### 方法 2：通过 GitHub CLI

```bash
# 安装 GitHub CLI
brew install gh

# 登录
gh auth login

# 添加 Secret
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/services/..."

# 查看所有 Secrets
gh secret list
```

---

## 最小配置建议

### 仅启用必要功能
如果不想配置所有 Secrets，可以只配置：

**基础 CI/CD（必需）：**
- 无需任何 Secrets

**代码覆盖率（推荐）：**
- `CODECOV_TOKEN`

**安全扫描（推荐）：**
- `SNYK_TOKEN`

**视觉测试（可选）：**
- `CHROMATIC_PROJECT_TOKEN`

**通知系统（可选）：**
- `SLACK_WEBHOOK_URL`
- `DISCORD_WEBHOOK_URL`

**邮件通知（可选）：**
- `EMAIL_USERNAME`
- `EMAIL_PASSWORD`
- `EMAIL_RECIPIENT`

---

## 测试配置

### 测试 Slack 通知
```bash
# 测试 Webhook
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Test notification from YYC3 CI/CD"}' \
  $SLACK_WEBHOOK_URL
```

### 测试 Discord 通知
```bash
# 测试 Webhook
curl -X POST -H 'Content-type: application/json' \
  --data '{"content":"Test notification from YYC3 CI/CD"}' \
  $DISCORD_WEBHOOK_URL
```

### 测试邮件发送
```bash
# 使用 Python 测试
python3 - <<'EOF'
import smtplib
from email.mime.text import MIMEText

msg = MIMEText('Test email from YYC3 CI/CD')
msg['Subject'] = 'YYC3 CI/CD Test'
msg['From'] = 'your-email@gmail.com'
msg['To'] = 'recipient@email.com'

with smtplib.SMTP('smtp.gmail.com', 587) as server:
    server.starttls()
    server.login('your-email@gmail.com', 'app-password')
    server.send_message(msg)
EOF
```

---

## 安全最佳实践

1. **定期轮换密钥**
   - 每 90 天更换一次应用密码
   - 发现泄露时立即更换

2. **最小权限原则**
   - 只授予必要的权限
   - 使用专用账号而非个人账号

3. **监控使用情况**
   - 定期检查 Secrets 使用日志
   - 监控异常活动

4. **不要硬编码**
   - 永远不要在代码中直接写入 Secrets
   - 使用 GitHub Secrets 管理敏感信息

5. **访问控制**
   - 限制能访问 Secrets 的人员
   - 使用环境分离（dev/staging/prod）

---

## 故障排除

### 问题：Slack 通知未发送
**解决：**
- 检查 Webhook URL 是否正确
- 确认机器人有发送权限
- 检查频道设置是否允许 Webhook

### 问题：Codecov 未显示报告
**解决：**
- 确认 token 格式正确
- 检查仓库是否在 Codecov 中正确关联
- 查看工作流日志中的上传状态

### 问题：邮件发送失败
**解决：**
- 检查 SMTP 设置是否正确
- 确认应用专用密码有效
- 检查防火墙是否阻止 SMTP 连接

### 问题：Chromatic 构建失败
**解决：**
- 确认项目 token 有效
- 检查 Storybook 配置是否正确
- 查看 Chromatic 日志获取详细错误

---

## 参考资料

- [GitHub Secrets 文档](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Chromatic 官方文档](https://www.chromatic.com/docs)
- [Codecov 官方文档](https://docs.codecov.com/)
- [Slack API 文档](https://api.slack.com/messaging/webhooks)
- [Discord Webhook 指南](https://discord.com/developers/docs/resources/webhook)
- [Snyk 文档](https://docs.snyk.io/)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
