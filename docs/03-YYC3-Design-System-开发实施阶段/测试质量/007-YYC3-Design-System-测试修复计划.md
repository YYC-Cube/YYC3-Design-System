---
@file: YYC³ Design System 测试修复计划
@description: 测试失败分析和修复计划
@author: YanYuCloudCube Team
@version: 1.0.0
@created: 2026-02-28
@updated: 2026-02-28
@status: Active
@tags: testing, quality, bug-fix
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# YYC³ Design System 测试修复计划

## 测试状态概览

- **总测试数**: 456
- **通过测试**: 433
- **失败测试**: 23
- **通过率**: 94.96%
- **目标通过率**: 100%

## 失败测试分类

### 1. 超时测试失败（4个）

#### 1.1 图片预加载测试
**文件**: `src/resource-optimization/__tests__/index.test.ts`
**测试用例**: "应该预加载单张图片"
**失败原因**: 测试超时（5秒）
**根本原因**: Mock 的 Image 对象没有正确触发 `onload` 事件

**修复方案**:
```typescript
it('应该预加载单张图片', async () => {
  const mockSrc = 'https://example.com/image.jpg';
  let resolveLoad: (value: void) => void;
  
  const mockImage = {
    onload: null as ((this: GlobalEventHandlers, ev: Event) => any) | null,
    onerror: null as ((this: GlobalEventHandlers, ev: Event) => any) | null,
    src: '',
  };

  const loadPromise = new Promise<void>((resolve) => {
    resolveLoad = resolve;
  });

  jest.spyOn(window, 'Image').mockImplementation(() => {
    // 模拟图片加载
    setTimeout(() => {
      if (mockImage.onload) {
        mockImage.onload.call(mockImage, new Event('load'));
      }
      resolveLoad();
    }, 100);
    
    return mockImage as unknown as HTMLImageElement;
  });

  await preloadLazyImage(mockSrc);

  expect(mockImage.onload).toBeDefined();
  
  // 等待加载完成
  await loadPromise;
});
```

#### 1.2 性能基准测试 - 图片加载
**文件**: `src/resource-optimization/__tests__/index.test.ts`
**测试用例**: "应该测量图片加载性能"
**失败原因**: 测试超时（5秒）
**根本原因**: 同上，Mock Image 对象没有触发加载事件

**修复方案**: 使用 Jest 的 fake timers 来控制时间

```typescript
it('应该测量图片加载性能', async () => {
  jest.useFakeTimers();

  const mockSrc = 'https://example.com/image.jpg';
  const mockImage = {
    onload: null,
    onerror: null,
  };

  jest.spyOn(window, 'Image').mockImplementation(() => {
    // 模拟快速加载（100ms）
    setTimeout(() => {
      if (mockImage.onload) {
        mockImage.onload(new Event('load'));
      }
    }, 100);
    
    return mockImage as unknown as HTMLImageElement;
  });

  const start = performance.now();

  await preloadLazyImage(mockSrc);

  // 等待异步操作完成
  jest.runAllTimers();
  await new Promise(resolve => setImmediate(resolve));

  const end = performance.now();
  const loadTime = end - start;

  expect(loadTime).toBeLessThan(1000);
  
  jest.useRealTimers();
}, 10000); // 增加超时时间到 10 秒
```

#### 1.3 性能基准测试 - 字体加载
**文件**: `src/resource-optimization/__tests__/index.test.ts`
**测试用例**: "应该测量字体加载性能"
**失败原因**: 加载时间超过预期（3003ms > 1000ms）
**根本原因**: 字体预加载是真实网络请求，时间不可控

**修复方案**: 调整测试预期或 Mock 字体加载

```typescript
it('应该测量字体加载性能', async () => {
  jest.spyOn(document.head, 'appendChild').mockImplementation((node) => {
    // 模拟字体快速加载
    setTimeout(() => {
      const event = new Event('load');
      (node as HTMLElement).dispatchEvent(event);
    }, 100);
    return node;
  });

  const mockFont = {
    fontFamily: 'Test Font',
    fontSrc: 'https://example.com/font.woff2',
  };

  const start = performance.now();

  await preloadFont(mockFont.fontFamily, mockFont.fontSrc);

  // 等待模拟加载完成
  await new Promise(resolve => setTimeout(resolve, 200));

  const end = performance.now();
  const loadTime = end - start;

  expect(loadTime).toBeLessThan(500); // 调整预期到 500ms
});
```

#### 1.4 性能基准测试 - 资源预加载
**文件**: `src/resource-optimization/__tests__/index.test.ts`
**测试用例**: "应该测量资源预加载性能"
**失败原因**: 同字体加载，真实网络请求不可控

