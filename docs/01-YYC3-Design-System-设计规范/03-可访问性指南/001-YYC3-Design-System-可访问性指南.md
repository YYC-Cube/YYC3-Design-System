/**
 * @file 可访问性指南
 * @description YYC³ 设计系统可访问性指南，确保产品符合WCAG标准
 * @module docs/accessibility-guide
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 * @updated 2026-02-18
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

# 可访问性指南

> YYC³ Design System - 可访问性指南
> 版本: 1.0.0
> 更新日期: 2026-02-18

---

## 目录

- [可访问性概述](#可访问性概述)
- [WCAG 标准](#wcag-标准)
- [键盘导航](#键盘导航)
- [屏幕阅读器](#屏幕阅读器)
- [色彩对比度](#色彩对比度)
- [表单可访问性](#表单可访问性)
- [媒体可访问性](#媒体可访问性)
- [测试工具](#测试工具)

---

## 可访问性概述

### 什么是可访问性？

可访问性（Accessibility，简称 A11y）是指产品能够被所有用户，包括有障碍的用户，无障碍地使用。

### 为什么重要？

1. **包容性**：确保所有用户都能使用产品
2. **法律合规**：符合相关法律法规要求
3. **用户体验**：提升所有用户的使用体验
4. **市场扩大**：覆盖更广泛的用户群体

### YYC³ 可访问性承诺

YYC³ 设计系统致力于创建符合 WCAG 2.1 AA 级别标准的可访问性组件。

---

## WCAG 标准

### WCAG 2.1 四大原则

#### 1. 可感知性 (Perceivable)

信息和用户界面组件必须以用户可以感知的方式呈现。

##### 文本替代

```tsx
// ✅ 好的设计 - 提供有意义的 alt 文本
<img src="/logo.png" alt="YYC³ 公司 Logo" />

// ✅ 好的设计 - 装饰性图片使用空 alt
<img src="/decorative.png" alt="" />

// ❌ 不好的设计 - 缺少 alt 文本
<img src="/logo.png" />

// ❌ 不好的设计 - 无意义的 alt 文本
<img src="/logo.png" alt="图片" />
```

##### 时间媒体

```tsx
// ✅ 好的设计 - 提供字幕
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="/captions.vtt"
    srcLang="zh"
    label="中文字幕"
  />
</video>

// ✅ 好的设计 - 提供音频描述
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <track
    kind="descriptions"
    src="/descriptions.vtt"
    srcLang="zh"
    label="音频描述"
  />
</video>
```

##### 可适应性

```tsx
// ✅ 好的设计 - 响应式布局
<div className="responsive-container">
  <p>内容会根据屏幕大小自动调整</p>
</div>

// ✅ 好的设计 - 支持方向变化
<div className="orientation-aware">
  <p>内容会根据设备方向自动调整</p>
</div>
```

#### 2. 可操作性 (Operable)

用户界面组件和导航必须是可操作的。

##### 键盘可访问

```tsx
// ✅ 好的设计 - 所有交互元素可通过键盘访问
<button onClick={handleClick}>按钮</button>
<a href="/page">链接</a>
<input type="text" placeholder="输入框" />

// ❌ 不好的设计 - 仅支持鼠标交互
<div onClick={handleClick}>点击这里</div>
```

##### 无键盘陷阱

```tsx
// ✅ 好的设计 - 提供关闭模态框的方式
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogCloseButton onClick={() => setIsOpen(false)}>
      <CloseIcon />
    </DialogCloseButton>
    <p>模态框内容</p>
  </DialogContent>
</Dialog>

// ✅ 好的设计 - ESC 键关闭模态框
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };
  window.addEventListener('keydown', handleEscape);
  return () => window.removeEventListener('keydown', handleEscape);
}, [isOpen]);
```

##### 充足时间

```tsx
// ✅ 好的设计 - 提供暂停自动播放的选项
<Carousel
  autoPlay
  interval={5000}
  onPause={() => console.log('暂停')}
  onResume={() => console.log('继续')}
>
  {/* 轮播内容 */}
</Carousel>

// ✅ 好的设计 - 会话超时前提醒用户
<SessionTimeout
  timeout={30 * 60 * 1000}
  warning={5 * 60 * 1000}
  onTimeout={handleTimeout}
>
  <p>您的会话即将过期，是否继续？</p>
