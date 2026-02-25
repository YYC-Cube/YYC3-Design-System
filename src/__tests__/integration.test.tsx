/**
 * @file 组件集成测试
 * @description 测试多个组件的集成使用
 * @module __tests__/integration
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import * as React from 'react';

import { render, fireEvent, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/Modal';
import { Grid } from '../components/Grid';
import { Container } from '../components/Container';

describe('组件集成测试', () => {
  afterEach(() => {
    // 清理主题状态
    jest.clearAllMocks();
  });

  describe('主题切换集成', () => {
    it('应该能够在不同主题下渲染Button', () => {
      const TestComponent = () => {
        const { mode, setMode } = useTheme();
        return (
          <div>
            <Button>按钮</Button>
            <button onClick={() => setMode('dark')}>切换主题</button>
            <span data-testid="current-theme">当前主题: {mode}</span>
          </div>
        );
      };

      const { unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('当前主题: light');
      expect(screen.getByRole('button', { name: '按钮' })).toBeInTheDocument();

      act(() => {
        screen.getByText('切换主题').click();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('当前主题: dark');
      
      unmount();
    });

    it('应该能够在不同主题下渲染Input', () => {
      const TestComponent = () => {
        return (
          <div>
            <Input placeholder="输入框" />
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByPlaceholderText('输入框')).toBeInTheDocument();
    });
  });

  describe('表单集成', () => {
    it('应该能够集成Input和Button', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        const handleSubmit = () => {
          console.warn('提交:', value);
        };

        return (
          <Card>
            <CardHeader>
              <CardTitle>表单</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={value}
                onChange={setValue}
                placeholder="请输入内容"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit}>提交</Button>
            </CardFooter>
          </Card>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByPlaceholderText('请输入内容')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '提交' })).toBeInTheDocument();
    });

    it('应该能够处理表单提交', () => {
      const handleSubmit = jest.fn();
      const TestComponent = () => {
        const [value, setValue] = React.useState('');

        return (
          <Card>
            <CardContent>
              <Input
                value={value}
                onChange={setValue}
                placeholder="请输入内容"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubmit(value)}>提交</Button>
            </CardFooter>
          </Card>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const input = screen.getByPlaceholderText('请输入内容');
      fireEvent.change(input, { target: { value: '测试内容' } });

      const button = screen.getByRole('button', { name: '提交' });
      fireEvent.click(button);

      expect(handleSubmit).toHaveBeenCalledWith('测试内容');
    });
  });

  describe('Modal集成', () => {
    it('应该能够集成Modal和Button', () => {
      const TestComponent = () => {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
          <div>
            <Button onClick={() => setIsOpen(true)}>打开Modal</Button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <ModalHeader>
                <ModalTitle>标题</ModalTitle>
              </ModalHeader>
              <ModalContent>内容</ModalContent>
              <ModalFooter>
                <Button onClick={() => setIsOpen(false)}>关闭</Button>
              </ModalFooter>
            </Modal>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByRole('button', { name: '打开Modal' })).toBeInTheDocument();
      expect(screen.queryByText('内容')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: '打开Modal' }));

      expect(screen.getByText('内容')).toBeInTheDocument();
    });

    it('应该能够通过按钮关闭Modal', () => {
      const TestComponent = () => {
        const [isOpen, setIsOpen] = React.useState(true);

        return (
          <ThemeProvider>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <ModalContent>内容</ModalContent>
              <ModalFooter>
                <Button onClick={() => setIsOpen(false)}>关闭</Button>
              </ModalFooter>
            </Modal>
          </ThemeProvider>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('内容')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: '关闭' }));

      expect(screen.queryByText('内容')).not.toBeInTheDocument();
    });
  });

  describe('Grid集成', () => {
    it('应该能够在Grid中渲染多个Card', () => {
      const cards = Array.from({ length: 4 }, (_, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>卡片{i}</CardTitle>
          </CardHeader>
          <CardContent>内容{i}</CardContent>
        </Card>
      ));

      render(
        <ThemeProvider>
          <Grid cols={2}>
            {cards}
          </Grid>
        </ThemeProvider>
      );

      expect(screen.getByText('卡片0')).toBeInTheDocument();
      expect(screen.getByText('卡片1')).toBeInTheDocument();
      expect(screen.getByText('卡片2')).toBeInTheDocument();
      expect(screen.getByText('卡片3')).toBeInTheDocument();
    });

    it('应该能够在Grid中渲染多个Button', () => {
      const buttons = Array.from({ length: 4 }, (_, i) => (
        <Button key={i}>按钮{i}</Button>
      ));

      render(
        <ThemeProvider>
          <Grid cols={2}>
            {buttons}
          </Grid>
        </ThemeProvider>
      );

      expect(screen.getByRole('button', { name: '按钮0' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '按钮1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '按钮2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '按钮3' })).toBeInTheDocument();
    });
  });

  describe('Container集成', () => {
    it('应该能够在Container中渲染Card', () => {
      render(
        <ThemeProvider>
          <Container>
            <Card>
              <CardContent>内容</CardContent>
            </Card>
          </Container>
        </ThemeProvider>
      );

      expect(screen.getByText('内容')).toBeInTheDocument();
    });

    it('应该能够在Container中渲染Grid', () => {
      const items = Array.from({ length: 4 }, (_, i) => (
        <div key={i}>项目{i}</div>
      ));

      render(
        <ThemeProvider>
          <Container>
            <Grid cols={2}>
              {items}
            </Grid>
          </Container>
        </ThemeProvider>
      );

      expect(screen.getByText('项目0')).toBeInTheDocument();
      expect(screen.getByText('项目1')).toBeInTheDocument();
      expect(screen.getByText('项目2')).toBeInTheDocument();
      expect(screen.getByText('项目3')).toBeInTheDocument();
    });
  });

  describe('复杂场景集成', () => {
    it('应该能够集成所有组件', () => {
      const TestComponent = () => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [value, setValue] = React.useState('');

        return (
          <Container>
            <Card>
              <CardHeader>
                <CardTitle>复杂场景</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={value}
                  onChange={setValue}
                  placeholder="请输入内容"
                />
                <Grid cols={2}>
                  <Button onClick={() => setIsOpen(true)}>打开Modal</Button>
                  <Button>提交</Button>
                </Grid>
              </CardContent>
            </Card>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <ModalHeader>
                <ModalTitle>Modal标题</ModalTitle>
              </ModalHeader>
              <ModalContent>Modal内容</ModalContent>
              <ModalFooter>
                <Button onClick={() => setIsOpen(false)}>关闭</Button>
              </ModalFooter>
            </Modal>
          </Container>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('复杂场景')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('请输入内容')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '打开Modal' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '提交' })).toBeInTheDocument();
      expect(screen.queryByText('Modal内容')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: '打开Modal' }));

      expect(screen.getByText('Modal内容')).toBeInTheDocument();
    });
  });
});
