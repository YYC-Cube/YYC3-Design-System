/**
 * @file Modal 组件 Story
 * @description Modal 组件的 Storybook 故事
 * @module stories/components/Modal.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../../src/components/Button';
import { Modal } from '../../src/components/Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '是否打开',
    },
    onClose: {
      action: 'closed',
      description: '关闭事件',
    },
    className: {
      control: 'text',
      description: '自定义类名',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    isOpen: true,
    children: (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>默认模态框</h2>
        <p>这是一个默认的模态框内容。</p>
      </div>
    ),
  },
};

export const WithoutCloseButton: Story = {
  args: {
    isOpen: true,
    onClose: undefined,
    children: (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>无关闭按钮</h2>
        <p>这个模态框没有关闭按钮，只能通过编程方式关闭。</p>
      </div>
    ),
  },
};

export const WithLongContent: Story = {
  args: {
    isOpen: true,
    children: (
      <div style={{ padding: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>长内容模态框</h2>
        <p>这是第一段内容。</p>
        <p>这是第二段内容。</p>
        <p>这是第三段内容。</p>
        <p>这是第四段内容。</p>
        <p>这是第五段内容。</p>
        <p>这是第六段内容。</p>
        <p>这是第七段内容。</p>
        <p>这是第八段内容。</p>
        <p>当内容过长时，模态框内部会自动滚动。</p>
      </div>
    ),
  },
};

export const WithForm: Story = {
  args: {
    isOpen: true,
    children: (
      <div style={{ padding: '2rem', width: '400px' }}>
        <h2 style={{ margin: '0 0 1.5rem 0' }}>用户信息</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>
            用户名
          </label>
          <input
            type="text"
            placeholder="请输入用户名"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.25rem',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>
            邮箱
          </label>
          <input
            type="email"
            placeholder="请输入邮箱"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.25rem',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
          <Button variant="default">保存</Button>
          <Button variant="outline">取消</Button>
        </div>
      </div>
    ),
  },
};

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>打开模态框</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ padding: '2rem', width: '400px' }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>交互式模态框</h2>
            <p>点击按钮打开模态框，点击关闭按钮或按 ESC 键关闭。</p>
            <div style={{ marginTop: '1.5rem' }}>
              <Button onClick={() => setIsOpen(false)}>关闭</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

export const WithConfirmation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleConfirm = () => {
      alert('已确认操作！');
      setIsOpen(false);
    };
    
    return (
      <div>
        <Button variant="destructive" onClick={() => setIsOpen(true)}>
          删除项目
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ padding: '2rem', width: '400px' }}>
            <h2 style={{ margin: '0 0 1rem 0', color: '#e05a3f' }}>确认删除</h2>
            <p>您确定要删除这个项目吗？此操作无法撤销。</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                取消
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                确认删除
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

export const WithSuccessMessage: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>显示成功消息</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ padding: '2rem', width: '400px', textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: '#10b981', 
              borderRadius: '50%', 
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '2rem',
            }}>
              ✓
            </div>
            <h2 style={{ margin: '0 0 1rem 0' }}>操作成功</h2>
            <p>您的操作已成功完成！</p>
            <div style={{ marginTop: '1.5rem' }}>
              <Button onClick={() => setIsOpen(false)}>确定</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

export const WithImage: Story = {
  args: {
    isOpen: true,
    children: (
      <div style={{ padding: '0' }}>
        <img
          src="https://via.placeholder.com/600x400/d45a5f/ffffff?text=Image+Modal"
          alt="示例图片"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <div style={{ padding: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>图片模态框</h2>
          <p>这是一个包含图片的模态框示例。</p>
        </div>
      </div>
    ),
  },
};

export const WithMultipleModals: Story = {
  render: () => {
    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    
    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => setIsOpen1(true)}>打开模态框 1</Button>
        <Button onClick={() => setIsOpen2(true)}>打开模态框 2</Button>
        
        <Modal isOpen={isOpen1} onClose={() => setIsOpen1(false)}>
          <div style={{ padding: '2rem' }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>模态框 1</h2>
            <p>这是第一个模态框。</p>
          </div>
        </Modal>
        
        <Modal isOpen={isOpen2} onClose={() => setIsOpen2(false)}>
          <div style={{ padding: '2rem' }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>模态框 2</h2>
            <p>这是第二个模态框。</p>
          </div>
        </Modal>
      </div>
    );
  },
};

export const WithCustomStyle: Story = {
  args: {
    isOpen: true,
    className: 'custom-modal',
    children: (
      <div style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
      }}>
        <h2 style={{ margin: '0 0 1rem 0' }}>自定义样式</h2>
        <p>这个模态框使用了自定义的渐变背景。</p>
      </div>
    ),
  },
};
