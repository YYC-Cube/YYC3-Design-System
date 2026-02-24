/**
 * @file Divider 组件测试
 * @description 测试 Divider 组件的各项功能
 * @module __tests__/components/Divider.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'


import { Divider } from './Divider';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('Divider 组件', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('应该正确渲染水平分隔符', () => {
    renderWithTheme(<Divider />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('应该正确渲染垂直分隔符', () => {
    renderWithTheme(<Divider orientation="vertical" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('应该正确渲染实线样式', () => {
    renderWithTheme(<Divider variant="solid" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('应该正确渲染虚线样式', () => {
    renderWithTheme(<Divider variant="dashed" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('应该正确渲染垂直虚线样式', () => {
    renderWithTheme(<Divider orientation="vertical" variant="dashed" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('应该应用自定义 className', () => {
    const { container } = renderWithTheme(<Divider className="custom-divider" />);
    
    const divider = container.querySelector('.custom-divider');
    expect(divider).toBeInTheDocument();
  });

  it('应该正确设置 role 属性', () => {
    renderWithTheme(<Divider />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('应该正确设置边框颜色', () => {
    renderWithTheme(<Divider />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toHaveStyle({
      borderColor: 'rgb(160, 160, 160)',
    });
  });

  it('应该正确处理水平实线组合', () => {
    renderWithTheme(<Divider orientation="horizontal" variant="solid" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('应该正确处理水平虚线组合', () => {
    renderWithTheme(<Divider orientation="horizontal" variant="dashed" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('应该正确处理垂直实线组合', () => {
    renderWithTheme(<Divider orientation="vertical" variant="solid" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('应该正确处理垂直虚线组合', () => {
    renderWithTheme(<Divider orientation="vertical" variant="dashed" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('应该正确处理所有默认值', () => {
    renderWithTheme(<Divider />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });

  it('应该正确处理自定义 className 和默认值', () => {
    const { container } = renderWithTheme(<Divider className="custom" />);
    
    const divider = container.querySelector('.custom');
    expect(divider).toBeInTheDocument();
  });
});
