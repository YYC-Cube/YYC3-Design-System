# YYC³ Design System - GitHub Actions 工作流详细文档

## 概述

本文档详细说明 YYC³ Design System 项目中 GitHub Actions 工作流的实现细节、配置方法和最佳实践。

## 工作流架构

### 文件结构

```
.github/
├── workflows/
│   ├── test-and-build.yml              # 基础测试与构建工作流
│   └── test-and-report-pr-comment.yml   # 增强版：PR 评论与 Check 注释
└── README.md                          # 本文档
```

---

## 1. 基础工作流：test-and-build.yml

### 触发条件

```yaml
on:
  pull_request:
    paths:
      - 'design/tokens.json'
      - 'scripts/**'
      - 'style-dictionary.config.js'
  push:
    paths:
      - 'design/tokens.json'
      - 'scripts/**'
      - 'style-dictionary.config.js'
```

### 执行流程

| 步骤 | 命令 | 说明 |
|------|------|------|
| 1 | `actions/checkout@v4` | 检出代码仓库 |
| 2 | `actions/setup-node@v4` | 设置 Node.js 18 环境 |
| 3 | `npm ci` | 安装项目依赖 |
| 4 | `npm run test:oklch` | 运行 OKLCH 烟雾测试 |
| 5 | `npm run test` | 运行 Jest 单元测试 |
| 6 | `npm run build:tokens` | 使用 Style Dictionary 构建 tokens |
| 7 | `npm run report:oklch` | 生成 OKLCH 转换报告 |
| 8 | `actions/upload-artifact@v4` | 上传报告为 artifact |

---

## 2. 增强版工作流：test-and-report-pr-comment.yml

### 核心功能

1. **PR 评论自动更新**：在 PR 中显示 OKLCH 转换结果
2. **GitHub Checks 集成**：为失败项创建精确的行号注释
3. **Artifact 管理**：上传完整报告供下载
4. **失败优先级分类**：按重要性排序显示问题

### 权限配置

```yaml
permissions:
  contents: read
  pull-requests: write    # 用于发布/更新 PR 评论
  actions: read          # 用于读取 artifact
  checks: write          # 用于创建 GitHub Checks
```

### 环境变量

```yaml
env:
  TOP_N: 5  # 失败报告显示的 Top-N 数量
```

### 详细执行步骤

#### 步骤 1-6：基础设置和构建

与基础工作流相同，包括代码检出、环境设置、依赖安装、测试和构建。

#### 步骤 7：生成 OKLCH 报告

```yaml
- name: Generate OKLCH report (JSON + MD)
  id: gen_report
  env:
    TOP_N: ${{ env.TOP_N }}
  run: |
    npm run report:oklch
```

**生成文件**：
- `reports/oklch-report.json` - JSON 格式报告
- `reports/oklch-report.md` - Markdown 格式报告

**报告结构**：
```json
{
  "generatedAt": "2025-01-30T00:00:00.000Z",
  "summary": {
    "total": 100,
    "failures": 5,
    "warnings": 2
  },
  "results": [...],
  "failures": [
    {
      "path": "color.primary",
      "source": "...",
      "reason": "missing_hex",
      "priorityScore": 100
    }
  ],
  "warnings": [...]
}
```

#### 步骤 8-9：确保报告存在并上传

```yaml
- name: Ensure reports exist
  run: |
    mkdir -p reports
    if [ ! -f reports/oklch-report.json ]; then
      echo '{"generatedAt":"","summary":{"total":0,"failures":0,"warnings":0},"results":[],"failures":[],"warnings":[]}' > reports/oklch-report.json
    fi
    if [ ! -f reports/oklch-report.md ]; then
      echo "# OKLCH report not generated" > reports/oklch-report.md
    fi

- name: Upload OKLCH report artifact
  id: upload_artifact
  uses: actions/upload-artifact@v4
  with:
    name: oklch-report
    path: reports/
```

#### 步骤 10：获取 Artifact 下载 URL

```yaml
- name: Get artifact download URL
  id: get_artifact
  env:
    REPO: ${{ github.repository }}
    RUN_ID: ${{ github.run_id }}
    TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    API="https://api.github.com/repos/${REPO}/actions/runs/${RUN_ID}/artifacts"
    resp=$(curl -s -H "Authorization: token ${TOKEN}" "$API")
    artifact_id=$(echo "$resp" | jq -r '.artifacts[] | select(.name=="oklch-report") | .id')
    if [ -n "$artifact_id" ] && [ "$artifact_id" != "null" ]; then
      art_api="https://api.github.com/repos/${REPO}/actions/artifacts/${artifact_id}"
      art_resp=$(curl -s -H "Authorization: token ${TOKEN}" "$art_api")
      archive_url=$(echo "$art_resp" | jq -r '.archive_download_url')
      echo "::set-output name=url::$archive_url"
    fi
```