</SessionTimeout>
```

#### 3. 可理解性 (Understandable)

信息和用户界面操作必须是可理解的。

##### 可读性

```tsx
// ✅ 好的设计 - 使用清晰的语言
<p>请输入您的邮箱地址</p>

// ❌ 不好的设计 - 使用技术术语
<p>请输入有效的电子邮件格式字符串</p>

// ✅ 好的设计 - 提供上下文
<div>
  <label htmlFor="email">邮箱地址</label>
  <input id="email" type="email" placeholder="example@domain.com" />
  <small>我们将发送验证链接到您的邮箱</small>
</div>
```

##### 可预测性

```tsx
// ✅ 好的设计 - 遵循平台约定
<Button variant="primary">提交</Button>

// ❌ 不好的设计 - 违反平台约定
<Button variant="primary" onContextMenu={handleSubmit}>
  右键提交
</Button>
```

##### 输入协助

```tsx
// ✅ 好的设计 - 提供输入验证
<Input
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  helperText={emailError ? '请输入有效的邮箱地址' : 'example@domain.com'}
/>

// ✅ 好的设计 - 提供自动完成
<Input
  type="text"
  placeholder="搜索..."
  list="suggestions"
  autoComplete="off"
/>
<datalist id="suggestions">
  <option value="建议 1" />
  <option value="建议 2" />
  <option value="建议 3" />
</datalist>
```

#### 4. 健壮性 (Robust)

内容必须足够健壮，能够被各种用户代理可靠地解释。

##### 兼容性

```tsx
// ✅ 好的设计 - 使用语义化 HTML
<nav aria-label="主导航">
  <ul>
    <li><a href="/">首页</a></li>
    <li><a href="/about">关于</a></li>
    <li><a href="/contact">联系</a></li>
  </ul>
</nav>

// ❌ 不好的设计 - 使用非语义化元素
<div className="navigation">
  <div className="nav-item">首页</div>
  <div className="nav-item">关于</div>
  <div className="nav-item">联系</div>
</div>
```

---

## 键盘导航

### Tab 键导航

#### 焦点顺序

```tsx
// ✅ 好的设计 - 逻辑焦点顺序
<form>
  <label htmlFor="name">姓名</label>
  <input id="name" type="text" />
  
  <label htmlFor="email">邮箱</label>
  <input id="email" type="email" />
  
  <label htmlFor="password">密码</label>
  <input id="password" type="password" />
  
  <button type="submit">提交</button>
</form>

// ❌ 不好的设计 - 混乱的焦点顺序
<form>
  <button type="submit">提交</button>
  
  <label htmlFor="password">密码</label>
  <input id="password" type="password" />
  
  <label htmlFor="email">邮箱</label>
  <input id="email" type="email" />
  
  <label htmlFor="name">姓名</label>
  <input id="name" type="text" />
</form>
```

#### 焦点可见性

```tsx
// ✅ 好的设计 - 清晰的焦点样式
const focusStyle = {
  outline: '2px solid #d45a5f',
  outlineOffset: '2px',
};

<input style={focusStyle} type="text" />

// ✅ 好的设计 - 使用 :focus-visible
input:focus-visible {
  outline: 2px solid #d45a5f;
  outline-offset: 2px;
}
```

### 快捷键

#### 全局快捷键

```tsx
// ✅ 好的设计 - 提供常用快捷键
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl/Cmd + K: 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    
    // Escape: 关闭模态框
    if (e.key === 'Escape') {
      closeModal();
    }
    
    // Ctrl/Cmd + /: 打开帮助
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      openHelp();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

#### 组件快捷键

```tsx
// ✅ 好的设计 - 组件内快捷键
const Dropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  
  return (
    <div onKeyDown={handleKeyDown}>
      <button onClick={() => setIsOpen(!isOpen)}>
        菜单
      </button>
      {isOpen && <ul>{children}</ul>}
    </div>
  );
};
```

### 跳过导航

```tsx
// ✅ 好的设计 - 跳过导航链接
<a
  href="#main-content"
  className="skip-link"
  onClick={(e) => {
    e.preventDefault();
    document.getElementById('main-content')?.focus();
  }}
>
  跳到主要内容
</a>

<main id="main-content" tabIndex={-1}>
  <h1>主要内容</h1>
</main>

// CSS
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #d45a5f;
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## 屏幕阅读器

### ARIA 属性

#### 语义化角色

```tsx
// ✅ 好的设计 - 使用语义化角色
<nav role="navigation" aria-label="主导航">
  <ul>
    <li><a href="/">首页</a></li>
    <li><a href="/about">关于</a></li>
  </ul>
