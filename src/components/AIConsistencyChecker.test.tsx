/**
 * @file AI 一致性检查组件测试
 * @description 测试 AIConsistencyChecker 组件的各项功能
 * @module __tests__/components/AIConsistencyChecker.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { AIConsistencyChecker } from './AIConsistencyChecker';
import { ThemeProvider } from '../theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('AIConsistencyChecker', () => {
  it('应该渲染组件', () => {
    renderWithTheme(<AIConsistencyChecker />);
    expect(screen.getByText('AI 设计一致性检查')).toBeInTheDocument();
  });

  it('应该显示开始检查按钮', () => {
    renderWithTheme(<AIConsistencyChecker />);
    expect(screen.getByText('开始检查')).toBeInTheDocument();
  });

  it('应该支持自定义类名', () => {
    const { container } = renderWithTheme(<AIConsistencyChecker className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('应该支持自定义 tokens', () => {
    const customTokens = {
      color: {
        primary: '#ff0000',
        secondary: '#00ff00',
        background: '#ffffff',
        foreground: '#000000'
      }
    };
    renderWithTheme(<AIConsistencyChecker tokens={customTokens as any} />);
    
    const checkButton = screen.getByText('开始检查');
    expect(checkButton).toBeInTheDocument();
  });

  it('应该支持点击开始检查按钮', () => {
    renderWithTheme(<AIConsistencyChecker />);
    
    const checkButton = screen.getByText('开始检查');
    fireEvent.click(checkButton);
  });
});
