import * as React from 'react';
import { render, fireEvent } from '@testing-library/react'
import { screen } from '@testing-library/dom';

import '@testing-library/jest-dom';
import { Modal } from '../Modal'
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('Modal 组件', () => {
  describe('基础渲染', () => {
    it('当open为false时不应该渲染Modal', () => {
      render(<ThemeProvider>
        <Modal isOpen={false} onClose={() => {}}>
          <div>Modal内容</div>
        </Modal>
      );
      expect(screen.queryByText('Modal内容')).not.toBeInTheDocument();
    });

    it('当open为true时应该渲染Modal', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <div>Modal内容</div>
        </Modal>
      );
      expect(screen.getByText('Modal内容')).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}} className="custom-modal">
          <div>内容</div>
        </Modal>
      );
      const modal = screen.getByText('内容');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('关闭功能', () => {
    it('应该支持通过onClose关闭', () => {
      const handleClose = jest.fn();
      const { rerender } = render(<ThemeProvider>
        <Modal isOpen={true} onClose={handleClose}>
          <div>内容</div>
        </Modal>
      );
      
      rerender(<ThemeProvider>
        <Modal isOpen={false} onClose={handleClose}>
          <div>内容</div>
        </Modal>
      );
      
      expect(screen.queryByText('内容')).not.toBeInTheDocument();
    });

    it('点击遮罩层应该触发onClose', () => {
      const handleClose = jest.fn();
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={handleClose}>
          <div>内容</div>
        </Modal>
      );
      
      const overlay = screen.getByText('内容').parentElement?.parentElement;
      if (overlay) {
        fireEvent.click(overlay);
      }
      expect(handleClose).toHaveBeenCalled();
    });

    it('点击Modal内容不应该触发onClose', () => {
      const handleClose = jest.fn();
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={handleClose}>
          <div>内容</div>
        </Modal>
      );
      
      const content = screen.getByText('内容');
      fireEvent.click(content);
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('键盘事件', () => {
    it('按ESC键应该触发onClose', () => {
      const handleClose = jest.fn();
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={handleClose}>
          <div>内容</div>
        </Modal>
      );
      
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      expect(handleClose).toHaveBeenCalled();
    });

    it('按其他键不应该触发onClose', () => {
      const handleClose = jest.fn();
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={handleClose}>
          <div>内容</div>
        </Modal>
      );
      
      fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' });
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  describe('ModalHeader 组件', () => {
    it('应该正确渲染ModalHeader', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Header>标题</Modal.Header>
        </Modal>
      );
      expect(screen.getByText('标题')).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Header className="custom-header">标题</Modal.Header>
        </Modal>
      );
      const header = screen.getByText('标题');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('ModalTitle 组件', () => {
    it('应该正确渲染ModalTitle', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Title>Modal标题</Modal.Title>
        </Modal>
      );
      const title = screen.getByText('Modal标题');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H2');
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Title className="custom-title">标题</Modal.Title>
        </Modal>
      );
      const title = screen.getByText('标题');
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('ModalDescription 组件', () => {
    it('应该正确渲染ModalDescription', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Description>Modal描述</Modal.Description>
        </Modal>
      );
      const description = screen.getByText('Modal描述');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Description className="custom-desc">描述</Modal.Description>
        </Modal>
      );
      const description = screen.getByText('描述');
      expect(description).toHaveClass('custom-desc');
    });
  });

  describe('ModalContent 组件', () => {
    it('应该正确渲染ModalContent', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Content>内容</Modal.Content>
        </Modal>
      );
      expect(screen.getByText('内容')).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Content className="custom-content">内容</Modal.Content>
        </Modal>
      );
      const content = screen.getByText('内容');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('ModalFooter 组件', () => {
    it('应该正确渲染ModalFooter', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Footer>底部</Modal.Footer>
        </Modal>
      );
      expect(screen.getByText('底部')).toBeInTheDocument();
    });

    it('应该支持自定义类名', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Footer className="custom-footer">底部</Modal.Footer>
        </Modal>
      );
      const footer = screen.getByText('底部');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('组合使用', () => {
    it('应该正确渲染完整的Modal结构', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Header>
            <Modal.Title>标题</Modal.Title>
            <Modal.Description>描述</Modal.Description>
          </Modal.Header>
          <Modal.Content>内容</Modal.Content>
          <Modal.Footer>底部</Modal.Footer>
        </Modal>
      );

      expect(screen.getByText('标题')).toBeInTheDocument();
      expect(screen.getByText('描述')).toBeInTheDocument();
      expect(screen.getByText('内容')).toBeInTheDocument();
      expect(screen.getByText('底部')).toBeInTheDocument();
    });

    it('应该支持嵌套组件', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Content>
            <div>嵌套内容</div>
            <button>按钮</button>
          </Modal.Content>
        </Modal>
      );

      expect(screen.getByText('嵌套内容')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('可访问性', () => {
    it('应该设置正确的ARIA属性', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <div>内容</div>
        </Modal>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
    });

    it('应该支持自定义aria-label', () => {
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}} aria-label="自定义Modal">
          <div>内容</div>
        </Modal>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-label', '自定义Modal');
    });
  });

  describe('ref', () => {
    it('Modal应该支持ref转发', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}} ref={ref}>
          <div>内容</div>
        </Modal>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('ModalContent应该支持ref转发', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ThemeProvider>
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Content ref={ref}>内容</Modal.Content>
        </Modal>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
