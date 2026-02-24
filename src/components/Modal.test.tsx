/**
 * @file Modal 组件测试
 * @description 测试 Modal 组件的各项功能
 * @module __tests__/components/Modal.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom';


import { Modal } from './Modal';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('Modal 组件', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  beforeEach(() => {
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    document.body.style.overflow = 'unset';
  });

  it('应该在 isOpen 为 false 时不渲染', () => {
    renderWithTheme(
      <Modal isOpen={false}>
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('应该在 isOpen 为 true 时渲染', () => {
    renderWithTheme(
      <Modal isOpen={true}>
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('应该在点击关闭按钮时调用 onClose', () => {
    const handleClose = jest.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('应该在点击背景时调用 onClose', () => {
    const handleClose = jest.fn();
    const { container } = renderWithTheme(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );

    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('应该在点击模态框内容时不调用 onClose', () => {
    const handleClose = jest.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );

    const modalContent = screen.getByRole('dialog');
    fireEvent.click(modalContent);

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('应该在按 ESC 键时调用 onClose', () => {
    const handleClose = jest.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('应该在按其他键时不调用 onClose', () => {
    const handleClose = jest.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Enter' });

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('应该在打开时禁用 body 滚动', () => {
    renderWithTheme(
      <Modal isOpen={true}>
        <div>Modal content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('应该在关闭时恢复 body 滚动', () => {
    const handleClose = jest.fn();
    const { unmount } = renderWithTheme(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );

    handleClose();
    unmount();

    expect(document.body.style.overflow).toBe('unset');
  });

  it('应该在没有 onClose 时不显示关闭按钮', () => {
    renderWithTheme(
      <Modal isOpen={true}>
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  it('应该应用自定义 className', () => {
    renderWithTheme(
      <Modal isOpen={true} className="custom-class">
        <div>Modal content</div>
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('custom-class');
  });

  it('应该正确渲染复杂内容', () => {
    renderWithTheme(
      <Modal isOpen={true}>
        <div>
          <h2>Modal Title</h2>
          <p>Modal description</p>
        </div>
      </Modal>
    );

    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal description')).toBeInTheDocument();
  });

  it('应该应用正确的样式', () => {
    renderWithTheme(
      <Modal isOpen={true}>
        <div>Modal content</div>
      </Modal>
    );

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveStyle({
      position: 'relative',
      maxWidth: '90%',
      maxHeight: '90vh',
    });
  });

  it('应该在切换 isOpen 时正确处理事件监听器', () => {
    const handleClose = jest.fn();
    renderWithTheme(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