**修复方案**: Mock DOM 操作

```typescript
it('应该测量资源预加载性能', async () => {
  jest.spyOn(document.head, 'appendChild').mockImplementation((node) => {
    // 模拟资源快速加载
    setTimeout(() => {
      const event = new Event('load');
      (node as HTMLElement).dispatchEvent(event);
    }, 100);
    return node;
  });

  const mockUrl = 'https://example.com/script.js';

  const start = performance.now();

  preloadResource(mockUrl, 'script');

  // 等待模拟加载完成
  await new Promise(resolve => setTimeout(resolve, 200));

  const end = performance.now();
  const loadTime = end - start;

  expect(loadTime).toBeLessThan(500); // 调整预期到 500ms
});
```

### 2. 资源预加载测试失败（2个）

#### 2.1 资源清空测试
**文件**: `src/resource-optimization/__tests__/index.test.ts`
**测试用例**: "应该清空所有资源缓存"
**失败原因**: 预期 count > 0，实际 count = 0
**根本原因**: `preloadResource` 可能是同步操作，没有立即更新统计

**修复方案**: 添加等待时间或检查实现

```typescript
it('应该清空所有资源缓存', async () => {
  const mockUrl = 'https://example.com/script.js';

  preloadResource(mockUrl, 'script');
  
  // 等待资源添加到缓存
  await new Promise(resolve => setTimeout(resolve, 100));
  
  expect(getResourcePreloaderStats().count).toBeGreaterThan(0);

  clearAllResources();

  expect(getResourcePreloaderStats().count).toBe(0);
});
```

#### 2.2 预加载提示生成测试
**文件**: `src/resource-optimization/__tests__/index.test.ts`
**测试用例**: "应该生成预加载提示"
**失败原因**: 预期 hints.length > 0，实际 hints.length = 0
**根本原因**: 同上，统计更新延迟

**修复方案**: 添加等待时间

```typescript
it('应该生成预加载提示', async () => {
  const mockUrl = 'https://example.com/script.js';

  preloadResource(mockUrl, 'script');
  
  // 等待资源添加到缓存
  await new Promise(resolve => setTimeout(resolve, 100));

  const hints = generatePreloadHints();
  expect(hints.length).toBeGreaterThan(0);
});
```

### 3. 其他测试失败（17个）

需要进一步分析其他失败测试的具体原因。

## 修复优先级

### P0 - 立即修复（高优先级）
1. ✅ 修复超时测试（4个）
   - 图片预加载测试
   - 性能基准测试（3个）
   
2. ✅ 修复资源预加载测试（2个）
   - 资源清空测试
   - 预加载提示生成测试

### P1 - 本周修复（中优先级）
1. 分析并修复其他 17 个失败测试
2. 优化测试超时设置
3. 添加更好的 Mock 策略

### P2 - 下周优化（低优先级）
1. 提高测试稳定性
2. 减少测试执行时间
3. 添加测试覆盖率报告

## 实施计划

### 阶段 1：P0 修复（1-2天）
- [ ] 修复图片预加载超时测试
- [ ] 修复性能基准测试（3个）
- [ ] 修复资源预加载测试（2个）
- [ ] 验证所有 P0 测试通过

### 阶段 2：P1 修复（3-5天）
- [ ] 分析其他 17 个失败测试
- [ ] 逐个修复失败测试
- [ ] 优化测试超时和 Mock 策略
- [ ] 验证所有测试通过

### 阶段 3：质量提升（1-2天）
- [ ] 优化测试执行时间
- [ ] 提高测试稳定性
- [ ] 添加集成测试
- [ ] 更新测试文档

## 测试质量目标

### 当前状态
- 通过率: 94.96%
- 执行时间: 29.424s
- 覆盖率目标: 80%

### 目标状态
- 通过率: 100%
- 执行时间: < 20s
- 覆盖率: > 85%

## 最佳实践建议

### 1. Mock 策略
- 使用 Jest 的 fake timers 控制异步操作
- Mock DOM 操作（appendChild, removeChild）
- 模拟事件触发（load, error）

### 2. 超时设置
- 为异步测试设置合理的超时时间
- 使用 Jest 的 done 回调或 async/await
- 避免依赖真实网络请求

### 3. 测试隔离
- 每个测试前清理状态
- 使用 beforeEach 和 afterEach
- 避免测试间的状态污染

## 相关资源

- [Jest 官方文档](https://jestjs.io/)
- [Testing Library 文档](https://testing-library.com/)
- [React Testing 库](https://react-testing-library.com/)
- [Jest Mock API](https://jestjs.io/docs/mock-functions)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
