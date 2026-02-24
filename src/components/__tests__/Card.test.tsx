import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom';
import { Card } from '../Card'
import { ThemeProvider } from '../../theme/ThemeProvider';;

describe('Card 组件', () => {
  describe('Card 基础渲染', () => {
    it('应该正确渲染Card', () => {
      render(<ThemeProvider><Card>卡片内容</Card></ThemeProvider>);
      const card = screen.getByText('卡片内容');
      expect(card).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider><Card className="custom-class">卡片</Card></ThemeProvider>);
      const card = screen.getByText('卡片');
      expect(card).toHaveClass('custom-class');
    });

    it('应该支持自定义样式', () => {
      render(<ThemeProvider><Card style={{ width: '300px' }}>卡片</Card></ThemeProvider>);
      const card = screen.getByText('卡片');
      expect(card).toHaveStyle({ width: '300px' });
    });
  });

  describe('CardHeader 组件', () => {
    it('应该正确渲染CardHeader', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Header>标题</Card.Header>
        </Card></ThemeProvider>);
      const header = screen.getByText('标题');
      expect(header).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Header className="custom-header">标题</Card.Header>
        </Card></ThemeProvider>);
      const header = screen.getByText('标题');
      expect(header).toHaveClass('custom-header');
    });

    it('应该支持自定义样式', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Header style={{ padding: '20px' }}>标题</Card.Header>
        </Card></ThemeProvider>);
      const header = screen.getByText('标题');
      expect(header).toHaveStyle({ padding: '20px' });
    });
  });

  describe('CardTitle 组件', () => {
    it('应该正确渲染CardTitle', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Title>卡片标题</Card.Title>
        </Card></ThemeProvider>);
      const title = screen.getByText('卡片标题');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H3');
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Title className="custom-title">标题</Card.Title>
        </Card></ThemeProvider>);
      const title = screen.getByText('标题');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardDescription 组件', () => {
    it('应该正确渲染CardDescription', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Description>卡片描述</Card.Description>
        </Card></ThemeProvider>);
      const description = screen.getByText('卡片描述');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Description className="custom-desc">描述</Card.Description>
        </Card></ThemeProvider>);
      const description = screen.getByText('描述');
      expect(description).toHaveClass('custom-desc');
    });
  });

  describe('CardContent 组件', () => {
    it('应该正确渲染CardContent', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Content>内容</Card.Content>
        </Card></ThemeProvider>);
      const content = screen.getByText('内容');
      expect(content).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Content className="custom-content">内容</Card.Content>
        </Card></ThemeProvider>);
      const content = screen.getByText('内容');
      expect(content).toHaveClass('custom-content');
    });

    it('应该支持自定义样式', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Content style={{ padding: '20px' }}>内容</Card.Content>
        </Card></ThemeProvider>);
      const content = screen.getByText('内容');
      expect(content).toHaveStyle({ padding: '20px' });
    });
  });

  describe('CardFooter 组件', () => {
    it('应该正确渲染CardFooter', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Footer>底部</Card.Footer>
        </Card></ThemeProvider>);
      const footer = screen.getByText('底部');
      expect(footer).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Footer className="custom-footer">底部</Card.Footer>
        </Card></ThemeProvider>);
      const footer = screen.getByText('底部');
      expect(footer).toHaveClass('custom-footer');
    });

    it('应该支持自定义样式', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Footer style={{ padding: '20px' }}>底部</Card.Footer>
        </Card></ThemeProvider>);
      const footer = screen.getByText('底部');
      expect(footer).toHaveStyle({ padding: '20px' });
    });
  });

  describe('组合使用', () => {
    it('应该正确渲染完整的Card结构', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Header>
            <Card.Title>标题</Card.Title>
            <Card.Description>描述</Card.Description>
          </Card.Header>
          <Card.Content>内容</Card.Content>
          <Card.Footer>底部</Card.Footer>
        </Card></ThemeProvider>);

      expect(screen.getByText('标题')).toBeInTheDocument();
      expect(screen.getByText('描述')).toBeInTheDocument();
      expect(screen.getByText('内容')).toBeInTheDocument();
      expect(screen.getByText('底部')).toBeInTheDocument();
    });

    it('应该支持多个CardContent', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Content>内容1</Card.Content>
          <Card.Content>内容2</Card.Content>
        </Card></ThemeProvider>);

      expect(screen.getByText('内容1')).toBeInTheDocument();
      expect(screen.getByText('内容2')).toBeInTheDocument();
    });

    it('应该支持嵌套组件', () => {
      render(<ThemeProvider>
        <Card>
          <Card.Content>
            <div>嵌套内容</div>
            <button>按钮</button>
          </Card.Content>
        </Card></ThemeProvider>);

      expect(screen.getByText('嵌套内容')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('ref', () => {
    it('Card应该支持ref转发', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ThemeProvider><Card ref={ref}>卡片</Card></ThemeProvider>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('CardHeader应该支持ref转发', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ThemeProvider>
        <Card>
          <Card.Header ref={ref}>标题</Card.Header>
        </Card></ThemeProvider>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('CardContent应该支持ref转发', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ThemeProvider>
        <Card>
          <Card.Content ref={ref}>内容</Card.Content>
        </Card></ThemeProvider>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('CardFooter应该支持ref转发', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ThemeProvider>
        <Card>
          <Card.Footer ref={ref}>底部</Card.Footer>
        </Card></ThemeProvider>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