</nav>

<main role="main">
  <h1>主要内容</h1>
</main>

<aside role="complementary" aria-label="侧边栏">
  <p>侧边栏内容</p>
</aside>

<footer role="contentinfo">
  <p>页脚内容</p>
</footer>
```

#### 状态和属性

```tsx
// ✅ 好的设计 - 提供按钮状态
<button
  aria-label="播放视频"
  aria-pressed={isPlaying}
  onClick={togglePlay}
>
  {isPlaying ? <PauseIcon /> : <PlayIcon />}
</button>

// ✅ 好的设计 - 提供输入框状态
<input
  type="email"
  aria-label="邮箱地址"
  aria-invalid={!!emailError}
  aria-describedby={emailError ? 'email-error' : 'email-help'}
  value={email}
  onChange={setEmail}
/>
{emailError ? (
  <p id="email-error" role="alert" aria-live="polite">
    {emailError}
  </p>
) : (
  <p id="email-help">请输入有效的邮箱地址</p>
)}

// ✅ 好的设计 - 提供模态框状态
<Dialog
  open={isOpen}
  onOpenChange={setIsOpen}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  aria-modal="true"
>
  <DialogContent>
    <h2 id="dialog-title">对话框标题</h2>
    <p id="dialog-description">对话框描述</p>
  </DialogContent>
</Dialog>
```

#### 实时区域

```tsx
// ✅ 好的设计 - 使用 aria-live
<div role="status" aria-live="polite">
  {notification && <p>{notification}</p>}
</div>

// ✅ 好的设计 - 使用 aria-atomic
<div role="alert" aria-live="assertive" aria-atomic="true">
  {errorMessage && <p>{errorMessage}</p>}
</div>
```

### 隐藏内容

```tsx
// ✅ 好的设计 - 屏幕阅读器专用文本
<button>
  <span className="sr-only">删除项目</span>
  <TrashIcon />
</button>

// ✅ 好的设计 - 视觉隐藏但保留功能
<span className="sr-only">当前有 3 个新消息</span>

// CSS
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 色彩对比度

### 对比度要求

| 内容类型 | AA 级别 | AAA 级别 |
|---------|---------|----------|
| 正常文本 | 4.5:1 | 7:1 |
| 大文本 (18pt+) | 3:1 | 4.5:1 |
| 图形元素 | 3:1 | 3:1 |

### 颜色选择

```tsx
// ✅ 好的设计 - 足够的对比度
<button style={{ backgroundColor: '#d45a5f', color: '#ffffff' }}>
  高对比度按钮
</button>

// ❌ 不好的设计 - 对比度不足
<button style={{ backgroundColor: '#d45a5f', color: '#ffcccc' }}>
  低对比度按钮
</button>
```

### 颜色对比度检查器

使用内置的颜色对比度检查器工具：

```tsx
import { ColorContrastChecker } from 'yyc3-design-system';

<ColorContrastChecker />
```

---

## 表单可访问性

### 表单标签

```tsx
// ✅ 好的设计 - 使用 label 元素
<label htmlFor="email">邮箱地址</label>
<input id="email" type="email" />

// ✅ 好的设计 - 使用 aria-label
<input
  type="search"
  aria-label="搜索"
  placeholder="搜索..."
/>

// ✅ 好的设计 - 使用 aria-labelledby
<fieldset>
  <legend id="contact-info">联系信息</legend>
  <div>
    <label htmlFor="name" id="name-label">姓名</label>
    <input
      id="name"
      type="text"
      aria-labelledby="name-label"
    />
  </div>
</fieldset>
```

### 表单验证

```tsx
// ✅ 好的设计 - 实时验证
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
  aria-invalid={!!emailError}
  aria-describedby={emailError ? 'email-error' : undefined}
  error={!!emailError}
  helperText={emailError}
/>
{emailError && (
  <p id="email-error" role="alert" aria-live="polite">
    {emailError}
  </p>
)}
```

### 表单提交

