---
@file: TESTING.md
@description: YYC³ Design System 智能化测试操作脚本指南
@author: YanYuCloudCube Team
@version: 2.0.0
@created: 2026-03-01
@updated: 2026-03-01
@status: active
@tags: testing, automation, qa
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# YYC³ Design System 智能化测试操作脚本指南

本文档详细说明 YYC³ Design System 的智能化测试操作脚本和自动化测试流程。

## 📋 目录

- [测试脚本概览](#测试脚本概览)
- [快速开始](#快速开始)
- [单元测试](#单元测试)
- [集成测试](#集成测试)
- [E2E 测试](#e2e-测试)
- [可访问性测试](#可访问性测试)
- [性能测试](#性能测试)
- [OKLCH 颜色转换测试](#oklch-颜色转换测试)
- [完整 QA 检查](#完整-qa-检查)
- [持续集成](#持续集成)
- [测试覆盖率](#测试覆盖率)
- [故障排除](#故障排除)

## 测试脚本概览

YYC³ Design System 提供全面的测试脚本，覆盖所有测试类型：

| 脚本 | 描述 | 用时 |
|------|------|------|
| `npm test` | 运行所有测试 | 5-10 min |
| `npm run test:unit` | 单元测试 | 2-3 min |
| `npm run test:integration` | 集成测试 | 3-5 min |
| `npm run test:e2e` | E2E 测试（无头） | 5-8 min |
| `npm run test:e2e:headed` | E2E 测试（有头） | 5-8 min |
| `npm run test:a11y` | 可访问性测试 | 1-2 min |
| `npm run test:perf` | 性能测试 | 2-3 min |
| `npm run test:oklch` | OKLCH 颜色转换测试 | 30 sec |
| `npm run test:coverage` | 测试覆盖率报告 | 3-5 min |
| `npm run qa` | 完整 QA 检查 | 10-15 min |

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行所有测试

```bash
npm test
```

### 运行完整 QA 检查

```bash
npm run qa
```

完整 QA 检查包括：
1. TypeScript 类型检查
2. ESLint 代码检查
3. Locale 验证
4. 所有测试运行
5. 测试覆盖率生成
6. E2E 测试

## 单元测试

### 运行单元测试

```bash
npm run test:unit
```

### 监听模式

```bash
npm run test:watch
```

### 单元测试示例

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button 组件', () => {
  beforeEach(() => {
    // 每个测试前运行
  });

  it('应该渲染按钮文本', () => {
    render(<Button label="Click me" onClick={vi.fn()} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('应该在点击时调用 onClick', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('应该在禁用时不调用 onClick', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} disabled />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### 单元测试最佳实践

1. **隔离性**：每个测试应该独立运行
2. **可读性**：测试名称应该描述测试内容
3. **覆盖率**：目标覆盖率 ≥80%
4. **速度**：单元测试应该快速运行（<100ms）

## 集成测试

### 运行集成测试

```bash
npm run test:integration
```

### 集成测试示例

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import { App } from '../App';

describe('主题系统集成测试', () => {
  it('应该正确初始化主题', async () => {
    render(
      <ThemeProvider defaultTheme="future" defaultMode="light">
        <App />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-indicator')).toHaveTextContent('future');
    });
  });

  it('应该正确切换主题', async () => {
    render(
      <ThemeProvider defaultTheme="future" defaultMode="light">
        <App />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('theme-toggle');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByTestId('theme-indicator')).toHaveTextContent('cyber');
    });
  });
});
```

## E2E 测试

### 运行 E2E 测试

```bash
# 无头模式（推荐用于 CI）
npm run test:e2e

# 有头模式（用于调试）
npm run test:e2e:headed
```

### E2E 测试示例

```typescript
import { test, expect } from '@playwright/test';

test.describe('主题切换 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3200');
  });

  test('应该能够切换主题', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');
    await themeToggle.click();

    await expect(page.locator('body')).toHaveClass(/theme-cyber/);
  });

  test('应该能够切换语言', async ({ page }) => {
    const langToggle = page.getByTestId('lang-toggle');
    await langToggle.click();

    await expect(page.getByText('English')).toBeVisible();
  });

  test('应该能够安装 PWA', async ({ page }) => {
    const installButton = page.getByText('安装应用');
    if (await installButton.isVisible()) {
      await installButton.click();
      await expect(page.getByText('应用已安装')).toBeVisible();
    }
  });
});
```

### E2E 测试最佳实践

1. **用户视角**：模拟真实用户操作
2. **稳定性**：使用等待策略避免竞态条件
3. **独立性**：测试之间应该独立
4. **可维护性**：使用页面对象模式

## 可访问性测试

### 运行可访问性测试

```bash
npm run test:a11y
```

### 可访问性测试示例

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button 可访问性测试', () => {
  it('应该没有可访问性违规', async () => {
    const { container } = render(
      <Button label="Click me" onClick={vi.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('应该有正确的 ARIA 标签', () => {
    render(<Button label="Click me" onClick={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });
});
```

### 可访问性检查项

- [ ] 所有交互元素可以通过键盘访问
- [ ] 所有图片有 alt 文本
- [ ] 表单标签与输入正确关联
- [ ] 颜色对比度满足 WCAG AA 标准
- [ ] 焦点指示清晰可见
- [ ] ARIA 标签正确使用

## 性能测试

### 运行性能测试

```bash
npm run test:perf
```

### 性能测试示例

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button 性能测试', () => {
  it('应该在合理时间内渲染', () => {
    const startTime = performance.now();
    render(<Button label="Click me" onClick={vi.fn()} />);
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(16); // 60fps = 16.67ms per frame
  });

  it('应该正确使用 React.memo 优化', () => {
    const { rerender } = render(
      <Button label="Click me" onClick={vi.fn()} />
    );
    const firstRenderTime = performance.now();

    rerender(<Button label="Click me" onClick={vi.fn()} />);
    const secondRenderTime = performance.now();

    const reRenderTime = secondRenderTime - firstRenderTime;
    expect(reRenderTime).toBeLessThan(5); // 重新渲染应该更快
  });
});
```

### 性能基准

| 组件 | 渲染时间 | 目标 |
|------|----------|------|
| Button | < 1ms | ✅ |
| Input | < 2ms | ✅ |
| Modal | < 5ms | ✅ |
| ThemeProvider | < 10ms | ✅ |

## OKLCH 颜色转换测试

### 运行 OKLCH 测试

```bash
npm run test:oklch
```

### OKLCH 测试示例

```typescript
import { describe, it, expect } from 'vitest';
import { oklchToHex, hexToOklch } from '../utils/color';

describe('OKLCH 颜色转换测试', () => {
  it('应该正确转换 OKLCH 到 HEX', () => {
    const hex = oklchToHex(0.5, 0.1, 180);
    expect(hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('应该正确转换 HEX 到 OKLCH', () => {
    const oklch = hexToOklch('#ff0000');
    expect(oklch).toHaveProperty('l');
    expect(oklch).toHaveProperty('c');
    expect(oklch).toHaveProperty('h');
  });

  it('应该是双向转换一致的', () => {
    const originalHex = '#3A9FFB';
    const oklch = hexToOklch(originalHex);
    const convertedHex = oklchToHex(oklch.l, oklch.c, oklch.h);
    expect(convertedHex).toBeCloseToHex(originalHex);
  });
});
```

### OKLCH 转换精度

- **精度要求**：HEX 值差异 ≤ 5
- **性能要求**：转换时间 < 1ms
- **覆盖范围**：所有有效 OKLCH 值

## 完整 QA 检查

### 运行完整 QA 检查

```bash
npm run qa
```

### QA 检查流程

1. **类型检查** (`npm run typecheck`)
   - 验证所有 TypeScript 类型
   - 确保类型安全

2. **代码检查** (`npm run lint`)
   - ESLint 代码质量检查
   - 代码风格一致性

3. **Locale 验证** (`npm run validate:locales`)
   - 检查翻译完整性
   - 验证翻译键一致性

4. **测试运行** (`npm test -- --coverage`)
   - 运行所有测试
   - 生成覆盖率报告

5. **E2E 测试** (`npm run test:e2e`)
   - 验证端到端流程
   - 确保用户场景正常

6. **QA Dashboard 检查**
   - 生成 QA 报告
   - 标识问题区域

### QA 检查报告

完整 QA 检查后会生成详细报告，包括：

```markdown
# QA 检查报告

## 检查结果
- ✅ TypeScript 类型检查：通过
- ✅ ESLint 代码检查：通过
- ✅ Locale 验证：通过
- ✅ 单元测试：通过 (100/100)
- ✅ 集成测试：通过 (50/50)
- ✅ E2E 测试：通过 (20/20)
- ✅ 可访问性测试：通过 (0 violations)
- ✅ 性能测试：通过

## 测试覆盖率
- 语句覆盖率：85%
- 分支覆盖率：82%
- 函数覆盖率：88%
- 行覆盖率：85%

## 发现的问题
- 无

## 建议
- 可以继续提升测试覆盖率到 90%
- 建议添加更多边界情况测试
```

## 持续集成

### GitHub Actions 工作流

项目配置了完整的 CI/CD 工作流，自动运行所有测试：

```yaml
name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run validate:locales
      - run: npm test -- --coverage
      - run: npm run test:e2e
      - uses: codecov/codecov-action@v3
```

### CI 检查项

每次 PR 和 push 都会自动运行：
1. TypeScript 类型检查
2. ESLint 代码检查
3. Locale 验证
4. 所有测试
5. E2E 测试
6. 构建验证

### 状态徽章

在 README.md 中添加状态徽章：

```markdown
[![Build Status](https://github.com/YYC-Cube/YYC3-Design-System/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/YYC-Cube/YYC3-Design-System/actions/workflows/ci-cd.yml)
[![Test Coverage](https://codecov.io/gh/YYC-Cube/YYC3-Design-System/branch/main/graph/badge.svg)](https://codecov.io/gh/YYC-Cube/YYC3-Design-System)
```

## 测试覆盖率

### 生成覆盖率报告

```bash
npm run test:coverage
```

### 覆盖率目标

| 指标 | 目标 | 当前 | 状态 |
|------|------|------|------|
| 语句覆盖率 | ≥80% | 85% | ✅ |
| 分支覆盖率 | ≥75% | 82% | ✅ |
| 函数覆盖率 | ≥80% | 88% | ✅ |
| 行覆盖率 | ≥80% | 85% | ✅ |

### 覆盖率报告查看

生成报告后，在浏览器中打开：

```bash
open coverage/lcov-report/index.html
```

### 提升覆盖率建议

1. **识别未覆盖代码**
   ```bash
   npm run test:coverage
   # 查看 coverage/lcov-report/index.html
   ```

2. **添加缺失测试**
   - 为未覆盖的分支添加测试
   - 测试边界情况
   - 测试错误处理

3. **重构代码**
   - 简化复杂逻辑
   - 拆分大函数
   - 减少嵌套

## 故障排除

### 常见问题

**Q: 测试超时？**

A: 增加测试超时时间：
```typescript
it('应该异步加载', async () => {
  await waitFor(() => {
    expect(element).toBeVisible();
  }, { timeout: 5000 });
});
```

**Q: Mock 失败？**

A: 确保 mock 正确设置：
```typescript
vi.mock('../api', () => ({
  fetchData: vi.fn().mockResolvedValue({ data: 'test' })
}));
```

**Q: E2E 测试不稳定？**

A: 使用等待策略：
```typescript
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible();
```

**Q: 测试覆盖率不正确？**

A: 清理缓存并重新运行：
```bash
rm -rf coverage
npm run test:coverage
```

### 调试技巧

1. **使用 debug 模式**
   ```bash
   DEBUG=* npm test
   ```

2. **查看详细输出**
   ```bash
   npm test -- --verbose
   ```

3. **运行单个测试**
   ```bash
   npm test -- --testNamePattern="should render button"
   ```

4. **使用 VS Code 调试**
   - 安装 Jest Runner 插件
   - 在测试文件中设置断点
   - 点击测试旁的调试按钮

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
