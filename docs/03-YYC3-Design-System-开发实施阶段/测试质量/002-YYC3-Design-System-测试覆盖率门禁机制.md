# 测试覆盖率门禁机制

## 概述

YYC³ Design System 已实施测试覆盖率门禁机制，确保代码质量维持在可接受的水平。

## 配置

测试覆盖率门禁机制在 [jest.config.cjs](../jest.config.cjs) 中配置：

```javascript
coverageThreshold: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
  './src/components/': {
    branches: 60,
    functions: 60,
    lines: 60,
    statements: 60,
  },
  './src/utils/': {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

## 阈值说明

### 全局阈值

- **分支覆盖率**: 50%
- **函数覆盖率**: 50%
- **行覆盖率**: 50%
- **语句覆盖率**: 50%

### 组件目录阈值 (./src/components/)

- **分支覆盖率**: 60%
- **函数覆盖率**: 60%
- **行覆盖率**: 60%
- **语句覆盖率**: 60%

### 工具目录阈值 (./src/utils/)

- **分支覆盖率**: 80%
- **函数覆盖率**: 80%
- **行覆盖率**: 80%
- **语句覆盖率**: 80%

## 使用方法

### 运行测试并检查覆盖率

```bash
npm run test:coverage
```

### 检查是否达标

测试完成后，Jest 会自动检查覆盖率是否达到设定的阈值。如果未达标，会显示类似以下的警告：

```
Jest: "global" coverage threshold for statements (50%) not met: 16.78%
Jest: "global" coverage threshold for branches (50%) not met: 18.5%
Jest: "./src/components/" coverage threshold for statements (60%) not met: 52.87%
```

### CI/CD 集成

在 CI/CD 流程中，如果覆盖率未达标，测试将返回非零退出码，阻止代码合并：

```yaml
- name: Run tests with coverage
  run: npm run test:coverage

- name: Check coverage threshold
  run: |
    if [ $? -ne 0 ]; then
      echo "测试覆盖率未达标，请提升覆盖率后再提交代码"
      exit 1
    fi
```

## 当前覆盖率状态

### 核心组件覆盖率

| 组件 | 语句覆盖率 | 分支覆盖率 | 行覆盖率 | 函数覆盖率 |
|--------|-----------|-----------|---------|-----------|
| Button | 100% | 72.72% | 100% | 100% |
| Alert | 100% | 81.25% | 100% | 100% |
| Badge | 100% | 70% | 100% | 100% |
| Avatar | 100% | 92.3% | 100% | 100% |
| Card | 100% | 58.33% | 100% | 100% |
| Checkbox | 94.73% | 78.37% | 100% | 94.44% |
| Input | 100% | N/A | 100% | 100% |

### 工具模块覆盖率

| 模块 | 语句覆盖率 | 分支覆盖率 | 行覆盖率 | 函数覆盖率 |
|--------|-----------|-----------|---------|-----------|
| animations.ts | 100% | 85.71% | 100% | 100% |
| performance.ts | 100% | 83.33% | 100% | 100% |
| logger.ts | 20% | 0% | 0% | 20% |

## 改进建议

### 短期目标

1. **提升 Card 组件分支覆盖率**：从 58.33% 提升至 75%+
2. **提升 Checkbox 组件分支覆盖率**：从 78.37% 提升至 85%+
3. **修复 logger.ts 测试**：提升分支覆盖率至 80%+

### 中期目标

1. **全局覆盖率达标**：将全局覆盖率提升至 50%+
2. **组件目录达标**：将 src/components/ 覆盖率提升至 60%+
3. **工具目录达标**：将 src/utils/ 覆盖率提升至 80%+

### 长期目标

1. **提高全局阈值**：将全局阈值提升至 70%+
2. **提高组件阈值**：将组件目录阈值提升至 80%+
3. **提高工具阈值**：将工具目录阈值提升至 90%+

## 最佳实践

### 1. 编写测试时考虑覆盖率

- 为每个新功能编写单元测试
- 确保测试覆盖所有代码分支
- 测试边缘情况和错误处理

### 2. 定期检查覆盖率

```bash
# 查看覆盖率报告
open coverage/lcov-report/index.html

# 查看特定组件的覆盖率
npm run test:coverage -- --testPathPattern="ComponentName"
```

### 3. 持续改进

- 每次代码审查时检查覆盖率变化
- 定期重构代码以提高可测试性
- 优先提升低覆盖率组件的测试

### 4. 使用覆盖率报告

- 关注未覆盖的代码行
- 分析未覆盖的原因（不可达、未测试等）
- 为未覆盖的关键路径添加测试

## 相关文档

- [测试覆盖率报告](./测试覆盖率报告.md)
- [Jest 配置](../jest.config.cjs)
- [CI/CD 配置](../.github/workflows/ci-cd.yml)

## 更新日志

- 2026-02-19: 初始实施测试覆盖率门禁机制
- 2026-02-19: 添加核心组件覆盖率提升任务
- 2026-02-19: 配置差异化阈值（全局、组件、工具）
