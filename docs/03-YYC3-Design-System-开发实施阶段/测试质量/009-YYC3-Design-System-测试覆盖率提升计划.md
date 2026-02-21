/**

* @file 测试覆盖率提升计划
* @description YYC³ 设计系统测试覆盖率提升计划，目标达到 90% 标准
* @module docs/test-coverage-improvement-plan
* @author YYC³
* @version 1.0.0
* @created 2026-02-18
* @updated 2026-02-18
* @copyright Copyright (c) 2026 YYC³
* @license MIT
 */

# YYC³ 设计系统测试覆盖率提升计划

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

**创建日期**：2026-02-18
**作者**：YYC³ Team
**版本**：1.0.0
**更新日期**：2026-02-18

---

## 概述

本计划基于 YYC³ 团队「五高五标五化」核心要求，为设计系统测试覆盖率提升提供详细的实施方案，目标达到 90% 测试覆盖率标准。

## 当前状态

### 测试覆盖率现状

| 指标 | 当前值 | 目标值 | 差距 | 状态 |
|--------|--------|--------|------|------|
| 整体测试覆盖率 | 60% | 90% | -30% | ⚠️ 待提升 |
| 单元测试通过率 | 100% (72/72) | 100% | 0% | ✅ 达标 |
| TypeScript 类型检查 | 0 错误 | 0 错误 | 0 | ✅ 达标 |
| ESLint 警告 | 1 个 | 0 个 | -1 | ⚠️ 待修复 |

### 未测试文件

| 文件路径 | 当前覆盖率 | 目标覆盖率 | 优先级 |
|---------|----------|----------|--------|
| src/components/TokenPlayground.tsx | 0% | 90% | 🔴 高 |
| src/utils/performance.ts | 0% | 90% | 🔴 高 |

### ESLint 警告

| 文件路径 | 行号 | 警告内容 | 优先级 |
|---------|------|----------|--------|
| src/utils/performance.ts | 87 | React Hook useEffect has a spread element in its dependency array | 🔴 高 |

## 目标

### 主要目标

* 🎯 **整体测试覆盖率**: 60% → 90% (+30%)
* 🎯 **TokenPlayground.tsx 覆盖率**: 0% → 90% (+90%)
* 🎯 **performance.ts 覆盖率**: 0% → 90% (+90%)
* 🎯 **ESLint 警告**: 1 个 → 0 个 (-1)

### 次要目标

* 📊 **单元测试数量**: 72 个 → 100+ 个 (+28 个)
* 📈 **集成测试覆盖率**: 40% → 80% (+40%)
* 🔒 **E2E 测试覆盖率**: 20% → 60% (+40%)

## 实施计划

### 阶段一：修复 ESLint 警告（1-2 天）

#### 任务 1.1: 修复 useUpdateEffect 依赖数组警告

**文件**: `src/utils/performance.ts`

**问题描述**:

```typescript
// 当前代码（第 87 行）
useEffect(() => {
  // ...
}, [...dependencies]); // ❌ 展开操作导致无法静态验证
```

**解决方案**:

```typescript
// 修复后的代码
const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const isMounted = useRef(false);
  const prevDeps = useRef(deps);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (prevDeps.current !== deps) {
      effect();
    }
    prevDeps.current = deps;
  }, [deps]); // ✅ 移除展开操作
};
```

**预期效果**:

* ✅ 消除 ESLint 警告
* ✅ 提高代码质量
* ✅ 符合 React Hooks 最佳实践

**验收标准**:

* ✅ `npm run lint` 无警告
* ✅ 代码逻辑保持不变
* ✅ 功能测试通过

### 阶段二：为 TokenPlayground.tsx 添加单元测试（3-5 天）

#### 任务 2.1: 分析 TokenPlayground.tsx 组件

**文件**: `src/components/TokenPlayground.tsx`

**组件功能**:

* 令牌分类展示
* 令牌值实时预览
* 令牌编辑和更新
* 主题切换支持

**测试覆盖点**:

1. 组件渲染测试
2. 令牌分类功能测试
3. 令牌值显示测试
4. 令牌编辑功能测试
5. 主题切换测试
6. 边界情况测试

#### 任务 2.2: 编写单元测试

**文件**: `src/components/TokenPlayground.test.tsx`