#### 步骤 11：构建 PR 评论内容

```yaml
- name: Build PR comment body
  id: build_comment
  run: |
    set -euo pipefail
    JSON="reports/oklch-report.json"
    TOP_N=${{ env.TOP_N }}
    artifact_url="${{ steps.get_artifact.outputs.url }}"

    total=$(jq -r '.summary.total // 0' "$JSON")
    failures=$(jq -r '.summary.failures // 0' "$JSON")
    warnings=$(jq -r '.summary.warnings // 0' "$JSON")
    generatedAt=$(jq -r '.generatedAt // ""' "$JSON")

    # 构建评论内容（包含失败摘要、Top-N、警告、修复建议等）
    comment="# OKLCH -> HEX 转换报告\n\n..."
    echo "::set-output name=body::$comment"
  shell: bash
```

**评论内容结构**：
- 报告摘要（总数、失败数、警告数）
- 最关键的 3 项（优先处理项）
- 失败摘要（Top-N，按优先级排序）
- 警告信息（超出 sRGB 色域）
- 修复建议（快速模板）
- Artifact 下载链接

#### 步骤 12：发布或更新 PR 评论

```yaml
- name: Post or update PR comment with OKLCH summary
  if: github.event_name == 'pull_request'
  uses: peter-evans/create-or-update-comment@v4
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    repository: ${{ github.repository }}
    issue-number: ${{ github.event.pull_request.number }}
    body: ${{ steps.build_comment.outputs.body }}
    identifier: oklch-report-comment
```

**关键参数**：
- `identifier`: 用于识别和更新现有评论
- 首次运行创建新评论
- 后续运行更新现有评论

#### 步骤 13：创建 GitHub Check

```yaml
- name: Create GitHub Check with top-3 annotations
  id: create_check
  if: github.event_name == 'pull_request'
  env:
    REPO: ${{ github.repository }}
    TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    set -euo pipefail
    JSON="reports/oklch-report.json"
    owner_repo="${REPO}"
    owner=$(echo "$owner_repo" | cut -d'/' -f1)
    repo=$(echo "$owner_repo" | cut -d'/' -f2)

    annotations_json="[]"
    failures_count=$(jq '.failures | length' "$JSON")

    if [ "$failures_count" -gt 0 ]; then
      jq -c '.failures[0:3][]' "$JSON" | while read -r item; do
        path=$(echo "$item" | jq -r '.path // "unknown"')
        reason=$(echo "$item" | jq -r '.reason // ""')
        src=$(echo "$item" | jq -r '.source // ""' | sed 's/"/\\"/g')

        ann=$(jq -n --arg path "$path" --arg reason "$reason" --arg src "$src" '{
          path: $path,
          start_line: 1,
          end_line: 1,
          annotation_level: "failure",
          message: ("Reason: " + $reason + " | Source: " + $src)
        }')
        annotations_json=$(echo "$annotations_json" | jq --argjson a "$ann" '. + [$a]')
      done
    fi

    check_payload=$(jq -n \
      --arg name "OKLCH Color Conversion Check" \
      --arg head_sha "${GITHUB_SHA}" \
      --argjson annotations "$annotations_json" \
      '{
        name: $name,
        head_sha: $head_sha,
        status: "completed",
        conclusion: (if $annotations | length > 0 then "failure" else "success" end),
        output: {
          title: "OKLCH Conversion Results",
          summary: (if ($annotations | length) > 0 then "Failures detected" else "All conversions successful" end),
          annotations: $annotations
        }
      }')

    curl -s -X POST \
      -H "Authorization: token ${TOKEN}" \
      -H "Accept: application/vnd.github.v3+json" \
      "https://api.github.com/repos/${REPO}/check-runs" \
      -d "$check_payload"
```

**Check 注释结构**：
- 每个失败项对应一条 annotation
- 包含 token 路径、失败原因、原始值
- 在 PR 的 Checks 标签页显示

---

## 3. 增强功能详解

### 3.1 失败优先级分类

在 `scripts/generate-oklch-report.js` 中实现：

