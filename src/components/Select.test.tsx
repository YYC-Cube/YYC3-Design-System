/**
 * @file Select 组件测试
 * @description 测试 Select 组件的各项功能
 * @module __tests__/components/Select.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'


import { Select } from './Select';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('Select 组件', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('应该正确渲染默认 Select', () => {
    renderWithTheme(<Select options={mockOptions} />);
    
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('应该显示自定义 placeholder', () => {
    renderWithTheme(<Select options={mockOptions} placeholder="Choose an option" />);
    
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('应该在点击时打开下拉菜单', () => {
    renderWithTheme(<Select options={mockOptions} />);
    
    const trigger = screen.getByText('Select...');
    fireEvent.click(trigger);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('应该在选择选项后关闭下拉菜单', () => {
    renderWithTheme(<Select options={mockOptions} />);
    
    const trigger = screen.getByText('Select...');
    fireEvent.click(trigger);
    
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    
    expect(trigger.textContent).toBe('Option 1');
  });

  it('应该调用 onChange 回调', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Select options={mockOptions} onChange={handleChange} />);
    
    const trigger = screen.getByText('Select...');
    fireEvent.click(trigger);
    
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    
    expect(handleChange).toHaveBeenCalledWith('option1');
  });

  it('应该在禁用状态下不响应点击', () => {
    const handleChange = jest.fn();
    const { container } = renderWithTheme(<Select options={mockOptions} disabled onChange={handleChange} />);
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    const dropdown = container.querySelector('[role="listbox"]');
    expect(dropdown).toHaveStyle({ display: 'none' });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('应该支持受控模式', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Select options={mockOptions} value="option1" onChange={handleChange} />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger.textContent).toContain('Option 1');
  });

  it('应该在受控模式下正确更新值', () => {
    const handleChange = jest.fn();
    renderWithTheme(
      <Select options={mockOptions} value="option1" onChange={handleChange} />
    );
    
    const trigger = screen.getByRole('combobox');
    expect(trigger.textContent).toContain('Option 1');
  });

  it('应该在点击外部时关闭下拉菜单', () => {
    const { container } = renderWithTheme(
      <div>
        <Select options={mockOptions} />
        <div data-testid="outside">Outside</div>
      </div>
    );
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    
    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);
    
    const dropdown = container.querySelector('[role="listbox"]');
    expect(dropdown).toHaveStyle({ display: 'none' });
  });

  it('应该应用自定义 className', () => {
    const { container } = renderWithTheme(
      <Select options={mockOptions} className="custom-class" />
    );
    
    const select = container.querySelector('.custom-class');
    expect(select).toBeInTheDocument();
  });

  it('应该在悬停选项时改变样式', () => {
    renderWithTheme(<Select options={mockOptions} />);
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    const options = screen.getAllByRole('option');
    const option1 = options.find(opt => opt.textContent === 'Option 1');
    if (option1) {
      fireEvent.mouseEnter(option1);
    }
    
    expect(option1).toHaveStyle({
      backgroundColor: 'rgb(224, 106, 112)',
      color: 'rgb(240, 240, 240)',
    });
  });

  it('应该在离开选项时恢复样式', () => {
    renderWithTheme(<Select options={mockOptions} />);
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    const options = screen.getAllByRole('option');
    const option1 = options.find(opt => opt.textContent === 'Option 1');
    if (option1) {
      fireEvent.mouseEnter(option1);
    }
    expect(option1).toHaveStyle({
      backgroundColor: 'rgb(224, 106, 112)',
      color: 'rgb(240, 240, 240)',
    });
    
    if (option1) {
      fireEvent.mouseLeave(option1);
    }
    expect(option1).toHaveStyle({
      color: 'rgb(240, 240, 240)',
    });
  });

  it('应该正确显示箭头图标', () => {
    renderWithTheme(<Select options={mockOptions} />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger.textContent).toContain('▼');
    
    fireEvent.click(trigger);
    expect(trigger.textContent).toContain('▲');
  });

  it('应该在非受控模式下维护内部状态', () => {
    renderWithTheme(<Select options={mockOptions} />);
    
    const trigger = screen.getByText('Select...');
    fireEvent.click(trigger);
    
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    
    expect(trigger.textContent).toBe('Option 1');
    
    fireEvent.click(trigger);
    const option2 = screen.getByText('Option 2');
    fireEvent.click(option2);
    
    expect(trigger.textContent).toBe('Option 2');
  });

  it('应该正确设置 aria 属性', () => {
    renderWithTheme(<Select options={mockOptions} />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('role', 'combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('应该在打开时更新 aria-expanded', () => {
    renderWithTheme(<Select options={mockOptions} />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('应该在禁用时设置正确的 tabIndex', () => {
    renderWithTheme(<Select options={mockOptions} disabled />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('tabIndex', '-1');
  });

  it('应该在未禁用时设置正确的 tabIndex', () => {
    renderWithTheme(<Select options={mockOptions} />);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('tabIndex', '0');
  });

  it('应该为选项设置正确的 aria-selected', () => {
    renderWithTheme(<Select options={mockOptions} value="option1" />);
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    const options = screen.getAllByRole('option');
    const option1 = options.find(opt => opt.textContent === 'Option 1');
    const option2 = options.find(opt => opt.textContent === 'Option 2');
    
    expect(option1).toHaveAttribute('aria-selected', 'true');
    expect(option2).toHaveAttribute('aria-selected', 'false');
  });
});