```typescript
/**
 * @file TokenPlayground 组件测试
 * @description 测试 TokenPlayground 组件的各项功能
 * @module __tests__/components/TokenPlayground.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TokenPlayground } from '../TokenPlayground';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('TokenPlayground', () => {
  const mockTokens = {
    color: {
      primary: { value: '#d45a5f', oklch: 'oklch(0.6 0.15 15)' },
      secondary: { value: '#5fd4c9', oklch: 'oklch(0.7 0.1 180)' }
    },
    spacing: {
      xs: { value: '4px' },
      sm: { value: '8px' },
      md: { value: '16px' }
    },
    typography: {
      fontSize: {
        xs: { value: '12px' },
        sm: { value: '14px' },
        md: { value: '16px' }
      }
    }
  };

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('组件渲染', () => {
    it('应该成功渲染组件', () => {
      renderWithTheme(<TokenPlayground tokens={mockTokens} />);
      expect(screen.getByTestId('token-playground')).toBeInTheDocument();
    });

    it('应该显示令牌分类标签', () => {
      renderWithTheme(<TokenPlayground tokens={mockTokens} />);
      expect(screen.getByText('颜色')).toBeInTheDocument();
      expect(screen.getByText('间距')).toBeInTheDocument();
      expect(screen.getByText('排版')).toBeInTheDocument();
    });

    it('应该显示令牌列表', () => {
      renderWithTheme(<TokenPlayground tokens={mockTokens} />);
      expect(screen.getByText('primary')).toBeInTheDocument();
      expect(screen.getByText('secondary')).toBeInTheDocument();
    });
  });

  describe('令牌分类功能', () => {
    it('应该支持切换令牌分类', async () => {
      renderWithTheme(<TokenPlayground tokens={mockTokens} />);
      
      const spacingTab = screen.getByText('间距');
      fireEvent.click(spacingTab);
      
      await waitFor(() => {
        expect(screen.getByText('xs')).toBeInTheDocument();
        expect(screen.getByText('sm')).toBeInTheDocument();
        expect(screen.getByText('md')).toBeInTheDocument();
      });
    });

    it('应该高亮当前选中的分类', () => {
      renderWithTheme(<TokenPlayground tokens={mockTokens} />);
      
      const colorTab = screen.getByText('颜色');
      expect(colorTab).toHaveClass('active');
    });
  });

  describe('令牌值显示', () => {
    it('应该显示令牌的 HEX 值', () => {
      renderWithTheme(<TokenPlayground tokens={mockTokens} />);
      
      const primaryToken = screen.getByText('primary');
      fireEvent.click(primaryToken);
      
      expect(screen.getByDisplayValue('#d45a5f')).toBeInTheDocument();
    });

    it('应该显示令牌的 OKLCH 值', () => {
      renderWithTheme(<TokenPlayground tokens={mockTokens} />);
      
      const primaryToken = screen.getByText('primary');
      fireEvent.click(primaryToken);
      
      expect(screen.getByText('oklch(0.6 0.15 15)')).toBeInTheDocument();
    });
  });

  describe('令牌编辑功能', () => {
    it('应该支持编辑令牌值', async () => {
      const onTokenUpdate = vi.fn();
      renderWithTheme(
        <TokenPlayground 
          tokens={mockTokens} 
          onTokenUpdate={onTokenUpdate} 
        />
      );
      
      const primaryToken = screen.getByText('primary');
      fireEvent.click(primaryToken);
      
      const input = screen.getByDisplayValue('#d45a5f');
      fireEvent.change(input, { target: { value: '#ff0000' } });
      
      await waitFor(() => {
        expect(onTokenUpdate).toHaveBeenCalledWith('color.primary', '#ff0000');
      });
    });

    it('应该验证令牌值的格式', async () => {
      renderWithTheme(<TokenPlayground tokens={mockTokens} />);
      
      const primaryToken = screen.getByText('primary');
      fireEvent.click(primaryToken);
      
      const input = screen.getByDisplayValue('#d45a5f');
      fireEvent.change(input, { target: { value: 'invalid' } });
      
      await waitFor(() => {
        expect(screen.getByText('无效的颜色格式')).toBeInTheDocument();
      });
    });
  });

  describe('主题切换', () => {
    it('应该支持切换亮色/暗色主题', async () => {
      renderWithTheme(<TokenPlayground tokens={mockTokens} />);
      
      const themeToggle = screen.getByTestId('theme-toggle');
      fireEvent.click(themeToggle);
      
      await waitFor(() => {
        expect(screen.getByTestId('token-playground')).toHaveClass('dark-theme');
      });
    });

    it('应该在主题切换时更新令牌显示', async () => {
      renderWithTheme(<TokenPlayground tokens={mockTokens} />);
      
      const themeToggle = screen.getByTestId('theme-toggle');
      fireEvent.click(themeToggle);
      
      await waitFor(() => {
        const tokenValue = screen.getByDisplayValue('#d45a5f');
        expect(tokenValue).toHaveStyle({ backgroundColor: '#1a1a1a' });
      });
    });
  });

  describe('边界情况', () => {
    it('应该处理空令牌对象', () => {
      renderWithTheme(<TokenPlayground tokens={{}} />);
      expect(screen.getByText('暂无令牌')).toBeInTheDocument();
    });

    it('应该处理缺失的令牌分类', () => {
      const partialTokens = {
        color: mockTokens.color
      };
      renderWithTheme(<TokenPlayground tokens={partialTokens} />);
      expect(screen.getByText('颜色')).toBeInTheDocument();
      expect(screen.queryByText('间距')).not.toBeInTheDocument();
    });

    it('应该处理无效的令牌值', () => {
      const invalidTokens = {
        color: {
          primary: { value: null }
        }
      };
      renderWithTheme(<TokenPlayground tokens={invalidTokens} />);
      expect(screen.getByText('无效的令牌值')).toBeInTheDocument();
    });
  });
});
```

