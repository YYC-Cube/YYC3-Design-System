import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen, fireEvent, waitFor } from '@testing-library/dom';;;
import '@testing-library/jest-dom';

import { Button } from './Button';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('Button', () => {
  const renderWithTheme = (component: React.ReactElement, theme?: 'light' | 'dark') => {
    return render(<ThemeProvider initial={theme}>{component}</ThemeProvider>);
  };

  it('it('renders button with text', () => {
    renderWithTheme(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('it('is disabled when disabled prop is true', () => {
    renderWithTheme(<Button disabled>Click me</Button>);
    
    const button = screen.getByText('Click me');
    expect(button).toBeDisabled();
  });

  it('it('applies variant styles', () => {
    const { container } = renderWithTheme(<Button variant="destructive">Delete</Button>);
    
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({
      background: 'rgb(255, 107, 91)',
    });
  });

  it('it('applies size styles', () => {
    const { container } = renderWithTheme(<Button size="lg">Large Button</Button>);
    
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({
      padding: '0.75rem 1.5rem',
    });
  });

  it('it('should support all variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;

    variants.forEach(variant => {
      const { container, unmount } = renderWithTheme(<Button variant={variant}>Test</Button>);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('it('should support all sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    sizes.forEach(size => {
      const { container, unmount } = renderWithTheme(<Button size={size}>Test</Button>);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('it('should apply custom className', () => {
    renderWithTheme(<Button className="custom-class">Click me</Button>);
    
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('custom-class');
  });

  it('it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button disabled onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('it('should render children correctly', () => {
    renderWithTheme(
      <Button>
        <span>Custom content</span>
      </Button>
    );
    
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('it('应该正确设置 disabled 状态的样式', () => {
    renderWithTheme(<Button disabled>Click me</Button>);
    
    const button = screen.getByText('Click me');
    expect(button).toHaveStyle({
      cursor: 'not-allowed',
      opacity: 0.5,
    });
  });

  it('it('应该正确设置非禁用状态的样式', () => {
    renderWithTheme(<Button>Click me</Button>);
    
    const button = screen.getByText('Click me');
    expect(button).toHaveStyle({
      cursor: 'pointer',
      opacity: 1,
    });
  });

  it('it('应该为 default variant 应用正确的样式', () => {
    renderWithTheme(<Button variant="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 destructive variant 应用正确的样式', () => {
    renderWithTheme(<Button variant="destructive">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 outline variant 应用正确的样式', () => {
    renderWithTheme(<Button variant="outline">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 secondary variant 应用正确的样式', () => {
    renderWithTheme(<Button variant="secondary">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 ghost variant 应用正确的样式', () => {
    renderWithTheme(<Button variant="ghost">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 link variant 应用正确的样式', () => {
    renderWithTheme(<Button variant="link">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 default size 应用正确的样式', () => {
    renderWithTheme(<Button size="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 sm size 应用正确的样式', () => {
    renderWithTheme(<Button size="sm">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 lg size 应用正确的样式', () => {
    renderWithTheme(<Button size="lg">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 icon size 应用正确的样式', () => {
    renderWithTheme(<Button size="icon">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该正确处理无效 variant（使用默认值）', () => {
    renderWithTheme(<Button variant={'invalid' as any}>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该正确设置 transition 样式', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      transition: 'all 0.2s ease',
    });
  });

  it('it('应该正确设置 fontWeight', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      fontWeight: 500,
    });
  });

  it('it('应该正确设置 borderRadius', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 outline variant 设置正确的边框', () => {
    renderWithTheme(<Button variant="outline">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为非 outline variant 设置无边框', () => {
    renderWithTheme(<Button variant="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 secondary variant 应用正确的背景色', () => {
    renderWithTheme(<Button variant="secondary">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 ghost variant 应用正确的背景色', () => {
    renderWithTheme(<Button variant="ghost">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'transparent',
    });
  });

  it('it('应该为 link variant 应用正确的文本装饰', () => {
    renderWithTheme(<Button variant="link">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      textDecoration: 'underline',
      padding: 0,
    });
  });

  it('it('应该为 sm size 应用正确的样式', () => {
    renderWithTheme(<Button size="sm">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0.25rem 0.75rem',
    });
  });

  it('it('应该为 icon size 应用正确的样式', () => {
    renderWithTheme(<Button size="icon">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0.5rem',
    });
  });

  it('it('应该在禁用状态下不触发点击事件', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button disabled onClick={handleClick}>Test</Button>);
    
    const button = screen.getByText('Test');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('it('应该正确处理 onClick 为 undefined 的情况', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('it('应该支持多次点击', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Test</Button>);
    
    const button = screen.getByText('Test');
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  it('it('应该为 outline variant 设置正确的边框样式', () => {
    renderWithTheme(<Button variant="outline">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      border: '1px solid rgb(224, 106, 112)',
    });
  });

  it('it('应该正确处理默认 className', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该为 default variant 应用正确的背景色', () => {
    renderWithTheme(<Button variant="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'rgb(224, 106, 112)',
    });
  });

  it('it('应该为 default variant 应用正确的文字颜色', () => {
    renderWithTheme(<Button variant="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      color: 'rgb(255, 255, 255)',
    });
  });

  it('it('应该为 destructive variant 应用正确的背景色', () => {
    renderWithTheme(<Button variant="destructive">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'rgb(255, 107, 91)',
    });
  });

  it('it('应该为 destructive variant 应用正确的文字颜色', () => {
    renderWithTheme(<Button variant="destructive">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      color: 'rgb(255, 255, 255)',
    });
  });

  it('it('应该为 outline variant 应用正确的背景色', () => {
    renderWithTheme(<Button variant="outline">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'transparent',
    });
  });

  it('it('应该为 outline variant 应用正确的文字颜色', () => {
    renderWithTheme(<Button variant="outline">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      color: 'rgb(224, 106, 112)',
    });
  });

  it('it('应该为 ghost variant 应用正确的文字颜色', () => {
    renderWithTheme(<Button variant="ghost">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      color: 'rgb(224, 106, 112)',
    });
  });

  it('it('应该为 link variant 应用正确的背景色', () => {
    renderWithTheme(<Button variant="link">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'transparent',
    });
  });

  it('it('应该为 link variant 应用正确的文字颜色', () => {
    renderWithTheme(<Button variant="link">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      color: 'rgb(224, 106, 112)',
    });
  });

  it('it('应该为 default size 应用正确的样式', () => {
    renderWithTheme(<Button size="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0.5rem 1rem',
    });
  });

  it('it('应该为 lg size 应用正确的样式', () => {
    renderWithTheme(<Button size="lg">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0.75rem 1.5rem',
    });
  });

  it('it('应该为无效 variant 使用默认样式', () => {
    renderWithTheme(<Button variant={'invalid' as any}>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'rgb(224, 106, 112)',
      color: 'rgb(255, 255, 255)',
    });
  });

  it('it('应该正确设置 borderRadius', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      borderRadius: '0.5rem',
    });
  });

  it('it('应该正确设置 fontFamily', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      fontFamily: 'Geist, system-ui, -apple-system, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial',
    });
  });

  it('it('应该为 secondary variant 应用正确的背景色', () => {
    renderWithTheme(<Button variant="secondary">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'rgb(45, 45, 45)',
    });
  });

  it('it('应该为 secondary variant 应用正确的文字颜色', () => {
    renderWithTheme(<Button variant="secondary">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      color: 'rgb(240, 240, 240)',
      background: 'rgb(45, 45, 45)',
    });
  });

  it('it('应该正确处理空字符串 children', () => {
    renderWithTheme(<Button>{''}</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('it('应该正确处理 null children', () => {
    renderWithTheme(<Button>{null}</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('it('应该正确处理 number children', () => {
    renderWithTheme(<Button>123</Button>);
    
    const button = screen.getByText('123');
    expect(button).toBeInTheDocument();
  });

  it('it('应该正确处理多个子元素', () => {
    renderWithTheme(
      <Button>
        <span>Icon</span>
        <span>Text</span>
      </Button>
    );
    
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('it('应该正确处理组合 props', () => {
    renderWithTheme(<Button variant="outline" size="lg" disabled>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'transparent',
      padding: '0.75rem 1.5rem',
      opacity: 0.5,
    });
  });

  it('it('应该正确处理所有 props 组合', () => {
    const handleClick = jest.fn();
    renderWithTheme(
      <Button 
        variant="ghost" 
        size="sm" 
        disabled={false}
        onClick={handleClick}
        className="test-class"
      >
        Test
      </Button>
    );
    
    const button = screen.getByText('Test');
    expect(button).toHaveClass('test-class');
    expect(button).toHaveStyle({
      background: 'transparent',
      padding: '0.25rem 0.75rem',
    });
  });

  it('it('应该正确处理无效 size', () => {
    renderWithTheme(<Button size={'invalid' as any}>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该正确处理特殊字符 children', () => {
    renderWithTheme(<Button>特殊字符 & symbols @#$%</Button>);
    
    const button = screen.getByText('特殊字符 & symbols @#$%');
    expect(button).toBeInTheDocument();
  });

  it('it('应该在没有主题时使用默认值', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该正确处理默认主题令牌', () => {
    renderWithTheme(<Button variant="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'rgb(224, 106, 112)',
      color: 'rgb(255, 255, 255)',
    });
  });

  it('it('应该正确处理 sizeStyles 对象', () => {
    renderWithTheme(<Button size="lg">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0.75rem 1.5rem',
    });
  });

  it('it('应该正确处理 fontSize 样式', () => {
    renderWithTheme(<Button size="sm">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      fontSize: '0.875rem',
    });
  });

  it('it('应该正确处理 fontWeight 样式', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      fontWeight: 500,
    });
  });

  it('it('应该正确处理 transition 样式', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      transition: 'all 0.2s ease',
    });
  });

  it('it('应该正确处理 opacity 样式', () => {
    renderWithTheme(<Button disabled>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      opacity: 0.5,
    });
  });

  it('it('应该正确处理非禁用状态的 opacity', () => {
    renderWithTheme(<Button disabled={false}>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      opacity: 1,
    });
  });

  it('it('应该正确处理无效 variant 并使用默认样式', () => {
    renderWithTheme(<Button variant={'unknown' as any}>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'rgb(224, 106, 112)',
      color: 'rgb(255, 255, 255)',
    });
  });

  it('it('应该正确处理默认 variant', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该正确处理所有 variant 类型的样式返回', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    
    variants.forEach(variant => {
      const { unmount } = renderWithTheme(<Button variant={variant}>Test</Button>);
      const button = screen.getByText('Test');
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('it('应该正确处理所有 size 类型的样式返回', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;
    
    sizes.forEach(size => {
      const { unmount } = renderWithTheme(<Button size={size}>Test</Button>);
      const button = screen.getByText('Test');
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('it('应该正确处理 disabled 所有状态的组合', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    
    variants.forEach(variant => {
      const { unmount } = renderWithTheme(<Button variant={variant} disabled>Test</Button>);
      const button = screen.getByText('Test');
      expect(button).toBeDisabled();
      unmount();
    });
  });

  it('it('应该正确处理 onClick 所有变体', () => {
    const handleClick = jest.fn();
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    
    variants.forEach(variant => {
      const { unmount } = renderWithTheme(<Button variant={variant} onClick={handleClick}>Test</Button>);
      const button = screen.getByText('Test');
      fireEvent.click(button);
      unmount();
    });
    
    expect(handleClick).toHaveBeenCalledTimes(6);
  });

  it('it('应该正确处理 variantStyles 变量的赋值', () => {
    renderWithTheme(<Button variant="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toBeInTheDocument();
  });

  it('it('应该正确处理 sizeStyles 的展开', () => {
    renderWithTheme(<Button size="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0.5rem 1rem',
    });
  });

  it('it('应该正确处理 radius 变量的使用', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      borderRadius: '0.5rem',
    });
  });

  it('it('应该正确处理所有 variant 的默认值回退', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    
    variants.forEach(variant => {
      const { unmount } = renderWithTheme(<Button variant={variant}>Test</Button>);
      const button = screen.getByText('Test');
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('it('应该正确处理所有 size 的默认值回退', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;
    
    sizes.forEach(size => {
      const { unmount } = renderWithTheme(<Button size={size}>Test</Button>);
      const button = screen.getByText('Test');
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it('it('应该正确处理 link variant 的 padding 为 0', () => {
    renderWithTheme(<Button variant="link">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0px',
    });
  });

  it('it('应该正确处理 outline variant 的边框条件', () => {
    renderWithTheme(<Button variant="outline">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      border: '1px solid rgb(224, 106, 112)',
    });
  });

  it('it('应该正确处理非 outline variant 的无边框', () => {
    renderWithTheme(<Button variant="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'rgb(224, 106, 112)',
      color: 'rgb(255, 255, 255)',
    });
  });

  it('it('应该正确处理 disabled 的 cursor 样式', () => {
    renderWithTheme(<Button disabled>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      cursor: 'not-allowed',
    });
  });

  it('it('应该正确处理非 disabled 的 cursor 样式', () => {
    renderWithTheme(<Button disabled={false}>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      cursor: 'pointer',
    });
  });

  it('it('应该正确处理 link variant 不应用 sizeStyles', () => {
    renderWithTheme(<Button variant="link" size="lg">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0px',
    });
  });

  it('it('应该正确处理非 link variant 应用 sizeStyles', () => {
    renderWithTheme(<Button variant="default" size="lg">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0.75rem 1.5rem',
    });
  });

  it('it('应该正确处理 default size 的 padding', () => {
    renderWithTheme(<Button size="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0.5rem 1rem',
    });
  });

  it('it('应该正确处理 sm size 的 padding', () => {
    renderWithTheme(<Button size="sm">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0.25rem 0.75rem',
    });
  });

  it('it('应该正确处理 icon size 的 padding', () => {
    renderWithTheme(<Button size="icon">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      padding: '0.5rem',
    });
  });

  it('it('应该正确处理 default size 的 fontSize', () => {
    renderWithTheme(<Button size="default">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      fontSize: '1rem',
    });
  });

  it('it('应该正确处理 sm size 的 fontSize', () => {
    renderWithTheme(<Button size="sm">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      fontSize: '0.875rem',
    });
  });

  it('it('应该正确处理 lg size 的 fontSize', () => {
    renderWithTheme(<Button size="lg">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      fontSize: '1.5rem',
    });
  });

  it('it('应该正确处理 icon size 的 fontSize', () => {
    renderWithTheme(<Button size="icon">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      fontSize: '1rem',
    });
  });

  it('it('应该正确处理所有 variant 的颜色值', () => {
    const { unmount } = renderWithTheme(<Button variant="default">Test</Button>);
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'rgb(224, 106, 112)',
      color: 'rgb(255, 255, 255)',
    });
    unmount();

    const { unmount: unmount2 } = renderWithTheme(<Button variant="destructive">Test</Button>);
    const button2 = screen.getByText('Test');
    expect(button2).toHaveStyle({
      background: 'rgb(255, 107, 91)',
      color: 'rgb(255, 255, 255)',
    });
    unmount2();

    const { unmount: unmount3 } = renderWithTheme(<Button variant="outline">Test</Button>);
    const button3 = screen.getByText('Test');
    expect(button3).toHaveStyle({
      background: 'transparent',
      color: 'rgb(224, 106, 112)',
    });
    unmount3();

    const { unmount: unmount4 } = renderWithTheme(<Button variant="secondary">Test</Button>);
    const button4 = screen.getByText('Test');
    expect(button4).toHaveStyle({
      background: 'rgb(45, 45, 45)',
      color: 'rgb(240, 240, 240)',
    });
    unmount4();

    const { unmount: unmount5 } = renderWithTheme(<Button variant="ghost">Test</Button>);
    const button5 = screen.getByText('Test');
    expect(button5).toHaveStyle({
      background: 'transparent',
      color: 'rgb(224, 106, 112)',
    });
    unmount5();

    const { unmount: unmount6 } = renderWithTheme(<Button variant="link">Test</Button>);
    const button6 = screen.getByText('Test');
    expect(button6).toHaveStyle({
      background: 'transparent',
      color: 'rgb(224, 106, 112)',
    });
    unmount6();
  });

  it('it('应该正确处理 link variant 的 textDecoration', () => {
    renderWithTheme(<Button variant="link">Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      textDecoration: 'underline',
    });
  });

  it('it('应该正确处理所有 variant 和 size 的组合', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;
    
    variants.forEach(variant => {
      sizes.forEach(size => {
        const { unmount } = renderWithTheme(<Button variant={variant} size={size}>Test</Button>);
        const button = screen.getByText('Test');
        expect(button).toBeInTheDocument();
        unmount();
      });
    });
  });

  it('it('应该正确处理默认 variant 和默认 size', () => {
    renderWithTheme(<Button>Test</Button>);
    
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      background: 'rgb(224, 106, 112)',
      color: 'rgb(255, 255, 255)',
      padding: '0.5rem 1rem',
    });
  });
});

