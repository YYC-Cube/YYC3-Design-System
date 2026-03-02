/**
 * @file 菜单组件测试
 * @description 测试Menu组件的各项功能
 * @module __tests__/components/Menu.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import { Menu } from '../Menu';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Menu', () => {
  const mockItems = [
    { key: 'home', label: '首页', icon: '🏠' },
    { key: 'products', label: '产品', icon: '📦' },
    { key: 'about', label: '关于', icon: 'ℹ️' },
  ];

  it('应该渲染菜单', () => {
    render(
      <ThemeProvider>
        <Menu items={mockItems} />
      </ThemeProvider>
    );
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('产品')).toBeInTheDocument();
    expect(screen.getByText('关于')).toBeInTheDocument();
  });

  it('应该支持垂直模式', () => {
    render(
      <ThemeProvider>
        <Menu items={mockItems} mode="vertical" />
      </ThemeProvider>
    );
    expect(screen.getByText('首页')).toBeInTheDocument();
  });

  it('应该支持默认选中', () => {
    render(
      <ThemeProvider>
        <Menu items={mockItems} defaultSelectedKeys={['products']} />
      </ThemeProvider>
    );
    const productsItem = screen.getByText('产品');
    expect(productsItem).toBeInTheDocument();
  });

  it('应该触发点击事件', () => {
    const handleSelect = jest.fn();
    render(
      <ThemeProvider>
        <Menu items={mockItems} onSelect={handleSelect} />
      </ThemeProvider>
    );
    const homeItem = screen.getByText('首页');
    fireEvent.click(homeItem);
    expect(handleSelect).toHaveBeenCalledWith('home');
  });

  it('应该支持禁用状态', () => {
    const disabledItems = [
      ...mockItems,
      { key: 'disabled', label: '禁用项', icon: '🚫', disabled: true },
    ];
    render(
      <ThemeProvider>
        <Menu items={disabledItems} />
      </ThemeProvider>
    );
    expect(screen.getByText('禁用项')).toBeInTheDocument();
  });

  it('应该支持自定义类名', () => {
    render(
      <ThemeProvider>
        <Menu items={mockItems} className="custom-menu" />
      </ThemeProvider>
    );
    const menu = screen.getByRole('navigation');
    expect(menu).toHaveClass('custom-menu');
  });

  it('应该支持内联模式', () => {
    render(
      <ThemeProvider>
        <Menu items={mockItems} mode="inline" />
      </ThemeProvider>
    );
    expect(screen.getByText('首页')).toBeInTheDocument();
  });
});
