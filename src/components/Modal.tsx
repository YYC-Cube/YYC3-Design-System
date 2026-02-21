import React, { useEffect, useRef } from 'react';
import { useTheme } from '../theme/useTheme';

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen = false,
  onClose,
  children,
  className = '',
}) => {
  const { tokens } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: isOpen ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: tokens['color.card'] as string || '#f8f9ef',
    borderRadius: tokens['radius.lg'] as string || '0.5rem',
    boxShadow: `0 10px 25px rgba(0, 0, 0, 0.2)`,
    maxWidth: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: tokens['color.foreground'] as string || '#000',
    padding: 0,
    lineHeight: 1,
  };

  if (!isOpen) return null;

  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
      <div ref={modalRef} style={modalStyle} className={className} role="dialog" aria-modal="true">
        {onClose && (
          <button
            style={closeButtonStyle}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
