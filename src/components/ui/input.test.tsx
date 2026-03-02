import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from '../ui/input';
import { ThemeProvider } from '../../context/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider initial="light">{component}</ThemeProvider>);
};

describe('Input 组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认 Input', () => {
      renderWithTheme(<Input placeholder="输入内容" />);
      const input = screen.getByPlaceholderText('输入内容');
      expect(input).toBeInTheDocument();
    });

    it('应该是 input 元素', () => {
      renderWithTheme(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.tagName).toBe('INPUT');
    });

    it('应该支持自定义 className', () => {
      renderWithTheme(<Input className="custom-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
    });

    it('应该支持自定义样式', () => {
      renderWithTheme(<Input style={{ width: '300px' }} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveStyle({ width: '300px' });
    });
  });

  describe('输入类型', () => {
    it('应该支持 text 类型', () => {
      renderWithTheme(<Input type="text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('应该支持 email 类型', () => {
      renderWithTheme(<Input type="email" />);
      const input = screen.getByRole('textbox', { type: 'email' });
      expect(input).toBeInTheDocument();
    });

    it('应该支持 password 类型', () => {
      renderWithTheme(<Input type="password" />);
      const input = screen.getByLabelText(/password/i) || screen.getByPlaceholderText('');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('应该支持 number 类型', () => {
      renderWithTheme(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
    });

    it('应该支持 tel 类型', () => {
      renderWithTheme(<Input type="tel" />);
      const input = screen.getByRole('textbox', { type: 'tel' });
      expect(input).toBeInTheDocument();
    });

    it('应该支持 url 类型', () => {
      renderWithTheme(<Input type="url" />);
      const input = screen.getByRole('textbox', { type: 'url' });
      expect(input).toBeInTheDocument();
    });
  });

  describe('受控组件', () => {
    it('应该支持受控值', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('初始值');
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
      };

      renderWithTheme(<TestComponent />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('初始值');
    });

    it('应该响应 onChange 事件', async () => {
      const handleChange = jest.fn();
      renderWithTheme(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('应该正确更新受控值', async () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
      };

      renderWithTheme(<TestComponent />);
      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'hello');

      expect(input).toHaveValue('hello');
    });
  });

  describe('非受控组件', () => {
    it('应该支持 defaultValue', () => {
      renderWithTheme(<Input defaultValue="默认值" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('默认值');
    });

    it('应该支持 ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      renderWithTheme(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('应该通过 ref 获取值', () => {
      const ref = React.createRef<HTMLInputElement>();
      renderWithTheme(<Input ref={ref} defaultValue="test" />);

      expect(ref.current?.value).toBe('test');
    });
  });

  describe('属性和验证', () => {
    it('应该支持 disabled 状态', () => {
      renderWithTheme(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('应该支持 required 属性', () => {
      renderWithTheme(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('应该支持 maxLength 属性', () => {
      renderWithTheme(<Input maxLength={10} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxlength', '10');
    });

    it('应该支持 minLength 属性', () => {
      renderWithTheme(<Input minLength={5} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('minlength', '5');
    });

    it('应该支持 placeholder', () => {
      renderWithTheme(<Input placeholder="请输入..." />);
      const input = screen.getByPlaceholderText('请输入...');
      expect(input).toBeInTheDocument();
    });

    it('应该支持 autoComplete', () => {
      renderWithTheme(<Input autoComplete="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autocomplete', 'email');
    });

    it('应该支持 autoFocus', () => {
      renderWithTheme(<Input autoFocus />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });
  });

  describe('事件处理', () => {
    it('应该触发 onFocus 事件', () => {
      const handleFocus = jest.fn();
      renderWithTheme(<Input onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');

      input.focus();

      expect(handleFocus).toHaveBeenCalled();
    });

    it('应该触发 onBlur 事件', () => {
      const handleBlur = jest.fn();
      renderWithTheme(<Input onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');

      input.focus();
      input.blur();

      expect(handleBlur).toHaveBeenCalled();
    });

    it('应该触发 onKeyDown 事件', () => {
      const handleKeyDown = jest.fn();
      renderWithTheme(<Input onKeyDown={handleKeyDown} />);
      const input = screen.getByRole('textbox');

      fireEvent.keyDown(input, { key: 'Enter' });

      expect(handleKeyDown).toHaveBeenCalled();
    });

    it('应该触发 onKeyPress 事件', () => {
      const handleKeyPress = jest.fn();
      renderWithTheme(<Input onKeyPress={handleKeyPress} />);
      const input = screen.getByRole('textbox');

      fireEvent.keyPress(input, { key: 'a' });

      expect(handleKeyPress).toHaveBeenCalled();
    });

    it('应该触发 onKeyUp 事件', () => {
      const handleKeyUp = jest.fn();
      renderWithTheme(<Input onKeyUp={handleKeyUp} />);
      const input = screen.getByRole('textbox');

      fireEvent.keyUp(input, { key: 'a' });

      expect(handleKeyUp).toHaveBeenCalled();
    });
  });

  describe('边缘情况', () => {
    it('应该处理空字符串值', () => {
      const handleChange = jest.fn();
      renderWithTheme(<Input value="" onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      expect(input).toHaveValue('');
    });

    it('应该处理 null 值', () => {
      renderWithTheme(<Input value={null as any} />);
      const input = screen.getByRole('textbox');

      expect(input).toBeInTheDocument();
    });

    it('应该处理 undefined 值', () => {
      renderWithTheme(<Input value={undefined} />);
      const input = screen.getByRole('textbox');

      expect(input).toBeInTheDocument();
    });

    it('应该处理超长输入', async () => {
      renderWithTheme(<Input />);
      const input = screen.getByRole('textbox');

      const longText = 'A'.repeat(1000);
      await userEvent.type(input, longText);

      expect(input).toHaveValue(longText);
    });

    it('应该处理特殊字符', async () => {
      renderWithTheme(<Input />);
      const input = screen.getByRole('textbox');

      const specialChars = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`';
      await userEvent.type(input, specialChars);

      expect(input).toHaveValue(specialChars);
    });

    it('应该处理中文输入', async () => {
      renderWithTheme(<Input />);
      const input = screen.getByRole('textbox');

      const chineseText = '你好，世界！';
      await userEvent.type(input, chineseText);

      expect(input).toHaveValue(chineseText);
    });

    it('应该处理表情符号', async () => {
      renderWithTheme(<Input />);
      const input = screen.getByRole('textbox');

      const emojis = '😀🎉🚀';
      await userEvent.type(input, emojis);

      expect(input).toHaveValue(emojis);
    });
  });

  describe('可访问性', () => {
    it('应该支持 aria-label', () => {
      renderWithTheme(<Input aria-label="用户名" />);
      const input = screen.getByLabelText('用户名');
      expect(input).toBeInTheDocument();
    });

    it('应该支持 aria-describedby', () => {
      renderWithTheme(<Input aria-describedby="help-text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('应该支持 aria-invalid', () => {
      renderWithTheme(<Input aria-invalid="true" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('应该支持 aria-required', () => {
      renderWithTheme(<Input aria-required="true" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Props 传递', () => {
    it('应该传递 data-testid 属性', () => {
      renderWithTheme(<Input data-testid="test-input" />);
      expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });

    it('应该传递 id 属性', () => {
      renderWithTheme(<Input id="input-1" />);
      expect(document.getElementById('input-1')).toBeInTheDocument();
    });

    it('应该传递 name 属性', () => {
      renderWithTheme(<Input name="username" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'username');
    });

    it('应该传递其他 HTML 属性', () => {
      renderWithTheme(<Input spellCheck={false} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('spellcheck', 'false');
    });
  });
});
