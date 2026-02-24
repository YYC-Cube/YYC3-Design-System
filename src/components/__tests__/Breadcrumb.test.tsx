/**
 * @file 面包屑导航组件测试
 * @description 测试Breadcrumb组件的各项功能
 * @module __tests__/components/Breadcrumb.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

;

import { render, fireEvent, waitFor } from '@testing-library/react'

import { Breadcrumb } from '../Breadcrumb'
import { ThemeProvider } from '../../theme/ThemeProvider';;

describe('Breadcrumb', () => {
  const mockItems = [
    { key: 'home', title: '首页', href: '/' },
    { key: 'products', title: '产品', href: '/products' },
    { key: 'detail', title: '详情' },
  ];

  it('应该渲染面包屑导航', () => {
    render(<ThemeProvider><Breadcrumb items={mockItems} />);
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('产品')).toBeInTheDocument();
    expect(screen.getByText('详情')).toBeInTheDocument();
  });

  it('应该使用默认分隔符', () => {
    render(<ThemeProvider><Breadcrumb items={mockItems} />);
    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(2);
  });

  it('应该使用自定义分隔符', () => {
    render(<ThemeProvider><Breadcrumb items={mockItems} separator=">" />);
    const separators = screen.getAllByText('>');
    expect(separators).toHaveLength(2);
  });

  it('应该渲染链接', () => {
    render(<ThemeProvider><Breadcrumb items={mockItems} />);
    const homeLink = screen.getByText('首页').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('应该支持点击事件', () => {
    const mockOnClick = jest.fn();
    const itemsWithClick = [
      { key: 'home', title: '首页', onClick: mockOnClick },
      { key: 'detail', title: '详情' },
    ];
    render(<ThemeProvider><Breadcrumb items={itemsWithClick} />);
    const homeLink = screen.getByText('首页').closest('a');
    homeLink?.click();
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('应该正确标记最后一项', () => {
    render(<ThemeProvider><Breadcrumb items={mockItems} />);
    const lastItem = screen.getByText('详情');
    expect(lastItem).toHaveAttribute('aria-current', 'page');
  });

  it('应该支持禁用状态', () => {
    const itemsWithDisabled = [
      { key: 'home', title: '首页', href: '/', disabled: true },
      { key: 'detail', title: '详情' },
    ];
    render(<ThemeProvider><Breadcrumb items={itemsWithDisabled} />);
    const homeLink = screen.getByText('首页').closest('a');
    expect(homeLink).toHaveAttribute('aria-disabled', 'true');
  });

  it('应该支持自定义类名', () => {
    const { container } = render(<ThemeProvider>
      <Breadcrumb items={mockItems} className="custom-breadcrumb" />
    );
    expect(container.querySelector('.custom-breadcrumb')).toBeInTheDocument();
  });

  it('应该支持自定义分隔符组件', () => {
    const customSeparator = <span className="custom-separator">→</span>;
    render(<ThemeProvider><Breadcrumb items={mockItems} separator={customSeparator} />);
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('应该正确处理空项', () => {
    render(<ThemeProvider><Breadcrumb items={[]} />);
    expect(screen.queryByRole('navigation')).toBeInTheDocument();
  });

  it('应该支持单个项', () => {
    const singleItem = [{ key: 'home', title: '首页' }];
    render(<ThemeProvider><Breadcrumb items={singleItem} />);
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.queryByText('/')).not.toBeInTheDocument();
  });
});
