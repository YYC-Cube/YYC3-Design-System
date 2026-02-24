import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen, fireEvent, waitFor } from '@testing-library/dom';;;
import '@testing-library/jest-dom';
import { Button } from '../Button'
import { ThemeProvider } from '../../theme/ThemeProvider';;

describe('Button 组件', () => {
  describe('基础渲染', () => {
    it('it('it('it('应该正确渲染默认按钮', () => {
      render(<ThemeProvider><Button>点击我</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('点击我');
    });

    it('it('it('it('应该支持自定义类名', () => {
      render(<ThemeProvider><Button className="custom-class">按钮</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('it('it('it('应该支持自定义样式', () => {
      render(<ThemeProvider><Button style={{ color: 'blue' }}>按钮</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ color: 'blue' });
    });
  });

  describe('变体', () => {
    it('it('it('it('应该渲染默认变体', () => {
      render(<ThemeProvider><Button variant="default">默认</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('it('it('it('应该渲染危险变体', () => {
      render(<ThemeProvider><Button variant="destructive">危险</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('it('it('it('应该渲染轮廓变体', () => {
      render(<ThemeProvider><Button variant="outline">轮廓</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('it('it('it('应该渲染次要变体', () => {
      render(<ThemeProvider><Button variant="secondary">次要</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('it('it('it('应该渲染幽灵变体', () => {
      render(<ThemeProvider><Button variant="ghost">幽灵</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('it('it('it('应该渲染链接变体', () => {
      render(<ThemeProvider><Button variant="link">链接</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('尺寸', () => {
    it('it('it('it('应该渲染默认尺寸', () => {
      render(<ThemeProvider><Button size="default">默认</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('it('it('it('应该渲染小尺寸', () => {
      render(<ThemeProvider><Button size="sm">小按钮</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('it('it('it('应该渲染大尺寸', () => {
      render(<ThemeProvider><Button size="lg">大按钮</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('it('it('it('应该渲染图标尺寸', () => {
      render(<ThemeProvider><Button size="icon">🔍</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('状态', () => {
    it('it('it('it('应该支持禁用状态', () => {
      render(<ThemeProvider><Button disabled>禁用</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('it('it('it('禁用时不应该触发onClick', () => {
      const handleClick = jest.fn();
      render(<ThemeProvider><Button disabled onClick={handleClick}>禁用</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('事件', () => {
    it('it('it('it('应该支持onClick事件', () => {
      const handleClick = jest.fn();
      render(<ThemeProvider><Button onClick={handleClick}>点击</Button>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('it('it('it('应该支持键盘事件', () => {
      const handleKeyDown = jest.fn();
      render(<ThemeProvider><Button onKeyDown={handleKeyDown}>按钮</Button>);
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('可访问性', () => {
    it('it('it('it('应该支持自定义aria-label', () => {
      render(<ThemeProvider><Button aria-label="关闭按钮">×</Button>);
      const button = screen.getByLabelText('关闭按钮');
      expect(button).toBeInTheDocument();
    });

    it('it('it('it('应该支持disabled属性的可访问性', () => {
      render(<ThemeProvider><Button disabled>禁用</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });
  });

  describe('ref', () => {
    it('it('it('it('应该支持ref转发', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<ThemeProvider><Button ref={ref}>按钮</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