**预期效果**:

* ✅ TokenPlayground.tsx 覆盖率: 0% → 90%
* ✅ 单元测试数量: +30 个
* ✅ 整体测试覆盖率: +5%

**验收标准**:

* ✅ 所有测试通过
* ✅ 覆盖率 ≥ 90%
* ✅ 代码质量检查通过

### 阶段三：为 performance.ts 添加单元测试（3-5 天）

#### 任务 3.1: 分析 performance.ts 工具函数

**文件**: `src/utils/performance.ts`

**工具函数**:

* `measureFCP()`: 测量首次内容绘制
* `measureLCP()`: 测量最大内容绘制
* `measureFID()`: 测量首次输入延迟
* `measureCLS()`: 测量累积布局偏移
* `measureTTFB()`: 测量首次字节时间
* `useUpdateEffect()`: 自定义 Hook

**测试覆盖点**:

1. 性能指标测量函数测试
2. useUpdateEffect Hook 测试
3. 边界情况测试
4. 错误处理测试

#### 任务 3.2: 编写单元测试

**文件**: `src/utils/performance.test.ts`

```typescript
/**
 * @file performance 工具函数测试
 * @description 测试 performance 工具函数的各项功能
 * @module __tests__/utils/performance.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  measureFCP,
  measureLCP,
  measureFID,
  measureCLS,
  measureTTFB,
  useUpdateEffect
} from '../performance';

describe('performance 工具函数', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('measureFCP', () => {
    it('应该返回首次内容绘制时间', async () => {
      const mockPerformanceObserver = vi.fn();
      global.PerformanceObserver = mockPerformanceObserver as any;
      
      mockPerformanceObserver.mockImplementation((callback) => ({
        observe: vi.fn(),
        disconnect: vi.fn()
      }));

      const fcp = await measureFCP();
      expect(typeof fcp).toBe('number');
    });

    it('在不支持 PerformanceObserver 时返回 0', async () => {
      delete (global as any).PerformanceObserver;
      
      const fcp = await measureFCP();
      expect(fcp).toBe(0);
    });
  });

  describe('measureLCP', () => {
    it('应该返回最大内容绘制时间', async () => {
      const mockPerformanceObserver = vi.fn();
      global.PerformanceObserver = mockPerformanceObserver as any;
      
      mockPerformanceObserver.mockImplementation((callback) => ({
        observe: vi.fn(),
        disconnect: vi.fn()
      }));

      const lcp = await measureLCP();
      expect(typeof lcp).toBe('number');
    });

    it('在不支持 PerformanceObserver 时返回 0', async () => {
      delete (global as any).PerformanceObserver;
      
      const lcp = await measureLCP();
      expect(lcp).toBe(0);
    });
  });

  describe('measureFID', () => {
    it('应该返回首次输入延迟', async () => {
      const mockPerformanceObserver = vi.fn();
      global.PerformanceObserver = mockPerformanceObserver as any;
      
      mockPerformanceObserver.mockImplementation((callback) => ({
        observe: vi.fn(),
        disconnect: vi.fn()
      }));

      const fid = await measureFID();
      expect(typeof fid).toBe('number');
    });

    it('在不支持 PerformanceObserver 时返回 0', async () => {
      delete (global as any).PerformanceObserver;
      
      const fid = await measureFID();
      expect(fid).toBe(0);
    });
  });

  describe('measureCLS', () => {
    it('应该返回累积布局偏移值', async () => {
      const mockPerformanceObserver = vi.fn();
      global.PerformanceObserver = mockPerformanceObserver as any;
      
      mockPerformanceObserver.mockImplementation((callback) => ({
        observe: vi.fn(),
        disconnect: vi.fn()
      }));

      const cls = await measureCLS();
      expect(typeof cls).toBe('number');
    });

    it('在不支持 PerformanceObserver 时返回 0', async () => {
      delete (global as any).PerformanceObserver;
      
      const cls = await measureCLS();
      expect(cls).toBe(0);
    });
  });

  describe('measureTTFB', () => {
    it('应该返回首次字节时间', () => {
      const mockPerformance = {
        timing: {
          responseStart: 500,
          navigationStart: 0
        }
      };
      global.performance = mockPerformance as any;
      
      const ttfb = measureTTFB();
      expect(ttfb).toBe(500);
    });

    it('在不支持 performance.timing 时返回 0', () => {
      delete (global as any).performance;
      
      const ttfb = measureTTFB();
      expect(ttfb).toBe(0);
    });
  });

  describe('useUpdateEffect', () => {
    it('应该在组件挂载后执行 effect', () => {
      const effect = vi.fn();
      const { rerender } = renderHook(() => useUpdateEffect(effect));
      
      expect(effect).not.toHaveBeenCalled();
      rerender();
      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('应该在依赖变化时执行 effect', () => {
      const effect = vi.fn();
      const { rerender } = renderHook(() => useUpdateEffect(effect, [1]));
      
      rerender();
      expect(effect).toHaveBeenCalledTimes(1);
      
      rerender();
      expect(effect).toHaveBeenCalledTimes(1);
      
      rerender();
      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('应该在依赖数组变化时执行 effect', () => {
      const effect = vi.fn();
      const { rerender } = renderHook(({ deps }) => useUpdateEffect(effect, deps), {
        initialProps: { deps: [1] }
      });
      
      rerender({ deps: [2] });
      expect(effect).toHaveBeenCalledTimes(1);
      
      rerender({ deps: [2] });
      expect(effect).toHaveBeenCalledTimes(1);
      
      rerender({ deps: [3] });
      expect(effect).toHaveBeenCalledTimes(2);
    });

    it('应该处理 undefined 依赖', () => {
      const effect = vi.fn();
      renderHook(() => useUpdateEffect(effect));
      
      expect(effect).not.toHaveBeenCalled();
    });
  });
});
```

