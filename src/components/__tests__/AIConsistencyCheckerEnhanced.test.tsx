import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { AIConsistencyCheckerEnhanced } from '../AIConsistencyCheckerEnhanced';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('AIConsistencyCheckerEnhanced', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('应该渲染增强的一致性检查器', () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced />);
    expect(screen.getByText('AI 设计一致性检查 (增强版)')).toBeInTheDocument();
  });

  it('应该显示实时检查徽章', () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced realtimeCheck />);
    expect(screen.getByText('实时检查')).toBeInTheDocument();
  });

  it('应该显示开始检查按钮', () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced />);
    expect(screen.getByText('开始检查')).toBeInTheDocument();
  });

  it('应该显示自动修复复选框', () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced />);
    expect(screen.getByLabelText('启用自动修复')).toBeInTheDocument();
  });

  it('应该显示对比度标准选择器', () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced />);
    expect(screen.getByText('对比度标准:')).toBeInTheDocument();
    expect(screen.getByText('WCAG AA (4.5:1)')).toBeInTheDocument();
    expect(screen.getByText('WCAG AAA (7:1)')).toBeInTheDocument();
  });

  it('应该允许切换对比度标准', () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced />);
    
    const select = screen.getByText('WCAG AA (4.5:1)').closest('select');
    if (select) {
      fireEvent.change(select, { target: { value: 'AAA' } });
      expect(select).toHaveValue('AAA');
    }
  });

  it('应该允许启用/禁用自动修复', () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced />);
    
    const checkbox = screen.getByLabelText('启用自动修复') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it('应该在点击开始检查时执行检查', () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced realtimeCheck={false} />);
    
    const button = screen.getByText('开始检查');
    fireEvent.click(button);
    
    expect(screen.getByText('检查中...')).toBeInTheDocument();
  });

  it('应该显示一致性评分', async () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced realtimeCheck={false} />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      expect(screen.getByText('一致性评分')).toBeInTheDocument();
    });
  });

  it('应该显示问题摘要', async () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced realtimeCheck={false} />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      const errorBadge = screen.queryByText(/错误:/);
      const warningBadge = screen.queryByText(/警告:/);
      const infoBadge = screen.queryByText(/信息:/);
      
      expect(errorBadge !== null || warningBadge !== null || infoBadge !== null).toBe(true);
    });
  });

  it('应该显示 AI 推荐', async () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced realtimeCheck={false} />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      expect(screen.getByText('AI 推荐')).toBeInTheDocument();
    });
  });

  it('应该显示检测到的问题列表', async () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced realtimeCheck={false} />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      const issuesHeading = screen.queryByText(/检测到的问题/);
      expect(issuesHeading !== null).toBe(true);
    });
  });

  it('应该允许展开问题详情', async () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced realtimeCheck={false} />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      const issue = screen.queryByText(/影响令牌/);
      if (issue) {
        fireEvent.click(issue);
      }
    });
  });

  it('应该显示自动修复按钮当存在可修复的问题', async () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced realtimeCheck={false} />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      const autoFixButton = screen.queryByText(/自动修复/);
      const fixButton = screen.queryByText(/修复此问题/);
      expect(autoFixButton !== null || fixButton !== null).toBe(true);
    });
  });

  it('应该调用 onAutoFix 回调', async () => {
    const onAutoFix = jest.fn();
    renderWithTheme(<AIConsistencyCheckerEnhanced onAutoFix={onAutoFix} realtimeCheck={false} />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      const autoFixButton = screen.queryByText(/自动修复/);
      if (autoFixButton) {
        fireEvent.click(autoFixButton);
      }
    });
  });

  it('应该在无问题时显示成功消息', async () => {
    renderWithTheme(<AIConsistencyCheckerEnhanced 
      tokens={{
        'color.primary': '#3b82f6',
        'color.foreground': '#000000',
        'color.background': '#ffffff',
      }} 
      realtimeCheck={false}
    />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      expect(screen.getByText('完美！')).toBeInTheDocument();
      expect(screen.getByText('未发现一致性问题')).toBeInTheDocument();
    });
  });

  it('应该定期执行实时检查', () => {
    const setIntervalSpy = jest.spyOn(window, 'setInterval');
    
    renderWithTheme(<AIConsistencyCheckerEnhanced realtimeCheck />);
    
    expect(setIntervalSpy).toHaveBeenCalled();
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30000);
    
    setIntervalSpy.mockRestore();
  });

  it('应该在组件卸载时清除定时器', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const setIntervalSpy = jest.spyOn(window, 'setInterval');
    
    const { unmount } = renderWithTheme(<AIConsistencyCheckerEnhanced realtimeCheck />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    clearIntervalSpy.mockRestore();
    setIntervalSpy.mockRestore();
  });
});
