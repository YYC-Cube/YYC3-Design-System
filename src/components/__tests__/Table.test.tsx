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
import { ThemeProvider } from '../../theme/ThemeProvider';

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
    render(<ThemeProvider><Table columns={mockColumns} dataSource={mockData} /></ThemeProvider>);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('应该渲染数据行', () => {
    render(<ThemeProvider><Table columns={mockColumns} dataSource={mockData} /></ThemeProvider>);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('应该支持排序', () => {
    render(<ThemeProvider><Table columns={mockColumns.map(col => ({ ...col, sortable: true }))} dataSource={mockData} /></ThemeProvider>);
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);
    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('应该支持行选择', () => {
    const mockOnChange = jest.fn();
    render(
      <ThemeProvider>
        <Table
          columns={mockColumns}
          dataSource={mockData}
          rowSelection={{
            onChange: mockOnChange,
            type: 'checkbox',
          }}
        />
      </ThemeProvider>
    );
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('应该支持分页', () => {
    const mockOnChange = jest.fn();
    render(
      <ThemeProvider>
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
      </ThemeProvider>
    );
    const paginationInfo = screen.getByText(/1.*100/);
    expect(paginationInfo).toBeInTheDocument();
  });

  it('应该支持行点击事件', () => {
    const mockOnRowClick = jest.fn();
    render(
      <ThemeProvider>
        <Table
          columns={mockColumns}
          dataSource={mockData}
          onRow={() => ({ onClick: mockOnRowClick })}
        />
      </ThemeProvider>
    );
    const firstRow = screen.getByText('John Doe');
    fireEvent.click(firstRow);
    expect(mockOnRowClick).toHaveBeenCalled();
  });

  it('应该支持空数据', () => {
    render(<ThemeProvider><Table columns={mockColumns} dataSource={[]} /></ThemeProvider>);
    const emptyText = screen.getByText(/暂无数据/);
    expect(emptyText).toBeInTheDocument();
  });

  it('应该支持自定义单元格渲染', () => {
    const customColumns = [
      { key: 'name', title: 'Name', dataIndex: 'name', render: (value: unknown) => <strong>{value as string}</strong> },
    ];
    render(<ThemeProvider><Table columns={customColumns} dataSource={mockData} /></ThemeProvider>);
    const nameCell = screen.getByText('John Doe');
    expect(nameCell.closest('strong')).toBeInTheDocument();
  });

  it('应该支持列宽设置', () => {
    const widthColumns = [
      { key: 'name', title: 'Name', dataIndex: 'name', width: 200 },
      { key: 'age', title: 'Age', dataIndex: 'age', width: 100 },
    ];
    render(<ThemeProvider><Table columns={widthColumns} dataSource={mockData} /></ThemeProvider>);
    const nameHeader = screen.getByText('Name');
    expect(nameHeader).toBeInTheDocument();
  });

  it('应该支持数据加载状态', () => {
    render(
      <ThemeProvider>
        <Table
          columns={mockColumns}
          dataSource={mockData}
          loading
        />
      </ThemeProvider>
    );
    const loadingIndicator = screen.getByRole('status');
    expect(loadingIndicator).toBeInTheDocument();
  });
});
