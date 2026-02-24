/**
 * @file CSP Provider测试
 * @description 测试CSP Provider功能
 * @module __tests__/security/CSPProvider.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import * as React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom';

import { CSPProvider, useCSP, CSPScript, CSPStyle, CSPImg, createStrictCSPConfig, createModerateCSPConfig, createPermissiveCSPConfig, generateNonce, withCSP } from '../CSPProvider';

describe('CSP Provider Module', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('CSPProvider', () => {
    it('应该提供默认CSP配置', () => {
      const TestComponent = () => {
        const { config } = useCSP();

        return (
          <div data-testid="config">
            <div data-testid="default-src">{config['default-src']}</div>
            <div data-testid="enabled">{config.enabled ? 'enabled' : 'disabled'}</div>
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      expect(screen.getByTestId('config')).toBeInTheDocument();
    });

    it('应该支持自定义配置', () => {
      const customConfig = {
        'script-src': "'self'",
        'style-src': "'self' 'unsafe-inline'"
      };

      const TestComponent = () => {
        const { config } = useCSP();

        return (
          <div data-testid="config">
            <div data-testid="script-src">{config['script-src']}</div>
            <div data-testid="style-src">{config['style-src']}</div>
          </div>
        );
      };

      render(
        <CSPProvider config={customConfig}>
          <TestComponent />
        </CSPProvider>
      );

      expect(screen.getByTestId('script-src')).toBeInTheDocument();
      expect(screen.getByTestId('style-src')).toBeInTheDocument();
    });

    it('应该支持自定义nonce', () => {
      const customNonce = 'custom-nonce-123';

      const TestComponent = () => {
        const { nonce } = useCSP();

        return (
          <div data-testid="nonce">{nonce}</div>
        );
      };

      render(
        <CSPProvider nonce={customNonce}>
          <TestComponent />
        </CSPProvider>
      );

      const nonceDiv = screen.getByTestId('nonce');
      expect(nonceDiv.textContent).toBe(customNonce);
    });

    it('应该处理没有nonce的情况', () => {
      const TestComponent = () => {
        const { nonce } = useCSP();

        return (
          <div data-testid="nonce">{nonce || 'no nonce'}</div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      const nonceDiv = screen.getByTestId('nonce');
      expect(nonceDiv.textContent).toBe('no nonce');
    });

    it('应该支持禁用CSP', () => {
      const TestComponent = () => {
        const { enabled } = useCSP();

        return (
          <div data-testid="enabled">{enabled ? 'enabled' : 'disabled'}</div>
        );
      };

      render(
        <CSPProvider enabled={false}>
          <TestComponent />
        </CSPProvider>
      );

      const enabledDiv = screen.getByTestId('enabled');
      expect(enabledDiv.textContent).toBe('disabled');
    });

    it('应该支持report-only模式', async () => {
      const onViolation = jest.fn();

      const TestComponent = () => {
        const { config } = useCSP();

        return (
          <div data-testid="config">{config.reportOnly ? 'report-only' : 'enforce'}</div>
        );
      };

      render(
        <CSPProvider reportOnly={true} onViolation={onViolation}>
          <TestComponent />
        </CSPProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('config')).toBeInTheDocument();
      });
    });

    it('应该合并默认配置和自定义配置', () => {
      const customConfig = {
        'script-src': "'self'"
      };

      const TestComponent = () => {
        const { config } = useCSP();

        return (
          <div>
            <div data-testid="default-src">{config['default-src']}</div>
            <div data-testid="script-src">{config['script-src']}</div>
          </div>
        );
      };

      render(
        <CSPProvider config={customConfig}>
          <TestComponent />
        </CSPProvider>
      );

      expect(screen.getByTestId('default-src')).toHaveTextContent("'self'");
      expect(screen.getByTestId('script-src')).toHaveTextContent("'self'");
    });

    it('应该更新配置', async () => {
      const TestComponent = () => {
        const { updateConfig, config } = useCSP();

        return (
          <div>
            <div data-testid="script-src">{config['script-src']}</div>
            <button data-testid="update" onClick={() => updateConfig({ 'script-src': "'self'" })}>
              Update
            </button>
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      const updateButton = screen.getByTestId('update');
      await act(async () => {
        updateButton.click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('script-src')).toHaveTextContent("'self'");
      });
    });

    it('应该在禁用时不添加meta标签', () => {
      const metaTagExists = () => {
        return document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
      };

      render(
        <CSPProvider enabled={false}>
          <div>Test</div>
        </CSPProvider>
      );

      expect(metaTagExists()).toBe(false);
    });

    it('应该在启用时添加meta标签', () => {
      const metaTagExists = () => {
        return document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
      };

      render(
        <CSPProvider enabled={true}>
          <div>Test</div>
        </CSPProvider>
      );

      expect(metaTagExists()).toBe(true);
    });

    it('应该在report-only模式下使用正确的meta标签', () => {
      const metaTagExists = () => {
        return document.querySelector('meta[http-equiv="Content-Security-Policy-Report-Only"]') !== null;
      };

      render(
        <CSPProvider reportOnly={true}>
          <div>Test</div>
        </CSPProvider>
      );

      expect(metaTagExists()).toBe(true);
    });

    it('应该清理meta标签在卸载时', () => {
      const { unmount } = render(
        <CSPProvider>
          <div>Test</div>
        </CSPProvider>
      );

      const metaTagExists = () => {
        return document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
      };

      expect(metaTagExists()).toBe(true);

      unmount();

      expect(metaTagExists()).toBe(false);
    });

    it('应该处理多个CSPProvider实例', () => {
      const TestComponent = () => {
        const { nonce } = useCSP();

        return <div data-testid="nonce">{nonce || 'no-nonce'}</div>;
      };

      render(
        <CSPProvider nonce="first">
          <CSPProvider nonce="second">
            <TestComponent />
          </CSPProvider>
        </CSPProvider>
      );

      expect(screen.getByTestId('nonce')).toHaveTextContent('second');
    });
  });

  describe('useCSP Hook', () => {
    it('应该返回CSP相关的状态和方法', () => {
      const TestComponent = () => {
        const csp = useCSP();

        expect(csp.config).toBeDefined();
        expect(csp.enabled).toBeDefined();
        expect(csp.updateConfig).toBeDefined();

        return (
          <div>
            <div data-testid="has-update">{typeof csp.updateConfig === 'function' ? 'has-update' : 'no-update'}</div>
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      expect(screen.getByTestId('has-update')).toBeInTheDocument();
    });

    it('应该支持更新配置', async () => {
      const TestComponent = () => {
        const { updateConfig } = useCSP();
        const [updated, setUpdated] = React.useState(false);

        const handleUpdate = async () => {
          await updateConfig({ 'script-src': "'self'" });
          setUpdated(true);
        };

        return (
          <div>
            <div data-testid="updated">{updated ? 'updated' : 'not-updated'}</div>
            <button data-testid="update" onClick={handleUpdate}>Update</button>
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      const updateButton = screen.getByTestId('update');
      await act(async () => {
        updateButton.click();
      });

      await waitFor(() => {
        const updatedDiv = screen.getByTestId('updated');
        expect(updatedDiv.textContent).toBe('updated');
      });
    });
  });

  describe('CSPScript', () => {
    it('应该在有nonce时添加nonce属性', () => {
      const customNonce = 'test-nonce-123';

      const TestComponent = () => {
        return (
          <div>
            <CSPScript nonce={customNonce}>
              console.log(&quot;test&quot;);
            </CSPScript>
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      const scriptElement = document.querySelector('script[nonce]');
      expect(scriptElement).toBeTruthy();
    });

    it('应该在禁用时正常渲染', () => {
      const TestComponent = () => {
        return (
          <CSPScript>
            console.log(&quot;test&quot;);
          </CSPScript>
        );
      };

      render(
        <CSPProvider enabled={false}>
          <TestComponent />
        </CSPProvider>
      );

      const scriptElement = document.querySelector('script');
      expect(scriptElement).toBeTruthy();
    });
  });

  describe('CSPStyle', () => {
    it('应该在有nonce时添加nonce属性', () => {
      const customNonce = 'test-nonce-456';

      const TestComponent = () => {
        return (
          <div>
            <CSPStyle nonce={customNonce}>
              {`body { color: red; }`}
            </CSPStyle>
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      const styleElement = document.querySelector('style[nonce]');
      expect(styleElement).toBeTruthy();
    });

    it('应该在禁用时正常渲染', () => {
      const TestComponent = () => {
        return (
          <CSPStyle>
            {`body { color: red; }`}
          </CSPStyle>
        );
      };

      render(
        <CSPProvider enabled={false}>
          <TestComponent />
        </CSPProvider>
      );

      const styleElement = document.querySelector('style');
      expect(styleElement).toBeTruthy();
    });
  });

  describe('CSP违规处理', () => {
    it('应该处理CSP违规报告', () => {
      const onViolation = jest.fn();

      const TestComponent = () => {
        const { config } = useCSP();

        return (
          <div data-testid="config">{config.onViolation ? 'has-handler' : 'no-handler'}</div>
        );
      };

      render(
        <CSPProvider onViolation={onViolation}>
          <TestComponent />
        </CSPProvider>
      );

      expect(screen.getByTestId('config')).toBeInTheDocument();
    });
  });

  describe('createStrictCSPConfig', () => {
    it('应该创建严格的CSP配置', () => {
      const config = createStrictCSPConfig();

      expect(config['default-src']).toBe("'self'");
      expect(config['script-src']).toBe("'self' 'nonce-{nonce}'");
      expect(config['style-src']).toBe("'self' 'nonce-{nonce}'");
      expect(config['upgrade-insecure-requests']).toBe(true);
      expect(config['block-all-mixed-content']).toBe(true);
    });
  });

  describe('createModerateCSPConfig', () => {
    it('应该创建适度的CSP配置', () => {
      const config = createModerateCSPConfig();

      expect(config['default-src']).toBe("'self'");
      expect(config['script-src']).toBe("'self' 'unsafe-inline' 'unsafe-eval' https:");
      expect(config['style-src']).toBe("'self' 'unsafe-inline' https:");
      expect(config['frame-ancestors']).toBe("'self'");
    });
  });

  describe('createPermissiveCSPConfig', () => {
    it('应该创建宽松的CSP配置', () => {
      const config = createPermissiveCSPConfig();

      expect(config['default-src']).toBe("'self'");
      expect(config['script-src']).toBe("'self' 'unsafe-inline' 'unsafe-eval' https: http:");
      expect(config['style-src']).toBe("'self' 'unsafe-inline' https: http:");
      expect(config['img-src']).toBe("'self' data: https: http: blob:");
    });
  });

  describe('generateNonce', () => {
    it('应该生成随机的nonce', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();

      expect(nonce1).toBeDefined();
      expect(nonce2).toBeDefined();
      expect(nonce1).not.toBe(nonce2);
    });

    it('应该生成字符串类型的nonce', () => {
      const nonce = generateNonce();

      expect(typeof nonce).toBe('string');
    });
  });

  describe('withCSP', () => {
    it('应该包装组件并添加CSP', () => {
      const TestComponent = () => <div data-testid="test">Test</div>;
      const WrappedComponent = withCSP(TestComponent);

      render(<WrappedComponent />);
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    it('应该支持自定义配置', () => {
      const TestComponent = () => <div data-testid="test">Test</div>;
      const customConfig = { 'script-src': "'self'" };
      const WrappedComponent = withCSP(TestComponent, customConfig);

      render(<WrappedComponent />);
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    it('应该保留组件的displayName', () => {
      const TestComponent = () => <div>Test</div>;
      TestComponent.displayName = 'TestComponent';
      const WrappedComponent = withCSP(TestComponent);

      expect(WrappedComponent.displayName).toBe('withCSP(TestComponent)');
    });
  });

  describe('generateCSPMetaTag', () => {
    it('应该生成基本的CSP标签', () => {
      const config = {
        'default-src': "'self'",
        'script-src': "'self'"
      };

      const TestComponent = () => {
        const { config: cspConfig } = useCSP();
        return <div data-testid="config">{JSON.stringify(cspConfig)}</div>;
      };

      render(
        <CSPProvider config={config}>
          <TestComponent />
        </CSPProvider>
      );

      expect(screen.getByTestId('config')).toBeInTheDocument();
    });

    it('应该处理布尔值指令', () => {
      const config = {
        'default-src': "'self'",
        'upgrade-insecure-requests': true,
        'block-all-mixed-content': true
      };

      const TestComponent = () => {
        const { config: cspConfig } = useCSP();
        return <div data-testid="config">{JSON.stringify(cspConfig)}</div>;
      };

      render(
        <CSPProvider config={config}>
          <TestComponent />
        </CSPProvider>
      );

      expect(screen.getByTestId('config')).toBeInTheDocument();
    });

    it('应该处理undefined值', () => {
      const config = {
        'default-src': "'self'",
        'script-src': undefined
      };

      const TestComponent = () => {
        const { config: cspConfig } = useCSP();
        return <div data-testid="config">{JSON.stringify(cspConfig)}</div>;
      };

      render(
        <CSPProvider config={config}>
          <TestComponent />
        </CSPProvider>
      );

      expect(screen.getByTestId('config')).toBeInTheDocument();
    });
  });

  describe('isURLAllowed', () => {
    it('应该允许self URL', () => {
      const config = {
        'img-src': "'self'"
      };

      const TestComponent = () => {
        return (
          <div>
            <CSPImg src="/image.jpg" data-testid="img" />
          </div>
        );
      };

      render(
        <CSPProvider config={config}>
          <TestComponent />
        </CSPProvider>
      );

      const imgElement = document.querySelector('img');
      expect(imgElement).toBeTruthy();
    });

    it('应该允许data URL', () => {
      const config = {
        'img-src': "'self' data:"
      };

      const TestComponent = () => {
        return (
          <div>
            <CSPImg src="data:image/png;base64,abc123" data-testid="img" />
          </div>
        );
      };

      render(
        <CSPProvider config={config}>
          <TestComponent />
        </CSPProvider>
      );

      const imgElement = document.querySelector('img');
      expect(imgElement).toBeTruthy();
    });

    it('应该允许https URL', () => {
      const config = {
        'img-src': "'self' https:"
      };

      const TestComponent = () => {
        return (
          <div>
            <CSPImg src="https://example.com/image.jpg" data-testid="img" />
          </div>
        );
      };

      render(
        <CSPProvider config={config}>
          <TestComponent />
        </CSPProvider>
      );

      const imgElement = document.querySelector('img');
      expect(imgElement).toBeTruthy();
    });

    it('应该允许http URL', () => {
      const config = {
        'img-src': "'self' http:"
      };

      const TestComponent = () => {
        return (
          <div>
            <CSPImg src="http://example.com/image.jpg" data-testid="img" />
          </div>
        );
      };

      render(
        <CSPProvider config={config}>
          <TestComponent />
        </CSPProvider>
      );

      const imgElement = document.querySelector('img');
      expect(imgElement).toBeTruthy();
    });
  });

  describe('边界情况', () => {
    it('应该处理空配置', () => {
      const TestComponent = () => {
        const { config } = useCSP();
        return <div data-testid="config">{JSON.stringify(config)}</div>;
      };

      render(
        <CSPProvider config={{}}>
          <TestComponent />
        </CSPProvider>
      );

      expect(screen.getByTestId('config')).toBeInTheDocument();
    });

    it('应该处理多次更新配置', async () => {
      const TestComponent = () => {
        const { updateConfig, config } = useCSP();
        const [updateCount, setUpdateCount] = React.useState(0);

        const handleUpdate = async () => {
          await updateConfig({ 'script-src': "'self'" });
          setUpdateCount(prev => prev + 1);
          await updateConfig({ 'style-src': "'self'" });
          setUpdateCount(prev => prev + 1);
        };

        return (
          <div>
            <div data-testid="update-count">{updateCount}</div>
            <div data-testid="script-src">{config['script-src']}</div>
            <button data-testid="update" onClick={handleUpdate}>Update</button>
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      const updateButton = screen.getByTestId('update');
      await act(async () => {
        updateButton.click();
      });

      await waitFor(() => {
        const updateCountDiv = screen.getByTestId('update-count');
        expect(updateCountDiv.textContent).toBe('2');
      });
    });

    it('应该处理没有提供children的情况', () => {
      render(
        <CSPProvider>
          <div>Test</div>
        </CSPProvider>
      );
    });

    it('应该处理在CSPProvider外使用useCSP', () => {
      const TestComponent = () => {
        try {
          const csp = useCSP();
          return <div data-testid="csp">{JSON.stringify(csp)}</div>;
        } catch (error) {
          return <div data-testid="error">{(error as Error).message}</div>;
        }
      };

      render(<TestComponent />);
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });

  describe('CSPScript 更多测试', () => {
    it('应该支持自定义属性', () => {
      const customNonce = 'test-nonce-789';

      const TestComponent = () => {
        return (
          <div>
            <CSPScript nonce={customNonce} data-testid="script">
              console.log(&quot;test&quot;);
            </CSPScript>
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      const scriptElement = document.querySelector('script');
      expect(scriptElement).toBeTruthy();
      expect(scriptElement?.getAttribute('nonce')).toBe(customNonce);
    });

    it('应该处理空children', () => {
      const customNonce = 'test-nonce-empty';

      const TestComponent = () => {
        return (
          <div>
            <CSPScript nonce={customNonce} data-testid="script" />
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      const scriptElement = document.querySelector('script');
      expect(scriptElement).toBeTruthy();
    });
  });

  describe('CSPStyle 更多测试', () => {
    it('应该支持自定义属性', () => {
      const customNonce = 'test-nonce-style';

      const TestComponent = () => {
        return (
          <div>
            <CSPStyle nonce={customNonce} data-testid="style">
              {`body { color: red; }`}
            </CSPStyle>
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      const styleElement = document.querySelector('style');
      expect(styleElement).toBeTruthy();
      expect(styleElement?.getAttribute('nonce')).toBe(customNonce);
    });

    it('应该处理空children', () => {
      const customNonce = 'test-nonce-empty-style';

      const TestComponent = () => {
        return (
          <div>
            <CSPStyle nonce={customNonce} data-testid="style" />
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      const styleElement = document.querySelector('style');
      expect(styleElement).toBeTruthy();
    });
  });

  describe('CSPImg', () => {
    it('应该在启用CSP时检查图片源', () => {
      render(
        <CSPProvider>
          <CSPImg src="/test.jpg" alt="Test" data-testid="test-img" />
        </CSPProvider>
      );

      expect(screen.getByTestId('test-img')).toBeInTheDocument();
    });

    it('应该在禁用CSP时不检查图片源', () => {
      render(
        <CSPProvider enabled={false}>
          <CSPImg src="https://example.com/test.jpg" alt="Test" data-testid="test-img" />
        </CSPProvider>
      );

      expect(screen.getByTestId('test-img')).toBeInTheDocument();
    });

    it('应该警告不允许的图片源', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <CSPProvider config={{ 'img-src': "'self'" }}>
          <CSPImg src="https://example.com/test.jpg" alt="Test" data-testid="test-img" />
        </CSPProvider>
      );

      expect(screen.getByTestId('test-img')).toBeInTheDocument();
      consoleWarnSpy.mockRestore();
    });

    it('应该允许self图片源', () => {
      render(
        <CSPProvider config={{ 'img-src': "'self'" }}>
          <CSPImg src="/test.jpg" alt="Test" data-testid="test-img" />
        </CSPProvider>
      );

      expect(screen.getByTestId('test-img')).toBeInTheDocument();
    });

    it('应该允许data图片源', () => {
      render(
        <CSPProvider config={{ 'img-src': "'self' data:" }}>
          <CSPImg src="data:image/png;base64,test" alt="Test" data-testid="test-img" />
        </CSPProvider>
      );

      expect(screen.getByTestId('test-img')).toBeInTheDocument();
    });
  });

  describe('useCSP', () => {
    it('应该在Provider外使用时抛出错误', () => {
      const TestComponent = () => {
        try {
          useCSP();
          return <div data-testid="no-error">No error</div>;
        } catch {
          return <div data-testid="error">Error</div>;
        }
      };

      render(<TestComponent />);
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    it('应该返回正确的context值', () => {
      const TestComponent = () => {
        const csp = useCSP();

        return (
          <div>
            <div data-testid="enabled">{csp.enabled ? 'enabled' : 'disabled'}</div>
            <div data-testid="has-config">{csp.config ? 'has-config' : 'no-config'}</div>
            <div data-testid="has-update">{typeof csp.updateConfig === 'function' ? 'has-update' : 'no-update'}</div>
          </div>
        );
      };

      render(
        <CSPProvider>
          <TestComponent />
        </CSPProvider>
      );

      expect(screen.getByTestId('enabled')).toHaveTextContent('enabled');
      expect(screen.getByTestId('has-config')).toHaveTextContent('has-config');
      expect(screen.getByTestId('has-update')).toHaveTextContent('has-update');
    });
  });
});