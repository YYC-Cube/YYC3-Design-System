/**
 * @file 错误通知组件
 * @description YYC³ Design System错误通知组件
 * @component ErrorNotification
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-25
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { memo, useEffect, useState, useCallback } from 'react';
import { errorLogger } from '../core/ErrorLogger';
import { ErrorNotification as ErrorNotificationType, ErrorLevel } from '../types/error';
import { useTheme } from '../theme/ThemeProvider';

export interface ErrorNotificationContainerProps {
  className?: string;
  'data-testid'?: string;
}

export const ErrorNotificationContainer = memo<ErrorNotificationContainerProps>(({
  className = '',
  'data-testid': dataTestId,
}) => {
  const { tokens } = useTheme();
  const [notifications, setNotifications] = useState<ErrorNotificationType[]>([]);

  useEffect(() => {
    const unsubscribe = errorLogger.onNotification((notification) => {
      setNotifications(prev => [...prev, notification]);

      if (notification.duration && notification.duration > 0) {
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, notification.duration);
      }
    });

    return unsubscribe;
  }, []);

  const handleDismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const containerStyles = {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    maxWidth: '400px',
  };

  const notificationStyles = {
    display: 'flex',
    alignItems: 'flex-start' as const,
    gap: '12px',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: tokens['color.background'] as string || '#fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    animation: 'slideIn 0.3s ease-out',
  };

  const iconStyles = {
    fontSize: '24px',
    flexShrink: 0,
  };

  const contentStyles = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  };

  const titleStyles = {
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: tokens['color.text.primary'] as string || '#333',
  };

  const messageStyles = {
    fontSize: '13px',
    color: tokens['color.text.secondary'] as string || '#666',
    lineHeight: '1.5',
  };

  const dismissButtonStyles = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    fontSize: '16px',
    color: tokens['color.text.secondary'] as string || '#666',
    opacity: 0.6,
    transition: 'opacity 0.2s',
  };

  const dismissButtonHoverStyles = {
    ...dismissButtonStyles,
    opacity: 1,
  };

  const getIcon = (level: ErrorLevel): string => {
    switch (level) {
      case ErrorLevel.DEBUG:
        return '🔍';
      case ErrorLevel.INFO:
        return 'ℹ️';
      case ErrorLevel.WARN:
        return '⚠️';
      case ErrorLevel.ERROR:
        return '❌';
      case ErrorLevel.FATAL:
        return '💀';
      default:
        return '⚠️';
    }
  };

  const getBorderColor = (level: ErrorLevel): string => {
    switch (level) {
      case ErrorLevel.DEBUG:
        return tokens['color.info'] as string || '#1890ff';
      case ErrorLevel.INFO:
        return tokens['color.info'] as string || '#1890ff';
      case ErrorLevel.WARN:
        return tokens['color.warning'] as string || '#faad14';
      case ErrorLevel.ERROR:
        return tokens['color.error'] as string || '#ff4d4f';
      case ErrorLevel.FATAL:
        return tokens['color.error'] as string || '#ff4d4f';
      default:
        return tokens['color.warning'] as string || '#faad14';
    }
  };

  const getTitle = (level: ErrorLevel): string => {
    switch (level) {
      case ErrorLevel.DEBUG:
        return '调试信息';
      case ErrorLevel.INFO:
        return '信息';
      case ErrorLevel.WARN:
        return '警告';
      case ErrorLevel.ERROR:
        return '错误';
      case ErrorLevel.FATAL:
        return '严重错误';
      default:
        return '警告';
    }
  };

  return (
    <div className={className} style={containerStyles} data-testid={dataTestId}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            ...notificationStyles,
            borderLeft: `4px solid ${getBorderColor(notification.level)}`,
          }}
        >
          <span style={iconStyles}>{getIcon(notification.level)}</span>
          <div style={contentStyles}>
            <div style={titleStyles}>{getTitle(notification.level)}</div>
            <div style={messageStyles}>{notification.message}</div>
          </div>
          {notification.dismissible && (
            <button
              style={dismissButtonStyles}
              onClick={() => handleDismiss(notification.id)}
              onMouseEnter={(e) => Object.assign((e.target as HTMLElement).style, dismissButtonHoverStyles)}
              onMouseLeave={(e) => Object.assign((e.target as HTMLElement).style, dismissButtonStyles)}
              aria-label="Dismiss"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
});

ErrorNotificationContainer.displayName = 'ErrorNotificationContainer';
