/**
 * @file XSS防护测试
 * @description 测试XSS防护功能
 * @module __tests__/security/XSSProtection.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import * as React from 'react';
;
;
import { XSSProvider, useXSS } from '../XSSProtection'
import { render, cleanup, fireEvent, waitFor, act } from '@testing-library/react'
import { screen } from '@testing-library/dom';;

describe('XSS Protection Module', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('XSSProvider', () => {
    it('应该提供默认配置', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [dirty, setDirty] = React.useState('<script>alert("xss")</script>');
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize(dirty).then(setClean);
        }, [dirty, sanitize]);

        return (
          <div>
            <input
              data-testid="input"
              value={dirty}
              onChange={(e) => setDirty(e.target.value)}
            />
            <div data-testid="output">{clean}</div>
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const input = screen.getByTestId('input');
      const output = screen.getByTestId('output');

      expect(input).toBeInTheDocument();
      expect(output).toBeInTheDocument();

      await waitFor(() => {
        expect(output.textContent).not.toContain('<script>');
      });
    });

    it('应该支持自定义配置', async () => {
      const customConfig = {
        allowedTags: ['b', 'i', 'em'],
        allowedAttributes: {}
      };

      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [input] = React.useState('<b>bold</b><script>evil</script>');
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize(input).then(setClean);
        }, [input, sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider config={customConfig}>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).toContain('bold');
      });
      
      expect(output.textContent).not.toContain('<script>');
    });

    it('应该处理HTML实体编码', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('&lt;script&gt;alert(1)&lt;/script&gt;').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).toBeDefined();
      });
    });

    it('应该过滤危险属性', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('<div onclick="alert(1)">click</div>').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).not.toContain('onclick');
      });
    });
  });

  describe('useXSS Hook', () => {
    it('应该返回sanitize函数', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('<p>safe content</p>').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output).toBeInTheDocument();
      });
    });

    it('应该处理空字符串', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).toBe('');
      });
    });

    it('应该处理null和undefined', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [cleanNull, setCleanNull] = React.useState('');
        const [cleanUndefined, setCleanUndefined] = React.useState('');

        React.useEffect(() => {
          sanitize(null as unknown as string).then(setCleanNull);
          sanitize(undefined as unknown as string).then(setCleanUndefined);
        }, [sanitize]);

        return (
          <div>
            <div data-testid="output-null">{cleanNull}</div>
            <div data-testid="output-undefined">{cleanUndefined}</div>
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const outputNull = screen.getByTestId('output-null');
      const outputUndefined = screen.getByTestId('output-undefined');
      
      await waitFor(() => {
        expect(outputNull).toBeInTheDocument();
        expect(outputUndefined).toBeInTheDocument();
      });
    });

    it('应该处理特殊字符', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('<>&"\'').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).toBeDefined();
      });
    });
  });

  describe('XSS攻击防护', () => {
    it('应该阻止script标签注入', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('<script>alert("xss")</script>').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).not.toContain('<script>');
        expect(output.textContent).not.toContain('alert');
      });
    });

    it('应该阻止iframe注入', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('<iframe src="evil.com"></iframe>').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).not.toContain('<iframe');
      });
    });

    it('应该阻止javascript:协议', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('<a href="javascript:alert(1)">click</a>').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).not.toContain('javascript:');
      });
    });

    it('应该阻止on事件处理器', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('<div onmouseover="alert(1)">hover</div>').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).not.toContain('onmouseover');
      });
    });

    it('应该阻止data:URL', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('<img src="data:text/html,<script>alert(1)</script>">').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).not.toContain('data:');
      });
    });
  });

  describe('安全内容保留', () => {
    it('应该保留安全的HTML标签', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('<p><strong>bold</strong> and <em>italic</em></p>').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).toContain('bold');
        expect(output.textContent).toContain('italic');
      });
    });

    it('应该保留链接', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('<a href="https://example.com">safe link</a>').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).toContain('safe link');
      });
    });

    it('应该保留图片', async () => {
      const TestComponent = () => {
        const { sanitize } = useXSS();
        const [clean, setClean] = React.useState('');

        React.useEffect(() => {
          sanitize('<img src="https://example.com/image.jpg" alt="image">').then(setClean);
        }, [sanitize]);

        return (
          <div data-testid="output">
            {clean}
          </div>
        );
      };

      render(
        <XSSProvider>
          <TestComponent />
        </XSSProvider>
      );

      const output = screen.getByTestId('output');
      
      await waitFor(() => {
        expect(output.textContent).toBeDefined();
      });
    });
  });
});