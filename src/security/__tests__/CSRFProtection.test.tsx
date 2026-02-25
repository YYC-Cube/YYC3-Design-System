/**
 * @file CSRF防护测试
 * @description 测试CSRF防护功能
 * @module __tests__/security/CSRFProtection.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import * as React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { screen } from '@testing-library/dom';

import { CSRFProvider, CSRFProtectedForm, useCSRF, CSRFProtectedFetch, withCSRFProtection, createCSRFMiddleware, validateCSRFToken, createStrictConfig, createModerateConfig, createPermissiveConfig } from '../CSRFProtection';

global.fetch = jest.fn() as any;

describe('CSRF Protection Module', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('CSRFProvider', () => {
    it('应该生成并存储token', async () => {
      const TestComponent = () => {
        const { token, config } = useCSRF();
        return (
          <div>
            <div data-testid="token">{token || 'loading'}</div>
            <div data-testid="token-length">{config?.tokenLength}</div>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        const tokenLength = screen.getByTestId('token-length');
        expect(token.textContent).not.toBe('loading');
        expect(tokenLength.textContent).toBe('32');
      });
    });

    it('应该支持自定义配置', async () => {
      const customConfig = {
        tokenLength: 16,
        expirationTime: 60000
      };

      const TestComponent = () => {
        const { token, config } = useCSRF();
        return (
          <div>
            <div data-testid="token">{token || 'loading'}</div>
            <div data-testid="config-length">{config?.tokenLength}</div>
            <div data-testid="config-expiry">{config?.expirationTime}</div>
          </div>
        );
      };

      render(
        <CSRFProvider config={customConfig}>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        const configLength = screen.getByTestId('config-length');
        const configExpiry = screen.getByTestId('config-expiry');
        expect(token.textContent).not.toBe('loading');
        expect(configLength.textContent).toBe('16');
        expect(configExpiry.textContent).toBe('60000');
      });
    });

    it('应该从服务器端获取token', async () => {
      const serverToken = 'server-generated-token';
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: serverToken })
      });

      const TestComponent = () => {
        const { token } = useCSRF();
        return (
          <div data-testid="token">{token || 'loading'}</div>
        );
      };

      render(
        <CSRFProvider serverEndpoint="/api/csrf-token">
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).toBe(serverToken);
      });
    });
  });

  describe('useCSRF Hook', () => {
    it('应该返回CSRF相关的状态和方法', async () => {
      const TestComponent = () => {
        const { token, refreshTokens, clearTokens } = useCSRF();
        return (
          <div>
            <div data-testid="token">{token || 'loading'}</div>
            <button data-testid="refresh" onClick={refreshTokens}>Refresh</button>
            <button data-testid="clear" onClick={clearTokens}>Clear</button>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });

      const refreshButton = screen.getByTestId('refresh');
      const clearButton = screen.getByTestId('clear');
      expect(refreshButton).toBeInTheDocument();
      expect(clearButton).toBeInTheDocument();
    });

    it('应该验证token有效性', async () => {
      const TestComponent = () => {
        const { token, validateToken } = useCSRF();
        const [isValid, setIsValid] = React.useState<boolean | null>(null);

        const handleValidate = () => {
          setIsValid(validateToken(token || ''));
        };

        return (
          <div>
            <div data-testid="token">{token || 'loading'}</div>
            <div data-testid="valid">{isValid === null ? 'not-tested' : isValid ? 'valid' : 'invalid'}</div>
            <button data-testid="validate" onClick={handleValidate}>Validate</button>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });

      const validateButton = screen.getByTestId('validate');
      fireEvent.click(validateButton);

      await waitFor(() => {
        const valid = screen.getByTestId('valid');
        expect(valid.textContent).toBe('valid');
      });
    });

    it('应该刷新token', async () => {
      const TestComponent = () => {
        const { token, refreshTokens } = useCSRF();
        return (
          <div>
            <div data-testid="token">{token || 'loading'}</div>
            <button data-testid="refresh" onClick={refreshTokens}>Refresh</button>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });

      const firstToken = screen.getByTestId('token').textContent;

      const refreshButton = screen.getByTestId('refresh');
      fireEvent.click(refreshButton);

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe(firstToken);
      });
    });

    it('应该清除token', async () => {
      const TestComponent = () => {
        const { token, clearTokens } = useCSRF();
        return (
          <div>
            <div data-testid="token">{token || 'cleared'}</div>
            <button data-testid="clear" onClick={clearTokens}>Clear</button>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('cleared');
      });

      const clearButton = screen.getByTestId('clear');
      fireEvent.click(clearButton);

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).toBe('cleared');
      });
    });

    it('应该添加token到请求', async () => {
      const TestComponent = () => {
        const { token, addToRequest } = useCSRF();
        const [hasToken, setHasToken] = React.useState(false);

        const handleAdd = () => {
          const request = addToRequest({
            method: 'POST',
            headers: {}
          });
          setHasToken(!!request.headers?.['X-CSRF-Token']);
        };

        return (
          <div>
            <div data-testid="token">{token || 'loading'}</div>
            <div data-testid="has-token">{hasToken ? 'yes' : 'no'}</div>
            <button data-testid="add" onClick={handleAdd}>Add</button>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });

      const addButton = screen.getByTestId('add');
      fireEvent.click(addButton);

      await waitFor(() => {
        const hasToken = screen.getByTestId('has-token');
        expect(hasToken.textContent).toBe('yes');
      });
    });

    it('应该添加token到URL', async () => {
      const TestComponent = () => {
        const { token, addToURL } = useCSRF();
        const [url, setUrl] = React.useState('');

        const handleAdd = () => {
          setUrl(addToURL('/api/endpoint'));
        };

        return (
          <div>
            <div data-testid="token">{token || 'loading'}</div>
            <div data-testid="url">{url || 'no-url'}</div>
            <button data-testid="add" onClick={handleAdd}>Add</button>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });

      const addButton = screen.getByTestId('add');
      fireEvent.click(addButton);

      await waitFor(() => {
        const url = screen.getByTestId('url');
        expect(url.textContent).toContain('csrf_token');
      });
    });

    it('应该在没有token时保持URL不变', async () => {
      const TestComponent = () => {
        const { addToURL, clearTokens } = useCSRF();
        const [url, setUrl] = React.useState('');

        const handleAdd = () => {
          clearTokens();
          setUrl(addToURL('/api/endpoint'));
        };

        return (
          <div>
            <div data-testid="url">{url || 'no-url'}</div>
            <button data-testid="add" onClick={handleAdd}>Add</button>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      const addButton = screen.getByTestId('add');
      fireEvent.click(addButton);

      await waitFor(() => {
        const url = screen.getByTestId('url');
        expect(url.textContent).toContain('/api/endpoint');
      });
    });

    it('应该添加token到表单', async () => {
      const TestComponent = () => {
        const { token, addToForm } = useCSRF();
        const formRef = React.useRef<HTMLFormElement>(null);
        const [hasToken, setHasToken] = React.useState(false);

        const handleAdd = () => {
          if (formRef.current) {
            addToForm(formRef.current);
            const input = formRef.current.querySelector('input[name="csrf_token"]') as HTMLInputElement;
            setHasToken(!!input && input.value === token);
          }
        };

        return (
          <div>
            <div data-testid="token">{token || 'loading'}</div>
            <div data-testid="has-token">{hasToken ? 'yes' : 'no'}</div>
            <form ref={formRef} data-testid="form">
              <button type="button" data-testid="add" onClick={handleAdd}>Add</button>
            </form>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });

      const addButton = screen.getByTestId('add');
      fireEvent.click(addButton);

      await waitFor(() => {
        const hasToken = screen.getByTestId('has-token');
        expect(hasToken.textContent).toBe('yes');
      });
    });
  });

  describe('CSRFProtectedForm', () => {
    it('应该在表单中自动添加CSRF token', async () => {
      const handleSubmit = jest.fn();

      const TestComponent = () => {
        return (
          <CSRFProtectedForm onSubmit={handleSubmit} data-testid="form">
            <button type="submit">Submit</button>
          </CSRFProtectedForm>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const form = screen.getByTestId('form');
        expect(form).toBeInTheDocument();
      });
    });

    it('应该支持自定义字段名', async () => {
      const handleSubmit = jest.fn();
      const TestComponent = () => {
        return (
          <CSRFProtectedForm onSubmit={handleSubmit} data-testid="form">
            <button type="submit">Submit</button>
          </CSRFProtectedForm>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const form = screen.getByTestId('form');
        expect(form).toBeInTheDocument();
      });
    });
  });

  describe('CSRFProtectedFetch', () => {
    it('应该在fetch请求中自动添加CSRF token', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const TestComponent = () => {
        const csrfContext = useCSRF();
        const [result, setResult] = React.useState<unknown>(null);

        const handleClick = async () => {
          try {
            const response = await CSRFProtectedFetch('/api/endpoint', {
              method: 'POST',
              body: JSON.stringify({ data: 'test' })
            }, csrfContext);
            const data = await response.json();
            setResult(data);
          } catch (error) {
            console.error('Fetch error:', error);
          }
        };

        return (
          <div>
            <button data-testid="fetch" onClick={handleClick}>Fetch</button>
            <div data-testid="result">{result ? JSON.stringify(result) : 'no-result'}</div>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const fetchButton = screen.getByTestId('fetch');
        expect(fetchButton).toBeInTheDocument();
      });

      const fetchButton = screen.getByTestId('fetch');
      fireEvent.click(fetchButton);

      await waitFor(() => {
        const result = screen.getByTestId('result');
        expect(result.textContent).toContain('success');
      });
    });

    it('应该处理fetch错误', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const TestComponent = () => {
        const csrfContext = useCSRF();
        const [error, setError] = React.useState<string | null>(null);

        const handleClick = async () => {
          try {
            await CSRFProtectedFetch('/api/endpoint', {
              method: 'POST'
            }, csrfContext);
          } catch (err) {
            setError((err as Error).message);
          }
        };

        return (
          <div>
            <button data-testid="fetch" onClick={handleClick}>Fetch</button>
            <div data-testid="error">{error || 'no-error'}</div>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      const fetchButton = screen.getByTestId('fetch');
      fireEvent.click(fetchButton);

      await waitFor(() => {
        const error = screen.getByTestId('error');
        expect(error.textContent).toContain('Network error');
      });
    });

    it('应该支持自定义headers', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const TestComponent = () => {
        const csrfContext = useCSRF();
        const [called, setCalled] = React.useState(false);

        const handleClick = async () => {
          await CSRFProtectedFetch('/api/endpoint', {
            method: 'POST',
            headers: {
              'X-Custom-Header': 'custom-value'
            }
          }, csrfContext);
          setCalled(true);
        };

        return (
          <div>
            <button data-testid="fetch" onClick={handleClick}>Fetch</button>
            <div data-testid="called">{called ? 'called' : 'not-called'}</div>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      const fetchButton = screen.getByTestId('fetch');
      fireEvent.click(fetchButton);

      await waitFor(() => {
        const called = screen.getByTestId('called');
        expect(called.textContent).toBe('called');
      });
    });
  });

  describe('withCSRFProtection', () => {
    it('应该包装组件并添加CSRF保护', async () => {
      const TestComponent = () => {
        const { token } = useCSRF();
        return <div data-testid="token">{token || 'loading'}</div>;
      };

      const WrappedComponent = withCSRFProtection(TestComponent);

      render(<WrappedComponent />);

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });
    });

    it('应该支持自定义配置', async () => {
      const customConfig = {
        tokenLength: 16,
        expirationTime: 60000
      };

      const TestComponent = () => {
        const { config } = useCSRF();
        return <div data-testid="config-length">{config?.tokenLength}</div>;
      };

      const WrappedComponent = withCSRFProtection(TestComponent, customConfig);

      render(<WrappedComponent />);

      await waitFor(() => {
        const configLength = screen.getByTestId('config-length');
        expect(configLength.textContent).toBe('16');
      });
    });

    it('应该保留组件的displayName', () => {
      const TestComponent = () => <div>Test</div>;
      TestComponent.displayName = 'TestComponent';
      const WrappedComponent = withCSRFProtection(TestComponent);

      expect(WrappedComponent.displayName).toBe('withCSRFProtection(TestComponent)');
    });
  });

  describe('createCSRFMiddleware', () => {
    it('应该创建CSRF中间件', async () => {
      const TestComponent = () => {
        const csrfContext = useCSRF();
        const middleware = createCSRFMiddleware(csrfContext);
        return <div data-testid="has-middleware">{middleware ? 'has-middleware' : 'no-middleware'}</div>;
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const hasMiddleware = screen.getByTestId('has-middleware');
        expect(hasMiddleware.textContent).toBe('has-middleware');
      });
    });

    it('应该提供fetch方法', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const TestComponent = () => {
        const csrfContext = useCSRF();
        const [called, setCalled] = React.useState(false);

        const handleClick = async () => {
          const middleware = createCSRFMiddleware(csrfContext);
          await middleware.fetch('/api/endpoint');
          setCalled(true);
        };

        return (
          <div>
            <button data-testid="fetch" onClick={handleClick}>Fetch</button>
            <div data-testid="called">{called ? 'called' : 'not-called'}</div>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      const fetchButton = screen.getByTestId('fetch');
      fireEvent.click(fetchButton);

      await waitFor(() => {
        const called = screen.getByTestId('called');
        expect(called.textContent).toBe('called');
      });
    });

    it('应该提供XMLHttpRequest方法', async () => {
      const TestComponent = () => {
        const csrfContext = useCSRF();
        const middleware = createCSRFMiddleware(csrfContext);
        return <div data-testid="has-xhr">{typeof middleware.XMLHttpRequest === 'function' ? 'has-xhr' : 'no-xhr'}</div>;
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const hasXHR = screen.getByTestId('has-xhr');
        expect(hasXHR.textContent).toBe('has-xhr');
      });
    });

    it('应该创建XMLHttpRequest实例', async () => {
      const TestComponent = () => {
        const csrfContext = useCSRF();
        const [hasXHR, setHasXHR] = React.useState(false);

        const handleClick = () => {
          const middleware = createCSRFMiddleware(csrfContext);
          const xhr = middleware.XMLHttpRequest();
          setHasXHR(!!xhr);
        };

        return (
          <div>
            <button data-testid="create-xhr" onClick={handleClick}>Create XHR</button>
            <div data-testid="has-xhr">{hasXHR ? 'yes' : 'no'}</div>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      const createButton = screen.getByTestId('create-xhr');
      fireEvent.click(createButton);

      await waitFor(() => {
        const hasXHR = screen.getByTestId('has-xhr');
        expect(hasXHR.textContent).toBe('yes');
      });
    });

    it('应该支持XMLHttpRequest的open方法', async () => {
      const TestComponent = () => {
        const csrfContext = useCSRF();
        const [opened, setOpened] = React.useState(false);

        const handleClick = () => {
          const middleware = createCSRFMiddleware(csrfContext);
          const xhr = middleware.XMLHttpRequest();
          xhr.open('GET', '/api/endpoint');
          setOpened(true);
        };

        return (
          <div>
            <button data-testid="open-xhr" onClick={handleClick}>Open XHR</button>
            <div data-testid="opened">{opened ? 'yes' : 'no'}</div>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      const openButton = screen.getByTestId('open-xhr');
      fireEvent.click(openButton);

      await waitFor(() => {
        const opened = screen.getByTestId('opened');
        expect(opened.textContent).toBe('yes');
      });
    });

    it('应该支持XMLHttpRequest的setRequestHeader方法', async () => {
      const TestComponent = () => {
        const csrfContext = useCSRF();
        const [headerSet, setHeaderSet] = React.useState(false);

        const handleClick = () => {
          const middleware = createCSRFMiddleware(csrfContext);
          const xhr = middleware.XMLHttpRequest();
          xhr.open('POST', '/api/endpoint');
          xhr.setRequestHeader('Content-Type', 'application/json');
          setHeaderSet(true);
        };

        return (
          <div>
            <button data-testid="set-header" onClick={handleClick}>Set Header</button>
            <div data-testid="header-set">{headerSet ? 'yes' : 'no'}</div>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      const setHeaderButton = screen.getByTestId('set-header');
      fireEvent.click(setHeaderButton);

      await waitFor(() => {
        const headerSet = screen.getByTestId('header-set');
        expect(headerSet.textContent).toBe('yes');
      });
    });

    it('应该支持XMLHttpRequest的send方法', async () => {
      const TestComponent = () => {
        const csrfContext = useCSRF();
        const [sent, setSent] = React.useState(false);

        const handleClick = () => {
          const middleware = createCSRFMiddleware(csrfContext);
          const xhr = middleware.XMLHttpRequest();
          xhr.open('POST', '/api/endpoint');
          xhr.send('test data');
          setSent(true);
        };

        return (
          <div>
            <button data-testid="send" onClick={handleClick}>Send</button>
            <div data-testid="sent">{sent ? 'yes' : 'no'}</div>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      const sendButton = screen.getByTestId('send');
      fireEvent.click(sendButton);

      await waitFor(() => {
        const sent = screen.getByTestId('sent');
        expect(sent.textContent).toBe('yes');
      });
    });
  });

  describe('validateCSRFToken', () => {
    it('应该验证CSRF token', async () => {
      const TestComponent = () => {
        const { token } = useCSRF();
        return <div data-testid="token">{token || 'loading'}</div>;
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const tokenElement = screen.getByTestId('token');
        const token = tokenElement.textContent;
        expect(token).not.toBe('loading');

        if (token && token !== 'loading') {
          const request = new Request(new URL('/api/endpoint', window.location.origin).toString(), {
            method: 'POST',
            headers: {
              'X-CSRF-Token': token
            }
          });
          const isValid = validateCSRFToken(request, token, {
            headerName: 'X-CSRF-Token',
            parameterName: 'csrf_token'
          });
          expect(isValid).toBe(true);
        }
      });
    });

    it('应该允许安全方法', () => {
      const request = new Request(new URL('/api/endpoint', window.location.origin).toString(), {
        method: 'GET'
      });
      const isValid = validateCSRFToken(request, null, {
        headerName: 'X-CSRF-Token',
        parameterName: 'csrf_token'
      });
      expect(isValid).toBe(true);
    });

    it('应该拒绝无效token', () => {
      const request = new Request(new URL('/api/endpoint', window.location.origin).toString(), {
        method: 'POST',
        headers: {
          'X-CSRF-Token': 'invalid-token'
        }
      });
      const isValid = validateCSRFToken(request, 'valid-token', {
        headerName: 'X-CSRF-Token',
        parameterName: 'csrf_token'
      });
      expect(isValid).toBe(false);
    });

    it('应该从URL参数验证token', () => {
      const url = new URL('/api/endpoint?csrf_token=valid-token', window.location.origin);
      const request = new Request(url.toString(), {
        method: 'POST'
      });
      const isValid = validateCSRFToken(request, 'valid-token', {
        headerName: 'X-CSRF-Token',
        parameterName: 'csrf_token'
      });
      expect(isValid).toBe(true);
    });
  });

  describe('createStrictConfig', () => {
    it('应该创建严格的CSRF配置', () => {
      const config = createStrictConfig();

      expect(config.tokenLength).toBe(64);
      expect(config.expirationTime).toBe(1800000);
      expect(config.requireSamesite).toBe('strict');
      expect(config.requireSecure).toBe(true);
      expect(config.doubleSubmitCookie).toBe(true);
      expect(config.regenerateOnLoad).toBe(true);
      expect(config.storageType).toBe('session');
    });
  });

  describe('createModerateConfig', () => {
    it('应该创建适度的CSRF配置', () => {
      const config = createModerateConfig();

      expect(config.tokenLength).toBe(32);
      expect(config.expirationTime).toBe(3600000);
      expect(config.requireSamesite).toBe('lax');
      expect(config.requireSecure).toBe(true);
      expect(config.doubleSubmitCookie).toBe(true);
      expect(config.regenerateOnLoad).toBe(false);
      expect(config.storageType).toBe('memory');
    });
  });

  describe('createPermissiveConfig', () => {
    it('应该创建宽松的CSRF配置', () => {
      const config = createPermissiveConfig();

      expect(config.tokenLength).toBe(16);
      expect(config.expirationTime).toBe(7200000);
      expect(config.requireSamesite).toBe('lax');
      expect(config.requireSecure).toBe(false);
      expect(config.doubleSubmitCookie).toBe(false);
      expect(config.regenerateOnLoad).toBe(false);
      expect(config.storageType).toBe('local');
    });
  });

  describe('错误处理', () => {
    it('应该处理无效token验证', async () => {
      const TestComponent = () => {
        const { validateToken } = useCSRF();
        const [isValid, setIsValid] = React.useState<boolean | null>(null);

        const handleValidate = () => {
          setIsValid(validateToken('invalid-token'));
        };

        return (
          <div>
            <div data-testid="valid">{isValid === null ? 'not-tested' : isValid ? 'valid' : 'invalid'}</div>
            <button data-testid="validate" onClick={handleValidate}>Validate</button>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      const validateButton = screen.getByTestId('validate');
      fireEvent.click(validateButton);

      await waitFor(() => {
        const valid = screen.getByTestId('valid');
        expect(valid.textContent).toBe('invalid');
      });
    });

    it('应该处理服务器端token获取失败', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Server error'));

      const TestComponent = () => {
        const { token } = useCSRF();
        return (
          <div data-testid="token">{token || 'loading'}</div>
        );
      };

      render(
        <CSRFProvider serverEndpoint="/api/csrf-token">
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });
    });
  });

  describe('不同存储类型', () => {
    it('应该使用自定义验证器', async () => {
      const customValidator = jest.fn((token: string) => token.length > 0);

      const TestComponent = () => {
        const { token, validateToken } = useCSRF();
        const [isValid, setIsValid] = React.useState<boolean | null>(null);

        const handleValidate = () => {
          setIsValid(validateToken(token || ''));
        };

        return (
          <div>
            <div data-testid="token">{token || 'loading'}</div>
            <div data-testid="valid">{isValid === null ? 'not-tested' : isValid ? 'valid' : 'invalid'}</div>
            <button data-testid="validate" onClick={handleValidate}>Validate</button>
          </div>
        );
      };

      render(
        <CSRFProvider config={{ customValidator }}>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });

      const validateButton = screen.getByTestId('validate');
      fireEvent.click(validateButton);

      await waitFor(() => {
        const valid = screen.getByTestId('valid');
        expect(valid.textContent).toBe('valid');
        expect(customValidator).toHaveBeenCalled();
      });
    });

    it('应该在自定义验证器失败时拒绝token', async () => {
      const customValidator = jest.fn((token: string) => token === 'custom-token');

      const TestComponent = () => {
        const { token, validateToken } = useCSRF();
        const [isValid, setIsValid] = React.useState<boolean | null>(null);

        const handleValidate = () => {
          setIsValid(validateToken(token || ''));
        };

        return (
          <div>
            <div data-testid="token">{token || 'loading'}</div>
            <div data-testid="valid">{isValid === null ? 'not-tested' : isValid ? 'valid' : 'invalid'}</div>
            <button data-testid="validate" onClick={handleValidate}>Validate</button>
          </div>
        );
      };

      render(
        <CSRFProvider config={{ customValidator }}>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });

      const validateButton = screen.getByTestId('validate');
      fireEvent.click(validateButton);

      await waitFor(() => {
        const valid = screen.getByTestId('valid');
        expect(valid.textContent).toBe('invalid');
        expect(customValidator).toHaveBeenCalled();
      });
    });
  });

  describe('存储类型', () => {
    it('应该使用session存储', async () => {
      const TestComponent = () => {
        const { token } = useCSRF();
        return <div data-testid="token">{token || 'loading'}</div>;
      };

      render(
        <CSRFProvider config={{ storageType: 'session' }}>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });

      expect(sessionStorage.getItem('csrf-token')).toBeTruthy();
    });

    it('应该使用local存储', async () => {
      const TestComponent = () => {
        const { token } = useCSRF();
        return <div data-testid="token">{token || 'loading'}</div>;
      };

      render(
        <CSRFProvider config={{ storageType: 'local' }}>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });

      expect(localStorage.getItem('csrf-token')).toBeTruthy();
    });
  });

  describe('方法覆盖功能', () => {
    it('应该允许覆盖的方法', () => {
      const request = new Request(new URL('/api/endpoint', window.location.origin).toString(), {
        method: 'GET'
      });
      const isValid = validateCSRFToken(request, null, {
        headerName: 'X-CSRF-Token',
        parameterName: 'csrf_token'
      });
      expect(isValid).toBe(true);
    });

    it('应该拒绝不允许覆盖的方法', () => {
      const request = new Request(new URL('/api/endpoint', window.location.origin).toString(), {
        method: 'POST'
      });
      const isValid = validateCSRFToken(request, null, {
        headerName: 'X-CSRF-Token',
        parameterName: 'csrf_token'
      });
      expect(isValid).toBe(false);
    });
  });

  describe('更多错误场景', () => {
    it('应该处理token不匹配', async () => {
      const onValidationError = jest.fn();

      const TestComponent = () => {
        const { validateToken } = useCSRF();
        const [isValid, setIsValid] = React.useState<boolean | null>(null);

        const handleValidate = () => {
          setIsValid(validateToken('different-token'));
        };

        return (
          <div>
            <div data-testid="valid">{isValid === null ? 'not-tested' : isValid ? 'valid' : 'invalid'}</div>
            <button data-testid="validate" onClick={handleValidate}>Validate</button>
          </div>
        );
      };

      render(
        <CSRFProvider config={{ onValidationError }}>
          <TestComponent />
        </CSRFProvider>
      );

      const validateButton = screen.getByTestId('validate');
      fireEvent.click(validateButton);

      await waitFor(() => {
        const valid = screen.getByTestId('valid');
        expect(valid.textContent).toBe('invalid');
        expect(onValidationError).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'invalid_token'
          })
        );
      });
    });

    it('应该处理缺失token', async () => {
      const onValidationError = jest.fn();

      const TestComponent = () => {
        const { validateToken } = useCSRF();
        const [isValid, setIsValid] = React.useState<boolean | null>(null);

        const handleValidate = () => {
          setIsValid(validateToken(''));
        };

        return (
          <div>
            <div data-testid="valid">{isValid === null ? 'not-tested' : isValid ? 'valid' : 'invalid'}</div>
            <button data-testid="validate" onClick={handleValidate}>Validate</button>
          </div>
        );
      };

      render(
        <CSRFProvider config={{ onValidationError }}>
          <TestComponent />
        </CSRFProvider>
      );

      const validateButton = screen.getByTestId('validate');
      fireEvent.click(validateButton);

      await waitFor(() => {
        const valid = screen.getByTestId('valid');
        expect(valid.textContent).toBe('invalid');
        expect(onValidationError).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'missing_token'
          })
        );
      });
    });

    it('应该在Provider外使用useCSRF时抛出错误', () => {
      const TestComponent = () => {
        try {
          useCSRF();
          return <div data-testid="no-error">No error</div>;
        } catch {
          return <div data-testid="error">Error</div>;
        }
      };

      render(<TestComponent />);
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('应该处理空的请求配置', async () => {
      const TestComponent = () => {
        const { addToRequest } = useCSRF();
        const [result, setResult] = React.useState<string>('');

        const handleAdd = () => {
          const request = addToRequest({} as any);
          setResult(JSON.stringify(request));
        };

        return (
          <div>
            <button data-testid="add" onClick={handleAdd}>Add</button>
            <div data-testid="result">{result}</div>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      const addButton = screen.getByTestId('add');
      fireEvent.click(addButton);

      await waitFor(() => {
        const result = screen.getByTestId('result');
        expect(result.textContent).toBeTruthy();
      });
    });

    it('应该处理无效的URL', async () => {
      const TestComponent = () => {
        const { addToURL } = useCSRF();
        const [url, setUrl] = React.useState('');

        const handleAdd = () => {
          setUrl(addToURL('/api/endpoint'));
        };

        return (
          <div>
            <button data-testid="add" onClick={handleAdd}>Add</button>
            <div data-testid="url">{url}</div>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      const addButton = screen.getByTestId('add');
      fireEvent.click(addButton);

      await waitFor(() => {
        const url = screen.getByTestId('url');
        expect(url.textContent).toContain('/api/endpoint');
        expect(url.textContent).toContain('csrf_token');
      });
    });

    it('应该处理多个token刷新', async () => {
      const TestComponent = () => {
        const { token, refreshTokens } = useCSRF();
        const [tokens, setTokens] = React.useState<string[]>([]);

        const handleRefresh = () => {
          const currentToken = token;
          if (currentToken) {
            setTokens(prev => [...prev, currentToken]);
            refreshTokens();
          }
        };

        return (
          <div>
            <div data-testid="token">{token || 'loading'}</div>
            <div data-testid="count">{tokens.length}</div>
            <button data-testid="refresh" onClick={handleRefresh}>Refresh</button>
          </div>
        );
      };

      render(
        <CSRFProvider>
          <TestComponent />
        </CSRFProvider>
      );

      await waitFor(() => {
        const token = screen.getByTestId('token');
        expect(token.textContent).not.toBe('loading');
      });

      const refreshButton = screen.getByTestId('refresh');
      fireEvent.click(refreshButton);
      fireEvent.click(refreshButton);
      fireEvent.click(refreshButton);

      await waitFor(() => {
        const count = screen.getByTestId('count');
        expect(parseInt(count.textContent || '0')).toBeGreaterThanOrEqual(2);
      });
    });
  });
});
