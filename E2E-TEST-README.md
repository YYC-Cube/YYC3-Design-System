# 🎭 E2E测试说明

## 问题描述

E2E测试失败的原因是**Playwright浏览器未安装**。

错误信息：
```
Error: browserType.launch: Executable doesn't exist at /Users/yanyu/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell
```

## 解决方案

### 方案 1: 安装Playwright浏览器

```bash
# 安装Chromium浏览器
pnpm exec playwright install chromium

# 或者安装所有浏览器
pnpm exec playwright install --with-deps
```

### 方案 2: 修改test:e2e脚本

修改 `package.json` 中的 `test:e2e` 脚本：

```json
{
  "scripts": {
    "test:e2e": "playwright install --with-deps && playwright test"
  }
}
```

### 方案 3: 使用Docker

使用Docker运行E2E测试：

```bash
docker run --rm -it -v $(pwd):/app -w /app mcr.microsoft.com/playwright:v1.42.0-jammy sh -c "npm install && npx playwright install && npx playwright test"
```

## 运行E2E测试

### 1. 安装浏览器

```bash
pnpm exec playwright install chromium
```

### 2. 启动开发服务器

```bash
pnpm dev
```

### 3. 运行E2E测试（新终端）

```bash
pnpm test:e2e
```

### 4. 查看测试报告

```bash
pnpm exec playwright show-report
```

## 常见问题

### Q1: Playwright浏览器安装失败

**A**: 检查网络连接，或者使用代理：

```bash
PLAYWRIGHT_DOWNLOAD_HOST=https://playwright.azureedge.net pnpm exec playwright install
```

### Q2: E2E测试超时

**A**: 检查开发服务器是否启动成功，并确认端口为5173：

```bash
lsof -i :5173
```

### Q3: E2E测试在CI/CD中失败

**A**: 在CI/CD中添加安装浏览器的步骤：

```yaml
- name: Install Playwright browsers
  run: pnpm exec playwright install --with-deps

- name: Run E2E tests
  run: pnpm test:e2e
```

## 技术支持

- **Playwright文档**: [https://playwright.dev](https://playwright.dev)
- **GitHub Issues**: [https://github.com/YYC-Cube/YYC3-Design-System/issues](https://github.com/YYC-Cube/YYC3-Design-System/issues)
- **Email**: support@yyc3.com
