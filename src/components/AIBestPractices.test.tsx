/**
 * @file AI 最佳实践建议组件测试
 * @description 测试 AIBestPractices 组件的各项功能
 * @module __tests__/components/AIBestPractices.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { AIBestPractices } from './AIBestPractices';
import { ThemeProvider } from '../context/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('AIBestPractices', () => {
  it('应该渲染组件', () => {
    renderWithTheme(<AIBestPractices />);
    expect(screen.getByText('AI 最佳实践建议')).toBeInTheDocument();
  });

  it('应该显示生成建议按钮', () => {
    renderWithTheme(<AIBestPractices />);
    expect(screen.getByText('生成建议')).toBeInTheDocument();
  });

  it('应该支持自定义类名', () => {
    const { container } = renderWithTheme(<AIBestPractices className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('应该支持点击生成建议按钮', () => {
    renderWithTheme(<AIBestPractices />);

    const generateButton = screen.getByText('生成建议');
    fireEvent.click(generateButton);
  });
});
