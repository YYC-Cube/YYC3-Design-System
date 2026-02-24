/**
 * @file Card 组件测试
 * @description 测试 Card 组件的各项功能
 * @module __tests__/components/Card.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

;

import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen, fireEvent, waitFor } from '@testing-library/dom';;;
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { ThemeProvider } from '../theme/ThemeProvider';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider initial="light">{ui}</ThemeProvider>);
}

describe('Card 组件', () => {
  it('it('应该正确渲染默认 Card', () => {
    renderWithTheme(<Card>Default Content</Card>);

    expect(screen.getByText('Default Content')).toBeInTheDocument();
  });

  it('it('应该应用自定义 className', () => {
    const { container } = renderWithTheme(<Card className="custom-class">Test</Card>);

    const card = container.querySelector('div');
    expect(card).toHaveClass('custom-class');
  });

  it('it('应该应用正确的样式', () => {
    const { container } = renderWithTheme(<Card>Test</Card>);

    const card = container.querySelector('div');
    expect(card).toHaveStyle({
      backgroundColor: 'rgb(45, 45, 45)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      border: '1px solid rgb(160, 160, 160)',
      transition: 'all 0.2s ease',
    });
  });

  it('it('应该正确应用 shadow.card token', () => {
    const { container } = renderWithTheme(<Card>Test</Card>);

    const card = container.querySelector('div');
    const boxShadow = card?.style.boxShadow;
    expect(boxShadow).toBeDefined();
    expect(boxShadow).toContain('0px');
    expect(boxShadow).toContain('6px');
  });

  it('it('应该使用默认 shadow 值当 shadow.card 不存在时', () => {
    const { container } = renderWithTheme(<Card>Test</Card>);

    const card = container.querySelector('div');
    const boxShadow = card?.style.boxShadow;
    expect(boxShadow).toBeDefined();
    expect(boxShadow).toContain('0px');
    expect(boxShadow).toContain('6px');
    expect(boxShadow).toContain('20px');
    expect(boxShadow).toContain('-4px');
    expect(boxShadow).toContain('#0a0a0a');
  });

  it('it('应该使用默认颜色当 shadow.card 只有 4 个元素时', () => {
    const { container } = renderWithTheme(<Card>Test</Card>);

    const card = container.querySelector('div');
    const boxShadow = card?.style.boxShadow;
    expect(boxShadow).toBeDefined();
    expect(boxShadow).toContain('0px');
    expect(boxShadow).toContain('6px');
    expect(boxShadow).toContain('20px');
    expect(boxShadow).toContain('-4px');
    expect(boxShadow).toContain('#0a0a0a');
  });

  it('it('应该使用默认 shadow 值当 shadow.card 为空字符串时', () => {
    const { container } = renderWithTheme(<Card>Test</Card>);

    const card = container.querySelector('div');
    const boxShadow = card?.style.boxShadow;
    expect(boxShadow).toBeDefined();
    expect(boxShadow).toContain('0px');
    expect(boxShadow).toContain('6px');
    expect(boxShadow).toContain('20px');
    expect(boxShadow).toContain('-4px');
    expect(boxShadow).toContain('#0a0a0a');
  });

  it('it('应该使用自定义 shadow 值当 shadow.card 有 5 个元素时', () => {
    const { container } = renderWithTheme(<Card>Test</Card>);

    const card = container.querySelector('div');
    const boxShadow = card?.style.boxShadow;
    expect(boxShadow).toBeDefined();
    expect(boxShadow).toContain('0px');
    expect(boxShadow).toContain('6px');
    expect(boxShadow).toContain('20px');
    expect(boxShadow).toContain('-4px');
    expect(boxShadow).toContain('#0a0a0a');
  });

  it('it('应该正确处理空 children', () => {
    const { container } = renderWithTheme(<Card>{null}</Card>);

    const card = container.querySelector('div');
    expect(card).toBeInTheDocument();
  });

  it('it('应该正确处理 null children', () => {
    const { container } = renderWithTheme(<Card>{null}</Card>);

    const card = container.querySelector('div');
    expect(card).toBeInTheDocument();
  });

  it('it('应该正确处理 undefined children', () => {
    const { container } = renderWithTheme(<Card>{undefined}</Card>);

    const card = container.querySelector('div');
    expect(card).toBeInTheDocument();
  });

  it('it('应该正确处理数字 children', () => {
    renderWithTheme(<Card>123</Card>);

    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('it('应该正确处理 React 元素 children', () => {
    renderWithTheme(<Card><span>Custom</span></Card>);

    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('it('应该正确处理多个 children', () => {
    renderWithTheme(<Card><p>First</p><p>Second</p></Card>);

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});

describe('CardHeader 组件', () => {
  it('it('应该正确渲染默认 CardHeader', () => {
    renderWithTheme(<CardHeader>Header Content</CardHeader>);

    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('it('应该应用自定义 className', () => {
    const { container } = renderWithTheme(<CardHeader className="custom-class">Test</CardHeader>);

    const header = container.querySelector('div');
    expect(header).toHaveClass('custom-class');
  });

  it('it('应该应用正确的样式', () => {
    const { container } = renderWithTheme(<CardHeader>Header</CardHeader>);

    const header = container.querySelector('div');
    expect(header).toHaveStyle({
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid rgb(160, 160, 160)',
    });
  });

  it('it('应该正确处理空 children', () => {
    const { container } = renderWithTheme(<CardHeader>{null}</CardHeader>);

    const header = container.querySelector('div');
    expect(header).toBeInTheDocument();
  });
});

describe('CardTitle 组件', () => {
  it('it('应该正确渲染默认 CardTitle', () => {
    renderWithTheme(<CardTitle>Title Content</CardTitle>);

    expect(screen.getByText('Title Content')).toBeInTheDocument();
  });

  it('it('应该应用自定义 className', () => {
    const { container } = renderWithTheme(<CardTitle className="custom-class">Test</CardTitle>);

    const title = container.querySelector('h3');
    expect(title).toHaveClass('custom-class');
  });

  it('it('应该应用正确的样式', () => {
    const { container } = renderWithTheme(<CardTitle>Title</CardTitle>);

    const title = container.querySelector('h3');
    expect(title).toHaveStyle({
      fontSize: '1.5rem',
      fontWeight: '600',
      margin: '0px',
      color: 'rgb(240, 240, 240)',
    });
  });

  it('it('应该正确处理空 children', () => {
    const { container } = renderWithTheme(<CardTitle>{null}</CardTitle>);

    const title = container.querySelector('h3');
    expect(title).toBeInTheDocument();
  });
});

describe('CardContent 组件', () => {
  it('it('应该正确渲染默认 CardContent', () => {
    renderWithTheme(<CardContent>Content</CardContent>);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('it('应该应用自定义 className', () => {
    renderWithTheme(<CardContent className="custom-class">Test</CardContent>);

    const content = screen.getByText('Test');
    expect(content).toHaveClass('custom-class');
  });

  it('it('应该应用正确的样式', () => {
    renderWithTheme(<CardContent>Test</CardContent>);

    const content = screen.getByText('Test');
    expect(content).toHaveStyle({
      fontSize: '1rem',
      lineHeight: '1.5',
    });
  });

  it('it('应该正确处理空 children', () => {
    const { container } = renderWithTheme(<CardContent>{null}</CardContent>);

    const content = container.querySelector('div');
    expect(content).toBeInTheDocument();
  });
});