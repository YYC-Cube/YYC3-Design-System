import React from 'react';
import { render, screen } from '@testing-library/react';

import { Container } from '../Container';
import { ThemeProvider } from '../../context/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider initial="light">{component}</ThemeProvider>);
};

describe('Container 组件', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认 Container', () => {
      renderWithTheme(<Container>容器内容</Container>);
      expect(screen.getByText('容器内容')).toBeInTheDocument();
    });

    it('应该支持自定义 className', () => {
      renderWithTheme(<Container className="custom-container">内容</Container>);
      const container = screen.getByText('内容').closest('.container');
      expect(container).toHaveClass('custom-container');
    });

    it('应该支持自定义样式', () => {
      renderWithTheme(<Container style={{ maxWidth: '800px' }}>内容</Container>);
      const container = screen.getByText('内容').closest('.container');
      expect(container).toHaveStyle({ maxWidth: '800px' });
    });
  });

  describe('尺寸变体', () => {
    it('应该应用 small 尺寸', () => {
      renderWithTheme(<Container size="sm">内容</Container>);
      const container = screen.getByText('内容').closest('.container');
      expect(container).toHaveClass('container-sm');
    });

    it('应该应用 medium 尺寸', () => {
      renderWithTheme(<Container size="md">内容</Container>);
      const container = screen.getByText('内容').closest('.container');
      expect(container).toHaveClass('container-md');
    });

    it('应该应用 large 尺寸', () => {
      renderWithTheme(<Container size="lg">内容</Container>);
      const container = screen.getByText('内容').closest('.container');
      expect(container).toHaveClass('container-lg');
    });

    it('应该应用 full 尺寸', () => {
      renderWithTheme(<Container size="full">内容</Container>);
      const container = screen.getByText('内容').closest('.container');
      expect(container).toHaveClass('container-full');
    });
  });

  describe('对齐方式', () => {
    it('应该应用 left 对齐', () => {
      renderWithTheme(<Container align="left">内容</Container>);
      const container = screen.getByText('内容').closest('.container');
      expect(container).toHaveClass('text-left');
    });

    it('应该应用 center 对齐', () => {
      renderWithTheme(<Container align="center">内容</Container>);
      const container = screen.getByText('内容').closest('.container');
      expect(container).toHaveClass('text-center');
    });

    it('应该应用 right 对齐', () => {
      renderWithTheme(<Container align="right">内容</Container>);
      const container = screen.getByText('内容').closest('.container');
      expect(container).toHaveClass('text-right');
    });
  });

  describe('边缘情况', () => {
    it('应该处理空内容', () => {
      const { container } = renderWithTheme(<Container>{null}</Container>);
      expect(container.querySelector('.container')).toBeInTheDocument();
    });

    it('应该处理多个子元素', () => {
      renderWithTheme(
        <Container>
          <p>第一段</p>
          <p>第二段</p>
          <p>第三段</p>
        </Container>
      );
      expect(screen.getByText('第一段')).toBeInTheDocument();
      expect(screen.getByText('第二段')).toBeInTheDocument();
      expect(screen.getByText('第三段')).toBeInTheDocument();
    });

    it('应该处理嵌套内容', () => {
      renderWithTheme(
        <Container>
          <div>
            <span>嵌套内容</span>
          </div>
        </Container>
      );
      expect(screen.getByText('嵌套内容')).toBeInTheDocument();
    });

    it('应该处理长内容', () => {
      const longContent = 'A'.repeat(1000);
      renderWithTheme(<Container>{longContent}</Container>);
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('应该处理特殊字符', () => {
      const specialChars = '<>&"\'中文';
      renderWithTheme(<Container>{specialChars}</Container>);
      expect(screen.getByText(specialChars)).toBeInTheDocument();
    });
  });

  describe('Props 传递', () => {
    it('应该传递 data-testid 属性', () => {
      renderWithTheme(<Container data-testid="test-container">内容</Container>);
      expect(screen.getByTestId('test-container')).toBeInTheDocument();
    });

    it('应该传递 id 属性', () => {
      renderWithTheme(<Container id="container-1">内容</Container>);
      expect(document.getElementById('container-1')).toBeInTheDocument();
    });

    it('应该传递 aria-label 属性', () => {
      renderWithTheme(<Container aria-label="主容器">内容</Container>);
      expect(screen.getByLabelText('主容器')).toBeInTheDocument();
    });
  });
});
