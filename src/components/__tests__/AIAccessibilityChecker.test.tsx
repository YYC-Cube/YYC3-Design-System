import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { AIAccessibilityChecker } from '../AIAccessibilityChecker';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('AIAccessibilityChecker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('应该渲染可访问性检查器', () => {
    renderWithTheme(<AIAccessibilityChecker />);
    expect(screen.getByText('AI 可访问性检查器')).toBeInTheDocument();
  });

  it('应该显示自动检查徽章', () => {
    renderWithTheme(<AIAccessibilityChecker autoCheck />);
    expect(screen.getByText('自动检查')).toBeInTheDocument();
  });

  it('应该显示开始检查按钮', () => {
    renderWithTheme(<AIAccessibilityChecker />);
    expect(screen.getByText('开始检查')).toBeInTheDocument();
  });

  it('应该显示 WCAG 级别选择器', () => {
    renderWithTheme(<AIAccessibilityChecker />);
    expect(screen.getByText('WCAG 级别')).toBeInTheDocument();
    expect(screen.getByText('WCAG A (3:1)')).toBeInTheDocument();
    expect(screen.getByText('WCAG AA (4.5:1)')).toBeInTheDocument();
    expect(screen.getByText('WCAG AAA (7:1)')).toBeInTheDocument();
  });

  it('应该显示检查项目复选框', () => {
    renderWithTheme(<AIAccessibilityChecker />);
    expect(screen.getByText('对比度')).toBeInTheDocument();
    expect(screen.getByText('键盘')).toBeInTheDocument();
    expect(screen.getByText('ARIA')).toBeInTheDocument();
    expect(screen.getByText('表单')).toBeInTheDocument();
    expect(screen.getByText('标题')).toBeInTheDocument();
  });

  it('应该允许切换 WCAG 级别', () => {
    renderWithTheme(<AIAccessibilityChecker />);
    
    const select = screen.getByText('WCAG AA (4.5:1)').closest('select');
    if (select) {
      fireEvent.change(select, { target: { value: 'AAA' } });
      expect(select).toHaveValue('AAA');
    }
  });

  it('应该允许启用/禁用检查项目', () => {
    renderWithTheme(<AIAccessibilityChecker />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      const checkboxElement = checkbox as HTMLInputElement;
      if (checkboxElement.checked) {
        fireEvent.click(checkbox);
        expect(checkboxElement.checked).toBe(false);
      }
    });
  });

  it('应该在点击开始检查时执行检查', () => {
    renderWithTheme(<AIAccessibilityChecker />);
    
    const button = screen.getByText('开始检查');
    fireEvent.click(button);
    
    expect(screen.getByText('检查中...')).toBeInTheDocument();
  });

  it('应该显示可访问性评分', async () => {
    renderWithTheme(<AIAccessibilityChecker />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      expect(screen.getByText('可访问性评分')).toBeInTheDocument();
    });
  });

  it('应该显示 WCAG 合规等级', async () => {
    renderWithTheme(<AIAccessibilityChecker />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      const wcagBadge = screen.queryByText(/WCAG/);
      expect(wcagBadge !== null).toBe(true);
    });
  });

  it('应该显示问题摘要', async () => {
    renderWithTheme(<AIAccessibilityChecker />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      const summaryBadges = screen.queryAllByText(/严重:|中等:|轻微:/);
      expect(summaryBadges.length > 0).toBe(true);
    });
  });

  it('应该显示 AI 建议', async () => {
    renderWithTheme(<AIAccessibilityChecker />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      expect(screen.getByText('AI 建议')).toBeInTheDocument();
    });
  });

  it('应该显示检测到的问题列表', async () => {
    renderWithTheme(<AIAccessibilityChecker />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      const issuesHeading = screen.queryByText(/检测到的问题/);
      expect(issuesHeading !== null).toBe(true);
    });
  });

  it('应该允许展开问题详情', async () => {
    renderWithTheme(<AIAccessibilityChecker />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      const issueCard = screen.queryByText(/建议:/);
      if (issueCard) {
        fireEvent.click(issueCard);
      }
    });
  });

  it('应该显示修复按钮当存在可修复的问题', async () => {
    renderWithTheme(<AIAccessibilityChecker />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      const fixButton = screen.queryByText(/修复此问题/);
      const autoFixButton = screen.queryByText(/自动修复/);
      expect(fixButton !== null || autoFixButton !== null).toBe(true);
    });
  });

  it('应该在无问题时显示成功消息', async () => {
    const mockElement = document.createElement('div');
    mockElement.innerHTML = `
      <div style="color: #000000; background-color: #ffffff; font-size: 16px;">
        <h1>标题</h1>
        <p>内容</p>
      </div>
    `;
    document.body.appendChild(mockElement);

    renderWithTheme(<AIAccessibilityChecker targetElement={mockElement} />);
    
    fireEvent.click(screen.getByText('开始检查'));
    
    jest.advanceTimersByTime(100);
    
    await waitFor(() => {
      expect(screen.getByText('完美！')).toBeInTheDocument();
      expect(screen.getByText(/页面完全符合 WCAG/)).toBeInTheDocument();
    });

    document.body.removeChild(mockElement);
  });

  it('应该定期执行自动检查', () => {
    const setIntervalSpy = jest.spyOn(window, 'setInterval');
    
    renderWithTheme(<AIAccessibilityChecker autoCheck />);
    
    expect(setIntervalSpy).toHaveBeenCalled();
    
    setIntervalSpy.mockRestore();
  });

  it('应该在组件卸载时清除定时器', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const setIntervalSpy = jest.spyOn(window, 'setInterval');
    
    const { unmount } = renderWithTheme(<AIAccessibilityChecker autoCheck />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    clearIntervalSpy.mockRestore();
    setIntervalSpy.mockRestore();
  });
});
