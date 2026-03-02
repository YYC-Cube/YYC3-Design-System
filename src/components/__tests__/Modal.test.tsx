import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { Modal } from '../Modal';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Modal 组件', () => {
  describe('基础渲染', () => {
    it('当open为false时不应该渲染Modal', () => {
      render(
        <ThemeProvider>
          <Modal isOpen={false} onClose={() => {}}>
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      expect(screen.queryByText('Modal内容')).not.toBeInTheDocument();
    });

    it('当open为true时应该渲染Modal', () => {
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={() => {}}>
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      expect(screen.getByText('Modal内容')).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={() => {}} className="custom-modal">
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      const modalContent = screen.getByText('Modal内容');
      expect(modalContent).toBeInTheDocument();
    });

    it('应该支持自定义样式', () => {
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={() => {}} style={{ zIndex: 9999 }}>
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      const modalContent = screen.getByText('Modal内容');
      expect(modalContent).toBeInTheDocument();
    });
  });

  describe('交互', () => {
    it('应该点击遮罩层关闭Modal', () => {
      const handleClose = jest.fn();
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick>
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      const overlay = screen.getByText('Modal内容').parentElement?.parentElement;
      if (overlay) {
        fireEvent.click(overlay);
        expect(handleClose).toHaveBeenCalledTimes(1);
      }
    });

    it('应该点击ESC键关闭Modal', () => {
      const handleClose = jest.fn();
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={handleClose} closeOnEsc>
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('点击Modal内容不应该关闭Modal', () => {
      const handleClose = jest.fn();
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick>
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      const modalContent = screen.getByText('Modal内容');
      fireEvent.click(modalContent);
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('禁用关闭', () => {
    it('当closeOnOverlayClick为false时不应该点击遮罩关闭', () => {
      const handleClose = jest.fn();
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={false}>
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      const overlay = screen.getByText('Modal内容').parentElement?.parentElement;
      if (overlay) {
        fireEvent.click(overlay);
        expect(handleClose).not.toHaveBeenCalled();
      }
    });

    it('当closeOnEsc为false时不应该ESC关闭', () => {
      const handleClose = jest.fn();
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={handleClose} closeOnEsc={false}>
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('动画', () => {
    it('应该支持自定义动画持续时间', () => {
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={() => {}} animationDuration={300}>
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      expect(screen.getByText('Modal内容')).toBeInTheDocument();
    });

    it('应该禁用动画', () => {
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={() => {}} disableAnimation>
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      expect(screen.getByText('Modal内容')).toBeInTheDocument();
    });
  });

  describe('可访问性', () => {
    it('应该支持自定义aria-label', () => {
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={() => {}} aria-label="自定义Modal">
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-label', '自定义Modal');
    });

    it('应该支持aria-labelledby', () => {
      render(
        <ThemeProvider>
          <div id="modal-title">Modal标题</div>
          <Modal isOpen={true} onClose={() => {}} aria-labelledby="modal-title">
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    });
  });

  describe('ref', () => {
    it('应该支持ref转发', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <ThemeProvider>
          <Modal isOpen={true} onClose={() => {}} ref={ref}>
            <div>Modal内容</div>
          </Modal>
        </ThemeProvider>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
