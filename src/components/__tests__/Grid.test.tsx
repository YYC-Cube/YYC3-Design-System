import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom';
import { Grid } from '../Grid'
import { ThemeProvider } from '../../theme/ThemeProvider';;

describe('Grid 组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染Grid', () => {
      render(<ThemeProvider>
        <Grid>
          <div>项目1</div>
          <div>项目2</div>
        </Grid></ThemeProvider>);
      expect(screen.getByText('项目1')).toBeInTheDocument();
      expect(screen.getByText('项目2')).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Grid className="custom-grid">
          <div>内容</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('内容').parentElement;
      expect(grid).toHaveClass('custom-grid');
    });

    it('应该支持自定义样式', () => {
      render(<ThemeProvider>
        <Grid style={{ backgroundColor: 'red' }}>
          <div>内容</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('内容').parentElement;
      expect(grid).toHaveStyle({ backgroundColor: 'red' });
    });
  });

  describe('列数配置', () => {
    it('应该渲染默认1列', () => {
      render(<ThemeProvider>
        <Grid>
          <div>项目1</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
      });
    });

    it('应该渲染2列', () => {
      render(<ThemeProvider>
        <Grid cols={2}>
          <div>项目1</div>
          <div>项目2</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      });
    });

    it('应该渲染3列', () => {
      render(<ThemeProvider>
        <Grid cols={3}>
          <div>项目1</div>
          <div>项目2</div>
          <div>项目3</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      });
    });

    it('应该渲染4列', () => {
      render(<ThemeProvider>
        <Grid cols={4}>
          <div>项目1</div>
          <div>项目2</div>
          <div>项目3</div>
          <div>项目4</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      });
    });

    it('应该渲染6列', () => {
      render(<ThemeProvider>
        <Grid cols={6}>
          <div>项目1</div>
          <div>项目2</div>
          <div>项目3</div>
          <div>项目4</div>
          <div>项目5</div>
          <div>项目6</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
      });
    });

    it('应该渲染12列', () => {
      render(<ThemeProvider>
        <Grid cols={12}>
          <div>项目1</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
      });
    });
  });

  describe('间距配置', () => {
    it('应该渲染默认间距', () => {
      render(<ThemeProvider>
        <Grid>
          <div>项目1</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gap: '0.25rem',
      });
    });

    it('应该渲染数字间距', () => {
      render(<ThemeProvider>
        <Grid gap={4}>
          <div>项目1</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gap: '1rem',
      });
    });

    it('应该渲染字符串间距', () => {
      render(<ThemeProvider>
        <Grid gap="20px">
          <div>项目1</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gap: '20px',
      });
    });

    it('应该渲染rem间距', () => {
      render(<ThemeProvider>
        <Grid gap="2rem">
          <div>项目1</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gap: '2rem',
      });
    });
  });

  describe('子元素渲染', () => {
    it('应该渲染单个子元素', () => {
      render(<ThemeProvider>
        <Grid>
          <div>单个项目</div>
        </Grid></ThemeProvider>);
      expect(screen.getByText('单个项目')).toBeInTheDocument();
    });

    it('应该渲染多个子元素', () => {
      render(<ThemeProvider>
        <Grid>
          <div>项目1</div>
          <div>项目2</div>
          <div>项目3</div>
        </Grid></ThemeProvider>);
      expect(screen.getByText('项目1')).toBeInTheDocument();
      expect(screen.getByText('项目2')).toBeInTheDocument();
      expect(screen.getByText('项目3')).toBeInTheDocument();
    });

    it('应该渲染嵌套组件', () => {
      render(<ThemeProvider>
        <Grid>
          <div>
            <span>嵌套内容</span>
          </div>
        </Grid></ThemeProvider>);
      expect(screen.getByText('嵌套内容')).toBeInTheDocument();
    });

    it('应该渲染空Grid', () => {
      const { container } = render(<ThemeProvider><Grid />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('HTML属性', () => {
    it('应该支持id属性', () => {
      render(<ThemeProvider>
        <Grid id="test-grid">
          <div>内容</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('内容').parentElement;
      expect(grid).toHaveAttribute('id', 'test-grid');
    });

    it('应该支持data属性', () => {
      render(<ThemeProvider>
        <Grid data-testid="grid-test">
          <div>内容</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByTestId('grid-test');
      expect(grid).toBeInTheDocument();
    });

    it('应该支持aria属性', () => {
      render(<ThemeProvider>
        <Grid aria-label="网格布局">
          <div>内容</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('内容').parentElement;
      expect(grid).toHaveAttribute('aria-label', '网格布局');
    });
  });

  describe('ref', () => {
    it('应该支持ref转发', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ThemeProvider>
        <Grid ref={ref}>
          <div>内容</div>
        </Grid></ThemeProvider>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('应该能够通过ref访问DOM方法', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ThemeProvider>
        <Grid ref={ref}>
          <div>内容</div>
        </Grid></ThemeProvider>);
      expect(ref.current?.classList.contains('grid')).toBe(true);
    });
  });

  describe('样式计算', () => {
    it('应该正确计算gap为0', () => {
      render(<ThemeProvider>
        <Grid gap={0}>
          <div>项目1</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gap: '0rem',
      });
    });

    it('应该正确计算gap为8', () => {
      render(<ThemeProvider>
        <Grid gap={8}>
          <div>项目1</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        gap: '2rem',
      });
    });

    it('应该正确计算grid display属性', () => {
      render(<ThemeProvider>
        <Grid>
          <div>项目1</div>
        </Grid></ThemeProvider>);
      const grid = screen.getByText('项目1').parentElement;
      expect(grid).toHaveStyle({
        display: 'grid',
      });
    });
  });
});
