/**
 * @file 分页组件
 * @description 分页导航组件，支持页码跳转、每页数量选择等功能
 * @component Pagination
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { memo, useState, useCallback, useMemo } from 'react';
import { useTheme } from '../theme/ThemeProvider';

export interface PaginationProps {
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  pageSizeOptions?: number[];
  disabled?: boolean;
  simple?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const Pagination = memo<PaginationProps>(({
  current = 1,
  pageSize = 10,
  total = 0,
  onChange,
  showSizeChanger = false,
  showQuickJumper = false,
  showTotal,
  pageSizeOptions = [10, 20, 50, 100],
  disabled = false,
  simple = false,
  className = '',
  'data-testid': dataTestId,
}) => {
  const { tokens } = useTheme();
  const [jumpPage, setJumpPage] = useState<string>(current.toString());

  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);
  const startIndex = useMemo(() => (current - 1) * pageSize + 1, [current, pageSize]);
  const endIndex = useMemo(() => Math.min(current * pageSize, total), [current, pageSize, total]);

  const handlePageChange = useCallback((page: number) => {
    if (disabled || page < 1 || page > totalPages) return;
    onChange?.(page, pageSize);
  }, [disabled, totalPages, onChange, pageSize]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    if (disabled) return;
    const newPage = Math.min(current, Math.ceil(total / newPageSize));
    onChange?.(newPage, newPageSize);
  }, [disabled, current, total, onChange]);

  const handleJump = useCallback(() => {
    const page = parseInt(jumpPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
    }
  }, [jumpPage, totalPages, handlePageChange]);

  const handleJumpKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJump();
    }
  }, [handleJump]);

  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages - 1; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else {
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [totalPages, current]);

  const pageNumbers = getPageNumbers();

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  };

  const buttonStyles: React.CSSProperties = {
    minWidth: '32px',
    height: '32px',
    padding: '4px 8px',
    border: `1px solid ${tokens['color.border'] as string || '#d0d0d0'}`,
    backgroundColor: tokens['color.background'] as string || '#fff',
    color: tokens['color.text.primary'] as string || '#333',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
  };

  const buttonHoverStyles: React.CSSProperties = {
    ...buttonStyles,
    borderColor: tokens['color.primary'] as string || '#d45a5f',
    color: tokens['color.primary'] as string || '#d45a5f',
  };

  const activeButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    backgroundColor: tokens['color.primary'] as string || '#d45a5f',
    color: tokens['color.primary.foreground'] as string || '#fff',
    borderColor: tokens['color.primary'] as string || '#d45a5f',
  };

  const disabledButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  const ellipsisStyles: React.CSSProperties = {
    padding: '4px 8px',
    color: tokens['color.text.disabled'] as string || '#999',
  };

  const selectStyles: React.CSSProperties = {
    padding: '4px 8px',
    border: `1px solid ${tokens['color.border'] as string || '#d0d0d0'}`,
    backgroundColor: tokens['color.background'] as string || '#fff',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '14px',
  };

  const inputStyles: React.CSSProperties = {
    width: '50px',
    padding: '4px 8px',
    border: `1px solid ${tokens['color.border'] as string || '#d0d0d0'}`,
    backgroundColor: tokens['color.background'] as string || '#fff',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'center',
  };

  const totalTextStyles: React.CSSProperties = {
    color: tokens['color.text.secondary'] as string || '#666',
    fontSize: '14px',
  };

  if (simple) {
    return (
      <div className={className} style={containerStyles} data-testid={dataTestId}>
        <button
          onClick={() => handlePageChange(current - 1)}
          disabled={disabled || current === 1}
          style={disabled || current === 1 ? disabledButtonStyles : buttonStyles}
        >
          上一页
        </button>
        <span style={totalTextStyles}>
          {current} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(current + 1)}
          disabled={disabled || current === totalPages}
          style={disabled || current === totalPages ? disabledButtonStyles : buttonStyles}
        >
          下一页
        </button>
      </div>
    );
  }

  return (
    <div className={className} style={containerStyles} data-testid={dataTestId}>
      {showTotal && (
        <span style={totalTextStyles}>
          {showTotal(total, [startIndex, endIndex])}
        </span>
      )}
      <button
        onClick={() => handlePageChange(1)}
        disabled={disabled || current === 1}
        style={disabled || current === 1 ? disabledButtonStyles : buttonStyles}
        aria-label="首页"
      >
        首页
      </button>
      <button
        onClick={() => handlePageChange(current - 1)}
        disabled={disabled || current === 1}
        style={disabled || current === 1 ? disabledButtonStyles : buttonStyles}
        aria-label="上一页"
      >
        上一页
      </button>
      {pageNumbers.map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            disabled={disabled}
            style={page === current ? activeButtonStyles : buttonStyles}
            aria-label={`第${page}页`}
            aria-current={page === current ? 'page' : undefined}
            onMouseEnter={(e) => {
              if (page !== current && !disabled) {
                Object.assign(e.currentTarget.style, buttonHoverStyles);
              }
            }}
            onMouseLeave={(e) => {
              if (page !== current && !disabled) {
                Object.assign(e.currentTarget.style, buttonStyles);
              }
            }}
          >
            {page}
          </button>
        ) : (
          <span key={index} style={ellipsisStyles}>
            {page}
          </span>
        )
      ))}
      <button
        onClick={() => handlePageChange(current + 1)}
        disabled={disabled || current === totalPages}
        style={disabled || current === totalPages ? disabledButtonStyles : buttonStyles}
        aria-label="下一页"
      >
        下一页
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={disabled || current === totalPages}
        style={disabled || current === totalPages ? disabledButtonStyles : buttonStyles}
        aria-label="末页"
      >
        末页
      </button>
      {showSizeChanger && (
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
          disabled={disabled}
          style={selectStyles}
          aria-label="每页显示数量"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>
              {size} 条/页
            </option>
          ))}
        </select>
      )}
      {showQuickJumper && (
        <span style={totalTextStyles}>
          跳至
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyDown={handleJumpKeyDown}
            disabled={disabled}
            style={inputStyles}
            aria-label="跳转页码"
          />
          页
          <button
            onClick={handleJump}
            disabled={disabled}
            style={buttonStyles}
          >
            确定
          </button>
        </span>
      )}
    </div>
  );
});

Pagination.displayName = 'Pagination';
