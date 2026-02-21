# YYC³ Design System - GitHub Actions 文档

## 概述

本文档说明 YYC³ Design System 项目中 GitHub Actions 工作流的配置、使用和功能。

## 工作流文件

### 1. test-and-build.yml

**文件路径**: `.github/workflows/test-and-build.yml`

**触发条件**:
- Pull Request 事件（针对特定路径变更）
- Push 事件（针对特定路径变更）

**监控路径**:
- `design/tokens.json`
- `scripts/**`
- `style-dictionary.config.js`

**执行步骤**:
1. 检出代码仓库
2. 设置 Node.js 环境
3. 安装项目依赖
4. 运行 OKLCH 烟雾测试
5. 运行单元测试（Jest）
6. 使用 Style Dictionary 构建 tokens
7. 生成 OKLCH 报告
8. 上传 OKLCH 报告为 artifact

### 2. test-and-report-pr-comment.yml（增强版）

**文件路径**: `.github/workflows/test-and-report-pr-comment.yml`

**触发条件**:
- Pull Request 事件（针对特定路径变更）
- Push 事件（针对特定路径变更）

**监控路径**:
- `design/tokens.json`
- `scripts/**`
- `style-dictionary.config.js`

**权限配置**:
```yaml
permissions:
  contents: read
  pull-requests: write
  actions: read
  checks: write
```

**环境变量**:
```yaml
env:
  TOP_N: 5  # 失败报告显示的 Top-N 数量
```

**执行步骤**:

1. **检出代码仓库**
   - 使用 `actions/checkout@v4`

2. **设置 Node.js 环境**
   - 使用 `actions/setup-node@v4`
   - Node.js 版本: 18

3. **安装依赖**
   - 执行 `npm ci`

4. **运行 OKLCH 烟雾测试**
   - 执行 `npm run test:oklch`
   - 允许失败（`continue-on-error: true`）

5. **运行单元测试**
   - 执行 `npm run test`
   - 测试失败将导致工作流失败

6. **构建 tokens**
   - 执行 `npm run build:tokens`

7. **生成 OKLCH 报告**
   - 执行 `npm run report:oklch`
   - 生成 `reports/oklch-report.json`
   - 生成 `reports/oklch-report.md`

8. **确保报告文件存在**
   - 检查并创建 `reports/oklch-report.json`
   - 检查并创建 `reports/oklch-report.md`

9. **上传 OKLCH 报告 artifact**
   - 使用 `actions/upload-artifact@v4`
   - Artifact 名称: `oklch-report`
   - 路径: `reports/`

10. **获取 artifact 下载 URL**
    - 通过 GitHub API 查询 artifact 信息
    - 提取下载 URL 供 PR 评论使用

11. **构建 PR 评论内容**
    - 从 `reports/oklch-report.json` 读取报告数据
    - 生成结构化的 Markdown 评论内容，包括:
      - 失败摘要（按优先级排序，显示 Top-N）
      - 最关键的 3 项（优先处理项）
      - 警告信息（可能超出 sRGB 色域）
      - 修复建议（快速模板）
      - Artifact 下载链接

12. **发布或更新 PR 评论**
    - 使用 `peter-evans/create-or-update-comment@v4`
    - 评论标识符: `oklch-report-comment`
    - 在 PR 中显示 OKLCH 转换结果

13. **创建 GitHub Check**
    - 为前 3 个失败项创建注释
    - 在 PR 的 Checks 标签页显示转换结果
    - 使用 GitHub Checks API 创建检查运行

14. **失败处理**
    - 如果报告生成失败，工作流将以失败状态退出

## 增强功能

### 1. 失败优先级分类

在 `scripts/generate-oklch-report.js` 中实现了失败优先级分类系统：

**优先级分数**:
- `missing_hex`: 100（最高优先级）- 缺少 HEX 值
- `parse_error`: 80 - OKLCH 解析错误
- `out_of_gamut`: 60 - 超出 sRGB 色域
- `unknown_format`: 50 - 未知格式

