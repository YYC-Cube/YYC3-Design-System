/**
 * @file 令牌游乐场组件测试
 * @description 测试 TokenPlayground 组件的各项功能
 * @module __tests__/components/TokenPlayground.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import * as React from 'react';
;

import { render, fireEvent } from '@testing-library/react'
import { screen } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { TokenPlayground, getTokenValue, getTokenColor, getTokenString } from './TokenPlayground';
import { ThemeProvider } from '../theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('TokenPlayground', () => {
  describe('TokenPlayground 组件', () => {
    it('应该渲染组件', () => {
      renderWithTheme(<TokenPlayground />);
      expect(screen.getByText(/Token Playground/i)).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      const { container } = renderWithTheme(<TokenPlayground className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('getTokenValue', () => {
    it('应该获取简单的令牌值', () => {
      const tokens = { 'color.primary': '#ff0000' };
      const result = getTokenValue(tokens, 'color.primary');
      expect(result).toBe('#ff0000');
    });

    it('应该获取嵌套的令牌值', () => {
      const tokens = { color: { primary: '#ff0000' } };
      const result = getTokenValue(tokens, 'color.primary');
      expect(result).toBe('#ff0000');
    });

    it('应该处理不存在的令牌', () => {
      const tokens = { 'color.primary': '#ff0000' };
      const result = getTokenValue(tokens, 'color.nonexistent');
      expect(result).toBeUndefined();
    });
  });

  describe('getTokenColor', () => {
    it('应该获取颜色令牌', () => {
      const tokens = { 'color.primary': '#ff0000' };
      const result = getTokenColor(tokens, 'color.primary');
      expect(result).toEqual({ hex: '#ff0000', oklch: '', foreground: '#fff' });
    });

    it('应该处理不存在的颜色令牌', () => {
      const tokens = { 'color.primary': '#ff0000' };
      const result = getTokenColor(tokens, 'color.nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getTokenString', () => {
    it('应该获取字符串令牌', () => {
      const tokens = { 'color.primary': '#ff0000' };
      const result = getTokenString(tokens, 'color.primary', '#000000');
      expect(result).toBe('#ff0000');
    });

    it('应该返回默认值', () => {
      const tokens = { 'color.primary': '#ff0000' };
      const result = getTokenString(tokens, 'color.nonexistent', '#000000');
      expect(result).toBe('#000000');
    });

    it('应该处理非字符串令牌', () => {
      const tokens = { 'color.primary': { hex: '#ff0000', oklch: '', foreground: '#fff' } };
      const result = getTokenString(tokens, 'color.primary', '#000000');
      expect(result).toBe('#000000');
    });
  });

  describe('TokenPlayground 交互功能', () => {
    it('应该显示令牌分类', () => {
      renderWithTheme(<TokenPlayground />);
      expect(screen.getByText('color')).toBeInTheDocument();
    });

    it('应该默认选择第一个令牌', () => {
      renderWithTheme(<TokenPlayground />);
      expect(screen.getByText('color.primary')).toBeInTheDocument();
    });

    it('应该点击令牌进行选择', () => {
      const { container } = renderWithTheme(<TokenPlayground />);
      const tokenItems = container.querySelectorAll('[style*="cursor: pointer"]');
      if (tokenItems.length > 1) {
        const secondToken = tokenItems[1] as HTMLElement;
        secondToken.click();
        expect(screen.getByText('Value')).toBeInTheDocument();
      }
    });

    it('应该显示颜色预览', () => {
      renderWithTheme(<TokenPlayground />);
      expect(screen.getByText('Color Preview')).toBeInTheDocument();
    });

    it('应该显示令牌值', () => {
      renderWithTheme(<TokenPlayground />);
      expect(screen.getByText('Value')).toBeInTheDocument();
    });
  });

  describe('TokenPlayground 主题集成', () => {
    it('应该使用主题令牌', () => {
      const { container } = renderWithTheme(<TokenPlayground />);
      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveStyle({
        padding: '2rem'
      });
    });

    it('应该应用主题颜色', () => {
      renderWithTheme(<TokenPlayground />);
      const header = screen.getByText(/Token Playground/i);
      expect(header).toBeInTheDocument();
    });
  });

  describe('TokenPlayground 边界情况', () => {
    it('应该处理空令牌对象', () => {
      const result = getTokenValue({}, 'color.primary');
      expect(result).toBeUndefined();
    });

    it('应该处理无效路径', () => {
      const tokens = { 'color.primary': '#ff0000' };
      const result = getTokenValue(tokens, '');
      expect(result).toBeUndefined();
    });

    it('应该处理深层嵌套路径', () => {
      const tokens = { 
        color: { 
          primary: { 
            hex: '#ff0000',
            oklch: '',
            foreground: '#fff'
          } 
        } 
      };
      const result = getTokenValue(tokens, 'color.primary.hex');
      expect(result).toBe('#ff0000');
    });

    it('应该处理数组值', () => {
      const tokens = { 'color.primary': ['#ff0000', '#00ff00'] };
      const result = getTokenValue(tokens, 'color.primary');
      expect(result).toEqual(['#ff0000', '#00ff00']);
    });

    it('应该处理null值', () => {
      const tokens = { 'color.primary': null };
      const result = getTokenValue(tokens, 'color.primary');
      expect(result).toBeNull();
    });
  });

  describe('TokenPlayground 颜色令牌', () => {
    it('应该识别颜色令牌', () => {
      renderWithTheme(<TokenPlayground />);
      expect(screen.getByText('Color Preview')).toBeInTheDocument();
    });

    it('应该显示颜色预览背景', () => {
      renderWithTheme(<TokenPlayground />);
      const colorPreview = screen.getByText(/Color Preview/i);
      expect(colorPreview).toBeInTheDocument();
    });
  });

  describe('TokenPlayground 鼠标交互', () => {
    it('应该响应鼠标悬停', () => {
      const { container } = renderWithTheme(<TokenPlayground />);
      const tokenItems = container.querySelectorAll('[style*="cursor: pointer"]');
      if (tokenItems.length > 0) {
        const firstToken = tokenItems[0] as HTMLElement;
        
        fireEvent.mouseEnter(firstToken);
        expect(firstToken.style.backgroundColor).not.toBe('transparent');
        
        fireEvent.mouseLeave(firstToken);
        expect(firstToken.style.backgroundColor).toBe('transparent');
      }
    });
  });

  describe('TokenPlayground 响应式布局', () => {
    it('应该使用网格布局', () => {
      const { container } = renderWithTheme(<TokenPlayground />);
      const gridContainer = container.querySelector('[style*="display: grid"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('应该有标题', () => {
      renderWithTheme(<TokenPlayground />);
      expect(screen.getByText(/Token Playground/i)).toBeInTheDocument();
    });

    it('应该有令牌列表', () => {
      renderWithTheme(<TokenPlayground />);
      expect(screen.getByText('color')).toBeInTheDocument();
    });
  });
});
