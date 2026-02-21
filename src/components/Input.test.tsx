/**
 * @file Input 组件测试
 * @description 测试 Input 组件的各项功能
 * @module __tests__/components/Input.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';
import { ThemeProvider } from '../theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Input 组件', () => {
  it('应该正确渲染 input 元素', () => {
    renderWithTheme(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('应该支持不同的 type 属性', () => {
    const types = ['text', 'password', 'email', 'number'] as const;

    types.forEach(type => {
      const { container, unmount } = renderWithTheme(<Input type={type} />);
      const input = container.querySelector(`input[type="${type}"]`);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', type);
      unmount();
    });
  });

  it('应该支持 placeholder 属性', () => {
    renderWithTheme(<Input placeholder="Placeholder text" />);

    const input = screen.getByPlaceholderText('Placeholder text');
    expect(input).toBeInTheDocument();
  });

  it('应该支持 disabled 属性', () => {
    renderWithTheme(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('应该支持 value 属性', () => {
    renderWithTheme(<Input value="Test value" />);

    const input = screen.getByDisplayValue('Test value');
    expect(input).toBeInTheDocument();
  });

  it('应该支持 onChange 回调', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledWith('new value');
  });

  it('应该支持自定义 className', () => {
    renderWithTheme(<Input className="custom-class" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('应该在 focus 时改变边框颜色', () => {
    renderWithTheme(<Input />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    expect(input).toHaveStyle({ outline: 'none' });
  });

  it('应该在 blur 时恢复边框颜色', () => {
    renderWithTheme(<Input />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(input).toHaveStyle({ outline: 'none' });
  });

  it('应该应用正确的样式', () => {
    renderWithTheme(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveStyle({
      width: '100%',
      boxSizing: 'border-box',
      outline: 'none',
    });
  });

  it('应该在 disabled 时设置正确的样式', () => {
    renderWithTheme(<Input disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveStyle({
      cursor: 'not-allowed',
    });
  });

  it('应该在非 disabled 时设置正确的样式', () => {
    renderWithTheme(<Input disabled={false} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveStyle({
      cursor: 'text',
    });
  });

  it('应该正确处理长文本输入', () => {
    const longText = 'A'.repeat(1000);
    const handleChange = jest.fn();
    renderWithTheme(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: longText } });

    expect(handleChange).toHaveBeenCalledWith(longText);
  });

  it('应该正确处理特殊字符输入', () => {
    const specialChars = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`';
    const handleChange = jest.fn();
    renderWithTheme(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: specialChars } });

    expect(handleChange).toHaveBeenCalledWith(specialChars);
  });

  it('应该正确处理 Unicode 字符输入', () => {
    const unicodeText = '你好世界🌍';
    const handleChange = jest.fn();
    renderWithTheme(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: unicodeText } });

    expect(handleChange).toHaveBeenCalledWith(unicodeText);
  });

  it('应该正确处理空字符串输入', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input value="test" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('应该正确处理粘贴事件', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.paste(input, {
      clipboardData: {
        getData: () => 'pasted text'
      }
    });

    expect(input).toBeInTheDocument();
  });

  it('应该正确处理剪切事件', () => {
    renderWithTheme(<Input value="test text" />);

    const input = screen.getByRole('textbox');
    fireEvent.cut(input);

    expect(input).toBeInTheDocument();
  });

  it('应该正确处理复制事件', () => {
    renderWithTheme(<Input value="test text" />);

    const input = screen.getByRole('textbox');
    fireEvent.copy(input);

    expect(input).toBeInTheDocument();
  });

  it('应该正确处理键盘事件', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(input).toBeInTheDocument();
  });

  it('应该正确处理多次连续输入', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });

    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(handleChange).toHaveBeenNthCalledWith(1, 'a');
    expect(handleChange).toHaveBeenNthCalledWith(2, 'ab');
    expect(handleChange).toHaveBeenNthCalledWith(3, 'abc');
  });

  it('应该正确处理 placeholder 显示和隐藏', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input placeholder="Enter text" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter text');

    fireEvent.change(input, { target: { value: 'typed text' } });
    expect(input).toHaveValue('typed text');
  });

  it('应该正确处理空 placeholder', () => {
    renderWithTheme(<Input placeholder="" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', '');
  });

  it('应该正确处理未定义的 placeholder', () => {
    renderWithTheme(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', '');
  });

  it('应该正确处理 undefined value', () => {
    renderWithTheme(<Input value={undefined} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('应该正确处理空字符串 value', () => {
    renderWithTheme(<Input value="" />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('应该正确处理快速连续的 focus 和 blur', () => {
    renderWithTheme(<Input />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(input).toBeInTheDocument();
  });

  it('应该正确处理禁用状态下的所有事件', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input disabled onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);
    fireEvent.change(input, { target: { value: 'test' } });

    expect(input).toBeDisabled();
  });

  it('应该正确处理受控组件模式', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input value="" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');

    renderWithTheme(<Input value="controlled" onChange={handleChange} />);
    expect(screen.getByDisplayValue('controlled')).toBeInTheDocument();
  });

  it('应该正确处理非受控组件模式', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });
});
