---
@file: CONTRIBUTING.md
@description: YYC³ Design System 贡献指南
@author: YanYuCloudCube Team
@version: 2.0.0
@created: 2026-03-01
@updated: 2026-03-01
@status: active
@tags: contributing, guidelines, community
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# YYC³ Design System 贡献指南

感谢您对 YYC³ Design System 的关注！我们欢迎所有形式的贡献。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [测试要求](#测试要求)
- [文档要求](#文档要求)

## 行为准则

- 尊重所有贡献者
- 建设性地讨论问题
- 专注于对项目最有利的事情
- 保持友善和包容

## 如何贡献

### 报告 Bug

在提交 Bug 报告前，请确保：

1. 搜索现有的 [Issues](https://github.com/YYC-Cube/YYC3-Design-System/issues)，确认问题未被报告
2. 使用 Bug 报告模板提供详细信息
3. 包含复现步骤、预期行为和实际行为
4. 提供环境信息（操作系统、浏览器版本等）

### 提出新功能

1. 先在 [Discussions](https://github.com/YYC-Cube/YYC3-Design-System/discussions) 讨论想法
2. 提供详细的功能描述和使用场景
3. 说明为什么这个功能对项目有价值
4. 考虑是否愿意自己实现这个功能

### 提交代码

1. Fork 仓库并创建特性分支
2. 按照代码规范编写代码
3. 添加测试并确保通过
4. 更新相关文档
5. 提交 Pull Request

### 改进文档

1. 识别需要改进的文档部分
2. 提出改进建议或在 Discussions 讨论
3. Fork 仓库并创建文档分支
4. 更新文档并提交 Pull Request

## 开发环境设置

### 前置要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 pnpm >= 7.0.0
- Git

### 克隆仓库

```bash
git clone https://github.com/YYC-Cube/YYC3-Design-System.git
cd YYC3-Design-System
```

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
```

### 运行测试

```bash
npm test
```

### 构建项目

```bash
npm run build
```

## 代码规范

### TypeScript 规范

- 使用 TypeScript 进行类型定义
- 避免使用 `any` 类型
- 为函数添加返回类型
- 使用接口定义对象类型
- 为复杂类型添加注释

### React 规范

- 使用函数组件和 Hooks
- 组件使用 PascalCase 命名
- 文件名与组件名一致
- 使用 `useCallback` 和 `useMemo` 优化性能
- 为 Props 定义接口

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [disabled, onClick]);

  return (
    <button onClick={handleClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

### 样式规范

- 使用 Tailwind CSS 进行样式
- 避免内联样式
- 使用语义化的类名
- 遵循 BEM 命名约定（必要时）

### 命名规范

- **文件名**：kebab-case (如: `user-service.ts`)
- **组件名**：PascalCase (如: `UserService`)
- **函数/变量**：camelCase (如: `getUserById`)
- **常量**：UPPER_SNAKE_CASE (如: `MAX_RETRY_COUNT`)
- **类型/接口**：PascalCase (如: `User`)

## 提交规范

### 提交消息格式

遵循 [Conventional Commits](https://conventionalcommits.org/) 规范：

```
<类型>[可选 范围]: <描述>

[可选 主体]

[可选 页脚]
```

### 提交类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变动
- `ci`: CI/CD 相关
- `build`: 构建系统变动

### 提交示例

```bash
feat(theme): 添加暗色主题支持

实现暗色主题功能，包括：
- 添加暗色主题令牌
- 实现主题切换组件
- 更新所有组件以支持暗色主题

Closes #123
```

### 提交前检查

提交代码前请运行：

```bash
npm run typecheck  # 类型检查
npm run lint       # 代码检查
npm test           # 运行测试
```

## Pull Request 流程

### PR 标题格式

使用与提交消息相同的格式：

```
<类型>[可选 范围]: <描述>
```

### PR 描述模板

```markdown
## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 重大变更
- [ ] 文档更新

## 变更描述
简要描述此 PR 的变更内容

## 相关 Issue
Closes #(issue number)

## 测试
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] E2E 测试通过
- [ ] 手动测试完成

## 截图（如适用）
添加变更前后的截图

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 提交消息符合规范
```

### PR 审查流程

1. 所有 PR 需要通过 CI 检查
2. 至少一位维护者审查批准
3. 解决所有审查意见
4. 合并到目标分支

### 合并策略

- `main` 分支：使用 Squash and Merge
- `develop` 分支：使用 Merge Commit

## 测试要求

### 单元测试

- 为新功能添加单元测试
- 测试覆盖率不低于 80%
- 使用 Jest 和 React Testing Library

```typescript
describe('Button', () => {
  it('应该渲染标签文本', () => {
    render(<Button label="Click me" onClick={vi.fn()} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('应该在点击时调用 onClick', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 集成测试

- 测试组件间的交互
- 测试与外部服务的集成
- 测试用户流程

### E2E 测试

- 使用 Playwright 编写 E2E 测试
- 测试关键用户路径
- 测试跨浏览器兼容性

### 测试命令

```bash
npm run test:unit          # 单元测试
npm run test:integration   # 集成测试
npm run test:e2e          # E2E 测试
npm run test:coverage     # 覆盖率测试
```

## 文档要求

### 代码注释

- 为复杂逻辑添加注释
- 解释为什么这样做，而不是做了什么
- 保持注释简洁明了

### 组件文档

- 添加 JSDoc 注释
- 描述 Props 和返回值
- 提供使用示例

```typescript
/**
 * 按钮组件
 * @description 可点击的按钮组件，支持禁用状态
 * @param label - 按钮标签文本
 * @param onClick - 点击回调函数
 * @param disabled - 是否禁用按钮
 * @returns JSX 元素
 */
export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  // ...
};
```

### README 更新

- 新功能需要更新 README
- 添加使用示例
- 更新变更日志

### Storybook

- 为新组件添加 Story
- 包含不同状态的示例
- 添加文档说明

## 发布流程

### 版本号

遵循语义化版本：
- `MAJOR.MINOR.PATCH`
- 重大变更：增加 MAJOR
- 新功能：增加 MINOR
- Bug 修复：增加 PATCH

### 发布步骤

1. 更新版本号
2. 更新 CHANGELOG.md
3. 创建 Git 标签
4. 发布到 npm
5. 创建 GitHub Release

## 社区

### 获取帮助

- 查看 [文档](docs/)
- 在 [Issues](https://github.com/YYC-Cube/YYC3-Design-System/issues) 提问
- 在 [Discussions](https://github.com/YYC-Cube/YYC3-Design-System/discussions) 讨论

### 联系方式

- Email: [admin@0379.email](mailto:admin@0379.email)
- GitHub: [@YYC-Cube](https://github.com/YYC-Cube)

---

再次感谢您的贡献！🎉

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
