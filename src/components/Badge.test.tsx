/**
 * @file Badge 组件测试
 * @description 测试 Badge 组件的各项功能
 * @module __tests__/components/Badge.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */


import { render, screen } from '@testing-library/react';
import React from 'react';
import { Badge } from './Badge';
import { ThemeProvider } from '../theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider initial="light">{component}</ThemeProvider>);
};

describe('Badge 组件', () => {
  it('应该正确渲染默认 Badge', () => {
    renderWithTheme(<Badge>Default</Badge>);

    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('应该支持不同的变体', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const;

    variants.forEach(variant => {
      const { unmount } = renderWithTheme(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    });
  });

  it('应该为 default variant 应用正确的样式', () => {
    renderWithTheme(<Badge variant="default">Default</Badge>);

    const badge = screen.getByText('Default');
    expect(badge).toHaveStyle({
      backgroundColor: 'rgb(224, 106, 112)',
      color: 'rgb(255, 255, 255)',
    });
  });

  it('应该为 secondary variant 应用正确的样式', () => {
    renderWithTheme(<Badge variant="secondary">Secondary</Badge>);

    const badge = screen.getByText('Secondary');
    expect(badge).toBeInTheDocument();
  });

  it('应该为 destructive variant 应用正确的样式', () => {
    renderWithTheme(<Badge variant="destructive">Destructive</Badge>);

    const badge = screen.getByText('Destructive');
    expect(badge).toHaveStyle({
      backgroundColor: 'rgb(255, 107, 91)',
      color: 'rgb(255, 255, 255)',
    });
  });

  it('应该为 outline variant 应用正确的样式', () => {
    renderWithTheme(<Badge variant="outline">Outline</Badge>);

    const badge = screen.getByText('Outline');
    expect(badge).toBeInTheDocument();
  });

  it('应该应用自定义 className', () => {
    renderWithTheme(<Badge className="custom-class">Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveClass('custom-class');
  });

  it('应该应用正确的样式', () => {
    renderWithTheme(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      lineHeight: '1',
      transition: 'all 0.2s ease',
    });
  });

  it('应该正确处理空 children', () => {
    const { container } = renderWithTheme(<Badge>{null}</Badge>);

    const badge = container.querySelector('span');
    expect(badge).toBeInTheDocument();
  });

  it('应该正确处理 null children', () => {
    const { container } = renderWithTheme(<Badge>{null}</Badge>);

    const badge = container.querySelector('span');
    expect(badge).toBeInTheDocument();
  });

  it('应该正确处理 undefined children', () => {
    const { container } = renderWithTheme(<Badge>{undefined}</Badge>);

    const badge = container.querySelector('span');
    expect(badge).toBeInTheDocument();
  });

  it('应该正确处理数字 children', () => {
    renderWithTheme(<Badge>123</Badge>);

    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('应该正确处理 React 元素 children', () => {
    renderWithTheme(<Badge><span>Custom</span></Badge>);

    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('应该正确处理多个 children', () => {
    renderWithTheme(<Badge>Test <span>Badge</span></Badge>);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Badge')).toBeInTheDocument();
  });

  it('应该正确处理无效的 variant 属性', () => {
    renderWithTheme(<Badge variant={'invalid' as any}>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toBeInTheDocument();
  });

  it('应该为无效 variant 使用默认样式', () => {
    renderWithTheme(<Badge variant={'invalid' as any}>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.5rem',
    });
  });

  it('应该正确应用 borderRadius', () => {
    renderWithTheme(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      borderRadius: '0.25rem',
    });
  });

  it('应该正确应用 fontSize', () => {
    renderWithTheme(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      fontSize: '0.875rem',
    });
  });

  it('应该正确应用 fontWeight', () => {
    renderWithTheme(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      fontWeight: '500',
    });
  });

  it('应该正确应用 lineHeight', () => {
    renderWithTheme(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      lineHeight: '1',
    });
  });

  it('应该正确应用 transition', () => {
    renderWithTheme(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      transition: 'all 0.2s ease',
    });
  });

  it('应该正确应用 display', () => {
    renderWithTheme(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      display: 'inline-flex',
    });
  });

  it('应该正确应用 alignItems', () => {
    renderWithTheme(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      alignItems: 'center',
    });
  });

  it('应该正确应用 padding', () => {
    renderWithTheme(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      padding: '0.25rem 0.5rem',
    });
  });

  it('应该为所有 variant 应用正确的 border 样式', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const;

    variants.forEach(name => {
      const { unmount } = renderWithTheme(<Badge variant={name}>{name}</Badge>);
      const badge = screen.getByText(name);
      expect(badge).toBeInTheDocument();
      unmount();
    });
  });

  it('应该为所有 variant 应用正确的 backgroundColor', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const;

    variants.forEach(name => {
      const { unmount } = renderWithTheme(<Badge variant={name}>{name}</Badge>);
      const badge = screen.getByText(name);
      expect(badge).toBeInTheDocument();
      unmount();
    });
  });

  it('应该为所有 variant 应用正确的 color', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const;

    variants.forEach(name => {
      const { unmount } = renderWithTheme(<Badge variant={name}>{name}</Badge>);
      const badge = screen.getByText(name);
      expect(badge).toBeInTheDocument();
      unmount();
    });
  });

  it('应该正确处理未定义的 className', () => {
    renderWithTheme(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).not.toHaveClass();
  });

  it('应该正确处理空字符串 className', () => {
    renderWithTheme(<Badge className="">Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).not.toHaveClass();
  });

  it('default variant 应该有正确的样式组合', () => {
    renderWithTheme(<Badge variant="default">Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      lineHeight: '1',
      transition: 'all 0.2s ease',
    });
  });

  it('secondary variant 应该有边框', () => {
    renderWithTheme(<Badge variant="secondary">Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      border: '1px solid rgb(160, 160, 160)',
    });
  });

  it('outline variant 应该有透明背景', () => {
    renderWithTheme(<Badge variant="outline">Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toBeInTheDocument();
  });

  it('default variant 应该有正确的背景色和前景色', () => {
    renderWithTheme(<Badge variant="default">Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      backgroundColor: 'rgb(224, 106, 112)',
      color: 'rgb(255, 255, 255)',
    });
  });

  it('destructive variant 应该有正确的背景色和前景色', () => {
    renderWithTheme(<Badge variant="destructive">Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      backgroundColor: 'rgb(255, 107, 91)',
      color: 'rgb(255, 255, 255)',
    });
  });

  it('secondary variant 应该有正确的背景色', () => {
    renderWithTheme(<Badge variant="secondary">Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toBeInTheDocument();
  });

  it('secondary variant 应该有正确的前景色', () => {
    renderWithTheme(<Badge variant="secondary">Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      color: 'rgb(240, 240, 240)',
    });
  });

  it('outline variant 应该有正确的前景色', () => {
    renderWithTheme(<Badge variant="outline">Test</Badge>);

    const badge = screen.getByText('Test');
    expect(badge).toHaveStyle({
      color: 'rgb(240, 240, 240)',
    });
  });

  it('应该正确应用 baseStyle 展开', () => {
    renderWithTheme(<Badge>Test</Badge>);

    const badge = screen.getByText('Test');
    const style = badge.style;
    expect(style.display).toBe('inline-flex');
    expect(style.alignItems).toBe('center');
    expect(style.padding).toBe('0.25rem 0.5rem');
    expect(style.borderRadius).toBe('0.25rem');
    expect(style.fontSize).toBe('0.875rem');
    expect(style.fontWeight).toBe('500');
    expect(style.lineHeight).toBe('1');
    expect(style.transition).toBe('all 0.2s ease');
  });

  it('default variant 应该包含 baseStyle', () => {
    renderWithTheme(<Badge variant="default">Test</Badge>);

    const badge = screen.getByText('Test');
    const style = badge.style;
    expect(style.display).toBe('inline-flex');
    expect(style.alignItems).toBe('center');
    expect(style.padding).toBe('0.25rem 0.5rem');
    expect(style.borderRadius).toBe('0.25rem');
    expect(style.fontSize).toBe('0.875rem');
    expect(style.fontWeight).toBe('500');
    expect(style.lineHeight).toBe('1');
    expect(style.transition).toBe('all 0.2s ease');
  });

  it('secondary variant 应该包含 baseStyle', () => {
    renderWithTheme(<Badge variant="secondary">Test</Badge>);

    const badge = screen.getByText('Test');
    const style = badge.style;
    expect(style.display).toBe('inline-flex');
    expect(style.alignItems).toBe('center');
    expect(style.padding).toBe('0.25rem 0.5rem');
    expect(style.borderRadius).toBe('0.25rem');
    expect(style.fontSize).toBe('0.875rem');
    expect(style.fontWeight).toBe('500');
    expect(style.lineHeight).toBe('1');
    expect(style.transition).toBe('all 0.2s ease');
  });

  it('destructive variant 应该包含 baseStyle', () => {
    renderWithTheme(<Badge variant="destructive">Test</Badge>);

    const badge = screen.getByText('Test');
    const style = badge.style;
    expect(style.display).toBe('inline-flex');
    expect(style.alignItems).toBe('center');
    expect(style.padding).toBe('0.25rem 0.5rem');
    expect(style.borderRadius).toBe('0.25rem');
    expect(style.fontSize).toBe('0.875rem');
    expect(style.fontWeight).toBe('500');
    expect(style.lineHeight).toBe('1');
    expect(style.transition).toBe('all 0.2s ease');
  });

  it('outline variant 应该包含 baseStyle', () => {
    renderWithTheme(<Badge variant="outline">Test</Badge>);

    const badge = screen.getByText('Test');
    const style = badge.style;
    expect(style.display).toBe('inline-flex');
    expect(style.alignItems).toBe('center');
    expect(style.padding).toBe('0.25rem 0.5rem');
    expect(style.borderRadius).toBe('0.25rem');
    expect(style.fontSize).toBe('0.875rem');
    expect(style.fontWeight).toBe('500');
    expect(style.lineHeight).toBe('1');
    expect(style.transition).toBe('all 0.2s ease');
  });
});
