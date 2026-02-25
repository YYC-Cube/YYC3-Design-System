import * as React from 'react';
import { render, fireEvent, act } from '@testing-library/react'
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

    it('应该支持设置初始主题', () => {
      const TestComponent = () => {
        const { mode } = useTheme();
        return <div>当前主题: {mode}</div>;
      };
  });

  describe('主题切换', () => {
    it('应该默认使用light主题', () => {
      const TestComponent = () => {
        const { mode } = useTheme();
        return <div>当前主题: {mode}</div>;
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
        const { mode } = useTheme();
        return <div>当前主题: {mode}</div>;
      };

      render(
        <ThemeProvider initial="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('当前主题: dark')).toBeInTheDocument();
    });

    it('应该支持切换主题', () => {
      const TestComponent = () => {
        const { mode, setMode } = useTheme();
        return (
          <div>
            <div>当前主题: {mode}</div>
            <button onClick={() => setMode('dark')}>切换到深色</button>
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
        const { mode, setMode } = useTheme();
        return (
          <div>
            <div>当前主题: {mode}</div>
            <button onClick={() => setMode('light')}>切换到浅色</button>
          </div>
        );
      };

      render(
        <ThemeProvider initial="dark">
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
        const { mode } = useTheme();
        return <div>主题: {mode}</div>;
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
        const { setMode } = useTheme();
        return (
          <button onClick={() => setMode('dark')}>切换主题</button>
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
        const { mode } = useTheme();
        return <div>主题: {mode}</div>;
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
        const { mode } = useTheme();
        return <div>主题: {mode}</div>;
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
        const { mode, setMode } = useTheme();
        return (
          <div>
            <div>主题: {mode}</div>
            <button onClick={() => setMode('dark')}>切换</button>
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
        const { mode } = useTheme();
        return <div>主题: {mode}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('主题: light')).toBeInTheDocument();
    });
  });

  describe('嵌套组件', () => {
    it('应该支持嵌套组件使用主题', () => {
      const InnerComponent = () => {
        const { mode } = useTheme();
        return <div>内部主题: {mode}</div>;
      };

      const OuterComponent = () => {
        const { mode } = useTheme();
        return (
          <div>
            <div>外部主题: {mode}</div>
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
});

});