| 优先级分数 | 原因类型 | 说明 |
|-----------|---------|------|
| 100 | `missing_hex` | 缺少 HEX 值（最高优先级） |
| 80 | `parse_error` | OKLCH 字符串解析错误 |
| 60 | `out_of_gamut` | 颜色超出 sRGB 色域 |
| 50 | `unknown_format` | 未知格式 |

**分类逻辑**：
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

### 3.2 Top-N 报告

通过环境变量 `TOP_N` 控制：
```yaml
env:
  TOP_N: 5  # 显示前 5 个失败项
```

### 3.3 PR 评论自动更新

使用 `peter-evans/create-or-update-comment@v4`：
- `identifier: oklch-report-comment` 确保评论唯一性
- 自动检测并更新现有评论
- 支持评论内容长度限制（60,000 字符）

### 3.4 GitHub Checks 集成

为前 3 个失败项创建 Check 注释：
- 在 PR 的 Checks 标签页显示
- 可点击跳转到文件位置
- 显示详细的失败信息

### 3.5 Artifact 管理

自动上传报告文件：
- Artifact 名称: `oklch-report`
- 包含文件: `oklch-report.json`, `oklch-report.md`
- 可在 Actions 页面下载

---

## 4. 本地测试与调试

### 运行测试

```bash
# 安装依赖
npm install

# 运行 OKLCH 烟雾测试
npm run test:oklch

# 运行单元测试
npm run test

# 生成 OKLCH 报告
npm run report:oklch

# 构建 tokens
npm run build:tokens
```

### 查看报告

报告生成后位于 `reports/` 目录：
```bash
# 查看 JSON 报告
cat reports/oklch-report.json

# 查看 Markdown 报告
cat reports/oklch-report.md
```

### 调试工作流

在 GitHub Actions 页面：
1. 进入仓库的 Actions 标签页
2. 选择失败的工作流运行
3. 点击具体步骤查看详细日志
4. 检查环境变量和输出

---

## 5. 配置说明

### 5.1 修改 TOP_N 数量

编辑 `.github/workflows/test-and-report-pr-comment.yml`：
```yaml
env:
  TOP_N: 10  # 修改为您想要的数量
```

### 5.2 修改失败优先级

编辑 `scripts/generate-oklch-report.js`：
```javascript
function classifyFailure(item) {
  // 修改优先级分数
  if (!value.hex && !(value.oklch || value.okLch)) {
    reason = 'missing_hex';
    score = 100;  // 修改这里
    return { reason, score };
  }
}
```

### 5.3 添加新的检查类型

在 `scripts/generate-oklch-report.js` 中：
1. 扩展 `extractColorTokens` 函数
2. 添加新的分类逻辑到 `classifyFailure` 函数
3. 更新报告生成逻辑

---

## 6. 常见问题

### Q1: PR 评论没有显示

**可能原因**：
- 工作流权限不足
- 触发条件不满足
- 评论内容超过长度限制

**解决方案**：
1. 检查仓库设置中的 Actions 权限
2. 确保 `permissions` 配置包含 `pull-requests: write`
3. 检查工作流日志中的错误信息

### Q2: Artifact 无法下载

**可能原因**：
- Artifact 上传失败
- 文件路径不正确
- 权限不足

**解决方案**：
1. 检查 `reports/` 目录是否存在
2. 确认 `actions/upload-artifact@v4` 配置正确
3. 在 Actions 页面查看详细错误日志

### Q3: Check 注释未显示

**可能原因**：
- GitHub Checks API 调用失败
- `checks: write` 权限未配置
- API 认证信息错误

**解决方案**：
1. 检查 `permissions` 配置包含 `checks: write`
2. 验证 `GITHUB_TOKEN` 正确传递
3. 查看 API 响应中的错误信息

### Q4: 工作流运行超时

**可能原因**：
- 依赖安装时间过长
- 构建过程复杂
- 网络问题

**解决方案**：
1. 使用 `npm ci` 替代 `npm install`
2. 添加缓存步骤（`actions/cache`）
3. 考虑优化构建流程

---

## 7. 最佳实践

### 7.1 代码质量

- 保持 JSON 格式化良好，便于行号定位
- 使用一致的命名规范
- 添加适当的注释

### 7.2 工作流优化

- 使用缓存加速构建
- 并行化独立步骤
- 合理设置超时时间

### 7.3 报告管理

