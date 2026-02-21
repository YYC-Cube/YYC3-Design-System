/**
 * @file AI Token 生成器组件测试
 * @description 测试 AITokenGenerator 组件的各项功能
 * @module __tests__/components/AITokenGenerator.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AITokenGenerator } from './AITokenGenerator';
import { ThemeProvider } from '../theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('AITokenGenerator', () => {
  it('应该渲染组件', () => {
    renderWithTheme(<AITokenGenerator />);
    expect(screen.getByText('AI Token 生成器')).toBeInTheDocument();
  });

  it('应该显示基础颜色输入', () => {
    renderWithTheme(<AITokenGenerator />);
    expect(screen.getByText('基础颜色')).toBeInTheDocument();
  });

  it('应该显示色彩和谐选项', () => {
    renderWithTheme(<AITokenGenerator />);
    expect(screen.getByText('互补色')).toBeInTheDocument();
    expect(screen.getByText('类似色')).toBeInTheDocument();
    expect(screen.getByText('三色')).toBeInTheDocument();
    expect(screen.getByText('四色')).toBeInTheDocument();
    expect(screen.getByText('单色')).toBeInTheDocument();
  });

  it('应该显示间距比例滑块', () => {
    renderWithTheme(<AITokenGenerator />);
    expect(screen.getByText(/间距比例:/)).toBeInTheDocument();
  });

  it('应该显示包含色相和色调复选框', () => {
    renderWithTheme(<AITokenGenerator />);
    expect(screen.getByText('包含色相')).toBeInTheDocument();
    expect(screen.getByText('包含色调')).toBeInTheDocument();
  });

  it('应该显示生成令牌按钮', () => {
    renderWithTheme(<AITokenGenerator />);
    expect(screen.getByText('生成令牌')).toBeInTheDocument();
  });

  it('应该支持自定义类名', () => {
    const { container } = renderWithTheme(<AITokenGenerator className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('应该调用 onGenerate 回调', () => {
    const onGenerate = jest.fn();
    renderWithTheme(<AITokenGenerator onGenerate={onGenerate} />);
    
    const generateButton = screen.getByText('生成令牌');
    fireEvent.click(generateButton);
    
    expect(onGenerate).toHaveBeenCalled();
  });

  it('应该支持选择色彩和谐', () => {
    renderWithTheme(<AITokenGenerator />);
    
    const harmonyButton = screen.getByText('互补色');
    fireEvent.click(harmonyButton);
  });

  it('应该支持切换包含色相', () => {
    renderWithTheme(<AITokenGenerator />);
    
    const shadesCheckbox = screen.getByText('包含色相').querySelector('input[type="checkbox"]');
    if (shadesCheckbox) {
      fireEvent.click(shadesCheckbox);
    }
  });

  it('应该支持切换包含色调', () => {
    renderWithTheme(<AITokenGenerator />);
    
    const tintsCheckbox = screen.getByText('包含色调').querySelector('input[type="checkbox"]');
    if (tintsCheckbox) {
      fireEvent.click(tintsCheckbox);
    }
  });
});
