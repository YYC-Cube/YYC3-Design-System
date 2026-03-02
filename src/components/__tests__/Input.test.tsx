import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { Input } from '../Input';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Input 组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认输入框', () => {
      render(
        <ThemeProvider>
          <Input />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('应该支持placeholder', () => {
      render(
        <ThemeProvider>
          <Input placeholder="请输入内容" />
        </ThemeProvider>
      );
      const input = screen.getByPlaceholderText('请输入内容');
      expect(input).toBeInTheDocument();
    });

    it('应该支持默认值', () => {
      render(
        <ThemeProvider>
          <Input defaultValue="默认值" />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('默认值');
    });

    it('应该支持自定义类名', () => {
      render(
        <ThemeProvider>
          <Input className="custom-class" />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-class');
    });

    it('应该支持自定义样式', () => {
      render(
        <ThemeProvider>
          <Input style={{ width: '300px' }} />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveStyle({ width: '300px' });
    });
  });

  describe('类型', () => {
    it('应该渲染文本类型', () => {
      render(
        <ThemeProvider>
          <Input type="text" />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('应该渲染密码类型', () => {
      render(
        <ThemeProvider>
          <Input type="password" />
        </ThemeProvider>
      );
      const input = screen.getByLabelText(/password/i);
      expect(input).toBeInTheDocument();
    });

    it('应该渲染邮箱类型', () => {
      render(
        <ThemeProvider>
          <Input type="email" />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('应该渲染数字类型', () => {
      render(
        <ThemeProvider>
          <Input type="number" />
        </ThemeProvider>
      );
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('应该渲染搜索类型', () => {
      render(
        <ThemeProvider>
          <Input type="search" />
        </ThemeProvider>
      );
      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });
  });

  describe('状态', () => {
    it('应该支持禁用状态', () => {
      render(
        <ThemeProvider>
          <Input disabled />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('应该支持只读状态', () => {
      render(
        <ThemeProvider>
          <Input readOnly />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    it('应该支持必填状态', () => {
      render(
        <ThemeProvider>
          <Input required />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });
  });

  describe('受控组件', () => {
    it('应该支持受控模式', () => {
      const handleChange = jest.fn();
      render(
        <ThemeProvider>
          <Input value="初始值" onChange={handleChange} />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('初始值');
    });

    it('应该触发onChange事件', () => {
      const handleChange = jest.fn();
      render(
        <ThemeProvider>
          <Input onChange={handleChange} />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '新值' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('应该正确更新受控值', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
      };
      render(<TestComponent />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '测试值' } });
      expect(input).toHaveValue('测试值');
    });
  });

  describe('验证', () => {
    it('应该支持最小长度验证', () => {
      render(
        <ThemeProvider>
          <Input minLength={3} />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('minlength', '3');
    });

    it('应该支持最大长度验证', () => {
      render(
        <ThemeProvider>
          <Input maxLength={10} />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxlength', '10');
    });

    it('应该支持模式验证', () => {
      render(
        <ThemeProvider>
          <Input pattern="[0-9]*" />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('pattern', '[0-9]*');
    });
  });

  describe('事件', () => {
    it('应该支持onFocus事件', () => {
      const handleFocus = jest.fn();
      render(
        <ThemeProvider>
          <Input onFocus={handleFocus} />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      input.focus();
      expect(handleFocus).toHaveBeenCalled();
    });

    it('应该支持onBlur事件', () => {
      const handleBlur = jest.fn();
      render(
        <ThemeProvider>
          <Input onBlur={handleBlur} />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      input.focus();
      input.blur();
      expect(handleBlur).toHaveBeenCalled();
    });

    it('应该支持onKeyDown事件', () => {
      const handleKeyDown = jest.fn();
      render(
        <ThemeProvider>
          <Input onKeyDown={handleKeyDown} />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalled();
    });

    it('应该支持onKeyUp事件', () => {
      const handleKeyUp = jest.fn();
      render(
        <ThemeProvider>
          <Input onKeyUp={handleKeyUp} />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      fireEvent.keyUp(input, { key: 'Enter' });
      expect(handleKeyUp).toHaveBeenCalled();
    });
  });

  describe('可访问性', () => {
    it('应该支持自定义aria-label', () => {
      render(
        <ThemeProvider>
          <Input aria-label="用户名" />
        </ThemeProvider>
      );
      const input = screen.getByLabelText('用户名');
      expect(input).toBeInTheDocument();
    });

    it('应该支持自定义aria-describedby', () => {
      render(
        <ThemeProvider>
          <Input aria-describedby="help-text" />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('应该支持自定义aria-invalid', () => {
      render(
        <ThemeProvider>
          <Input aria-invalid="true" />
        </ThemeProvider>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('ref', () => {
    it('应该支持ref转发', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(
        <ThemeProvider>
          <Input ref={ref} />
        </ThemeProvider>
      );
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('应该能够通过ref访问input方法', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(
        <ThemeProvider>
          <Input ref={ref} />
        </ThemeProvider>
      );
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });
});
