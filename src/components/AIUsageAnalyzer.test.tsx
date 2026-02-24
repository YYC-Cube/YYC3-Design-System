/**
 * @file AI 使用模式分析组件测试
 * @description 测试 AIUsageAnalyzer 组件的各项功能
 * @module __tests__/components/AIUsageAnalyzer.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import * as React from 'react';
;

import { render, fireEvent } from '@testing-library/react'
import { screen } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { AIUsageAnalyzer } from './AIUsageAnalyzer';
import { ThemeProvider } from '../theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('AIUsageAnalyzer', () => {
  it('应该渲染组件', () => {
    renderWithTheme(<AIUsageAnalyzer />);
    expect(screen.getByText('AI 使用模式分析')).toBeInTheDocument();
  });

  it('应该显示开始分析按钮', () => {
    renderWithTheme(<AIUsageAnalyzer />);
    expect(screen.getByText('开始分析')).toBeInTheDocument();
  });

  it('应该支持自定义类名', () => {
    const { container } = renderWithTheme(<AIUsageAnalyzer className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('应该支持点击开始分析按钮', () => {
    renderWithTheme(<AIUsageAnalyzer />);
    
    const analyzeButton = screen.getByText('开始分析');
    fireEvent.click(analyzeButton);
  });
});
