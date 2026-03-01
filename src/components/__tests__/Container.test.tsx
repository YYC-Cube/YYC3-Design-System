import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { Container } from '../Container';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Container 组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染Container', () => {
      render(<ThemeProvider>
        <Container>
          <div>内容</div>
        </Container></ThemeProvider>);
      expect(screen.getByText('内容')).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Container className="custom-container">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveClass('custom-container');
    });

    it('应该支持自定义样式', () => {
      render(<ThemeProvider>
        <Container style={{ backgroundColor: 'blue' }}>
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({ backgroundColor: 'blue' });
    });
  });

  describe('最大宽度配置', () => {
    it('应该渲染默认最大宽度(lg)', () => {
      render(<ThemeProvider>
        <Container>
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        maxWidth: '1024px',
      });
    });

    it('应该渲染sm最大宽度', () => {
      render(<ThemeProvider>
        <Container maxWidth="sm">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        maxWidth: '640px',
      });
    });

    it('应该渲染md最大宽度', () => {
      render(<ThemeProvider>
        <Container maxWidth="md">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        maxWidth: '768px',
      });
    });

    it('应该渲染xl最大宽度', () => {
      render(<ThemeProvider>
        <Container maxWidth="xl">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        maxWidth: '1280px',
      });
    });

    it('应该渲染2xl最大宽度', () => {
      render(<ThemeProvider>
        <Container maxWidth="2xl">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        maxWidth: '1536px',
      });
    });

    it('应该渲染full最大宽度', () => {
      render(<ThemeProvider>
        <Container maxWidth="full">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        maxWidth: '100%',
      });
    });

    it('应该渲染none最大宽度', () => {
      render(<ThemeProvider>
        <Container maxWidth="none">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        maxWidth: 'none',
      });
    });
  });

  describe('居中布局', () => {
    it('应该自动居中内容', () => {
      render(<ThemeProvider>
        <Container>
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        marginLeft: 'auto',
        marginRight: 'auto',
      });
    });

    it('应该设置100%宽度', () => {
      render(<ThemeProvider>
        <Container>
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        width: '100%',
      });
    });
  });

  describe('内边距', () => {
    it('应该设置默认内边距', () => {
      render(<ThemeProvider>
        <Container>
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      });
    });
  });

  describe('子元素渲染', () => {
    it('应该渲染单个子元素', () => {
      render(<ThemeProvider>
        <Container>
          <div>单个内容</div>
        </Container></ThemeProvider>);
      expect(screen.getByText('单个内容')).toBeInTheDocument();
    });

    it('应该渲染多个子元素', () => {
      render(<ThemeProvider>
        <Container>
          <div>内容1</div>
          <div>内容2</div>
          <div>内容3</div>
        </Container></ThemeProvider>);
      expect(screen.getByText('内容1')).toBeInTheDocument();
      expect(screen.getByText('内容2')).toBeInTheDocument();
      expect(screen.getByText('内容3')).toBeInTheDocument();
    });

    it('应该渲染嵌套组件', () => {
      render(<ThemeProvider>
        <Container>
          <div>
            <span>嵌套内容</span>
          </div>
        </Container></ThemeProvider>);
      expect(screen.getByText('嵌套内容')).toBeInTheDocument();
    });

    it('应该渲染空Container', () => {
      const { container } = render(<ThemeProvider><Container />);
      const containerElement = container.querySelector('.container');
      expect(containerElement).toBeInTheDocument();
    });
  });

  describe('HTML属性', () => {
    it('应该支持id属性', () => {
      render(<ThemeProvider>
        <Container id="test-container">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveAttribute('id', 'test-container');
    });

    it('应该支持data属性', () => {
      render(<ThemeProvider>
        <Container data-testid="container-test">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByTestId('container-test');
      expect(container).toBeInTheDocument();
    });

    it('应该支持aria属性', () => {
      render(<ThemeProvider>
        <Container aria-label="容器">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveAttribute('aria-label', '容器');
    });
  });

  describe('ref', () => {
    it('应该支持ref转发', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ThemeProvider>
        <Container ref={ref}>
          <div>内容</div>
        </Container></ThemeProvider>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('应该能够通过ref访问DOM方法', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ThemeProvider>
        <Container ref={ref}>
          <div>内容</div>
        </Container></ThemeProvider>);
      expect(ref.current?.classList.contains('container')).toBe(true);
    });
  });

  describe('样式计算', () => {
    it('应该正确应用所有默认样式', () => {
      render(<ThemeProvider>
        <Container>
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        width: '100%',
        maxWidth: '1024px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      });
    });

    it('应该正确应用自定义maxWidth', () => {
      render(<ThemeProvider>
        <Container maxWidth="xl">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        width: '100%',
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      });
    });
  });

  describe('响应式行为', () => {
    it('应该在移动端正确渲染', () => {
      render(<ThemeProvider>
        <Container maxWidth="sm">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        maxWidth: '640px',
      });
    });

    it('应该在桌面端正确渲染', () => {
      render(<ThemeProvider>
        <Container maxWidth="2xl">
          <div>内容</div>
        </Container></ThemeProvider>);
      const container = screen.getByText('内容').parentElement;
      expect(container).toHaveStyle({
        maxWidth: '1536px',
      });
    });
  });
});
