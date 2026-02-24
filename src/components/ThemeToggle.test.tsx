import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'

import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderWithTheme = (component: React.ReactElement, initial?: 'light' | 'dark') => {
    return render(<ThemeProvider initial={initial}>{component}</ThemeProvider>);
  };

  it('renders correctly', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('toggles theme on click', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });

  it('has correct aria label in light mode', () => {
    renderWithTheme(<ThemeToggle />, 'light');
    const button = screen.getByLabelText('切换到深色模式');
    expect(button).toBeInTheDocument();
  });

  it('has correct aria label in dark mode', () => {
    renderWithTheme(<ThemeToggle />, 'dark');
    const button = screen.getByLabelText('切换到浅色模式');
    expect(button).toBeInTheDocument();
  });

  it('应该正确显示 light 模式的图标', () => {
    renderWithTheme(<ThemeToggle />, 'light');
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🌙');
  });

  it('应该正确显示 dark 模式的图标', () => {
    renderWithTheme(<ThemeToggle />, 'dark');
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('☀️');
  });

  it('应该在 light 模式下显示正确的 title', () => {
    renderWithTheme(<ThemeToggle />, 'light');
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', '深色模式');
  });

  it('应该在 dark 模式下显示正确的 title', () => {
    renderWithTheme(<ThemeToggle />, 'dark');
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', '浅色模式');
  });

  it('应该应用自定义 className', () => {
    renderWithTheme(<ThemeToggle className="custom-toggle" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-toggle');
  });

  it('应该正确设置按钮样式', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('应该正确设置图标样式', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    const icon = button.querySelector('div');
    expect(icon).toBeInTheDocument();
  });

  it('应该正确设置 transition 样式', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('应该在点击时从 light 切换到 dark', () => {
    renderWithTheme(<ThemeToggle />, 'light');
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('🌙');
    fireEvent.click(button);
    expect(button).toHaveTextContent('☀️');
  });

  it('应该在点击时从 dark 切换到 light', () => {
    renderWithTheme(<ThemeToggle />, 'dark');
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('☀️');
    fireEvent.click(button);
    expect(button).toHaveTextContent('🌙');
  });

  it('应该正确处理多次点击', () => {
    renderWithTheme(<ThemeToggle />, 'light');
    const button = screen.getByRole('button');
    
    expect(button).toHaveTextContent('🌙');
    fireEvent.click(button);
    expect(button).toHaveTextContent('☀️');
    fireEvent.click(button);
    expect(button).toHaveTextContent('🌙');
    fireEvent.click(button);
    expect(button).toHaveTextContent('☀️');
  });

  it('应该正确设置 role 属性', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
