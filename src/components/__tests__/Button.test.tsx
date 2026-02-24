import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom';;
import '@testing-library/jest-dom';
import { Button } from '../Button';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('Button 组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认按钮', () => {
      render(<ThemeProvider><Button>点击我</Button></ThemeProvider>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('点击我');
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider><Button className="custom-class">按钮</Button></ThemeProvider>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('应该支持禁用状态', () => {
      render(<ThemeProvider><Button disabled>禁用按钮</Button></ThemeProvider>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('应该支持加载状态', () => {
      render(<ThemeProvider><Button loading>加载中</Button></ThemeProvider>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('事件处理', () => {
    it('应该响应点击事件', () => {
      const handleClick = jest.fn();
      render(<ThemeProvider><Button onClick={handleClick}>点击我</Button></ThemeProvider>);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('样式变体', () => {
    it('应该支持不同大小', () => {
      render(<ThemeProvider><Button size="small">小按钮</Button></ThemeProvider>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('应该支持不同类型', () => {
      render(<ThemeProvider><Button variant="primary">主要按钮</Button></ThemeProvider>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });
});
