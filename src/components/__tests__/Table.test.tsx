/**
 * @file 表格组件测试
 * @description 测试Table组件的各项功能
 * @module __tests__/components/Table.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Table } from '../Table';

describe('Table', () => {
  const mockData = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' },
  ];

  const mockColumns = [
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'age', title: 'Age', dataIndex: 'age' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
  ];

  it('应该渲染表格', () => {
    render(<Table columns={mockColumns} dataSource={mockData} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('应该渲染数据行', () => {
    render(<Table columns={mockColumns} dataSource={mockData} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('应该支持排序', () => {
    render(<Table columns={mockColumns.map(col => ({ ...col, sortable: true }))} dataSource={mockData} />);
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('应该支持行选择', () => {
    const mockOnChange = jest.fn();
    render(
      <Table
        columns={mockColumns}
        dataSource={mockData}
        rowSelection={{
          onChange: mockOnChange,
          type: 'checkbox',
        }}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('应该支持分页', () => {
    const mockOnChange = jest.fn();
    render(
      <Table
        columns={mockColumns}
        dataSource={mockData}
        pagination={{
          current: 1,
          pageSize: 10,
          total: 100,
          onChange: mockOnChange,
        }}
      />
    );
    expect(screen.getByText('共 100 条')).toBeInTheDocument();
    expect(screen.getByText('第 1 页')).toBeInTheDocument();
  });

  it('应该支持自定义渲染', () => {
    const customColumns = [
      {
        key: 'name',
        title: 'Name',
        render: (value: unknown) => <strong>{value as string}</strong>,
      },
    ];
    render(<Table columns={customColumns} dataSource={mockData} />);
    const nameElement = screen.getByText('John Doe');
    expect(nameElement.tagName).toBe('STRONG');
  });

  it('应该支持加载状态', () => {
    render(<Table columns={mockColumns} dataSource={mockData} loading />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('应该支持不同尺寸', () => {
    const { rerender } = render(<Table columns={mockColumns} dataSource={mockData} size="small" />);
    expect(screen.getByText('Name')).toBeInTheDocument();

    rerender(<Table columns={mockColumns} dataSource={mockData} size="large" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('应该支持边框', () => {
    render(<Table columns={mockColumns} dataSource={mockData} bordered />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('应该支持隐藏表头', () => {
    render(<Table columns={mockColumns} dataSource={mockData} showHeader={false} />);
    expect(screen.queryByText('Name')).not.toBeInTheDocument();
  });

  it('应该支持行点击事件', () => {
    const mockOnRowClick = jest.fn();
    render(
      <Table
        columns={mockColumns}
        dataSource={mockData}
        onRow={() => ({ onClick: mockOnRowClick })}
      />
    );
    const firstRow = screen.getByText('John Doe').closest('tr');
    fireEvent.click(firstRow!);
    expect(mockOnRowClick).toHaveBeenCalled();
  });
});
