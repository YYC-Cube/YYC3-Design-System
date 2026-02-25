import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { AITokenGeneratorEnhanced } from '../AITokenGeneratorEnhanced';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('AITokenGeneratorEnhanced', () => {
  it('应该渲染增强的 Token 生成器', () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    expect(screen.getByText('AI Token 生成器 (增强版)')).toBeInTheDocument();
  });

  it('应该显示基础颜色输入', () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    expect(screen.getByLabelText('基础颜色')).toBeInTheDocument();
  });

  it('应该显示所有色彩和谐选项', () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    expect(screen.getByText('互补色')).toBeInTheDocument();
    expect(screen.getByText('类似色')).toBeInTheDocument();
    expect(screen.getByText('三色')).toBeInTheDocument();
    expect(screen.getByText('四色')).toBeInTheDocument();
    expect(screen.getByText('单色')).toBeInTheDocument();
    expect(screen.getByText('分裂互补')).toBeInTheDocument();
    expect(screen.getByText('双重互补')).toBeInTheDocument();
  });

  it('应该显示所有色彩空间选项', () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    expect(screen.getByText('HEX')).toBeInTheDocument();
    expect(screen.getByText('HSL')).toBeInTheDocument();
    expect(screen.getByText('LAB')).toBeInTheDocument();
    expect(screen.getByText('RGB')).toBeInTheDocument();
    expect(screen.getByText('OKLCH')).toBeInTheDocument();
  });

  it('应该显示可访问性标准选项', () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    expect(screen.getByText('WCAG AA')).toBeInTheDocument();
    expect(screen.getByText('WCAG AAA')).toBeInTheDocument();
  });

  it('应该允许选择不同的色彩和谐', () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    
    fireEvent.click(screen.getByText('互补色'));
    
    expect(screen.getByText('互补色')).toBeInTheDocument();
  });

  it('应该允许选择不同的色彩空间', () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    
    fireEvent.click(screen.getByText('HSL'));
    
    expect(screen.getByText('HSL')).toBeInTheDocument();
  });

  it('应该允许选择不同的可访问性标准', () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    
    fireEvent.click(screen.getByText('WCAG AAA'));
    
    expect(screen.getByText('WCAG AAA')).toBeInTheDocument();
  });

  it('应该允许启用/禁用包含色相', () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    
    const checkbox = screen.getByLabelText('包含色相') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('应该允许启用/禁用包含色调', () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    
    const checkbox = screen.getByLabelText('包含色调') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('应该允许启用/禁用智能对比度优化', () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    
    const checkbox = screen.getByLabelText('智能对比度优化') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('应该在点击生成令牌时生成令牌', async () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    
    fireEvent.click(screen.getByText('生成令牌'));
    
    await waitFor(() => {
      expect(screen.getByText(/生成的令牌/)).toBeInTheDocument();
    });
  });

  it('应该显示生成的令牌', async () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    
    fireEvent.click(screen.getByText('生成令牌'));
    
    await waitFor(() => {
      expect(screen.getByText('primary')).toBeInTheDocument();
    });
  });

  it('应该显示对比度信息', async () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    
    fireEvent.click(screen.getByText('生成令牌'));
    
    await waitFor(() => {
      expect(screen.getByText(/对比度:/)).toBeInTheDocument();
    });
  });

  it('应该显示 WCAG 合规徽章', async () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    
    fireEvent.click(screen.getByText('生成令牌'));
    
    await waitFor(() => {
      expect(screen.getByText('AA')).toBeInTheDocument();
    });
  });

  it('应该调用 onGenerate 回调', async () => {
    const onGenerate = jest.fn();
    renderWithTheme(<AITokenGeneratorEnhanced onGenerate={onGenerate} />);
    
    fireEvent.click(screen.getByText('生成令牌'));
    
    await waitFor(() => {
      expect(onGenerate).toHaveBeenCalled();
    });
  });

  it('应该显示 AI 推荐', async () => {
    renderWithTheme(<AITokenGeneratorEnhanced />);
    
    fireEvent.click(screen.getByText('生成令牌'));
    
    await waitFor(() => {
      expect(screen.getByText('AI 推荐')).toBeInTheDocument();
    });
  });
});
