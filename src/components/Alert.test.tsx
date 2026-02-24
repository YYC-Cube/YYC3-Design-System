/**
 * @file Alert 组件测试
 * @description 测试 Alert 组件的各项功能
 * @module __tests__/components/Alert.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen, fireEvent, waitFor } from '@testing-library/dom';;;

import { Alert } from './Alert';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('Alert 组件', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('it('应该正确渲染默认 Alert', () => {
    renderWithTheme(<Alert>Default alert message</Alert>);
    
    expect(screen.getByText('Default alert message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('it('应该显示正确的图标', () => {
    const { unmount } = renderWithTheme(<Alert variant="default">Test</Alert>);
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
    unmount();

    renderWithTheme(<Alert variant="destructive">Test</Alert>);
    expect(screen.getByText('⚠️')).toBeInTheDocument();

    renderWithTheme(<Alert variant="warning">Test</Alert>);
    expect(screen.getByText('⚡')).toBeInTheDocument();

    renderWithTheme(<Alert variant="success">Test</Alert>);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('it('应该应用正确的样式', () => {
    renderWithTheme(<Alert variant="default">Test message</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
    });
  });

  it('it('应该支持 destructive variant', () => {
    renderWithTheme(<Alert variant="destructive">Error message</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveStyle({
      borderLeft: '4px solid rgb(255, 107, 91)',
    });
  });

  it('it('应该支持 warning variant', () => {
    renderWithTheme(<Alert variant="warning">Warning message</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveStyle({
      backgroundColor: 'rgb(255, 243, 205)',
      borderLeft: '4px solid rgb(255, 193, 7)',
    });
  });

  it('it('应该支持 success variant', () => {
    renderWithTheme(<Alert variant="success">Success message</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveStyle({
      backgroundColor: 'rgb(212, 237, 218)',
      borderLeft: '4px solid rgb(40, 167, 69)',
    });
  });

  it('it('应该应用自定义 className', () => {
    renderWithTheme(<Alert className="custom-class">Test</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });

  it('it('应该正确渲染复杂内容', () => {
    renderWithTheme(
      <Alert>
        <div>
          <strong>Important:</strong> This is a complex alert message.
        </div>
      </Alert>
    );
    
    expect(screen.getByText('Important:')).toBeInTheDocument();
    expect(screen.getByText('This is a complex alert message.')).toBeInTheDocument();
  });

  it('it('应该正确处理图标样式', () => {
    renderWithTheme(<Alert>Test</Alert>);
    
    const icon = screen.getByText('ℹ️');
    expect(icon).toHaveStyle({
      fontSize: '1.25rem',
    });
  });

  it('it('应该正确设置边框样式', () => {
    const variants = ['default', 'destructive', 'warning', 'success'] as const;

    variants.forEach(variant => {
      const { unmount } = renderWithTheme(<Alert variant={variant}>Test</Alert>);
      const alert = screen.getByRole('alert');
      expect(alert).toHaveStyle({
        borderLeft: expect.stringContaining('4px solid'),
      });
      unmount();
    });
  });

  it('it('应该为 default variant 应用正确的样式', () => {
    renderWithTheme(<Alert variant="default">Test</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveStyle({
      backgroundColor: 'rgb(26, 26, 26)',
      borderLeft: '4px solid rgb(224, 106, 112)',
      color: 'rgb(240, 240, 240)',
    });
  });

  it('it('应该为 destructive variant 应用正确的样式', () => {
    renderWithTheme(<Alert variant="destructive">Test</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveStyle({
      backgroundColor: 'rgb(255, 107, 91)',
      borderLeft: '4px solid rgb(255, 107, 91)',
      color: 'rgb(255, 255, 255)',
    });
  });

  it('it('应该为 warning variant 应用正确的样式', () => {
    renderWithTheme(<Alert variant="warning">Test</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveStyle({
      backgroundColor: 'rgb(255, 243, 205)',
      borderLeft: '4px solid rgb(255, 193, 7)',
      color: 'rgb(133, 100, 4)',
    });
  });

  it('it('应该为 success variant 应用正确的样式', () => {
    renderWithTheme(<Alert variant="success">Test</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveStyle({
      backgroundColor: 'rgb(212, 237, 218)',
      borderLeft: '4px solid rgb(40, 167, 69)',
      color: 'rgb(21, 87, 36)',
    });
  });

  it('it('应该正确设置 gap 样式', () => {
    renderWithTheme(<Alert>Test</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveStyle({
      gap: '0.5rem',
    });
  });

  it('it('应该正确设置 borderRadius', () => {
    renderWithTheme(<Alert>Test</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveStyle({
      borderRadius: '0.25rem',
    });
  });

  it('it('应该正确设置 role 属性', () => {
    renderWithTheme(<Alert>Test</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('it('应该正确处理默认 variant', () => {
    renderWithTheme(<Alert>Test</Alert>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('it('应该正确处理无效 variant（使用默认值）', () => {
    renderWithTheme(<Alert variant={'invalid' as any}>Test</Alert>);
    
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeInTheDocument();
    expect(alertElement).toHaveStyle({
      backgroundColor: 'rgb(26, 26, 26)',
      color: 'rgb(240, 240, 240)',
    });
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });

  it('it('应该正确渲染多个 Alert 实例', () => {
    renderWithTheme(
      <>
        <Alert variant="default">First alert</Alert>
        <Alert variant="warning">Second alert</Alert>
        <Alert variant="success">Third alert</Alert>
      </>
    );
    
    expect(screen.getByText('First alert')).toBeInTheDocument();
    expect(screen.getByText('Second alert')).toBeInTheDocument();
    expect(screen.getByText('Third alert')).toBeInTheDocument();
  });

  it('it('应该正确处理空 children', () => {
    renderWithTheme(<Alert></Alert>);
    
    const icon = screen.getByText('ℹ️');
    expect(icon).toBeInTheDocument();
  });

  it('it('应该正确处理 null children', () => {
    renderWithTheme(<Alert>{null}</Alert>);
    
    const icon = screen.getByText('ℹ️');
    expect(icon).toBeInTheDocument();
  });

  it('it('应该正确处理 React Fragment 作为 children', () => {
    renderWithTheme(
      <Alert>
        <>
          <span>Line 1</span>
          <span>Line 2</span>
        </>
      </Alert>
    );
    
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
  });

  it('it('应该为每个 variant 设置正确的 borderLeft 样式', () => {
    const variants = [
      { name: 'default' as const, expectedBorder: '4px solid rgb(224, 106, 112)' },
      { name: 'destructive' as const, expectedBorder: '4px solid rgb(255, 107, 91)' },
      { name: 'warning' as const, expectedBorder: '4px solid rgb(255, 193, 7)' },
      { name: 'success' as const, expectedBorder: '4px solid rgb(40, 167, 69)' },
    ];

    variants.forEach(({ name, expectedBorder }) => {
      const { unmount } = renderWithTheme(<Alert variant={name}>Test</Alert>);
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({
        borderLeft: expectedBorder,
      });
      unmount();
    });
  });

  it('it('应该为每个 variant 设置正确的 backgroundColor', () => {
    const variants = [
      { name: 'default' as const, expectedBg: 'rgb(26, 26, 26)' },
      { name: 'destructive' as const, expectedBg: 'rgb(255, 107, 91)' },
      { name: 'warning' as const, expectedBg: 'rgb(255, 243, 205)' },
      { name: 'success' as const, expectedBg: 'rgb(212, 237, 218)' },
    ];

    variants.forEach(({ name, expectedBg }) => {
      const { unmount } = renderWithTheme(<Alert variant={name}>Test</Alert>);
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({
        backgroundColor: expectedBg,
      });
      unmount();
    });
  });

  it('it('应该为每个 variant 设置正确的 color', () => {
    const variants = [
      { name: 'default' as const, expectedColor: 'rgb(240, 240, 240)' },
      { name: 'destructive' as const, expectedColor: 'rgb(255, 255, 255)' },
      { name: 'warning' as const, expectedColor: 'rgb(133, 100, 4)' },
      { name: 'success' as const, expectedColor: 'rgb(21, 87, 36)' },
    ];

    variants.forEach(({ name, expectedColor }) => {
      const { unmount } = renderWithTheme(<Alert variant={name}>Test</Alert>);
      const alertEl = screen.getByRole('alert');
      expect(alertEl).toHaveStyle({
        color: expectedColor,
      });
      unmount();
    });
  });

  it('it('应该正确处理未定义的 className', () => {
    renderWithTheme(<Alert>Test</Alert>);
    
    const alertElement = screen.getByRole('alert');
    expect(alertElement).not.toHaveClass();
  });

  it('it('应该正确处理空字符串 className', () => {
    renderWithTheme(<Alert className="">Test</Alert>);
    
    const alertElement = screen.getByRole('alert');
    expect(alertElement).not.toHaveClass();
  });

  describe('当 tokens 缺失时使用默认值', () => {
    it('it('default variant 应该使用默认背景色', () => {
      renderWithTheme(<Alert variant="default">Test</Alert>);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({
        backgroundColor: 'rgb(26, 26, 26)',
      });
    });

    it('it('destructive variant 应该使用默认背景色', () => {
      renderWithTheme(<Alert variant="destructive">Test</Alert>);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({
        backgroundColor: 'rgb(255, 107, 91)',
      });
    });

    it('it('warning variant 应该使用硬编码颜色', () => {
      renderWithTheme(<Alert variant="warning">Test</Alert>);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({
        backgroundColor: 'rgb(255, 243, 205)',
      });
    });

    it('it('success variant 应该使用硬编码颜色', () => {
      renderWithTheme(<Alert variant="success">Test</Alert>);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({
        backgroundColor: 'rgb(212, 237, 218)',
      });
    });

    it('it('应该使用默认 borderRadius', () => {
      renderWithTheme(<Alert>Test</Alert>);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({
        borderRadius: '0.25rem',
      });
    });

    it('it('default variant 应该使用默认前景色', () => {
      renderWithTheme(<Alert variant="default">Test</Alert>);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({
        color: 'rgb(240, 240, 240)',
      });
    });

    it('it('destructive variant 应该使用默认前景色', () => {
      renderWithTheme(<Alert variant="destructive">Test</Alert>);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({
        color: 'rgb(255, 255, 255)',
      });
    });

    it('it('default variant 应该使用默认边框色', () => {
      renderWithTheme(<Alert variant="default">Test</Alert>);
      
      const alertElement = screen.getByRole('alert');
      expect(alertElement).toHaveStyle({
        borderLeft: '4px solid rgb(224, 106, 112)',
      });
    });
  });
});