**预期效果**:

* ✅ performance.ts 覆盖率: 0% → 90%
* ✅ 单元测试数量: +25 个
* ✅ 整体测试覆盖率: +4%

**验收标准**:

* ✅ 所有测试通过
* ✅ 覆盖率 ≥ 90%
* ✅ 代码质量检查通过

### 阶段四：提升整体测试覆盖率至 90%（10-15 天）

#### 任务 4.1: 为其他未测试组件添加测试

**目标组件**:

* `src/components/AITokenGenerator.tsx`
* `src/components/AIColorRecommender.tsx`
* `src/components/AIConsistencyChecker.tsx`
* `src/components/AIUsageAnalyzer.tsx`
* `src/components/AIBestPractices.tsx`
* `src/components/RealtimeEditor.tsx`
* `src/components/ColorContrastChecker.tsx`

**测试策略**:

1. 组件渲染测试
2. 用户交互测试
3. 状态管理测试
4. 边界情况测试
5. 错误处理测试

**预期效果**:

* ✅ 每个组件覆盖率 ≥ 80%
* ✅ 单元测试数量: +50 个
* ✅ 整体测试覆盖率: +15%

#### 任务 4.2: 添加集成测试

**测试场景**:

1. 主题切换集成测试
2. 令牌更新集成测试
3. AI 功能集成测试
4. 实时协作集成测试

**预期效果**:

* ✅ 集成测试覆盖率: 40% → 80%
* ✅ 整体测试覆盖率: +6%

#### 任务 4.3: 添加 E2E 测试

**测试场景**:

1. 用户创建令牌流程
2. 用户切换主题流程
3. 用户使用 AI 功能流程
4. 用户协作编辑流程

**预期效果**:

* ✅ E2E 测试覆盖率: 20% → 60%
* ✅ 整体测试覆盖率: +5%

## 时间线

### 总体时间线

```
Week 1-2   ████████████░░░░░░░░░░░░░░░  阶段一：修复 ESLint 警告
Week 3-5   ░░░░░░░░░░███████████████░░░░  阶段二：TokenPlayground 测试
Week 6-8   ░░░░░░░░░░░░░░░░░░░██████  阶段三：performance.ts 测试
Week 9-15  ░░░░░░░░░░░░░░░░░░░░░░████  阶段四：整体覆盖率提升
```

