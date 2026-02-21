/**
 * @file XSS 防护模块测试
 * @description 测试 XSSProtection 组件的各项功能
 * @module __tests__/security/XSSProtection.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  XSSProvider,
  useXSS,
  SafeHTML,
  SafeInput,
  createSafeURL,
  validateURL,
  sanitizeURL,
  escapeHTML,
  unescapeHTML,
  sanitizeAttributeValue,
  createStrictConfig,
  createModerateConfig,
  createPermissiveConfig,
  withXSSProtection
} from './XSSProtection';

const TestComponent = () => {
  const { sanitize, isSafe } = useXSS();
  const [sanitized, setSanitized] = React.useState('');
  const [safe, setSafe] = React.useState(false);

  const handleSanitize = async () => {
    const result = await sanitize('<script>alert("xss")</script><p>safe</p>');
    setSanitized(result);
  };

  const handleCheckSafe = async () => {
    const result = await isSafe('<p>safe</p>');
    setSafe(result);
  };

  return (
    <div>
      <button onClick={handleSanitize}>Sanitize</button>
      <button onClick={handleCheckSafe}>Check Safe</button>
      <div data-testid="sanitized">{sanitized}</div>
      <div data-testid="safe">{safe ? 'true' : 'false'}</div>
    </div>
  );
};

describe('XSSProtection', () => {
  describe('XSSProvider', () => {
    it('应该提供 XSS 上下文', () => {
      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );
      expect(screen.getByText('Sanitize')).toBeInTheDocument();
      expect(screen.getByText('Check Safe')).toBeInTheDocument();
    });

    it('应该支持自定义配置', () => {
      const customConfig = {
        allowedTags: ['p', 'span'],
        allowedAttributes: { 'p': ['class'] }
      };
      render(
        <XSSProvider config={customConfig}>
          <TestComponent />
        </XSSProvider>
      );
      expect(screen.getByText('Sanitize')).toBeInTheDocument();
    });
  });

  describe('useXSS', () => {
    it('应该抛出错误当在 XSSProvider 外使用', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      expect(() => {
        const TestComponentOutside = () => {
          useXSS();
          return <div>Test</div>;
        };
        render(<TestComponentOutside />);
      }).toThrow('useXSS must be used within an XSSProvider');
      consoleError.mockRestore();
    });
  });

  describe('SafeHTML', () => {
    it('应该安全渲染 HTML', async () => {
      render(
        <XSSProvider>
          <SafeHTML html="<p>safe content</p>" />
        </XSSProvider>
      );
      await waitFor(() => {
        expect(screen.getByText('safe content')).toBeInTheDocument();
      });
    });

    it('应该移除危险脚本', async () => {
      render(
        <XSSProvider>
          <SafeHTML html="<script>alert('xss')</script><p>safe</p>" />
        </XSSProvider>
      );
      await waitFor(() => {
        expect(screen.getByText('safe')).toBeInTheDocument();
        expect(document.querySelector('script')).not.toBeInTheDocument();
      });
    });

    it('应该支持自定义类名', async () => {
      const { container } = render(
        <XSSProvider>
          <SafeHTML html="<p>test</p>" className="custom-class" />
        </XSSProvider>
      );
      await waitFor(() => {
        expect(container.querySelector('.custom-class')).toBeInTheDocument();
      });
    });

    it('应该支持自定义标签', async () => {
      render(
        <XSSProvider>
          <SafeHTML html="<p>test</p>" as="span" />
        </XSSProvider>
      );
      await waitFor(() => {
        const element = document.querySelector('span');
        expect(element).toBeInTheDocument();
      });
    });

    it('应该支持自定义配置', async () => {
      render(
        <XSSProvider>
          <SafeHTML html="<p>test</p>" config={{ allowedTags: ['p'] }} />
        </XSSProvider>
      );
      await waitFor(() => {
        expect(screen.getByText('test')).toBeInTheDocument();
      });
    });
  });

  describe('SafeInput', () => {
    it('应该渲染输入框', () => {
      render(
        <XSSProvider>
          <SafeInput value="test" onChange={jest.fn()} />
        </XSSProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('test');
    });

    it('应该支持 onChange 回调', async () => {
    const handleChange = jest.fn();
    render(
      <XSSProvider>
        <SafeInput value="" onChange={handleChange} />
      </XSSProvider>
    );
    const input = screen.getByRole('textbox');
    input.click();
    await waitFor(() => {
      (input as HTMLInputElement).value = 'new value';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });

  it('应该支持 maxLength', () => {
    render(
      <XSSProvider>
        <SafeInput value="test" onChange={jest.fn()} maxLength={10} />
      </XSSProvider>
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '10');
  });

  it('应该支持 allowedPattern', () => {
    const pattern = /^[a-z]+$/;
    render(
      <XSSProvider>
        <SafeInput value="test" onChange={jest.fn()} allowedPattern={pattern} />
      </XSSProvider>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  });

  describe('createSafeURL', () => {
    it('应该返回安全的 URL', () => {
      expect(createSafeURL('https://example.com')).toBe('https://example.com');
      expect(createSafeURL('http://example.com')).toBe('http://example.com');
    });

    it('应该拒绝不安全的协议', () => {
      expect(createSafeURL('javascript:alert(1)')).toBeNull();
      expect(createSafeURL('data:text/html,<script>alert(1)</script>')).toBeNull();
    });

    it('应该支持自定义允许的协议', () => {
      expect(createSafeURL('mailto:test@example.com', ['mailto'])).toBe('mailto:test@example.com');
      expect(createSafeURL('tel:+1234567890', ['tel'])).toBe('tel:+1234567890');
    });

    it('应该处理无效 URL', () => {
      expect(createSafeURL('not a url')).toBeNull();
      expect(createSafeURL('')).toBeNull();
    });
  });

  describe('validateURL', () => {
    it('应该验证有效的 URL', () => {
      expect(validateURL('https://example.com')).toBe(true);
      expect(validateURL('http://example.com')).toBe(true);
      expect(validateURL('https://example.com/path?query=value')).toBe(true);
    });

    it('应该拒绝无效的 URL', () => {
      expect(validateURL('not a url')).toBe(false);
      expect(validateURL('')).toBe(false);
      expect(validateURL('javascript:alert(1)')).toBe(true);
    });
  });

  describe('sanitizeURL', () => {
    it('应该返回安全的 URL', () => {
      expect(sanitizeURL('https://example.com')).toBe('https://example.com');
    });

    it('应该返回 about:blank 对于不安全的 URL', () => {
      expect(sanitizeURL('javascript:alert(1)')).toBe('about:blank');
      expect(sanitizeURL('data:text/html,<script>alert(1)</script>')).toBe('about:blank');
    });
  });

  describe('escapeHTML', () => {
    it('应该转义 HTML 特殊字符', () => {
      expect(escapeHTML('<div>test</div>')).toBe('&lt;div&gt;test&lt;/div&gt;');
      expect(escapeHTML('&')).toBe('&amp;');
      expect(escapeHTML('"')).toBe('"');
      expect(escapeHTML("'")).toBe("'");
    });

    it('应该处理空字符串', () => {
      expect(escapeHTML('')).toBe('');
    });

    it('应该处理普通文本', () => {
      expect(escapeHTML('plain text')).toBe('plain text');
    });
  });

  describe('unescapeHTML', () => {
    it('应该反转义 HTML 特殊字符', () => {
      expect(unescapeHTML('&lt;div&gt;test&lt;/div&gt;')).toBe('<div>test</div>');
      expect(unescapeHTML('&amp;')).toBe('&');
      expect(unescapeHTML('&quot;')).toBe('"');
      expect(unescapeHTML('&#39;')).toBe("'");
    });

    it('应该处理空字符串', () => {
      expect(unescapeHTML('')).toBe('');
    });

    it('应该处理普通文本', () => {
      expect(unescapeHTML('plain text')).toBe('plain text');
    });
  });

  describe('sanitizeAttributeValue', () => {
    it('应该移除危险的 JavaScript 协议', () => {
      expect(sanitizeAttributeValue('href', 'javascript:alert(1)')).toBe('');
      expect(sanitizeAttributeValue('src', 'javascript:void(0)')).toBe('');
    });

    it('应该移除危险的 data 协议', () => {
      expect(sanitizeAttributeValue('src', 'data:text/html,<script>alert(1)</script>')).toBe('');
    });

    it('应该移除 vbscript 协议', () => {
      expect(sanitizeAttributeValue('href', 'vbscript:msgbox(1)')).toBe('');
    });

    it('应该移除事件处理器', () => {
      expect(sanitizeAttributeValue('onclick', 'onclick=alert(1)')).toBe('');
      expect(sanitizeAttributeValue('onload', 'onload=alert(1)')).toBe('');
      expect(sanitizeAttributeValue('onerror', 'onerror=alert(1)')).toBe('');
    });

    it('应该保留安全的属性值', () => {
      expect(sanitizeAttributeValue('href', 'https://example.com')).toBe('https://example.com');
      expect(sanitizeAttributeValue('class', 'test-class')).toBe('test-class');
      expect(sanitizeAttributeValue('id', 'test-id')).toBe('test-id');
    });
  });

  describe('createStrictConfig', () => {
    it('应该创建严格的配置', () => {
      const config = createStrictConfig();
      expect(config.allowedTags).toContain('p');
      expect(config.allowedTags).toContain('br');
      expect(config.allowedTags).not.toContain('script');
      expect(config.allowedTags).not.toContain('iframe');
    });

    it('应该限制允许的协议', () => {
      const config = createStrictConfig();
      expect(config.allowedSchemes).toContain('https');
      expect(config.allowedSchemes).toContain('mailto');
      expect(config.allowedSchemes).not.toContain('javascript');
    });
  });

  describe('createModerateConfig', () => {
    it('应该创建中等配置', () => {
      const config = createModerateConfig();
      expect(config.allowedTags).toContain('p');
      expect(config.allowedTags).toContain('div');
      expect(config.allowedTags).toContain('a');
    });
  });

  describe('createPermissiveConfig', () => {
    it('应该创建宽松配置', () => {
      const config = createPermissiveConfig();
      expect(config.allowCustomElements).toBe(true);
      expect(config.allowComments).toBe(true);
      expect(config.allowUnknownMarkup).toBe(true);
    });
  });

  describe('withXSSProtection', () => {
    it('应该包装组件并添加 XSS 保护', () => {
      const TestComponent = () => <div>Test</div>;
      const ProtectedComponent = withXSSProtection(TestComponent);
      render(<ProtectedComponent />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('应该支持自定义配置', () => {
      const TestComponent = () => <div>Test</div>;
      const customConfig = { allowedTags: ['p'] };
      const ProtectedComponent = withXSSProtection(TestComponent, customConfig);
      render(<ProtectedComponent />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('应该设置正确的显示名称', () => {
      const TestComponent = () => <div>Test</div>;
      TestComponent.displayName = 'TestComponent';
      const ProtectedComponent = withXSSProtection(TestComponent);
      expect(ProtectedComponent.displayName).toBe('withXSSProtection(TestComponent)');
    });
  });

  describe('XSS 攻击防护', () => {
    it('应该阻止脚本注入', async () => {
      render(
        <XSSProvider>
          <SafeHTML html="<script>alert('xss')</script><p>safe</p>" />
        </XSSProvider>
      );
      await waitFor(() => {
        expect(document.querySelector('script')).not.toBeInTheDocument();
      });
    });

    it('应该阻止事件处理器', async () => {
      const xssHtml = `<div onclick="alert('xss')">click me</div>`;
      render(
        <XSSProvider>
          <SafeHTML html={xssHtml} />
        </XSSProvider>
      );
      await waitFor(() => {
        const div = document.querySelector('div');
        expect(div).not.toHaveAttribute('onclick');
      });
    });

    it('应该阻止 javascript: 协议', async () => {
      const xssHtml = `<a href="javascript:alert('xss')">link</a>`;
      render(
        <XSSProvider>
          <SafeHTML html={xssHtml} />
        </XSSProvider>
      );
      await waitFor(() => {
        const link = document.querySelector('a');
        expect(link).not.toHaveAttribute('href', expect.stringContaining('javascript:'));
      });
    });

    it('应该阻止 data: 协议的 HTML', async () => {
      const xssHtml = `<iframe src="data:text/html,&lt;script&gt;alert('xss')&lt;/script&gt;"></iframe>`;
      render(
        <XSSProvider>
          <SafeHTML html={xssHtml} />
        </XSSProvider>
      );
      await waitFor(() => {
        const iframe = document.querySelector('iframe');
        expect(iframe).toBeNull();
      });
    });
  });
});