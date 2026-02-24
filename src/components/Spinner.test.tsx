import * as React from 'react';
;

import { render, fireEvent } from '@testing-library/react'
import { screen } from '@testing-library/dom';

import { ThemeProvider } from '../theme/ThemeProvider';
import { Spinner } from './Spinner';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Spinner', () => {
  describe('基本渲染', () => {
    it('应该渲染加载指示器', () => {
      renderWithTheme(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('应该有正确的ARIA标签', () => {
      renderWithTheme(<Spinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('应该有旋转动画', () => {
      const { container } = renderWithTheme(<Spinner />);
      const spinner = container.querySelector('div[role="status"]');
      expect(spinner).toHaveStyle({
        animation: 'spin 1s linear infinite'
      });
    });
  });

  describe('尺寸变体', () => {
    it('应该渲染小尺寸Spinner', () => {
      const { container } = renderWithTheme(<Spinner size="sm" />);
      const spinner = container.querySelector('div[role="status"]');
      expect(spinner).toHaveStyle({
        width: '1rem',
        height: '1rem'
      });
    });

    it('应该渲染中等尺寸Spinner（默认）', () => {
      const { container } = renderWithTheme(<Spinner />);
      const spinner = container.querySelector('div[role="status"]');
      expect(spinner).toHaveStyle({
        width: '1.5rem',
        height: '1.5rem'
      });
    });

    it('应该渲染大尺寸Spinner', () => {
      const { container } = renderWithTheme(<Spinner size="lg" />);
      const spinner = container.querySelector('div[role="status"]');
      expect(spinner).toHaveStyle({
        width: '2rem',
        height: '2rem'
      });
    });
  });

  describe('样式', () => {
    it('应该是圆形的', () => {
      const { container } = renderWithTheme(<Spinner />);
      const spinner = container.querySelector('div[role="status"]');
      expect(spinner).toHaveStyle({
        borderRadius: '50%'
      });
    });

    it('应该有边框样式', () => {
      const { container } = renderWithTheme(<Spinner />);
      const spinner = container.querySelector('div[role="status"]');
      const style = spinner?.getAttribute('style');
      expect(style).toContain('solid');
    });

    it('应该应用自定义类名', () => {
      const { container } = renderWithTheme(<Spinner className="custom-spinner" />);
      const spinner = container.querySelector('div[role="status"]');
      expect(spinner).toHaveClass('custom-spinner');
    });
  });

  describe('主题集成', () => {
    it('应该使用主题颜色', () => {
      const { container } = renderWithTheme(<Spinner />);
      const spinner = container.querySelector('div[role="status"]');
      expect(spinner).toHaveStyle({
        borderTopColor: expect.any(String)
      });
    });
  });

  describe('动画', () => {
    it('应该定义旋转关键帧动画', () => {
      const { container } = renderWithTheme(<Spinner />);
      const styleElement = container.querySelector('style');
      expect(styleElement).toBeInTheDocument();
      expect(styleElement?.textContent).toContain('@keyframes spin');
    });

    it('应该包含旋转角度定义', () => {
      const { container } = renderWithTheme(<Spinner />);
      const styleElement = container.querySelector('style');
      expect(styleElement?.textContent).toContain('rotate(0deg)');
      expect(styleElement?.textContent).toContain('rotate(360deg)');
    });
  });
});