### 详细时间表

| 阶段 | 任务 | 预计时间 | 开始日期 | 结束日期 |
|--------|------|----------|----------|
| 阶段一 | 修复 useUpdateEffect 警告 | 2026-02-18 | 2026-02-20 |
| 阶段二 | TokenPlayground 单元测试 | 2026-02-21 | 2026-02-25 |
| 阶段三 | performance.ts 单元测试 | 2026-02-26 | 2026-03-02 |
| 阶段四.1 | 其他组件单元测试 | 2026-03-03 | 2026-03-10 |
| 阶段四.2 | 集成测试 | 2026-03-11 | 2026-03-15 |
| 阶段四.3 | E2E 测试 | 2026-03-16 | 2026-03-22 |

## 资源需求

### 人力资源

| 角色 | 人数 | 工作量 | 职责 |
|------|------|--------|------|
| 前端工程师 | 2 | 100% | 编写单元测试和集成测试 |
| 测试工程师 | 1 | 100% | 编写 E2E 测试和测试策略 |
| 代码审查员 | 1 | 50% | 审查测试代码和质量 |

### 技术资源

**开发工具**:

* Vitest（单元测试框架）
* React Testing Library（组件测试）
* Playwright（E2E 测试）
* Istanbul（覆盖率统计）

**CI/CD 集成**:

* GitHub Actions（自动化测试）
* Codecov（覆盖率报告）
* Chromatic（视觉回归测试）

## 风险评估

### 技术风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| 测试编写复杂度高 | 中 | 中 | 提供测试模板和最佳实践 |
| Mock 数据准备困难 | 低 | 中 | 提供测试数据生成工具 |
| 测试执行时间长 | 中 | 低 | 优化测试并行执行 |
| 覆盖率统计不准确 | 低 | 中 | 使用多个覆盖率工具验证 |

### 进度风险

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| 需求变更频繁 | 中 | 高 | 敏捷开发，快速迭代 |
| 资源不足 | 低 | 高 | 分阶段交付，优先核心功能 |
| 技术难点卡壳 | 中 | 中 | 技术预研，专家支持 |

## 成功指标

### 阶段性指标

| 阶段 | 指标 | 目标值 | 当前值 | 状态 |
|--------|------|--------|--------|------|
| 阶段一 | ESLint 警告 | 0 个 | 1 个 | ⚠️ 待完成 |
| 阶段二 | TokenPlayground 覆盖率 | 90% | 0% | ⚠️ 待完成 |
| 阶段三 | performance.ts 覆盖率 | 90% | 0% | ⚠️ 待完成 |
| 阶段四 | 整体测试覆盖率 | 90% | 60% | ⚠️ 待完成 |

### 最终指标

| 指标 | 目标值 | 当前值 | 差距 |
|--------|--------|--------|------|
| 整体测试覆盖率 | 90% | 60% | -30% |
| 单元测试数量 | 100+ | 72 | -28 |
| 集成测试覆盖率 | 80% | 40% | -40% |
| E2E 测试覆盖率 | 60% | 20% | -40% |
| ESLint 警告 | 0 个 | 1 个 | -1 |

## 最佳实践

### 1. 测试编写原则

* **AAA 模式**: Arrange（准备）、Act（执行）、Assert（断言）
* **单一职责**: 每个测试只验证一个功能点
* **独立性**: 测试之间不相互依赖
* **可重复性**: 测试结果应该一致且可重复

### 2. 测试覆盖率策略

* **语句覆盖**: 确保每行代码至少被执行一次
* **分支覆盖**: 确保每个条件分支都被测试
* **路径覆盖**: 确保重要的代码路径都被覆盖
* **边界覆盖**: 测试边界条件和异常情况

### 3. 测试维护

* **定期更新**: 随着代码变更及时更新测试
* **清理无用测试**: 删除不再需要的测试
* **重构测试**: 保持测试代码的清晰和可维护
* **文档更新**: 保持测试文档的准确性

## 参考资源

* [Vitest 文档](https://vitest.dev/)
* [React Testing Library](https://testing-library.com/react)
* [Playwright 文档](https://playwright.dev/)
* [测试覆盖率最佳实践](https://jestjs.io/docs/tutorial-react#coverage)
* [YYC³ 标准规范](https://github.com/yyc3/standards)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

*文档最后更新：2026-02-18*

</div>
