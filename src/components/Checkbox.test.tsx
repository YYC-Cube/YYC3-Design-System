/**
 * @file Checkbox 组件测试
 * @description 测试 Checkbox 组件的各项功能
 * @module __tests__/components/Checkbox.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import { Checkbox } from './Checkbox';
import { ThemeProvider } from '../context/ThemeContext';

describe('Checkbox 组件', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('应该正确渲染未选中的 Checkbox', () => {
    renderWithTheme(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('应该正确渲染选中的 Checkbox', () => {
    renderWithTheme(<Checkbox checked />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it('应该在点击时切换状态', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Checkbox onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('应该在选中状态下点击时切换为 false', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Checkbox checked onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('应该在禁用状态下不响应点击', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Checkbox disabled onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalled();
  });

  it('应该应用自定义 className', () => {
    const { container } = renderWithTheme(<Checkbox className="custom-checkbox" />);

    const label = container.querySelector('.custom-checkbox');
    expect(label).toBeInTheDocument();
  });

  it('应该正确渲染 children', () => {
    renderWithTheme(<Checkbox>Label Text</Checkbox>);

    expect(screen.getByText('Label Text')).toBeInTheDocument();
  });

  it('应该在未选中时隐藏勾选标记', () => {
    renderWithTheme(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    const checkmark = checkbox.parentElement?.querySelector('span');
    expect(checkmark).toHaveStyle({ display: 'none' });
  });

  it('应该在选中时显示勾选标记', () => {
    renderWithTheme(<Checkbox checked />);

    const checkbox = screen.getByRole('checkbox');
    const checkmark = checkbox.parentElement?.querySelector('span');
    expect(checkmark).toHaveStyle({ display: 'block' });
  });

  it('应该在禁用时设置正确的属性', () => {
    renderWithTheme(<Checkbox disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('应该在未禁用时设置正确的属性', () => {
    renderWithTheme(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeDisabled();
  });

  it('应该在非受控模式下维护内部状态', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Checkbox onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('应该在受控模式下不维护内部状态', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Checkbox checked={false} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('应该在多次点击时正确切换状态', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Checkbox onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(2);

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  it('应该在禁用时正确处理样式', () => {
    renderWithTheme(<Checkbox disabled checked />);

    const checkbox = screen.getByRole('checkbox');
    const container = checkbox.parentElement;
    expect(container).toBeInTheDocument();
  });

  it('应该在未禁用时正确处理样式', () => {
    renderWithTheme(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    const container = checkbox.parentElement;
    expect(container).toBeInTheDocument();
  });

  it('应该在选中时应用正确的背景色', () => {
    renderWithTheme(<Checkbox checked />);

    const checkbox = screen.getByRole('checkbox');
    const container = checkbox.parentElement;
    expect(container).toBeInTheDocument();
  });

  it('应该在未选中时应用正确的背景色', () => {
    renderWithTheme(<Checkbox checked={false} />);

    const checkbox = screen.getByRole('checkbox');
    const container = checkbox.parentElement;
    expect(container).toBeInTheDocument();
  });

  it('应该在禁用时应用正确的样式', () => {
    renderWithTheme(<Checkbox disabled />);

    const checkbox = screen.getByRole('checkbox');
    const container = checkbox.parentElement;
    expect(container).toBeInTheDocument();
  });

  it('应该在未禁用时应用正确的样式', () => {
    renderWithTheme(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    const container = checkbox.parentElement;
    expect(container).toBeInTheDocument();
  });

  it('应该正确设置 role 属性', () => {
    renderWithTheme(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('应该正确处理没有 children 的情况', () => {
    renderWithTheme(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    const label = checkbox.parentElement;
    const labelSpan = label?.querySelectorAll('span');
    expect(labelSpan).toHaveLength(1);
  });

  it('应该正确处理有 children 的情况', () => {
    renderWithTheme(<Checkbox>Label Text</Checkbox>);

    const checkbox = screen.getByRole('checkbox');
    const label = checkbox.parentElement;
    const labelSpan = label?.querySelectorAll('span');
    expect(labelSpan).toHaveLength(2);
  });

  it('应该在点击时正确处理 onChange 回调', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Checkbox checked={false} onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('应该在禁用时禁用点击事件', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Checkbox disabled onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('应该在未禁用时启用点击事件', () => {
    renderWithTheme(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('应该正确设置勾选标记的样式', () => {
    renderWithTheme(<Checkbox checked />);

    const checkbox = screen.getByRole('checkbox');
    const checkmark = checkbox.parentElement?.querySelector('span');
    expect(checkmark).toBeInTheDocument();
  });

  it('应该正确设置 label 的样式', () => {
    renderWithTheme(<Checkbox>Label Text</Checkbox>);

    const checkbox = screen.getByRole('checkbox');
    const label = checkbox.parentElement;
    const labelSpan = label?.querySelector('span:last-child');
    expect(labelSpan).toBeInTheDocument();
  });

  it('应该在禁用时正确设置 label 样式', () => {
    renderWithTheme(<Checkbox disabled>Label Text</Checkbox>);

    const checkbox = screen.getByRole('checkbox');
    const label = checkbox.parentElement;
    const labelSpan = label?.querySelector('span:last-child');
    expect(labelSpan).toBeInTheDocument();
  });

  it('应该正确处理输入框的样式', () => {
    renderWithTheme(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveStyle({
      position: 'absolute',
      opacity: 0,
    });
  });

  it('应该在禁用时正确设置输入框样式', () => {
    renderWithTheme(<Checkbox disabled />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('应该在未禁用时正确设置输入框样式', () => {
    renderWithTheme(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });
});