```tsx
// ✅ 好的设计 - 提供提交状态
<form onSubmit={handleSubmit}>
  <Input type="text" placeholder="姓名" />
  <Input type="email" placeholder="邮箱" />
  <Button
    type="submit"
    disabled={isSubmitting}
    aria-busy={isSubmitting}
  >
    {isSubmitting ? <Spinner aria-label="提交中" /> : '提交'}
  </Button>
</form>
```

---

## 媒体可访问性

### 图片

```tsx
// ✅ 好的设计 - 提供描述性 alt 文本
<img
  src="/team.jpg"
  alt="YYC³ 团队在办公室开会，五个人围坐在会议桌旁"
/>

// ✅ 好的设计 - 装饰性图片使用空 alt
<img src="/pattern.png" alt="" />

// ✅ 好的设计 - 复杂图片使用长描述
<img
  src="/chart.png"
  alt="2024年销售趋势图"
  longdesc="/chart-description.html"
/>
```

### 视频

```tsx
// ✅ 好的设计 - 提供字幕和音频描述
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="/captions.vtt"
    srcLang="zh"
    label="中文字幕"
  />
  <track
    kind="descriptions"
    src="/descriptions.vtt"
    srcLang="zh"
    label="音频描述"
  />
</video>
```

### 音频

```tsx
// ✅ 好的设计 - 提供音频文本
<audio controls>
  <source src="/audio.mp3" type="audio/mpeg" />
  <p>
    您的浏览器不支持音频元素。
    <a href="/audio-transcript.html">查看音频文本</a>
  </p>
</audio>
```

---

## 测试工具

### 自动化测试

#### jest-axe

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<Button>按钮</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### @axe-core/react

```tsx
import { Axe } from '@axe-core/react';

<Axe>
  <App />
</Axe>
```

### 手动测试

#### 键盘导航测试

1. 使用 Tab 键遍历所有交互元素
2. 检查焦点顺序是否合理
3. 确保所有交互元素可通过键盘访问
4. 测试 Enter 和 Space 键是否触发操作

#### 屏幕阅读器测试

1. 使用 NVDA (Windows) 或 VoiceOver (Mac)
2. 检查所有内容是否被正确朗读
3. 验证 ARIA 属性是否正确应用
4. 测试导航和交互是否流畅

#### 颜色对比度测试

1. 使用颜色对比度检查器工具
2. 确保所有文本对比度符合 WCAG AA 标准
3. 测试不同主题下的对比度
4. 验证图形元素的对比度

### 浏览器工具

#### Chrome DevTools

- Lighthouse 可访问性审计
- Elements 面板中的 ARIA 属性检查
- Accessibility 面板

#### Firefox DevTools

- Accessibility Inspector
- ARIA 属性检查

#### Safari DevTools

- Accessibility Inspector
- VoiceOver 调试

---

## 最佳实践

### 1. 优先使用语义化 HTML

```tsx
// ✅ 好的设计
<nav>
  <ul>
    <li><a href="/">首页</a></li>
  </ul>
</nav>

// ❌ 不好的设计
<div className="nav">
  <div className="nav-item">首页</div>
</div>
```

### 2. 提供清晰的焦点指示

```tsx
// ✅ 好的设计
:focus-visible {
  outline: 2px solid #d45a5f;
  outline-offset: 2px;
}

// ❌ 不好的设计
:focus {
  outline: none;
}
```

### 3. 确保键盘可访问

```tsx
// ✅ 好的设计
<button onClick={handleClick}>按钮</button>

// ❌ 不好的设计
<div onClick={handleClick}>按钮</div>
```

### 4. 提供有意义的替代文本

```tsx
// ✅ 好的设计
<img src="/logo.png" alt="YYC³ 公司 Logo" />

// ❌ 不好的设计
<img src="/logo.png" alt="logo" />
```

### 5. 使用 ARIA 属性增强可访问性

```tsx
// ✅ 好的设计
<button
  aria-label="关闭对话框"
  aria-pressed={isPressed}
  onClick={handleClick}
>
  <CloseIcon />
</button>

// ❌ 不好的设计
<button onClick={handleClick}>
  <CloseIcon />
</button>
```

---

## 资源

### 学习资源

- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN 可访问性指南](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)

### 工具

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

---

**文档版本**: 1.0.0  
**最后更新**: 2026-02-18  
**维护者**: YYC³ Team
