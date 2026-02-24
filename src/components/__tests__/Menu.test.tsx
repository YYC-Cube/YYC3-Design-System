/**
 * @file 菜单组件测试
 * @description 测试Menu组件的各项功能
 * @module __tests__/components/Menu.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

;

import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen, fireEvent, waitFor } from '@testing-library/dom';;;
import { Menu } from '../Menu'
import { ThemeProvider } from '../../theme/ThemeProvider';;

describe('Menu', () => {
  const mockItems = [
    { key: 'home', label: '首页', icon: '🏠' },
    { key: 'products', label: '产品', icon: '📦' },
    { key: 'about', label: '关于', icon: 'ℹ️' },
  ];

  it('it('it('it('应该渲染菜单', () => {
    render(<ThemeProvider><Menu items={mockItems} />);
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('产品')).toBeInTheDocument();
    expect(screen.getByText('关于')).toBeInTheDocument();
  });

  it('it('it('it('应该支持垂直模式', () => {
    render(<ThemeProvider><Menu items={mockItems} mode="vertical" />);
    expect(screen.getByText('首页')).toBeInTheDocument();
  });

  it('it('it('it('应该支持水平模式', () => {
    render(<ThemeProvider><Menu items={mockItems} mode="horizontal" />);
    expect(screen.getByText('首页')).toBeInTheDocument();
  });

  it('it('it('it('应该支持图标', () => {
    render(<ThemeProvider><Menu items={mockItems} />);
    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('📦')).toBeInTheDocument();
  });

  it('it('it('it('应该支持选中状态', () => {
    render(<ThemeProvider><Menu items={mockItems} selectedKey="home" />);
    const homeItem = screen.getByText('首页').closest('div');
    expect(homeItem).toHaveStyle({ backgroundColor: expect.any(String) });
  });

  it('it('it('it('应该调用onSelect回调', () => {
    const mockOnSelect = jest.fn();
    render(<ThemeProvider><Menu items={mockItems} onSelect={mockOnSelect} />);
    const homeItem = screen.getByText('首页').closest('div');
    fireEvent.click(homeItem!);
    expect(mockOnSelect).toHaveBeenCalledWith('home');
  });

  it('it('it('it('应该支持禁用项', () => {
    const disabledItems = [
      { key: 'home', label: '首页' },
      { key: 'products', label: '产品', disabled: true },
    ];
    render(<ThemeProvider><Menu items={disabledItems} />);
    const productsItem = screen.getByText('产品').closest('div');
    expect(productsItem).toHaveAttribute('aria-disabled', 'true');
  });

  it('it('it('it('应该支持分隔线', () => {
    const itemsWithDivider = [
      { key: 'home', label: '首页' },
      { key: 'divider', label: '', divider: true },
      { key: 'products', label: '产品' },
    ];
    render(<ThemeProvider><Menu items={itemsWithDivider} />);
    const divider = screen.getByRole('menu').querySelector('div[style*="height: 1px"]');
    expect(divider).toBeInTheDocument();
  });

  it('it('it('it('应该支持嵌套菜单', () => {
    const nestedItems = [
      {
        key: 'file',
        label: '文件',
        icon: '📄',
        children: [
          { key: 'new', label: '新建' },
          { key: 'open', label: '打开' },
        ],
      },
    ];
    render(<ThemeProvider><Menu items={nestedItems} />);
    expect(screen.getByText('文件')).toBeInTheDocument();
    expect(screen.getByText('新建')).toBeInTheDocument();
    expect(screen.getByText('打开')).toBeInTheDocument();
  });

  it('it('it('it('应该支持快捷键', () => {
    const itemsWithShortcut = [
      { key: 'save', label: '保存', shortcut: 'Ctrl+S' },
      { key: 'open', label: '打开', shortcut: 'Ctrl+O' },
    ];
    render(<ThemeProvider><Menu items={itemsWithShortcut} />);
    expect(screen.getByText('Ctrl+S')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+O')).toBeInTheDocument();
  });

  it('it('it('it('应该支持折叠状态', () => {
    render(<ThemeProvider><Menu items={mockItems} inlineCollapsed />);
    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.queryByText('首页')).not.toBeInTheDocument();
  });

  it('it('it('it('应该支持暗色主题', () => {
    render(<ThemeProvider><Menu items={mockItems} theme="dark" />);
    const menu = screen.getByRole('menu');
    expect(menu).toHaveStyle({ backgroundColor: expect.any(String) });
  });

  it('it('it('it('应该支持默认选中项', () => {
    render(<ThemeProvider><Menu items={mockItems} defaultSelectedKey="products" />);
    const productsItem = screen.getByText('产品').closest('div');
    expect(productsItem).toHaveStyle({ backgroundColor: expect.any(String) });
  });

  it('it('it('it('应该支持受控选中状态', () => {
    const { rerender } = render(<ThemeProvider><Menu items={mockItems} selectedKey="home" />);
    expect(screen.getByText('首页').closest('div')).toHaveStyle({ backgroundColor: expect.any(String) });

    rerender(<ThemeProvider><Menu items={mockItems} selectedKey="products" />);
    expect(screen.getByText('产品').closest('div')).toHaveStyle({ backgroundColor: expect.any(String) });
  });

  it('it('it('it('应该支持自定义类名', () => {
    const { container } = render(<ThemeProvider><Menu items={mockItems} className="custom-menu" />);
    expect(container.querySelector('.custom-menu')).toBeInTheDocument();
  });

  it('it('it('it('应该支持点击事件', () => {
    const mockOnClick = jest.fn();
    const itemsWithClick = [
      { key: 'home', label: '首页', onClick: mockOnClick },
    ];
    render(<ThemeProvider><Menu items={itemsWithClick} />);
    const homeItem = screen.getByText('首页').closest('div');
    fireEvent.click(homeItem!);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('it('it('it('应该支持展开/折叠子菜单', () => {
    const nestedItems = [
      {
        key: 'file',
        label: '文件',
        children: [
          { key: 'new', label: '新建' },
          { key: 'open', label: '打开' },
        ],
      },
    ];
    render(<ThemeProvider><Menu items={nestedItems} />);
    const fileItem = screen.getByText('文件').closest('div');
    fireEvent.click(fileItem!);
    expect(screen.getByText('新建')).toBeInTheDocument();
  });
});