**分类逻辑**:
```javascript
function classifyFailure(item) {
  const { path, value } = item;
  let reason = 'unknown';
  let score = 0;
  if (typeof value === 'object') {
    if (!value.hex && !(value.oklch || value.okLch)) {
      reason = 'missing_hex';
      score = 100;
      return { reason, score };
    }
    // ... 其他分类逻辑
  }
  return { reason, score };
}
```

### 2. Top-N 报告

通过环境变量 `TOP_N` 控制显示的失败数量（默认为 5）：
```yaml
env:
  TOP_N: 5
```

### 3. PR 评论自动更新

使用 `peter-evans/create-or-update-comment@v4` 实现评论的自动更新：
- 首次运行创建新评论
- 后续运行更新现有评论（通过 `identifier` 参数）

### 4. GitHub Checks 集成

为前 3 个失败项创建 GitHub Check 注释：
```yaml
- name: Create GitHub Check with top-3 annotations
  if: github.event_name == 'pull_request'
  run: |
    # 创建 Check API 请求
```

### 5. Artifact 管理

自动上传报告文件为 GitHub Actions artifact：
- 文件: `reports/oklch-report.json` 和 `reports/oklch-report.md`
- 保留时间: 根据 GitHub 仓库设置
- 可在 Actions 页面下载

## 本地测试

### 测试 OKLCH 转换

```bash
# 运行 OKLCH 烟雾测试
npm run test:oklch

# 生成 OKLCH 报告
npm run report:oklch
```

### 查看报告

报告生成后位于 `reports/` 目录：
- `reports/oklch-report.json` - JSON 格式报告
- `reports/oklch-report.md` - Markdown 格式报告

## 配置说明

### 修改 TOP_N 数量

编辑 `.github/workflows/test-and-report-pr-comment.yml`：

```yaml
env:
  TOP_N: 10  # 修改为您想要的数量
```

### 修改失败优先级

编辑 `scripts/generate-oklch-report.js` 中的 `classifyFailure` 函数：

```javascript
if (!value.hex && !(value.oklch || value.okLch)) {
  reason = 'missing_hex';
  score = 100;  // 修改优先级分数
  return { reason, score };
}
```

### 添加新的检查类型

在 `scripts/generate-oklch-report.js` 中扩展 `extractColorTokens` 和 `classifyFailure` 函数。

## 常见问题

### Q1: PR 评论没有显示

**原因**: 工作流权限不足或触发条件不满足。

**解决方案**:
1. 检查仓库设置中的 Actions 权限
2. 确保 `permissions` 配置正确
3. 检查工作流触发路径是否匹配

### Q2: Artifact 无法下载

**原因**: Artifact 上传失败或权限不足。

**解决方案**:
1. 检查 `reports/` 目录是否存在
2. 确认 `actions/upload-artifact@v4` 权限配置正确
3. 在 Actions 页面查看详细错误日志

### Q3: Check 注释未显示

**原因**: GitHub Checks API 调用失败。

**解决方案**:
1. 检查 `checks: write` 权限是否已配置
2. 验证 API 调用的认证信息
3. 查看工作流日志中的错误信息

## 最佳实践

1. **定期更新依赖**: 保持 Actions 和第三方工具的最新版本
2. **监控工作流运行**: 定期检查 Actions 页面查看工作流状态
3. **优化报告内容**: 根据团队需求调整报告格式和内容
4. **使用缓存**: 对于大型项目，考虑使用 `actions/cache` 加速构建
5. **分支保护**: 配置分支保护规则，确保 PR 必须通过 CI 检查

## 贡献指南

如需改进或扩展 GitHub Actions 工作流，请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/workflow-improvement`
3. 提交更改: `git commit -am 'Improve workflow'`
4. 推送到分支: `git push origin feature/workflow-improvement`
5. 创建 Pull Request

## 许可证

本项目的 GitHub Actions 工作流遵循项目主许可证。

## 联系方式

如有问题或建议，请通过以下方式联系：
- GitHub Issues: [提交问题](https://github.com/your-repo/issues)
- 邮件: admin@0379.email

---

**最后更新**: 2025-01-30
