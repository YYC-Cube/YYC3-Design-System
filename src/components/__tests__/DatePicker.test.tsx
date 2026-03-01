import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { screen as screenDom } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { DatePicker } from '../DatePicker';
import { ThemeProvider } from '../../context/ThemeContext';

describe('DatePicker', () => {
  let mockOnChange: jest.Mock;

  beforeEach(() => {
    mockOnChange = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderDatePicker = (props = {}) => {
    return render(
      <ThemeProvider>
        <DatePicker {...props} onChange={mockOnChange} />
      </ThemeProvider>
    );
  };

  it('应该渲染日期选择器', () => {
    renderDatePicker();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('应该显示占位符', () => {
    renderDatePicker({ placeholder: '选择日期' });
    expect(screen.getByPlaceholderText('选择日期')).toBeInTheDocument();
  });

  it('应该在输入框点击时打开日历', async () => {
    renderDatePicker();
    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });
  });

  it('应该在点击外部时关闭日历', async () => {
    renderDatePicker();
    const input = screen.getByRole('textbox');

    fireEvent.click(input);
    await waitFor(() => {
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Sun')).not.toBeInTheDocument();
    });
  });

  it('应该在点击日期时调用 onChange', async () => {
    renderDatePicker();
    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('15'));

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date));
  });

  it('应该禁用日期选择器', () => {
    renderDatePicker({ disabled: true });
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('应该支持自定义格式', () => {
    const testDate = new Date(2026, 1, 15);
    renderDatePicker({ value: testDate, format: 'DD/MM/YYYY' });

    expect(screen.getByRole('textbox')).toHaveValue('15/02/2026');
  });

  it('应该支持最小日期限制', () => {
    const minDate = new Date(2026, 1, 10);
    renderDatePicker({ minDate });

    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    fireEvent.change(input, { target: { value: '2026-01-05' } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('应该支持最大日期限制', () => {
    const maxDate = new Date(2026, 0, 20, 12, 0, 0);
    renderDatePicker({ maxDate });

    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    fireEvent.change(input, { target: { value: '2026-01-25' } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('应该支持自定义禁用日期', async () => {
    const disabledDates = (date: Date) => date.getDate() === 13;
    renderDatePicker({ disabledDates });

    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: '2026-02-13' } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('应该显示当前月份', async () => {
    renderDatePicker();
    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    const today = new Date();
    const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    await waitFor(() => {
      expect(screen.getByText(monthYear)).toBeInTheDocument();
    });
  });

  it('应该支持月份导航', async () => {
    renderDatePicker();
    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });

    screenDom.getByText(/February 2026/);
    const prevButton = screen.getByLabelText('Previous month');
    const nextButton = screen.getByLabelText('Next month');

    fireEvent.click(prevButton);
    expect(screen.getByText(/January 2026/)).toBeInTheDocument();

    fireEvent.click(nextButton);
    expect(screen.getByText(/February 2026/)).toBeInTheDocument();
  });

  it('应该显示今天按钮', async () => {
    renderDatePicker();
    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  it('应该在点击今天按钮时选择今天', async () => {
    renderDatePicker();
    const input = screen.getByRole('textbox');
    fireEvent.click(input);

    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });

    const todayButton = screen.getByText('Today');
    fireEvent.click(todayButton);

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date));
  });
});
