/**
 * @file 分页组件测试
 * @description 测试Pagination组件的各项功能
 * @module __tests__/components/Pagination.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('应该渲染分页组件', () => {
    render(<Pagination total={100} />);
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('上一页')).toBeInTheDocument();
    expect(screen.getByText('下一页')).toBeInTheDocument();
    expect(screen.getByText('末页')).toBeInTheDocument();
  });

  it('应该显示当前页码', () => {
    render(<Pagination current={2} total={100} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('应该调用onChange回调', () => {
    const mockOnChange = jest.fn();
    render(<Pagination current={1} total={100} onChange={mockOnChange} />);
    const nextButton = screen.getByText('下一页');
    fireEvent.click(nextButton);
    expect(mockOnChange).toHaveBeenCalledWith(2, 10);
  });

  it('应该在第一页时禁用上一页按钮', () => {
    render(<Pagination current={1} total={100} />);
    const prevButton = screen.getByText('上一页');
    expect(prevButton).toBeDisabled();
  });

  it('应该在最后一页时禁用下一页按钮', () => {
    render(<Pagination current={10} total={100} />);
    const nextButton = screen.getByText('下一页');
    expect(nextButton).toBeDisabled();
  });

  it('应该显示总条数', () => {
    render(<Pagination total={100} showTotal={(total) => `共 ${total} 条`} />);
    expect(screen.getByText('共 100 条')).toBeInTheDocument();
  });

  it('应该显示范围', () => {
    render(
      <Pagination
        current={2}
        total={100}
        showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
      />
    );
    expect(screen.getByText('11-20 / 100')).toBeInTheDocument();
  });

  it('应该支持每页数量选择', () => {
    const mockOnChange = jest.fn();
    render(
      <Pagination
        total={100}
        showSizeChanger
        pageSizeOptions={[10, 20, 50]}
        onChange={mockOnChange}
      />
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('应该支持快速跳转', () => {
    render(<Pagination total={100} showQuickJumper />);
    expect(screen.getByPlaceholderText('跳转页码')).toBeInTheDocument();
  });

  it('应该支持简单模式', () => {
    render(<Pagination total={100} simple />);
    expect(screen.getByText('上一页')).toBeInTheDocument();
    expect(screen.getByText('下一页')).toBeInTheDocument();
    expect(screen.queryByText('首页')).not.toBeInTheDocument();
  });

  it('应该支持禁用状态', () => {
    render(<Pagination total={100} disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('应该正确处理总页数较少的情况', () => {
    render(<Pagination total={20} pageSize={10} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('应该显示省略号', () => {
    render(<Pagination current={5} total={100} />);
    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('应该支持自定义pageSize', () => {
    const mockOnChange = jest.fn();
    render(<Pagination total={100} pageSize={20} onChange={mockOnChange} />);
    const nextButton = screen.getByText('下一页');
    fireEvent.click(nextButton);
    expect(mockOnChange).toHaveBeenCalledWith(2, 20);
  });

  it('应该支持自定义类名', () => {
    const { container } = render(<Pagination total={100} className="custom-pagination" />);
    expect(container.querySelector('.custom-pagination')).toBeInTheDocument();
  });

  it('应该支持键盘导航', () => {
    const mockOnChange = jest.fn();
    render(
      <Pagination
        total={100}
        showQuickJumper
        onChange={mockOnChange}
      />
    );
    const input = screen.getByPlaceholderText('跳转页码');
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnChange).toHaveBeenCalledWith(5, 10);
  });
});