- 定期清理旧的 artifact
- 优化报告内容长度
- 提供清晰的修复建议

### 7.4 团队协作

- 配置分支保护规则
- 要求 PR 通过 CI 检查
- 及时处理 CI 失败

---

## 8. 故障排除

### 工作流日志分析

```bash
# 在 Actions 页面查看日志
1. 进入仓库的 Actions 标签页
2. 选择工作流运行
3. 点击具体步骤查看日志
4. 查找错误信息和堆栈跟踪
```

### 本地重现问题

```bash
# 检查 Node.js 版本
node --version  # 应该 >= 16

# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 运行测试
npm test

# 生成报告
npm run report:oklch
```

### 常见错误代码

| 错误代码 | 说明 | 解决方案 |
|---------|------|---------|
| `ENOENT` | 文件未找到 | 检查文件路径是否正确 |
| `EACCES` | 权限不足 | 检查文件权限 |
| `ETIMEDOUT` | 请求超时 | 检查网络连接 |
| `401` | 认证失败 | 检查 `GITHUB_TOKEN` |

---

## 9. 进阶功能

### 9.1 精确行号映射（可选）

如需更精确的行号定位，可以：

1. **生成行号映射文件**
   - 创建 `scripts/generate-tokens-line-map.js`
   - 扫描 `design/tokens.json` 并记录行号
   - 输出 `reports/tokens-line-map.json`

2. **在工作流中使用映射**
   - 读取 `tokens-line-map.json`
   - 使用精确行号创建 Check 注释

3. **提高匹配准确性**
   - 在 token 对象中添加注释字段
   - 使用 JSON Pointer 定位
   - 包含上下文片段

### 9.2 多文件支持

如 tokens 被拆分为多个文件：

1. 修改 `extractColorTokens` 支持多文件
2. 在 workflow 中扫描多个文件
3. 在 annotation 中使用正确的文件路径

### 9.3 可视化预览

在 artifact 上传后：

1. 触发短期预览服务（Netlify/GitHub Pages）
2. 展示颜色差异
3. 便于设计师确认

---

## 10. 安全考虑

### 10.1 密钥管理

- 不在代码中硬编码密钥
- 使用 GitHub Secrets
- 定期轮换密钥

### 10.2 权限最小化

```yaml
permissions:
  contents: read          # 只读代码
  pull-requests: write    # 仅写入 PR 评论
  actions: read          # 仅读取 artifact
  checks: write          # 仅写入 checks
```

### 10.3 输入验证

- 验证所有环境变量
- 检查文件路径安全性
- 防止注入攻击

---

## 11. 性能优化

### 11.1 缓存策略

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### 11.2 并行执行

```yaml
jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: Run tests in parallel
        run: |
          npm test &
          npm run test:oklch &
          wait
```

### 11.3 增量构建

- 只在相关文件变更时运行
- 使用路径过滤
- 缓存构建结果

---

## 12. 监控与告警

### 12.1 工作流监控

- 定期检查 Actions 页面
- 设置失败通知
- 记录运行统计

### 12.2 性能指标

- 工作流运行时间
- 失败率统计
- 资源使用情况

### 12.3 告警配置

在仓库设置中：
- 配置失败通知
- 设置 Slack/邮件集成
- 定义响应流程

---

## 13. 贡献指南

如需改进或扩展工作流：

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/workflow-improvement`
3. 提交更改：`git commit -am 'Improve workflow'`
4. 推送到分支：`git push origin feature/workflow-improvement`
5. 创建 Pull Request

**提交规范**：
- 遵循 Conventional Commits
- 提供清晰的变更说明
- 包含测试用例

---

## 14. 参考资料

### 官方文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Checks API](https://docs.github.com/en/rest/checks)
- [Style Dictionary 文档](https://amzn.github.io/style-dictionary/)

### 相关工具

- [peter-evans/create-or-update-comment](https://github.com/peter-evans/create-or-update-comment)
- [actions/upload-artifact](https://github.com/actions/upload-artifact)
- [actions/cache](https://github.com/actions/cache)

---

## 15. 许可证

本项目的 GitHub Actions 工作流遵循项目主许可证。

---

## 16. 联系方式

如有问题或建议：

- **GitHub Issues**: [提交问题](https://github.com/your-repo/issues)
- **邮件**: admin@0379.email
- **文档**: 查看 [项目 README](../../README.md)

---

**最后更新**: 2025-01-30
**文档版本**: 1.0.0
**维护者**: YYC³ Team
