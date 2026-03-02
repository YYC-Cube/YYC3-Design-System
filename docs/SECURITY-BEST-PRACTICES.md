# YYC³ Design System - 安全最佳实践指南

> **文档版本**: 1.0.0
> **创建日期**: 2026-03-03
> **维护者**: YYC³ Security Team

---

## 📋 目录

1. [概述](#概述)
2. [XSS 防护](#xss-防护)
3. [DOMPurify 使用](#dompurify-使用)
4. [安全组件](#安全组件)
5. [最佳实践](#最佳实践)
6. [常见场景](#常见场景)
7. [安全检查清单](#安全检查清单)

---

## 概述

YYC³ Design System 提供了全面的安全防护机制，特别是针对 XSS（跨站脚本攻击）的防护。本指南详细说明了如何正确使用这些安全功能。

### 关键安全组件

- **XSSProvider**: 提供全局 XSS 防护配置
- **SafeHTML**: 安全渲染 HTML 内容
- **SafeInput**: 安全的输入组件
- **XSSContext**: 访问安全功能的 Hook

---

## XSS 防护

### 1. 使用 XSSProvider

在应用的根组件包裹 `XSSProvider`：

```tsx
import { XSSProvider } from '@/security/XSSProtection';

function App() {
  return (
    <XSSProvider>
      <YourApp />
    </XSSProvider>
  );
}
```

### 2. 自定义安全配置

```tsx
import { XSSProvider, createStrictConfig } from '@/security/XSSProtection';

function App() {
  const config = createStrictConfig();

  return (
    <XSSProvider config={config}>
      <YourApp />
    </XSSProvider>
  );
}
```

### 3. 预设配置

项目提供了三种预设配置：

```tsx
import {
  createStrictConfig,      // 最严格：仅允许基本标签
  createModerateConfig,    // 适中：允许大多数安全标签
  createPermissiveConfig   // 宽松：允许自定义元素
} from '@/security/XSSProtection';
```

---

## DOMPurify 使用

### 什么是 DOMPurify？

DOMPurify 是一个 XSS 净化器，用于移除 HTML 中的恶意代码，同时保留安全的 HTML 内容。

### 安装

```bash
pnpm add dompurify
```

### 基本使用

#### 1. 使用 SafeHTML 组件（推荐）

```tsx
import { SafeHTML } from '@/security/XSSProtection';

function MyComponent({ content }: { content: string }) {
  return <SafeHTML html={content} />;
}
```

#### 2. 使用 useXSS Hook

```tsx
import { useXSS } from '@/security/XSSProtection';

function MyComponent({ content }: { content: string }) {
  const { sanitize } = useXSS();

  const [sanitized, setSanitized] = useState('');

  useEffect(() => {
    sanitize(content).then(setSanitized);
  }, [content, sanitize]);

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

#### 3. 使用自定义配置

```tsx
import { SafeHTML } from '@/security/XSSProtection';

function MyComponent({ content }: { content: string }) {
  return (
    <SafeHTML
      html={content}
      config={{
        allowedTags: ['p', 'strong', 'em'],
        allowedAttributes: {
          'a': ['href', 'target']
        }
      }}
    />
  );
}
```

---

## 安全组件

### SafeHTML

用于安全渲染用户生成的 HTML 内容。

```tsx
import { SafeHTML } from '@/security/XSSProtection';

interface BlogPostProps {
  title: string;
  content: string; // Markdown 渲染后的 HTML
}

function BlogPost({ title, content }: BlogPostProps) {
  return (
    <article>
      <h1>{title}</h1>
      <SafeHTML html={content} />
    </article>
  );
}
```

### SafeInput

用于需要输入净化的场景。

```tsx
import { SafeInput } from '@/security/XSSProtection';

function CommentForm() {
  const [comment, setComment] = useState('');

  return (
    <SafeInput
      value={comment}
      onChange={setComment}
      sanitizeOnInput={true}
      maxLength={500}
    />
  );
}
```

### URL 验证和净化

```tsx
import {
  createSafeURL,
  validateURL,
  sanitizeURL
} from '@/security/XSSProtection';

// 验证 URL
if (validateURL(userInputURL)) {
  // URL 格式有效
}

// 创建安全 URL
const safeURL = createSafeURL(userInputURL);
if (safeURL) {
  // URL 是安全的
}

// 净化 URL（返回安全 URL 或 about:blank）
const cleanURL = sanitizeURL(userInputURL);
```

---

## 最佳实践

### ✅ 应该做的

1. **始终使用 SafeHTML 或 useXSS 净化用户输入**
   ```tsx
   ✅ <SafeHTML html={userContent} />
   ```

2. **验证和净化所有 URL**
   ```tsx
   ✅ const safeURL = sanitizeURL(userInputURL);
   ```

3. **在应用根组件使用 XSSProvider**
   ```tsx
   ✅ <XSSProvider><App /></XSSProvider>
   ```

4. **使用预设配置或自定义严格配置**
   ```tsx
   ✅ const config = createStrictConfig();
   ```

5. **对用户输入进行输入验证**
   ```tsx
   ✅ <input type="text" pattern="[a-zA-Z0-9]+" />
   ```

### ❌ 不应该做的

1. **不要直接使用 dangerouslySetInnerHTML**
   ```tsx
   ❌ <div dangerouslySetInnerHTML={{ __html: userInput }} />
   ```

2. **不要绕过 DOMPurify**
   ```tsx
   ❌ const html = DOMPurify.sanitize(input, { ALLOWED_TAGS: ['*'] });
   ```

3. **不要在没有验证的情况下使用用户提供的 URL**
   ```tsx
   ❌ <a href={userInputURL}>Link</a>
   ```

4. **不要在客户端使用 eval 或 Function**
   ```tsx
   ❌ eval(userInput);
   ❌ new Function(userInput)();
   ```

5. **不要使用 innerHTML 设置用户内容**
   ```tsx
   ❌ element.innerHTML = userInput;
   ```

---

## 常见场景

### 场景 1: 评论系统

```tsx
import { SafeHTML } from '@/security/XSSProtection';

function Comment({ content }: { content: string }) {
  // 内容可能是 Markdown 渲染后的 HTML
  return (
    <div className="comment">
      <SafeHTML html={content} />
    </div>
  );
}
```

### 场景 2: 富文本编辑器

```tsx
import { useXSS } from '@/security/XSSProtection';

function RichTextEditor({ onSave }: { onSave: (content: string) => void }) {
  const { sanitize } = useXSS();
  const [content, setContent] = useState('');

  const handleSave = async () => {
    const sanitized = await sanitize(content);
    onSave(sanitized);
  };

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

### 场景 3: 博客文章（Markdown 渲染）

```tsx
import { SafeHTML } from '@/security/XSSProtection';
import { marked } from 'marked';

function BlogPost({ markdown }: { markdown: string }) {
  const html = marked(markdown);

  return (
    <article>
      <SafeHTML html={html} />
    </article>
  );
}
```

### 场景 4: 链接展示

```tsx
import { sanitizeURL } from '@/security/XSSProtection';

function LinkDisplay({ url }: { url: string }) {
  const safeURL = sanitizeURL(url);

  return (
    <a href={safeURL} target="_blank" rel="noopener noreferrer">
      {url}
    </a>
  );
}
```

### 场景 5: 用户头像

```tsx
import { createSafeURL } from '@/security/XSSProtection';

function UserAvatar({ src, alt }: { src: string; alt: string }) {
  const safeURL = createSafeURL(src, ['http', 'https', 'data']);

  if (!safeURL) {
    // 使用默认头像
    return <img src="/default-avatar.png" alt={alt} />;
  }

  return <img src={safeURL} alt={alt} />;
}
```

---

## 安全检查清单

### 开发时检查

- [ ] 所有用户输入都经过验证和净化
- [ ] 使用 SafeHTML 或 useXSS 净化 HTML 内容
- [ ] URL 使用 sanitizeURL 或 createSafeURL 净化
- [ ] 避免直接使用 dangerouslySetInnerHTML
- [ ] 避免使用 eval 或 Function
- [ ] 使用 CSP（Content Security Policy）
- [ ] 启用 XSS 检测和报告

### 部署前检查

- [ ] 运行安全扫描（如 npm audit）
- [ ] 检查 DOMPurify 配置是否适当严格
- [ ] 验证所有第三方库的安全性
- [ ] 测试 XSS 攻击场景
- [ ] 检查 CSP 头是否正确配置
- [ ] 验证所有用户输入字段都有适当的验证

### 定期检查

- [ ] 更新安全依赖（如 DOMPurify）
- [ ] 审查和更新 XSS 防护配置
- [ ] 进行安全审计和渗透测试
- [ ] 监控安全事件和报告
- [ ] 培训团队成员了解最新的安全威胁

---

## 配置参考

### 预设配置详解

#### Strict Config（严格）

```typescript
{
  allowedTags: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
  allowedAttributes: {
    a: ['href']
  },
  allowedSchemes: ['https', 'mailto']
}
```

**适用场景**：
- 用户评论
- 简单的文本内容
- 不需要复杂格式的内容

#### Moderate Config（适中）

这是默认配置，允许大多数安全的 HTML 标签和属性。

**适用场景**：
- 博客文章
- 富文本内容
- 需要 HTML 格式的内容

#### Permissive Config（宽松）

允许自定义元素、注释和未知标记。

**适用场景**：
- 内部工具
- 完全信任的内容来源
- 需要 Web Components 的场景

### 自定义配置

```typescript
const customConfig = {
  allowedTags: [...createModerateConfig().allowedTags, 'iframe'],
  allowedAttributes: {
    ...createModerateConfig().allowedAttributes,
    iframe: ['src', 'width', 'height', 'sandbox']
  },
  allowedSchemes: ['https', 'mailto', 'tel'],
  forbidTags: ['script', 'object', 'embed'],
  forbidAttributes: ['onclick', 'onload', 'onerror']
};
```

---

## 安全工具

### 1. URL 验证工具

```typescript
import {
  validateURL,
  createSafeURL,
  sanitizeURL
} from '@/security/XSSProtection';

// 验证 URL 格式
if (validateURL(url)) {
  // URL 格式有效
}

// 创建安全 URL（仅允许特定协议）
const safeURL = createSafeURL(url, ['https', 'mailto']);

// 净化 URL（返回安全 URL 或 about:blank）
const cleanURL = sanitizeURL(url);
```

### 2. HTML 转义工具

```typescript
import {
  escapeHTML,
  unescapeHTML
} from '@/security/XSSProtection';

// 转义 HTML 字符
const escaped = escapeHTML('<script>alert(1)</script>');
// 结果: &lt;script&gt;alert(1)&lt;/script&gt;

// 反转义 HTML 字符
const unescaped = unescapeHTML(escaped);
```

### 3. 属性值净化

```typescript
import {
  sanitizeAttributeValue
} from '@/security/XSSProtection';

// 净化属性值
const cleanValue = sanitizeAttributeValue('onclick', 'alert(1)');
// 结果: 空字符串（危险属性被移除）
```

### 4. XSS Hook

```typescript
import { createXSSHook } from '@/security/XSSProtection';

const hook = createXSSHook();

// 启用 XSS 检测
hook.enable();

// 禁用 XSS 检测
hook.disable();
```

---

## 常见问题

### Q: DOMPurify 会影响性能吗？

A: DOMPurify 的性能影响很小。对于大多数应用，性能影响可以忽略不计。如果需要处理大量 HTML 内容，可以考虑使用缓存。

### Q: 我可以在服务器端使用 DOMPurify 吗？

A: 可以。DOMPurify 支持 Node.js 环境。但在服务器端使用时，需要确保服务器环境正确配置。

### Q: DOMPurify 会保留样式吗？

A: 默认情况下，DOMPurify 会移除样式标签和内联样式。如果需要保留样式，可以在配置中允许相关的标签和属性。

### Q: 如何处理 SVG 内容？

A: DOMPurify 默认支持 SVG。但 SVG 可能包含 XSS 向量，建议使用严格的配置，并在必要时进行额外的验证。

### Q: 我可以允许自定义标签吗？

A: 可以，但需要谨慎。使用 `allowCustomElements: true` 配置，但要确保自定义标签的实现是安全的。

---

## 安全资源

### 官方文档

- [DOMPurify 官方文档](https://github.com/cure53/DOMPurify)
- [OWASP XSS 防护备忘单](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

### 安全工具

- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [Dependabot](https://github.com/features/dependabot)

### 学习资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)

---

## 贡献

如果您发现安全问题或有改进建议，请：

1. 不要公开安全问题
2. 通过私有渠道报告安全漏洞
3. 提供详细的复现步骤
4. 等待团队确认和修复

---

## 许可证

本文档遵循 YYC³ Design System 的许可证。

---

**文档维护**: YYC³ Security Team
**最后更新**: 2026-03-03
**版本**: 1.0.0
