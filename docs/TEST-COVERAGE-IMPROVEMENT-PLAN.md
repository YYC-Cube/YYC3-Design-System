# YYC³ Design System - 测试覆盖率提升计划

> **文档版本**: 1.0.0
> **创建日期**: 2026-03-03
> **维护者**: YYC³ Quality Team
> **目标覆盖率**: 80%

---

## 📊 当前覆盖率状况

### 整体覆盖率（基于 Button.test.tsx）

| 指标 | 当前值 | 目标值 | 差距 |
|------|--------|--------|------|
| Statements | 0.51% (65/12614) | 80% | -79.49% |
| Branches | 1.13% (64/5640) | 80% | -78.87% |
| Functions | 0.38% (13/3369) | 80% | -79.62% |
| Lines | 0.52% (61/11541) | 80% | -79.48% |

### 测试执行情况

- **测试套件总数**: 79
- **已执行测试套件**: ~29
- **测试总数**: 1225+
- **已执行测试**: ~150
- **执行率**: ~12%

### 问题分析

1. **大量测试被跳过**: 1224个测试被跳过（94.7%）
2. **测试套件执行不完整**: 许多测试套件因配置/依赖问题未执行
3. **覆盖率数据不完整**: 只有部分测试文件被执行

---

## 🎯 覆盖率提升策略

### 策略 1: 修复测试执行问题（优先级：🔴 高）

#### 1.1 解决测试跳过问题

**目标**: 将测试跳过率从94.7%降低到10%以下

**行动计划**:
1. 调查为什么大量测试被跳过
   - 检查Jest配置中的忽略模式
   - 检查测试文件命名规范
   - 检查测试条件判断逻辑

2. 修复阻止测试运行的问题
   - 添加缺失的依赖
   - 修复类型错误
   - 修复导入路径问题

3. 启用所有测试套件执行
   - 确保所有测试文件符合命名规范
   - 修复配置问题

**预期成果**:
- 测试跳过率: 94.7% → <10%
- 可执行测试数: 1 → 1000+
- 时间投入: 4-6小时

#### 1.2 修复测试断言失败

**目标**: 将测试通过率从83.7%提升到95%以上

**行动计划**:
1. 修复Badge测试的颜色值断言
   - 使用动态样式检查
   - 或更新期望值以匹配主题

2. 修复ThemeToggle测试的断言
   - 更新断言以匹配实际渲染的图标
   - 或使用更灵活的断言方法

3. 修复其他组件的测试失败
   - 逐个组件分析和修复

**预期成果**:
- 测试通过率: 83.7% → 95%+
- 失败测试数: ~20 → <10
- 时间投入: 2-3小时

### 策略 2: 为未测试组件编写测试（优先级：🟡 中）

#### 2.1 高优先级组件（核心功能）

**目标**: 为核心组件编写测试，覆盖率提升到30%

**组件列表**:
1. **UI组件** (src/components/ui/)
   - alert.tsx
   - avatar.tsx
   - checkbox.tsx
   - dialog.tsx
   - dropdown-menu.tsx
   - form.tsx
   - input.tsx
   - select.tsx
   - table.tsx
   - toast.tsx

2. **布局组件** (src/components/)
   - Container.tsx
   - Grid.tsx
   - Section.tsx

3. **功能组件** (src/components/)
   - Collapsible.tsx
   - Tabs.tsx
   - Tooltip.tsx

**测试模板**:
```typescript
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';
import { ThemeProvider } from '../context/ThemeContext';

describe('ComponentName 组件', () => {
  it('应该正确渲染', () => {
    render(
      <ThemeProvider>
        <ComponentName>测试内容</ComponentName>
      </ThemeProvider>
    );

    expect(screen.getByText('测试内容')).toBeInTheDocument();
  });

  it('应该接受自定义 className', () => {
    render(
      <ThemeProvider>
        <ComponentName className="custom-class">测试</ComponentName>
      </ThemeProvider>
    );

    const element = screen.getByText('测试');
    expect(element).toHaveClass('custom-class');
  });

  it('应该接受自定义样式', () => {
    render(
      <ThemeProvider>
        <ComponentName style={{ color: 'red' }}>测试</ComponentName>
      </ThemeProvider>
    );

    const element = screen.getByText('测试');
    expect(element).toHaveStyle({ color: 'red' });
  });

  it('应该处理各种 props', () => {
    render(
      <ThemeProvider>
        <ComponentName prop1="value1" prop2="value2">测试</ComponentName>
      </ThemeProvider>
    );

    expect(screen.getByText('测试')).toBeInTheDocument();
  });
});
```

