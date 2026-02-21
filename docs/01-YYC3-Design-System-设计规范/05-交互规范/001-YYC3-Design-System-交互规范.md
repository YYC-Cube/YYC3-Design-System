/**
 * @file 交互规范
 * @description YYC³ 设计系统交互规范，确保用户体验一致性
 * @module docs/interaction-guidelines
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 * @updated 2026-02-18
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

# 交互规范

> YYC³ Design System - 交互规范
> 版本: 1.0.0
> 更新日期: 2026-02-18

---

## 目录

- [交互原则](#交互原则)
- [交互模式](#交互模式)
- [动画与过渡](#动画与过渡)
- [反馈机制](#反馈机制)
- [错误处理](#错误处理)
- [可访问性](#可访问性)
- [性能要求](#性能要求)

---

## 交互原则

### 1. 可预测性

用户应该能够预测交互的结果。

#### 实践指南

- 遵循平台约定
- 使用熟悉的交互模式
- 保持一致的交互行为
- 提供清晰的视觉提示

```tsx
// ✅ 好的设计 - 遵循平台约定
<Button variant="primary">提交</Button>

// ❌ 不好的设计 - 违反平台约定
<Button variant="primary" onContextMenu={handleSubmit}>
  右键提交
</Button>
```

### 2. 即时性

系统应该对用户的操作做出及时响应。

#### 实践指南

- 提供即时的视觉反馈
- 显示加载状态
- 优化响应时间
- 使用骨架屏占位

```tsx
// ✅ 好的设计 - 即时反馈
<Button
  disabled={isLoading}
  onClick={handleSubmit}
>
  {isLoading ? <Spinner /> : '提交'}
</Button>

// ❌ 不好的设计 - 无反馈
<Button onClick={handleSubmit}>提交</Button>
```

### 3. 容错性

系统应该预防错误，并提供清晰的恢复路径。

#### 实践指南

- 提供输入验证
- 显示错误信息
- 支持撤销操作
- 保存用户数据

```tsx
// ✅ 好的设计 - 输入验证
<Input
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  helperText={emailError ? '请输入有效的邮箱地址' : ''}
/>

// ❌ 不好的设计 - 无验证
<Input type="email" value={email} onChange={setEmail} />
```

### 4. 效率性

帮助用户高效地完成任务。

#### 实践指南

- 减少操作步骤
- 提供智能默认值
- 支持键盘快捷键
- 优化表单填写

```tsx
// ✅ 好的设计 - 支持键盘快捷键
<Input
  type="text"
  placeholder="搜索..."
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === '/') {
      handleSearch();
    }
  }}
/>

// ❌ 不好的设计 - 只支持鼠标操作
<Input type="text" placeholder="搜索..." />
<Button onClick={handleSearch}>搜索</Button>
```

---

## 交互模式

### 点击交互

#### 按钮点击

```tsx
// 标准按钮
<Button variant="primary" onClick={handleClick}>
  点击我
</Button>

// 加载状态
<Button disabled={isLoading} onClick={handleClick}>
  {isLoading ? <Spinner /> : '提交'}
</Button>

// 确认操作
<Button
  variant="destructive"
  onClick={() => {
    if (confirm('确定要删除吗？')) {
      handleDelete();
    }
  }}
>
  删除
</Button>
```

#### 链接点击

```tsx
// 内部链接
<Link href="/about">关于我们</Link>

// 外部链接
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  外部链接
</a>

// 下载链接
<a href="/file.pdf" download>
  下载文件
</a>
```

### 表单交互

#### 输入框

```tsx
// 基本输入
<Input
  type="text"
  placeholder="请输入内容"
  value={value}
  onChange={setValue}
/>

// 带验证的输入
<Input
  type="email"
  placeholder="请输入邮箱"
  value={email}
  onChange={setEmail}
  error={emailError}
  helperText={emailError ? '请输入有效的邮箱地址' : 'example@domain.com'}
/>

// 自动聚焦
<Input
  type="text"
  placeholder="请输入内容"
  autoFocus
  value={value}
  onChange={setValue}
/>
```

#### 选择器

```tsx
// 下拉选择
<Select
  options={[
    { value: 'option1', label: '选项 1' },
    { value: 'option2', label: '选项 2' },
  ]}
  value={selectedOption}
  onChange={setSelectedOption}
/>

// 单选按钮
<Radio
  name="group"
  value="option1"
  checked={selectedOption === 'option1'}
  onChange={() => setSelectedOption('option1')}
>
  选项 1
</Radio>

// 复选框
<Checkbox
  checked={isChecked}
  onChange={setChecked}
>
  同意条款
</Checkbox>
```

#### 表单提交

```tsx
// 标准提交
<form onSubmit={handleSubmit}>
  <Input type="text" placeholder="姓名" />
  <Input type="email" placeholder="邮箱" />
  <Button type="submit">提交</Button>
</form>

// 异步提交
<form onSubmit={async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    await submitForm(data);
    toast.success('提交成功');
  } catch (error) {
    toast.error('提交失败');
  } finally {
    setIsLoading(false);
  }
}}>
  <Input type="text" placeholder="姓名" />
  <Button type="submit" disabled={isLoading}>
    {isLoading ? '提交中...' : '提交'}
  </Button>
</form>
```

### 导航交互

#### 面包屑导航

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/">首页</BreadcrumbItem>
  <BreadcrumbItem href="/products">产品</BreadcrumbItem>
  <BreadcrumbItem>产品详情</BreadcrumbItem>
</Breadcrumb>
```

#### 标签页导航

```tsx
<Tabs value={activeTab} onChange={setActiveTab}>
  <TabList>
    <Tab value="tab1">标签 1</Tab>
    <Tab value="tab2">标签 2</Tab>
    <Tab value="tab3">标签 3</Tab>
  </TabList>
  <TabPanel value="tab1">内容 1</TabPanel>
  <TabPanel value="tab2">内容 2</TabPanel>
  <TabPanel value="tab3">内容 3</TabPanel>
</Tabs>
```

#### 分页导航

```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

### 模态交互

#### 对话框

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>确认操作</DialogTitle>
      <DialogDescription>
        此操作无法撤销，确定要继续吗？
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        取消
      </Button>
      <Button variant="destructive" onClick={handleConfirm}>
        确认
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### 抽屉

```tsx
<Drawer open={isOpen} onOpenChange={setIsOpen}>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>侧边栏</DrawerTitle>
    </DrawerHeader>
    <DrawerBody>
      <p>侧边栏内容</p>
    </DrawerBody>
    <DrawerFooter>
      <Button onClick={() => setIsOpen(false)}>关闭</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

---

## 动画与过渡

### 动画原则

1. **有意义**：动画应该有明确的目的
2. **流畅**：动画应该流畅自然
3. **快速**：动画应该快速完成
4. **可控**：用户应该能够控制动画

### 动画时长

```typescript
const animationDuration = {
  fast: '150ms',    // 快速交互
  normal: '300ms',  // 标准交互
  slow: '500ms',    // 复杂交互
};
```

### 动画缓动

```typescript
const animationEasing = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};
```

### 常用动画

#### 淡入淡出

```tsx
<Animated animation="fadeIn">
  <div>淡入内容</div>
</Animated>

<Animated animation="fadeOut">
  <div>淡出内容</div>
</Animated>
```

#### 滑动动画

```tsx
<Animated animation="slideInUp">
  <div>从下滑入</div>
</Animated>

<Animated animation="slideInDown">
  <div>从上滑入</div>
</Animated>
```

#### 缩放动画

```tsx
<Animated animation="scaleIn">
  <div>缩放进入</div>
</Animated>

<Animated animation="scaleOut">
  <div>缩放退出</div>
</Animated>
```

### 过渡效果

#### 悬停效果

```tsx
<Button
  style={{
    transition: 'all 0.2s ease',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'scale(1.05)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)';
  }}
>
  悬停效果
</Button>
```

#### 焦点效果

```tsx
<Input
  style={{
    transition: 'all 0.2s ease',
  }}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = tokens.color.primary.hex;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${tokens.color.primary.hex}40`;
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = tokens.color['muted-foreground'].hex;
    e.currentTarget.style.boxShadow = 'none';
  }}
/>
```

---

## 反馈机制

### 视觉反馈

#### 加载状态

```tsx
// 按钮加载
<Button disabled={isLoading}>
  {isLoading ? <Spinner /> : '提交'}
</Button>

// 页面加载
<div className="loading-container">
  <Spinner size="lg" />
  <p>加载中...</p>
</div>

// 骨架屏
<Skeleton className="skeleton-title" />
<Skeleton className="skeleton-text" />
<Skeleton className="skeleton-text" />
```

#### 成功反馈

```tsx
<Alert variant="success">
  <CheckIcon />
  <AlertTitle>操作成功</AlertTitle>
  <AlertDescription>
    您的操作已成功完成。
  </AlertDescription>
</Alert>
```

#### 错误反馈

```tsx
<Alert variant="destructive">
  <AlertIcon />
  <AlertTitle>操作失败</AlertTitle>
  <AlertDescription>
    操作失败，请重试或联系支持。
  </AlertDescription>
</Alert>
```

#### 警告反馈

```tsx
<Alert variant="warning">
  <WarningIcon />
  <AlertTitle>注意</AlertTitle>
  <AlertDescription>
    此操作可能会影响其他功能。
  </AlertDescription>
</Alert>
```

### 触觉反馈

```tsx
// 按钮点击
<Button
  onClick={() => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    handleClick();
  }}
>
  点击
</Button>
```

### 音频反馈

```tsx
// 成功音效
const playSuccessSound = () => {
  const audio = new Audio('/sounds/success.mp3');
  audio.play();
};

// 错误音效
const playErrorSound = () => {
  const audio = new Audio('/sounds/error.mp3');
  audio.play();
};
```

---

## 错误处理

### 表单验证

#### 实时验证

```tsx
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    return '邮箱不能为空';
  }
  if (!emailRegex.test(value)) {
    return '请输入有效的邮箱地址';
  }
  return '';
};

<Input
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value));
  }}
  error={!!emailError}
  helperText={emailError}
/>
```

#### 提交验证

```tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  
  if (Object.values(errors).some(error => error)) {
    setErrors(errors);
    return;
  }
  
  try {
    await submitForm({ email, password });
    toast.success('提交成功');
  } catch (error) {
    toast.error('提交失败');
  }
};
```

### 网络错误

```tsx
const fetchData = async () => {
  try {
    setIsLoading(true);
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error('网络请求失败');
    }
    const data = await response.json();
    setData(data);
  } catch (error) {
    toast.error('加载数据失败，请重试');
  } finally {
    setIsLoading(false);
  }
};
```

### 错误边界

```tsx
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertTitle>发生错误</AlertTitle>
          <AlertDescription>
            {this.state.error?.message || '未知错误'}
          </AlertDescription>
          <Button onClick={() => window.location.reload()}>
            刷新页面
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}
```

---

## 可访问性

### 键盘导航

#### Tab 键导航

```tsx
// 确保所有交互元素可通过 Tab 键访问
<button tabIndex={0} onClick={handleClick}>
  可聚焦按钮
</button>

// 跳过导航链接
<a href="#main-content" className="skip-link">
  跳到主要内容
</a>
```

#### 快捷键

```tsx
// 全局快捷键
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      openSearch();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### ARIA 属性

```tsx
// 按钮
<Button
  aria-label="关闭对话框"
  aria-pressed={isPressed}
  onClick={handleClick}
>
  <CloseIcon />
</Button>

// 输入框
<Input
  aria-label="邮箱地址"
  aria-invalid={!!emailError}
  aria-describedby={emailError ? 'email-error' : undefined}
  type="email"
  value={email}
  onChange={setEmail}
/>
{emailError && (
  <p id="email-error" role="alert">
    {emailError}
  </p>
)}

// 模态框
<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogContent>
    <h2 id="dialog-title">对话框标题</h2>
    <p id="dialog-description">对话框描述</p>
  </DialogContent>
</Dialog>
```

### 屏幕阅读器

```tsx
// 隐藏视觉元素但保留给屏幕阅读器
<span className="sr-only">当前有 3 个新消息</span>

// 实时区域
<div role="status" aria-live="polite">
  {notification && <p>{notification}</p>
</div>

// 加载状态
<div role="status" aria-live="polite">
  {isLoading && <Spinner aria-label="加载中" />}
</div>
```

---

## 性能要求

### 响应时间

| 交互类型 | 目标响应时间 | 最大响应时间 |
|---------|------------|------------|
| 即时反馈 | < 100ms | < 200ms |
| 页面加载 | < 1s | < 3s |
| 表单提交 | < 500ms | < 2s |
| 数据加载 | < 500ms | < 2s |

### 优化策略

#### 防抖和节流

```tsx
// 防抖
const debouncedSearch = useDebounce(handleSearch, 300);

<Input
  type="text"
  placeholder="搜索..."
  onChange={(e) => debouncedSearch(e.target.value)}
/>

// 节流
const throttledScroll = useThrottle(handleScroll, 100);

<div onScroll={throttledScroll}>
  {/* 内容 */}
</div>
```

#### 虚拟滚动

```tsx
import { useVirtual } from 'react-virtual';

const VirtualList = ({ items }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualRow = useVirtual({
    size: items.length,
    parentRef,
    estimateSize: useCallback(() => 50, []),
  });
  
  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualRow.totalSize}px` }}>
        {virtualRow.virtualItems.map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### 懒加载

```tsx
// 组件懒加载
const LazyComponent = lazy(() => import('./LazyComponent'));

<Suspense fallback={<Spinner />}>
  <LazyComponent />
</Suspense>

// 图片懒加载
<img
  src={imageSrc}
  loading="lazy"
  alt="描述"
/>
```

---

**文档版本**: 1.0.0  
**最后更新**: 2026-02-18  
**维护者**: YYC³ Team
