/**
 * @file 颜色对比度检查组件测试
 * @description 测试 ColorContrastChecker 组件的各项功能
 * @module __tests__/components/ColorContrastChecker.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { ColorContrastChecker } from './ColorContrastChecker';
import { ThemeProvider } from '../context/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ColorContrastChecker', () => {
  it('应该渲染组件', () => {
    renderWithTheme(<ColorContrastChecker />);
    expect(screen.getByText('Color Contrast Checker')).toBeInTheDocument();
  });

  it('应该显示前景色输入', () => {
    renderWithTheme(<ColorContrastChecker />);
    expect(screen.getByText('Foreground Color')).toBeInTheDocument();
  });

  it('应该显示背景色输入', () => {
    renderWithTheme(<ColorContrastChecker />);
    expect(screen.getByText('Background Color')).toBeInTheDocument();
  });

  it('应该显示对比度结果', () => {
    renderWithTheme(<ColorContrastChecker />);
    expect(screen.getByText(/Contrast Ratio/)).toBeInTheDocument();
  });

  it('应该支持自定义类名', () => {
    const { container } = renderWithTheme(<ColorContrastChecker className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('应该显示 WCAG 评级', () => {
    renderWithTheme(<ColorContrastChecker />);
    expect(screen.getByText(/WCAG Rating/)).toBeInTheDocument();
  });
});