**预期成果**:
- 新增测试: ~50个
- 覆盖率提升: 0.51% → 30%
- 时间投入: 8-12小时

#### 2.2 中优先级组件（辅助功能）

**目标**: 为辅助组件编写测试，覆盖率提升到50%

**组件列表**:
1. **工具函数** (src/utils/)
   - cn.ts
   - animations.ts
   - locale-validation.ts
   - token-utils.ts

2. **主题系统** (src/theme/)
   - ThemeProvider.tsx
   - ThemeContext.tsx
   - useTheme.ts

3. **国际化** (src/i18n/)
   - LanguageContext.tsx
   - locale-validation.ts

4. **安全组件** (src/security/)
   - XSSProtection.tsx
   - SafeHTML
   - SafeInput

**测试模板（工具函数）**:
```typescript
import { functionName } from './fileName';

describe('functionName', () => {
  it('应该正确处理有效输入', () => {
    const result = functionName('valid input');
    expect(result).toBe('expected output');
  });

  it('应该正确处理无效输入', () => {
    const result = functionName('invalid input');
    expect(result).toBe('expected fallback');
  });

  it('应该处理边界情况', () => {
    const result = functionName('');
    expect(result).toBe('expected output for empty');
  });

  it('应该处理 null/undefined', () => {
    const result = functionName(null);
    expect(result).toBe('expected output for null');
  });
});
```

**预期成果**:
- 新增测试: ~30个
- 覆盖率提升: 30% → 50%
- 时间投入: 6-8小时

#### 2.3 低优先级组件（示例和文档）

**目标**: 为示例组件编写基础测试，覆盖率提升到60%

