/**
 * @file 错误边界组件
 * @description YYC³ Design System错误边界组件
 * @component ErrorBoundary
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { Component, ReactNode, ErrorInfo } from 'react';
import { errorLogger } from '../core/ErrorLogger';
import { ErrorBoundaryState } from '../types/error';
import { useTheme } from '../theme/ThemeProvider';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  component?: string;
  'data-testid'?: string;
}

export interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  onReset?: () => void;
  className?: string;
  'data-testid'?: string;
}

export const ErrorFallback = ({
  error,
  errorInfo,
  onReset,
  className = '',
  'data-testid': dataTestId,
}: ErrorFallbackProps) => {
  const { tokens } = useTheme();

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    minHeight: '400px',
    padding: '40px',
    backgroundColor: tokens['color.background'] as string || '#fff',
    color: tokens['color.text.primary'] as string || '#333',
  };

  const iconStyles = {
    fontSize: '64px',
    marginBottom: '20px',
  };

  const titleStyles = {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    marginBottom: '12px',
    color: tokens['color.error'] as string || '#ff4d4f',
  };

  const messageStyles = {
    fontSize: '16px',
    marginBottom: '24px',
    textAlign: 'center' as const,
    maxWidth: '600px',
    color: tokens['color.text.secondary'] as string || '#666',
  };

  const detailsStyles = {
    backgroundColor: tokens['color.surface'] as string || '#f5f5f5',
    padding: '16px',
    borderRadius: '4px',
    marginBottom: '24px',
    maxWidth: '800px',
    width: '100%',
    overflow: 'auto',
  };

  const detailsTitleStyles = {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    marginBottom: '8px',
    color: tokens['color.text.primary'] as string || '#333',
  };

  const detailsTextStyles = {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: tokens['color.text.secondary'] as string || '#666',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
  };

  const buttonStyles = {
    padding: '10px 20px',
    backgroundColor: tokens['color.primary'] as string || '#d45a5f',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  };

  const buttonHoverStyles = {
    ...buttonStyles,
    opacity: 0.9,
  };

  return (
    <div className={className} style={containerStyles} data-testid={dataTestId}>
      <div style={iconStyles}>⚠️</div>
      <h1 style={titleStyles}>出错了</h1>
      <p style={messageStyles}>
        抱歉，应用程序遇到了一个错误。请尝试刷新页面或联系支持团队。
      </p>

      {errorInfo && (
        <details style={detailsStyles}>
          <summary style={detailsTitleStyles}>错误详情</summary>
          <pre style={detailsTextStyles}>
            {error.message}
            {'\n\n'}
            {errorInfo.componentStack}
          </pre>
        </details>
      )}

      {onReset && (
        <button
          style={buttonStyles}
          onClick={onReset}
          onMouseEnter={(e) => Object.assign((e.target as HTMLElement).style, buttonHoverStyles)}
          onMouseLeave={(e) => Object.assign((e.target as HTMLElement).style, buttonStyles)}
        >
          重新加载
        </button>
      )}
    </div>
  );
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo,
    });

    errorLogger.handle(error, {
      component: this.props.component || 'ErrorBoundary',
      action: 'componentDidCatch',
      additionalData: {
        componentStack: errorInfo.componentStack,
      },
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          data-testid="error-fallback"
        />
      );
    }

    return this.props.children;
  }
}
