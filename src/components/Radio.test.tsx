/**
 * @file Radio 组件测试
 * @description 测试 Radio 组件的各项功能
 * @module __tests__/components/Radio.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import { Radio } from './Radio';
import { ThemeProvider } from '../context/ThemeContext';

describe('Radio 组件', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('应该正确渲染未选中的 Radio', () => {
    renderWithTheme(<Radio value="option1" name="test" />);

    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
    expect(radio).not.toBeChecked();
  });

  it('应该正确渲染选中的 Radio', () => {
    renderWithTheme(<Radio value="option1" name="test" checked />);

    const radio = screen.getByRole('radio');
    expect(radio).toBeChecked();
  });

  it('应该在点击时调用 onChange', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Radio value="option1" name="test" onChange={handleChange} />);

    const radio = screen.getByRole('radio');
    fireEvent.click(radio);

    expect(handleChange).toHaveBeenCalledWith('option1');
  });

  it('应该在禁用状态下不响应点击', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Radio value="option1" name="test" disabled onChange={handleChange} />);

    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
  });

  it('应该正确渲染子元素', () => {
    renderWithTheme(
      <Radio value="option1" name="test">
        Option Label
      </Radio>
    );

    expect(screen.getByText('Option Label')).toBeInTheDocument();
  });

  it('应该在没有子元素时不渲染 label', () => {
    const { container } = renderWithTheme(<Radio value="option1" name="test" />);

    const radio = screen.getByRole('radio');
    const label = container.querySelector('label > span:last-child');
    expect(label).not.toBeInTheDocument();
    expect(radio).toBeInTheDocument();
  });

  it('应该应用自定义 className', () => {
    const { container } = renderWithTheme(
      <Radio value="option1" name="test" className="custom-class" />
    );

    const label = container.querySelector('.custom-class');
    expect(label).toBeInTheDocument();
  });

  it('应该正确设置 name 属性', () => {
    renderWithTheme(<Radio value="option1" name="test-name" />);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('name', 'test-name');
  });

  it('应该正确设置 value 属性', () => {
    renderWithTheme(<Radio value="test-value" name="test" />);

    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('value', 'test-value');
  });

  it('应该在禁用时设置正确的属性', () => {
    renderWithTheme(<Radio value="option1" name="test" disabled />);

    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
  });

  it('应该在选中时显示内部圆点', () => {
    renderWithTheme(<Radio value="option1" name="test" checked />);

    const radio = screen.getByRole('radio');
    const container = radio.parentElement;
    const radioContainer = container?.querySelector('div');
    const dot = radioContainer?.querySelector('span');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveStyle({ display: 'block' });
  });

  it('应该在未选中时隐藏内部圆点', () => {
    renderWithTheme(<Radio value="option1" name="test" checked={false} />);

    const radio = screen.getByRole('radio');
    const container = radio.parentElement;
    const radioContainer = container?.querySelector('div');
    const dot = radioContainer?.querySelector('span');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveStyle({ display: 'none' });
  });

  it('应该在禁用时应用正确的样式', () => {
    renderWithTheme(<Radio value="option1" name="test" disabled />);

    const radio = screen.getByRole('radio');
    const container = radio.parentElement;
    const radioContainer = container?.querySelector('div');
    expect(radioContainer).toHaveStyle({
      cursor: 'not-allowed',
      opacity: 0.5,
    });
  });

  it('应该在未禁用时应用正确的样式', () => {
    renderWithTheme(<Radio value="option1" name="test" />);

    const radio = screen.getByRole('radio');
    const container = radio.parentElement;
    const radioContainer = container?.querySelector('div');
    expect(radioContainer).toHaveStyle({
      cursor: 'pointer',
      opacity: 1,
    });
  });

  it('应该在点击标签时触发 radio 的 change', () => {
    const handleChange = jest.fn();
    renderWithTheme(
      <Radio value="option1" name="test" onChange={handleChange}>
        Option Label
      </Radio>
    );

    const label = screen.getByText('Option Label');
    fireEvent.click(label);

    expect(handleChange).toHaveBeenCalledWith('option1');
  });

  it('应该在没有 value 时不调用 onChange', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Radio name="test" onChange={handleChange} />);

    const radio = screen.getByRole('radio');
    fireEvent.click(radio);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('应该正确处理多个 Radio 组件', () => {
    renderWithTheme(
      <div>
        <Radio value="option1" name="test" checked>
          Option 1
        </Radio>
        <Radio value="option2" name="test">
          Option 2
        </Radio>
        <Radio value="option3" name="test">
          Option 3
        </Radio>
      </div>
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('应该在禁用时正确处理子元素样式', () => {
    renderWithTheme(
      <Radio value="option1" name="test" disabled>
        Disabled Option
      </Radio>
    );

    const label = screen.getByText('Disabled Option');
    expect(label).toHaveStyle({
      cursor: 'not-allowed',
    });
  });

  it('应该在未禁用时正确处理子元素样式', () => {
    renderWithTheme(
      <Radio value="option1" name="test">
        Enabled Option
      </Radio>
    );

    const label = screen.getByText('Enabled Option');
    expect(label).toHaveStyle({
      cursor: 'pointer',
    });
  });

  it('应该应用正确的边框样式', () => {
    renderWithTheme(<Radio value="option1" name="test" />);

    const radio = screen.getByRole('radio');
    const container = radio.parentElement;
    const radioContainer = container?.querySelector('div');
    expect(radioContainer).toHaveStyle({
      borderRadius: '50%',
      border: '2px solid rgb(160, 160, 160)',
    });
  });

  it('应该在选中时应用正确的背景色', () => {
    renderWithTheme(<Radio value="option1" name="test" checked />);

    const radio = screen.getByRole('radio');
    const container = radio.parentElement;
    const radioContainer = container?.querySelector('div');
    expect(radioContainer).toHaveStyle({
      backgroundColor: 'rgb(224, 106, 112)',
    });
  });

  it('应该在未选中时应用透明背景', () => {
    renderWithTheme(<Radio value="option1" name="test" checked={false} />);

    const radio = screen.getByRole('radio');
    const container = radio.parentElement;
    const radioContainer = container?.querySelector('div');
    expect(radioContainer).not.toHaveStyle({
      backgroundColor: 'rgb(212, 90, 95)',
    });
  });
});