**组件列表**:
1. **示例组件** (src/components/*Example.tsx)
2. **优化组件** (src/components/*Optimization.tsx)
3. **AI组件** (src/components/AI*.tsx)

**注意**: 示例组件的测试可以相对简单，主要验证它们可以渲染。

**预期成果**:
- 新增测试: ~20个
- 覆盖率提升: 50% → 60%
- 时间投入: 4-6小时

### 策略 3: 增强现有测试（优先级：🟢 低）

#### 3.1 提高断言覆盖率

**目标**: 增强现有测试的断言，捕获更多代码路径

**行动计划**:
1. 为每个测试添加更多断言
2. 测试边缘情况和错误处理
3. 测试不同状态和变体

**示例**:
```typescript
// 之前
it('应该正确渲染', () => {
  render(<Component />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});

// 之后
it('应该正确渲染', () => {
  const { container } = render(<Component />);

  expect(screen.getByText('Test')).toBeInTheDocument();
  expect(container.querySelector('.component-class')).toBeInTheDocument();
  expect(screen.getByRole('button')).toBeDisabled();
});
```

**预期成果**:
- 代码路径覆盖率提升
- 边缘情况覆盖率提升
- 时间投入: 4-6小时

#### 3.2 添加集成测试

**目标**: 测试组件之间的交互

**行动计划**:
1. 创建组件组合的集成测试
2. 测试Context和Provider的使用
3. 测试事件处理和状态变化

**示例**:
```typescript
describe('组件集成测试', () => {
  it('Button 在 Form 中应该正确工作', () => {
    const handleSubmit = jest.fn();

    render(
      <ThemeProvider>
        <Form onSubmit={handleSubmit}>
          <Button type="submit">提交</Button>
        </Form>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('Tabs 应该正确切换内容', () => {
    render(
      <ThemeProvider>
        <Tabs>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeVisible();
    expect(screen.queryByText('Content 1')).not.toBeVisible();
  });
});
```

**预期成果**:
- 集成测试覆盖率提升
- 组件交互测试覆盖率提升
- 时间投入: 6-8小时

---

## 📅 实施时间表

### 第一阶段：修复测试执行（1周）

| 任务 | 负责人 | 时间 | 状态 |
|------|--------|------|------|
| 修复测试跳过问题 | QA团队 | 2-3天 | 🔄 待开始 |
| 修复测试断言失败 | 开发团队 | 2-3天 | 🔄 待开始 |
| 启用所有测试套件 | DevOps团队 | 1天 | 🔄 待开始 |

**里程碑**: 测试跳过率 <10%，测试执行率 >90%

### 第二阶段：核心组件测试（2周）

| 任务 | 负责人 | 时间 | 状态 |
|------|--------|------|------|
| UI组件测试 | UI团队 | 5-7天 | 🔄 待开始 |
| 布局组件测试 | UI团队 | 2-3天 | 🔄 待开始 |
| 功能组件测试 | 功能团队 | 3-4天 | 🔄 待开始 |

**里程碑**: 核心组件覆盖率 ≥80%，整体覆盖率 ≥30%

### 第三阶段：辅助功能测试（2周）

| 任务 | 负责人 | 时间 | 状态 |
|------|--------|------|------|
| 工具函数测试 | 工具团队 | 3-4天 | 🔄 待开始 |
| 主题系统测试 | 主题团队 | 2-3天 | 🔄 待开始 |
| 国际化测试 | i18n团队 | 2-3天 | 🔄 待开始 |
| 安全组件测试 | 安全团队 | 2-3天 | 🔄 待开始 |

**里程碑**: 辅助功能覆盖率 ≥80%，整体覆盖率 ≥50%

### 第四阶段：增强和集成测试（1-2周）

| 任务 | 负责人 | 时间 | 状态 |
|------|--------|------|------|
| 增强现有测试 | QA团队 | 3-4天 | 🔄 待开始 |
| 集成测试编写 | QA团队 | 4-6天 | 🔄 待开始 |

**里程碑**: 整体覆盖率 ≥80%

---

## 📈 覆盖率提升预测

### 第一阶段后
- 测试执行率: 12% → 90%
- 测试跳过率: 94.7% → <10%
- 覆盖率: 0.51% → 5%
- 测试总数: 1 → 1000+

### 第二阶段后
- 核心组件覆盖率: 0% → 80%
- 整体覆盖率: 5% → 30%
- 新增测试: ~50个

### 第三阶段后
- 辅助功能覆盖率: 0% → 80%
- 整体覆盖率: 30% → 50%
- 新增测试: ~30个

### 第四阶段后
- 整体覆盖率: 50% → 80%
- 新增测试: ~20个
- 集成测试: ~10个

### 最终目标
- **Statements**: 0.51% → 80%
- **Branches**: 1.13% → 80%
- **Functions**: 0.38% → 80%
- **Lines**: 0.52% → 80%

---

## 🛠️ 工具和资源

### 测试工具

- **Jest**: 测试框架
- **@testing-library/react**: React组件测试
- **@testing-library/user-event**: 用户交互测试
- **@testing-library/jest-dom**: Jest断言扩展
- **jest-axe**: 可访问性测试
- **Playwright**: E2E测试

### 覆盖率工具

- **Jest Coverage**: Jest内置覆盖率
- **Istanbul**: 覆盖率生成器
- **Codecov**: 覆盖率可视化

### 测试辅助工具

- **msw**: Mock Service Worker（API mock）
- **jest-fns**: 函数mock工具
- **react-test-renderer**: 组件快照测试

---

## 📝 测试最佳实践

### 1. 测试命名

```typescript
// ✅ 好的命名
it('应该在用户点击时提交表单', () => {});

// ❌ 不好的命名
it('test1', () => {});
it('表单测试', () => {});
```

### 2. 测试结构

```typescript
// ✅ AAA模式（Arrange, Act, Assert）
it('应该正确计算总价', () => {
  // Arrange
  const price = 100;
  const quantity = 2;
  const tax = 0.1;

  // Act
  const total = calculateTotal(price, quantity, tax);

  // Assert
  expect(total).toBe(220);
});
```

### 3. 测试独立性

```typescript
// ✅ 每个测试独立
it('应该正确处理A', () => {
  const result = process('A');
  expect(result).toBe('Result A');
});

it('应该正确处理B', () => {
  const result = process('B');
  expect(result).toBe('Result B');
});

// ❌ 测试相互依赖
it('应该正确处理A', () => {
  state.value = 'A';
  expect(state.value).toBe('A');
});

it('应该正确处理B', () => {
  // 依赖上一个测试的结果
  expect(state.value).toBe('B'); // 可能失败
});
```

### 4. 测试可读性

```typescript
// ✅ 清晰和描述性
const submitButton = screen.getByRole('button', { name: /submit/i });
expect(submitButton).toBeEnabled();

// ❌ 模糊和不清晰
const button = screen.getByRole('button');
expect(button).not.toBeDisabled();
```

### 5. 测试覆盖

```typescript
// ✅ 测试正常和边缘情况
it('应该正确处理有效输入', () => {
  expect(validateEmail('test@example.com')).toBe(true);
});

it('应该拒绝无效输入', () => {
  expect(validateEmail('invalid')).toBe(false);
});

it('应该处理空字符串', () => {
  expect(validateEmail('')).toBe(false);
});

it('应该处理null', () => {
  expect(validateEmail(null)).toBe(false);
});
```

---

## 🔍 覆盖率监控

### 持续集成配置

在 `.github/workflows/test.yml` 中配置：

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Check coverage threshold
        run: |
          if [ $(node -e "console.log(require('./coverage/coverage-summary.json').total.lines.pct")") -lt 80 ]; then
            echo "Coverage below 80%"
            exit 1
          fi
```

### 覆盖率徽章

在 README.md 中添加：

```markdown
![Coverage](https://codecov.io/gh/YYC-Cube/YYC3-Design-System/branch/main/graph/badge.svg)
```

---

## 🎯 成功标准

### 短期目标（1个月内）
- [ ] 测试跳过率 <10%
- [ ] 测试执行率 >90%
- [ ] 核心组件覆盖率 ≥80%
- [ ] 整体覆盖率 ≥30%

### 中期目标（2-3个月内）
- [ ] 所有组件覆盖率 ≥80%
- [ ] 辅助功能覆盖率 ≥80%
- [ ] 整体覆盖率 ≥80%
- [ ] 集成测试覆盖率 ≥70%

### 长期目标（持续）
- [ ] 保持覆盖率 ≥80%
- [ ] 所有新代码覆盖率 100%
- [ ] 每个PR包含测试

---

## 📞 支持和联系

### 团队联系

- **QA团队**: qa@yyc3.com
- **开发团队**: dev@yyc3.com
- **技术支持**: support@yyc3.com

### 文档资源

- [Jest文档](https://jestjs.io/docs/getting-started)
- [Testing Library文档](https://testing-library.com/docs/react-testing-library/intro)
- [覆盖率最佳实践](https://jestjs.io/docs/configuration#collectcoverage-boolean)

---

## 📄 附录

### A. 未测试组件清单

#### UI组件（src/components/ui/）
- [ ] alert.tsx
- [ ] avatar.tsx
- [ ] badge.tsx ✅ 已测试
- [ ] button.tsx ✅ 已测试
- [ ] calendar.tsx
- [ ] card.tsx ✅ 已测试
- [ ] carousel.tsx
- [ ] checkbox.tsx
- [ ] collapsible.tsx
- [ ] command.tsx
- [ ] context-menu.tsx
- [ ] dialog.tsx
- [ ] drawer.tsx
- [ ] dropdown-menu.tsx
- [ ] form.tsx
- [ ] hover-card.tsx
- [ ] input.tsx
- [ ] label.tsx
- [ ] menubar.tsx
- [ ] navigation-menu.tsx
- [ ] pagination.tsx
- [ ] popover.tsx
- [ ] progress.tsx
- [ ] radio-group.tsx
- [ ] scroll-area.tsx
- [ ] select.tsx
- [ ] separator.tsx
- [ ] sheet.tsx
- [ ] skeleton.tsx
- [ ] slider.tsx
- [ ] sonner.tsx
- [ ] switch.tsx
- [ ] table.tsx
- [ ] tabs.tsx
- [ ] toast.tsx
- [ ] toggle-group.tsx
- [ ] tooltip.tsx

#### 工具函数（src/utils/）
- [ ] animations-enhanced.ts
- [ ] animations.ts
- [ ] cn.ts
- [ ] font-display-optimizer.ts
- [ ] font-preloader.ts
- [ ] font-subsetter.ts
- [ ] image-lazy-loader.ts
- [ ] image-preloader.ts
- [ ] lazy-loader.tsx
- [ ] locale-validation.ts
- [ ] logger.ts
- [ ] optimized-animations.ts
- [ ] performance-reporter.ts
- [ ] performance.ts
- [ ] resource-preloader.ts
- [ ] responsive-image.ts
- [ ] theme-persistence.ts
- [ ] token-utils.ts
- [ ] virtual-scroll.ts
- [ ] web-vitals.ts

### B. 测试模板集合

#### UI组件测试模板

```typescript
// src/components/ui/ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';
import { ThemeProvider } from '../../context/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider initial="light">{component}</ThemeProvider>);
};

describe('ComponentName 组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染', () => {
      renderWithTheme(<ComponentName>测试内容</ComponentName>);
      expect(screen.getByText('测试内容')).toBeInTheDocument();
    });

    it('应该接受自定义 className', () => {
      renderWithTheme(<ComponentName className="custom-class">测试</ComponentName>);
      const element = screen.getByText('测试');
      expect(element).toHaveClass('custom-class');
    });

    it('应该接受自定义样式', () => {
      renderWithTheme(<ComponentName style={{ color: 'red' }}>测试</ComponentName>);
      const element = screen.getByText('测试');
      expect(element).toHaveStyle({ color: 'red' });
    });
  });

  describe('交互测试', () => {
    it('应该响应点击事件', () => {
      const handleClick = jest.fn();
      renderWithTheme(<ComponentName onClick={handleClick}>测试</ComponentName>);
      fireEvent.click(screen.getByText('测试'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('应该响应键盘事件', () => {
      const handleKeyDown = jest.fn();
      renderWithTheme(<ComponentName onKeyDown={handleKeyDown}>测试</ComponentName>);
      fireEvent.keyDown(screen.getByText('测试'), { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('边缘情况', () => {
    it('应该处理空内容', () => {
      const { container } = renderWithTheme(<ComponentName>{null}</ComponentName>);
      expect(container).toBeInTheDocument();
    });

    it('应该处理长内容', () => {
      const longContent = 'A'.repeat(1000);
      renderWithTheme(<ComponentName>{longContent}</ComponentName>);
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('应该处理特殊字符', () => {
      const specialChars = '<>&"\'';
      renderWithTheme(<ComponentName>{specialChars}</ComponentName>);
      expect(screen.getByText(specialChars)).toBeInTheDocument();
    });
  });
});
```

#### Hook测试模板

```typescript
// src/hooks/useHookName.test.ts
import { renderHook, act } from '@testing-library/react';
import { useHookName } from './useHookName';

describe('useHookName', () => {
  it('应该返回初始值', () => {
    const { result } = renderHook(() => useHookName());
    expect(result.current).toBe('initial value');
  });

  it('应该正确更新值', () => {
    const { result } = renderHook(() => useHookName());

    act(() => {
      result.current.update('new value');
    });

    expect(result.current.value).toBe('new value');
  });

  it('应该正确处理异步操作', async () => {
    const { result } = renderHook(() => useHookName());

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.data).toBeDefined();
  });
});
```

#### 工具函数测试模板

```typescript
// src/utils/functionName.test.ts
import { functionName } from './functionName';

describe('functionName', () => {
  it('应该正确处理有效输入', () => {
    const result = functionName('valid input');
    expect(result).toBe('expected output');
  });

  it('应该正确处理无效输入', () => {
    const result = functionName('invalid input');
    expect(result).toBe('expected fallback');
  });

  it('应该处理边界情况', () => {
    expect(functionName('')).toBe('expected output for empty');
    expect(functionName(null)).toBe('expected output for null');
    expect(functionName(undefined)).toBe('expected output for undefined');
  });

  it('应该处理各种数据类型', () => {
    expect(functionName('string')).toBe('expected for string');
    expect(functionName(123)).toBe('expected for number');
    expect(functionName(true)).toBe('expected for boolean');
    expect(functionName({})).toBe('expected for object');
    expect(functionName([])).toBe('expected for array');
  });
});
```

---

**文档维护**: YYC³ Quality Team
**最后更新**: 2026-03-03
**版本**: 1.0.0
**下次更新**: 实施进展更新
