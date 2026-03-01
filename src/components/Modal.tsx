import React, { useEffect, useRef, FC, memo } from 'react';
import { useTheme } from '../theme/useTheme';

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: FC<ModalProps> = ({ isOpen = false, onClose, children, className = '' }) => {
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
    backgroundColor: (tokens['color.card'] as string) || '#f8f9ef',
    borderRadius: (tokens['radius.lg'] as string) || '0.5rem',
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
    color: (tokens['color.foreground'] as string) || '#000',
    padding: 0,
    lineHeight: 1,
  };

  if (!isOpen) return null;

  return (
    <div style={backdropStyle} onClick={handleBackdropClick}>
      <div ref={modalRef} style={modalStyle} className={className} role="dialog" aria-modal="true">
        {onClose && (
          <button style={closeButtonStyle} onClick={onClose} aria-label="Close modal">
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';

export const ModalHeader = memo<{ children: React.ReactNode; className?: string }>(
  ({ children, className }) => {
    const { tokens } = useTheme();

    const headerStyle: React.CSSProperties = {
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: `1px solid ${(tokens['color.muted-foreground'] as string) || '#ccc'}`,
    };

    return (
      <div style={headerStyle} className={className}>
        {children}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

export const ModalTitle = memo<{ children: React.ReactNode; className?: string }>(
  ({ children, className }) => {
    const { tokens } = useTheme();

    const titleStyle: React.CSSProperties = {
      fontSize: (tokens['font-size.heading-2'] as string) || '1.5rem',
      fontWeight: '600',
      margin: '0',
      color: (tokens['color.foreground'] as string) || '#000',
    };

    return (
      <h2 style={titleStyle} className={className}>
        {children}
      </h2>
    );
  }
);

ModalTitle.displayName = 'ModalTitle';

export const ModalContent = memo<{ children: React.ReactNode; className?: string }>(
  ({ children, className }) => {
    const { tokens } = useTheme();

    const contentStyle: React.CSSProperties = {
      fontSize: (tokens['font-size.body'] as string) || '1rem',
      lineHeight: (tokens['line-height.body'] as string) || '1.5',
    };

    return (
      <div style={contentStyle} className={className}>
        {children}
      </div>
    );
  }
);

ModalContent.displayName = 'ModalContent';

export const ModalFooter = memo<{ children: React.ReactNode; className?: string }>(
  ({ children, className }) => {
    const { tokens } = useTheme();

    const footerStyle: React.CSSProperties = {
      marginTop: '1rem',
      paddingTop: '0.75rem',
      borderTop: `1px solid ${(tokens['color.muted-foreground'] as string) || '#ccc'}`,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.5rem',
    };

    return (
      <div style={footerStyle} className={className}>
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';

const ModalWithSubcomponents = Modal as typeof Modal & {
  Header: typeof ModalHeader;
  Title: typeof ModalTitle;
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
};

ModalWithSubcomponents.Header = ModalHeader;
ModalWithSubcomponents.Title = ModalTitle;
ModalWithSubcomponents.Content = ModalContent;
ModalWithSubcomponents.Footer = ModalFooter;

export default ModalWithSubcomponents;
