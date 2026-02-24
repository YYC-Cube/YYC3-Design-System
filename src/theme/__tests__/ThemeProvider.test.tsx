import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from '../ThemeProvider';

describe('ThemeProvider 组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染ThemeProvider', () => {
      render(
        <ThemeProvider>
          <div>内容</div>
        </ThemeProvider>
      );
      expect(screen.getByText('内容')).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(
        <ThemeProvider className="custom-theme">
          <div>内容</div>
        </ThemeProvider>
      );
      const provider = screen.getByText('内容').parentElement;
      expect(provider).toHaveClass('custom-theme');
    });
  });

  describe('主题切换', () => {
    it('应该默认使用light主题', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>当前主题: {theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('当前主题: light')).toBeInTheDocument();
    });

    it('应该支持设置初始主题', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>当前主题: {theme}</div>;
      };

      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('当前主题: dark')).toBeInTheDocument();
    });

    it('应该支持切换主题', () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div>当前主题: {theme}</div>
            <button onClick={() => setTheme('dark')}>切换到深色</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('当前主题: light')).toBeInTheDocument();

      act(() => {
        screen.getByText('切换到深色').click();
      });

      expect(screen.getByText('当前主题: dark')).toBeInTheDocument();
    });

    it('应该支持切换到light主题', () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div>当前主题: {theme}</div>
            <button onClick={() => setTheme('light')}>切换到浅色</button>
          </div>
        );
      };

      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('当前主题: dark')).toBeInTheDocument();

      act(() => {
        screen.getByText('切换到浅色').click();
      });

      expect(screen.getByText('当前主题: light')).toBeInTheDocument();
    });
  });

  describe('useTheme Hook', () => {
    it('应该返回当前主题', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>主题: {theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('主题: light')).toBeInTheDocument();
    });

    it('应该返回setTheme函数', () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return (
          <button onClick={() => setTheme('dark')}>切换主题</button>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('切换主题');
    });

    it('应该在ThemeProvider外使用时抛出错误', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>主题: {theme}</div>;
      };

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');
    });
  });

  describe('主题持久化', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('应该从localStorage读取保存的主题', () => {
      localStorage.setItem('theme', 'dark');

      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>主题: {theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('主题: dark')).toBeInTheDocument();
    });

    it('应该将主题保存到localStorage', () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div>主题: {theme}</div>
            <button onClick={() => setTheme('dark')}>切换</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      act(() => {
        screen.getByText('切换').click();
      });

      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });

  describe('主题属性', () => {
    it('应该提供主题颜色', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>主题: {theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('主题: light')).toBeInTheDocument();
    });
  });

  describe('系统主题检测', () => {
    it('应该支持系统主题检测', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>主题: {theme}</div>;
      };

      render(
        <ThemeProvider defaultTheme="system">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText(/主题:/)).toBeInTheDocument();
    });
  });

  describe('嵌套组件', () => {
    it('应该支持嵌套组件使用主题', () => {
      const InnerComponent = () => {
        const { theme } = useTheme();
        return <div>内部主题: {theme}</div>;
      };

      const OuterComponent = () => {
        const { theme } = useTheme();
        return (
          <div>
            <div>外部主题: {theme}</div>
            <InnerComponent />
          </div>
        );
      };

      render(
        <ThemeProvider>
          <OuterComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('外部主题: light')).toBeInTheDocument();
      expect(screen.getByText('内部主题: light')).toBeInTheDocument();
    });
  });

  describe('ref', () => {
    it('应该支持ref转发', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <ThemeProvider ref={ref}>
          <div>内容</div>
        </ThemeProvider>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
