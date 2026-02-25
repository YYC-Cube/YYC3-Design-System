/**
 * @file 表格组件
 * @description 企业级表格组件，支持排序、分页、选择等功能
 * @component Table
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import * as React from 'react';
import { memo, useState, useCallback, useMemo } from 'react';
import { useTheme } from '../theme/ThemeProvider';

export interface TableColumn<T = unknown> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[];
  dataSource: T[];
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
  bordered?: boolean;
  size?: 'small' | 'middle' | 'large';
  showHeader?: boolean;
  pagination?: {
    current?: number;
    pageSize?: number;
    total?: number;
    onChange?: (page: number, pageSize: number) => void;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
  };
  rowSelection?: {
    selectedRowKeys?: (string | number)[];
    onChange?: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
    type?: 'checkbox' | 'radio';
  };
  onRow?: (record: T, index: number) => {
    onClick?: (event: React.MouseEvent) => void;
    onDoubleClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
  };
  scroll?: {
    x?: string | number;
    y?: string | number;
  };
  className?: string;
  'data-testid'?: string;
}

export const Table = memo(<T extends Record<string, unknown>>({
  columns,
  dataSource,
  rowKey = 'id',
  loading = false,
  bordered = false,
  size = 'middle',
  showHeader = true,
  pagination,
  rowSelection,
  onRow,
  scroll,
  className = '',
  'data-testid': dataTestId,
}: TableProps<T>) => {
  const { tokens } = useTheme();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(rowSelection?.selectedRowKeys || []);

  const getRowKey = useCallback((record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return (record[rowKey] as string) || `${index}`;
  }, [rowKey]);

  const handleSort = useCallback((column: TableColumn<T>) => {
    if (!column.sortable) return;

    setSortConfig(prev => {
      if (prev?.key === column.key) {
        if (prev.direction === 'asc') {
          return { key: column.key, direction: 'desc' };
        }
        return null;
      }
      return { key: column.key, direction: 'asc' };
    });
  }, []);

  const handleRowSelect = useCallback((record: T, checked: boolean) => {
    const key = getRowKey(record, dataSource.indexOf(record));
    setSelectedRowKeys(prev => {
      let newKeys: (string | number)[];
      if (checked) {
        newKeys = [...prev, key];
      } else {
        newKeys = prev.filter(k => k !== key);
      }
      rowSelection?.onChange?.(newKeys, newKeys.map(k => dataSource.find((r, i) => getRowKey(r, i) === k)!));
      return newKeys;
    });
  }, [getRowKey, dataSource, rowSelection]);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(dataSource.map((record, index) => getRowKey(record, index)));
    } else {
      setSelectedRowKeys([]);
    }
  }, [dataSource, getRowKey]);

const getSortValue = (record: T, key: string): unknown => {
  return record[key];
};

const sortedData = useMemo(() => {
  if (!sortConfig) return dataSource;

  return [...dataSource].sort((a, b) => {
    const aValue = getSortValue(a, sortConfig.key);
    const bValue = getSortValue(b, sortConfig.key);

    if (aValue === bValue) return 0;

    const aStr = String(aValue ?? '');
    const bStr = String(bValue ?? '');
    const comparison = aStr < bStr ? -1 : 1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}, [dataSource, sortConfig]);

  const getSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;

    if (!sortConfig || sortConfig.key !== column.key) {
      return (
        <span style={{ marginLeft: '4px', opacity: 0.3 }}>↕</span>
      );
    }

    return (
      <span style={{ marginLeft: '4px' }}>
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '4px 8px',
          fontSize: '12px',
        };
      case 'large':
        return {
          padding: '16px 24px',
          fontSize: '16px',
        };
      default:
        return {
          padding: '12px 16px',
          fontSize: '14px',
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const tableStyles: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: sizeStyles.fontSize,
    color: tokens['color.text'] as string || '#333',
  };

  const cellStyles: React.CSSProperties = {
    padding: sizeStyles.padding,
    borderBottom: bordered ? `1px solid ${tokens['color.border'] as string || '#e0e0e0'}` : undefined,
    textAlign: 'left',
  };

  const headerStyles: React.CSSProperties = {
    ...cellStyles,
    backgroundColor: tokens['color.background.secondary'] as string || '#f5f5f5',
    fontWeight: 'bold',
    color: tokens['color.text.primary'] as string || '#333',
  };

  const rowStyles: React.CSSProperties = {
    transition: 'background-color 0.2s',
  };

  const selectedRowStyles: React.CSSProperties = {
    ...rowStyles,
    backgroundColor: tokens['color.primary.light'] as string || '#f0f0f0',
  };

  const loadingOverlay: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  };

  const emptyStateStyles: React.CSSProperties = {
    padding: '40px',
    textAlign: 'center',
    color: tokens['color.text.secondary'] as string || '#999',
  };

  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    const value = column.dataIndex ? record[column.dataIndex] : record;
    return column.render ? column.render(value, record, index) : value as React.ReactNode;
  };

  return (
    <div style={{ position: 'relative' }} className={className} data-testid={dataTestId}>
      {loading && (
        <div style={loadingOverlay} role="status" aria-live="polite">
          <div>加载中...</div>
        </div>
      )}
      <div style={{ overflowX: scroll?.x ? 'auto' : undefined, overflowY: scroll?.y ? 'auto' : undefined }}>
        <table style={tableStyles}>
          {showHeader && (
            <thead>
              <tr>
                {rowSelection && (
                  <th style={{ ...headerStyles, width: '50px', textAlign: 'center' }}>
                    <input
                      type={rowSelection.type === 'radio' ? 'radio' : 'checkbox'}
                      checked={selectedRowKeys.length > 0 && selectedRowKeys.length === dataSource.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      disabled={dataSource.length === 0}
                    />
                  </th>
                )}
                {columns.map(column => (
                  <th
                    key={column.key}
                    style={{
                      ...headerStyles,
                      width: column.width,
                      textAlign: column.align || 'left',
                      cursor: column.sortable ? 'pointer' : 'default',
                      userSelect: column.sortable ? 'none' : 'auto',
                    }}
                    onClick={() => handleSort(column)}
                  >
                    {column.title}
                    {getSortIcon(column)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowSelection ? 1 : 0)} style={emptyStateStyles}>
                  暂无数据
                </td>
              </tr>
            ) : sortedData.map((record, index) => {
              const key = getRowKey(record, index);
              const isSelected = selectedRowKeys.includes(key);
              const rowProps = onRow?.(record, index) || {};

              return (
                <tr
                  key={key}
                  style={isSelected ? selectedRowStyles : rowStyles}
                  onMouseEnter={(e) => {
                    rowStyles.backgroundColor = tokens['color.hover'] as string || '#f9f9f9';
                    rowProps.onMouseEnter?.(e);
                  }}
                  onMouseLeave={(e) => {
                    rowStyles.backgroundColor = 'transparent';
                    rowProps.onMouseLeave?.(e);
                  }}
                  onClick={rowProps.onClick}
                  onDoubleClick={rowProps.onDoubleClick}
                >
                  {rowSelection && (
                    <td style={{ ...cellStyles, textAlign: 'center', width: '50px' }}>
                      <input
                        type={rowSelection.type === 'radio' ? 'radio' : 'checkbox'}
                        checked={isSelected}
                        onChange={(e) => handleRowSelect(record, e.target.checked)}
                      />
                    </td>
                  )}
                  {columns.map(column => (
                    <td
                      key={column.key}
                      style={{
                        ...cellStyles,
                        textAlign: column.align || 'left',
                      }}
                    >
                      {renderCell(column, record, index)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
          <span>共 {pagination.total || dataSource.length} 条</span>
          <button
            onClick={() => pagination.onChange?.(1, pagination.pageSize || 10)}
            disabled={(pagination.current || 1) === 1}
            style={{
              padding: '4px 8px',
              border: `1px solid ${tokens['color.border'] as string || '#d0d0d0'}`,
              backgroundColor: tokens['color.background'] as string || '#fff',
              cursor: (pagination.current || 1) === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            首页
          </button>
          <button
            onClick={() => pagination.onChange?.((pagination.current || 1) - 1, pagination.pageSize || 10)}
            disabled={(pagination.current || 1) === 1}
            style={{
              padding: '4px 8px',
              border: `1px solid ${tokens['color.border'] as string || '#d0d0d0'}`,
              backgroundColor: tokens['color.background'] as string || '#fff',
              cursor: (pagination.current || 1) === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            上一页
          </button>
          <span>
            第 {pagination.current || 1} 页
          </span>
          <button
            onClick={() => pagination.onChange?.((pagination.current || 1) + 1, pagination.pageSize || 10)}
            disabled={!pagination.total || (pagination.current || 1) * (pagination.pageSize || 10) >= pagination.total}
            style={{
              padding: '4px 8px',
              border: `1px solid ${tokens['color.border'] as string || '#d0d0d0'}`,
              backgroundColor: tokens['color.background'] as string || '#fff',
              cursor: !pagination.total || (pagination.current || 1) * (pagination.pageSize || 10) >= pagination.total ? 'not-allowed' : 'pointer',
            }}
          >
            下一页
          </button>
          <button
            onClick={() => {
              const totalPages = Math.ceil((pagination.total || dataSource.length) / (pagination.pageSize || 10));
              pagination.onChange?.(totalPages, pagination.pageSize || 10);
            }}
            disabled={!pagination.total || (pagination.current || 1) * (pagination.pageSize || 10) >= pagination.total}
            style={{
              padding: '4px 8px',
              border: `1px solid ${tokens['color.border'] as string || '#d0d0d0'}`,
              backgroundColor: tokens['color.background'] as string || '#fff',
              cursor: !pagination.total || (pagination.current || 1) * (pagination.pageSize || 10) >= pagination.total ? 'not-allowed' : 'pointer',
            }}
          >
            末页
          </button>
          {pagination.showSizeChanger && (
            <select
              value={pagination.pageSize || 10}
              onChange={(e) => pagination.onChange?.(1, parseInt(e.target.value))}
              style={{
                padding: '4px 8px',
                border: `1px solid ${tokens['color.border'] as string || '#d0d0d0'}`,
                backgroundColor: tokens['color.background'] as string || '#fff',
              }}
            >
              <option value={10}>10 条/页</option>
              <option value={20}>20 条/页</option>
              <option value={50}>50 条/页</option>
              <option value={100}>100 条/页</option>
            </select>
          )}
          {pagination.showQuickJumper && (
            <span>
              跳至
              <input
                type="number"
                min={1}
                max={pagination.total ? Math.ceil(pagination.total / (pagination.pageSize || 10)) : 1}
                style={{
                  width: '50px',
                  padding: '4px 8px',
                  border: `1px solid ${tokens['color.border'] as string || '#d0d0d0'}`,
                  margin: '0 4px',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const page = parseInt((e.target as HTMLInputElement).value);
                    if (page >= 1) {
                      pagination.onChange?.(page, pagination.pageSize || 10);
                    }
                  }
                }}
              />
              页
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Table.displayName = 'Table';
