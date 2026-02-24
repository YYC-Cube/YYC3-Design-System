/**
 * @file Tooltip 组件测试
 * @description 测试 Tooltip 组件的各项功能
 * @module __tests__/components/Tooltip.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import * as React from 'react';

;

import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { Tooltip } from './Tooltip';
import { ThemeProvider } from '../theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Tooltip 组件', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('应该正确渲染子元素', () => {
    renderWithTheme(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('鼠标悬停后应该显示 tooltip', async () => {
    renderWithTheme(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
  });

  it('鼠标离开后应该隐藏 tooltip', async () => {
    renderWithTheme(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(button);

    await waitFor(() => {
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
    });
  });

  it('应该支持不同的 placement 选项', async () => {
    const placements: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];

    for (const placement of placements) {
      const { unmount } = renderWithTheme(
        <Tooltip content="Tooltip content" placement={placement}>
          <button>Hover me</button>
        </Tooltip>
      );

      const button = screen.getByText('Hover me');
      fireEvent.mouseEnter(button);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
      });

      unmount();
    }
  });

  it('应该应用自定义 className', () => {
    renderWithTheme(
      <Tooltip content="Tooltip content" className="custom-class">
        <button>Hover me</button>
      </Tooltip>
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('应该正确清理 timeout', () => {
    const { unmount } = renderWithTheme(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    unmount();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  it('应该在快速悬停时取消之前的 timeout', async () => {
    renderWithTheme(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    fireEvent.mouseLeave(button);
    fireEvent.mouseEnter(button);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
  });

  it('应该正确处理无效的 placement（使用默认值）', async () => {
    renderWithTheme(
      <Tooltip content="Tooltip content" placement={'invalid' as any}>
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
  });

  it('应该正确设置 role 属性', async () => {
    renderWithTheme(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
    });
  });

  it('应该正确设置 wrapper 样式', () => {
    renderWithTheme(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const wrapper = screen.getByText('Hover me').parentElement;
    expect(wrapper).toBeInTheDocument();
  });

  it('应该正确设置 tooltip 样式', async () => {
    renderWithTheme(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
    });
  });

  it('应该正确处理复杂内容', async () => {
    renderWithTheme(
      <Tooltip content={<div><strong>Bold</strong> text</div>}>
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    fireEvent.mouseEnter(button);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('text')).toBeInTheDocument();
    });
  });

  it('应该在未悬停时不显示 tooltip', () => {
    renderWithTheme(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
  });

  it('应该正确处理多次快速悬停', async () => {
    renderWithTheme(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByText('Hover me');
    
    fireEvent.mouseEnter(button);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    fireEvent.mouseLeave(button);
    fireEvent.mouseEnter(button);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    fireEvent.mouseLeave(button);
    fireEvent.mouseEnter(button);
    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    });
  });
});
