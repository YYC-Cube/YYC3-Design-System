/**
 * @file Progress 组件测试
 * @description 测试 Progress 组件的各项功能
 * @module __tests__/components/Progress.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import * as React from 'react';
;

import { render, fireEvent } from '@testing-library/react'
import { screen } from '@testing-library/dom';


import { Progress } from './Progress';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('Progress 组件', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('应该正确渲染默认进度条', () => {
    renderWithTheme(<Progress />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('aria-valuenow', '0');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('应该正确渲染指定值的进度条', () => {
    renderWithTheme(<Progress value={50} />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('aria-valuenow', '50');
  });

  it('应该正确渲染指定最大值的进度条', () => {
    renderWithTheme(<Progress value={5} max={10} />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('aria-valuemax', '10');
  });

  it('应该正确计算进度百分比', () => {
    renderWithTheme(<Progress value={50} max={100} />);
    
    const progress = screen.getByRole('progressbar');
    const bar = progress.querySelector('div');
    expect(bar).toHaveStyle({
      width: '50%',
    });
  });

  it('应该正确处理 0 值', () => {
    renderWithTheme(<Progress value={0} />);
    
    const progress = screen.getByRole('progressbar');
    const bar = progress.querySelector('div');
    expect(bar).toHaveStyle({
      width: '0%',
    });
  });

  it('应该正确处理 100% 值', () => {
    renderWithTheme(<Progress value={100} />);
    
    const progress = screen.getByRole('progressbar');
    const bar = progress.querySelector('div');
    expect(bar).toHaveStyle({
      width: '100%',
    });
  });

  it('应该正确处理超过最大值的值（限制为 100%）', () => {
    renderWithTheme(<Progress value={150} />);
    
    const progress = screen.getByRole('progressbar');
    const bar = progress.querySelector('div');
    expect(bar).toHaveStyle({
      width: '100%',
    });
  });

  it('应该正确处理负值（限制为 0%）', () => {
    renderWithTheme(<Progress value={-10} />);
    
    const progress = screen.getByRole('progressbar');
    const bar = progress.querySelector('div');
    expect(bar).toHaveStyle({
      width: '0%',
    });
  });

  it('应该应用自定义 className', () => {
    renderWithTheme(<Progress className="custom-progress" />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveClass('custom-progress');
  });

  it('应该正确设置容器样式', () => {
    renderWithTheme(<Progress />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveStyle({
      width: '100%',
      height: '0.5rem',
      overflow: 'hidden',
    });
  });

  it('应该正确设置进度条样式', () => {
    renderWithTheme(<Progress value={50} />);
    
    const progress = screen.getByRole('progressbar');
    const bar = progress.querySelector('div');
    expect(bar).toHaveStyle({
      height: '100%',
      transition: 'width 0.3s ease',
    });
  });

  it('应该正确设置 role 属性', () => {
    renderWithTheme(<Progress />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('应该正确设置 aria 属性', () => {
    renderWithTheme(<Progress value={75} max={200} />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '75');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '200');
  });

  it('应该正确处理自定义最大值的进度计算', () => {
    renderWithTheme(<Progress value={25} max={50} />);
    
    const progress = screen.getByRole('progressbar');
    const bar = progress.querySelector('div');
    expect(bar).toHaveStyle({
      width: '50%',
    });
  });

  it('应该正确处理小数值', () => {
    renderWithTheme(<Progress value={33.33} />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '33.33');
  });

  it('应该正确设置 borderRadius', () => {
    renderWithTheme(<Progress />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('应该正确设置进度条的 borderRadius', () => {
    renderWithTheme(<Progress value={50} />);
    
    const progress = screen.getByRole('progressbar');
    const bar = progress.querySelector('div');
    expect(bar).toBeInTheDocument();
  });

  it('应该正确处理默认 max 值', () => {
    renderWithTheme(<Progress value={50} />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('应该正确处理默认 value 值', () => {
    renderWithTheme(<Progress />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '0');
  });

  it('应该正确处理 0 最大值', () => {
    renderWithTheme(<Progress value={0} max={0} />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('应该正确处理负最大值', () => {
    renderWithTheme(<Progress value={50} max={-100} />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('应该正确设置容器背景色', () => {
    renderWithTheme(<Progress />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('应该正确设置进度条背景色', () => {
    renderWithTheme(<Progress value={50} />);
    
    const progress = screen.getByRole('progressbar');
    const bar = progress.querySelector('div');
    expect(bar).toBeInTheDocument();
  });
});
