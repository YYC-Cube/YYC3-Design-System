/**
 * @file 开发指南
 * @description YYC³ 设计系统开发指南，包括代码规范、组件开发流程、测试要求和发布流程
 * @module docs/development-guide
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 * @updated 2026-02-18
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

# YYC³ Design System - 开发指南

## 概述

本文档提供 YYC³ Design System 的开发指南，包括代码规范、组件开发流程、测试要求和发布流程。

## 代码规范

### TypeScript 规范

- 所有新组件必须使用 TypeScript
- 使用明确的类型定义，避免使用 `any`
- 为组件 Props 定义接口
- 为设计令牌定义类型

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  // 组件实现
};
```

### 组件命名规范

- 组件文件使用 PascalCase：`Button.tsx`
- 组件导出使用 PascalCase：`export const Button`
- 默认导出使用组件名：`export default Button`

### 令牌访问规范

- 使用扁平化键名访问设计令牌
- 使用方括号表示法访问动态键名
- 提供默认值作为回退

```typescript
const { tokens } = useTheme();
const colorHex = tokens[`color.${variant}`] || tokens['color.primary'];
```

### 样式规范

- 优先使用设计令牌而非硬编码值
- 使用内联样式或 CSS-in-JS
- 保持样式简洁和可维护

```typescript
const buttonStyle: React.CSSProperties = {
  background: tokens['color.primary'],
  borderRadius: tokens['radius.default'],
  padding: '0.5rem 1rem',
};
```

## 组件开发流程

### 1. 创建组件文件

```bash
# 在 src/components/ 目录下创建新组件
touch src/components/MyComponent.tsx
```

### 2. 定义组件 Props

```typescript
interface MyComponentProps {
  children: React.ReactNode;
  // 其他属性
}
```

### 3. 实现组件

```typescript
export const MyComponent: React.FC<MyComponentProps> = ({ children }) => {
  const { tokens } = useTheme();
  
  return (
    <div style={{ /* 使用设计令牌 */ }}>
      {children}
    </div>
  );
};

export default MyComponent;
```

### 4. 创建测试文件

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(
      <ThemeProvider>
        <MyComponent>Test</MyComponent>
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### 5. 运行测试

```bash
npm test
```

### 6. 更新文档

在 README.md 中添加组件文档和使用示例。

## 测试要求

### 测试覆盖率

- 核心组件测试覆盖率 >= 80%
- 工具函数测试覆盖率 >= 90%
- 关键业务逻辑测试覆盖率 = 100%

### 测试类型

- **单元测试**：测试单个组件或函数
- **集成测试**：测试组件间的交互
- **快照测试**：确保 UI 渲染一致性

### 测试最佳实践

- 使用 `renderWithTheme` 辅助函数包装组件
- 使用 `data-testid` 属性定位元素
- 测试用户交互和状态变化
- 测试边界情况和错误处理

```typescript
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

it('handles user interaction', () => {
  const handleClick = jest.fn();
  renderWithTheme(<Button onClick={handleClick}>Click</Button>);
  
  fireEvent.click(screen.getByText('Click'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 设计令牌使用

### 访问设计令牌

```typescript
const { tokens, setTokens } = useTheme();
```

### 可用令牌类别

- **颜色**: `color.primary`, `color.background`, `color.card`, 等
- **圆角**: `radius.default`, `radius.sm`, `radius.md`, `radius.lg`
- **阴影**: `shadow.card`, `shadow.popover`, `shadow.focus`
- **排版**: `typography.font-sans`, `typography.font-serif`, `typography.font-mono`
- **字体大小**: `font-size.heading-1`, `font-size.body`, `font-size.caption`
- **行高**: `line-height.heading`, `line-height.body`

### 更新设计令牌

```typescript
const handleUpdate = () => {
  setTokens({
    'color.primary': '#ff0000',
  });
};
```

## Git 工作流

### 分支命名

- `feature/功能名称` - 新功能开发
- `bugfix/问题描述` - Bug 修复
- `hotfix/紧急问题描述` - 紧急修复
- `refactor/重构描述` - 代码重构

### 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<类型>[可选 范围]: <描述>

[可选 主体]

[可选 页脚]
```

### 提交类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建或辅助工具变动

### 提交示例

```
feat(button): 添加按钮禁用状态

实现按钮的禁用状态，包括样式和交互逻辑。

- 添加 disabled 属性
- 实现禁用样式
- 添加禁用状态测试

Closes #123
```

## 代码审查清单

### 功能性

- [ ] 组件功能符合需求
- [ ] 所有 Props 都有类型定义
- [ ] 边界情况得到处理
- [ ] 错误处理完善

### 代码质量

- [ ] 代码遵循项目规范
- [ ] 没有硬编码的样式值
- [ ] 使用设计令牌而非魔法数字
- [ ] 代码可读性和可维护性良好

### 测试

- [ ] 有足够的测试覆盖
- [ ] 测试通过
- [ ] 测试覆盖边界情况
- [ ] 快照测试已更新

### 文档

- [ ] README 已更新
- [ ] 组件有使用示例
- [ ] Props 有类型注释
- [ ] CHANGELOG 已更新

## 发布流程

### 1. 更新版本号

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 2. 更新 CHANGELOG

在 CHANGELOG.md 中添加新版本的变更记录。

### 3. 构建项目

```bash
npm run build
```

### 4. 运行测试

```bash
npm test
```

### 5. 提交变更

```bash
git add .
git commit -m "chore: release version X.X.X"
git tag vX.X.X
git push origin main --tags
```

### 6. 发布到 NPM

```bash
npm publish
```

## 性能优化

### 组件优化

- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存事件处理函数

```typescript
export const MyComponent: React.FC<MyComponentProps> = React.memo(({ value }) => {
  const memoizedValue = useMemo(() => {
    return expensiveCalculation(value);
  }, [value]);

  return <div>{memoizedValue}</div>;
});
```

### 令牌优化

- 避免在渲染循环中重复访问令牌
- 缓存常用的令牌值

```typescript
const { tokens } = useTheme();
const primaryColor = tokens['color.primary'];
```

## 可访问性

### 基本要求

- 所有交互元素键盘可达
- 表单元素有正确的标签
- 颜色对比度符合 WCAG 标准
- 使用语义化 HTML

### 实施示例

```typescript
<button
  aria-label="关闭对话框"
  onClick={handleClose}
>
  ×
</button>

<input
  id="username"
  aria-label="用户名"
  aria-required="true"
  required
/>
```

## 故障排除

### 常见问题

**TypeScript 编译错误**

```bash
# 清理构建缓存
rm -rf node_modules/.cache
npm run build
```

**测试失败**

```bash
# 更新快照
npm test -- -u

# 运行特定测试
npm test -- Button.test.tsx
```

**令牌未生效**

- 检查组件是否在 ThemeProvider 内部
- 验证令牌键名是否正确
- 确认设计令牌已构建

## 资源

- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Jest 文档](https://jestjs.io/docs/getting-started)
- [Testing Library 文档](https://testing-library.com/docs/react-testing-library/intro/)
- [Style Dictionary 文档](https://amzn.github.io/style-dictionary/)

## 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [提交问题](https://github.com/yyc3/yyc3-design-system/issues)
- Email: [admin@0379.email](mailto:admin@0379.email)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

*文档最后更新：2026-02-18*

</div>
