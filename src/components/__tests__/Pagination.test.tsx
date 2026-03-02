/**
 * @file 分页组件测试
 * @description 测试Pagination组件的各项功能
 * @module __tests__/components/Pagination.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Pagination } from '../Pagination';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Pagination', () => {
  it('应该渲染分页组件', () => {
    render(
      <ThemeProvider>
        <Pagination total={100} />
      </ThemeProvider>
    );
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('上一页')).toBeInTheDocument();
    expect(screen.getByText('下一页')).toBeInTheDocument();
    expect(screen.getByText('末页')).toBeInTheDocument();
  });

  it('应该显示当前页码', () => {
    render(
      <ThemeProvider>
        <Pagination current={2} total={100} />
      </ThemeProvider>
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('应该调用onChange回调', () => {
    const mockOnChange = jest.fn();
    render(
      <ThemeProvider>
        <Pagination current={1} total={100} onChange={mockOnChange} />
      </ThemeProvider>
    );
    const nextButton = screen.getByText('下一页');
    fireEvent.click(nextButton);
    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('应该在第一页时禁用上一页按钮', () => {
    render(
      <ThemeProvider>
        <Pagination current={1} total={100} />
      </ThemeProvider>
    );
    const prevButton = screen.getByText('上一页');
    expect(prevButton).toBeDisabled();
  });

  it('应该在最后一页时禁用下一页按钮', () => {
    render(
      <ThemeProvider>
        <Pagination current={10} total={100} />
      </ThemeProvider>
    );
    const nextButton = screen.getByText('下一页');
    expect(nextButton).toBeDisabled();
  });

  it('应该显示总条数', () => {
    render(
      <ThemeProvider>
        <Pagination total={100} showTotal={(total) => `共 ${total} 条`} />
      </ThemeProvider>
    );
    expect(screen.getByText('共 100 条')).toBeInTheDocument();
  });

  it('应该支持自定义每页条数', () => {
    render(
      <ThemeProvider>
        <Pagination total={100} pageSize={20} />
      </ThemeProvider>
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('应该支持自定义页码显示数量', () => {
    render(
      <ThemeProvider>
        <Pagination total={100} pageSize={10} showSizeChanger={false} />
      </ThemeProvider>
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('应该支持快速跳转', () => {
    render(
      <ThemeProvider>
        <Pagination total={100} showQuickJumper />
      </ThemeProvider>
    );
    expect(screen.getByPlaceholderText('跳转页码')).toBeInTheDocument();
  });

  it('应该支持简单模式', () => {
    render(
      <ThemeProvider>
        <Pagination total={100} simple />
      </ThemeProvider>
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('应该支持自定义类名', () => {
    render(
      <ThemeProvider>
        <Pagination total={100} className="custom-pagination" />
      </ThemeProvider>
    );
    const pagination = screen.getByRole('navigation');
    expect(pagination).toHaveClass('custom-pagination');
  });

  it('应该支持自定义样式', () => {
    render(
      <ThemeProvider>
        <Pagination total={100} style={{ margin: '20px' }} />
      </ThemeProvider>
    );
    const pagination = screen.getByRole('navigation');
    expect(pagination).toHaveStyle({ margin: '20px' });
  });

  it('应该支持禁用状态', () => {
    render(
      <ThemeProvider>
        <Pagination total={100} disabled />
      </ThemeProvider>
    );
    const nextButton = screen.getByText('下一页');
    expect(nextButton).toBeDisabled();
  });

  it('应该支持自定义按钮文本', () => {
    render(
      <ThemeProvider>
        <Pagination
          total={100}
          itemRender={(page, type, element) => {
            if (type === 'prev') {
              return <button>上页</button>;
            }
            if (type === 'next') {
              return <button>下页</button>;
            }
            return element;
          }}
        />
      </ThemeProvider>
    );
    expect(screen.getByText('上页')).toBeInTheDocument();
    expect(screen.getByText('下页')).toBeInTheDocument();
  });

  it('应该支持onShowSizeChange回调', () => {
    const mockOnShowSizeChange = jest.fn();
    render(
      <ThemeProvider>
        <Pagination total={100} onShowSizeChange={mockOnShowSizeChange} showSizeChanger />
      </ThemeProvider>
    );
    const pageSizeButton = screen.getByText('10条/页');
    fireEvent.click(pageSizeButton);
  });

  it('应该支持hideOnSinglePage', () => {
    const { container } = render(
      <ThemeProvider>
        <Pagination total={10} hideOnSinglePage />
      </ThemeProvider>
    );
    const pagination = container.querySelector('.pagination');
    expect(pagination).not.toBeInTheDocument();
  });
});
