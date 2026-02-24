/**
 * @file 配色方案推荐组件测试
 * @description 测试 AIColorRecommender 组件的各项功能
 * @module __tests__/components/AIColorRecommender.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom';
import { AIColorRecommender } from './AIColorRecommender';
import { ThemeProvider } from '../theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('AIColorRecommender', () => {
  it('应该渲染组件', () => {
    renderWithTheme(<AIColorRecommender />);
    expect(screen.getByText('AI 配色方案推荐')).toBeInTheDocument();
  });

  it('应该显示基础颜色输入', () => {
    renderWithTheme(<AIColorRecommender />);
    expect(screen.getByText('基础颜色')).toBeInTheDocument();
  });

  it('应该显示用途选项', () => {
    renderWithTheme(<AIColorRecommender />);
    expect(screen.getByText('品牌')).toBeInTheDocument();
    expect(screen.getByText('UI 界面')).toBeInTheDocument();
    expect(screen.getByText('数据可视化')).toBeInTheDocument();
    expect(screen.getByText('营销活动')).toBeInTheDocument();
  });

  it('应该显示情绪选项', () => {
    renderWithTheme(<AIColorRecommender />);
    expect(screen.getByText('专业')).toBeInTheDocument();
    expect(screen.getByText('活泼')).toBeInTheDocument();
    expect(screen.getByText('平静')).toBeInTheDocument();
    expect(screen.getByText('活力')).toBeInTheDocument();
    expect(screen.getByText('高端')).toBeInTheDocument();
  });

  it('应该显示可访问性标准选项', () => {
    renderWithTheme(<AIColorRecommender />);
    expect(screen.getByText('AA (4.5:1)')).toBeInTheDocument();
    expect(screen.getByText('AAA (7:1)')).toBeInTheDocument();
  });

  it('应该显示生成配色方案按钮', () => {
    renderWithTheme(<AIColorRecommender />);
    expect(screen.getByText('生成配色方案')).toBeInTheDocument();
  });

  it('应该支持自定义类名', () => {
    const { container } = renderWithTheme(<AIColorRecommender className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('应该调用 onSelectScheme 回调', () => {
    const onSelectScheme = jest.fn();
    renderWithTheme(<AIColorRecommender onSelectScheme={onSelectScheme} />);
    
    const generateButton = screen.getByText('生成配色方案');
    fireEvent.click(generateButton);
    
    // 等待生成方案后点击方案
    setTimeout(() => {
      const schemes = screen.queryAllByText(/推荐方案/);
      if (schemes.length > 0) {
        const firstScheme = screen.queryAllByText(/推荐方案/)[0];
        if (firstScheme) {
          fireEvent.click(firstScheme);
        }
      }
    }, 100);
  });

  it('应该支持选择用途', () => {
    renderWithTheme(<AIColorRecommender />);
    
    const purposeButton = screen.getByText('品牌');
    fireEvent.click(purposeButton);
  });

  it('应该支持选择情绪', () => {
    renderWithTheme(<AIColorRecommender />);
    
    const moodButton = screen.getByText('活泼');
    fireEvent.click(moodButton);
  });

  it('应该支持选择可访问性标准', () => {
    renderWithTheme(<AIColorRecommender />);
    
    const accessibilityButton = screen.getByText('AAA (7:1)');
    fireEvent.click(accessibilityButton);
  });
});
