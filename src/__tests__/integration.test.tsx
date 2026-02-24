import * as React from 'react';

import { render, fireEvent, act } from '@testing-library/react'
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
  describe('主题切换集成', () => {
    it('应该能够在不同主题下渲染Button', () => {
      const TestComponent = () => {
        const { mode, setMode } = useTheme();
        return (
          <div>
            <Button>按钮</Button>
            <button onClick={() => setMode('dark')}>切换主题</button>
            <div>当前主题: {mode}</div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('当前主题: light')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '按钮' })).toBeInTheDocument();

      act(() => {
        screen.getByText('切换主题').click();
      });

      expect(screen.getByText('当前主题: dark')).toBeInTheDocument();
    });

    it('应该能够在不同主题下渲染Input', () => {
      const TestComponent = () => {
        const { mode, setMode } = useTheme();
        return (
          <div>
            <Button>按钮</Button>
            <button onClick={() => setMode('dark')}>切换主题</button>
            <div>当前主题: {mode}</div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('当前主题: light')).toBeInTheDocument();
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
                onChange={(e: any) => setValue(e.target.value)}
                placeholder="请输入内容"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit}>提交</Button>
            </CardFooter>
          </Card>
        );
      };

      render(<TestComponent />);

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
                onChange={(e: any) => setValue(e.target.value)}
                placeholder="请输入内容"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubmit(value)}>提交</Button>
            </CardFooter>
          </Card>
        );
      };

      render(<TestComponent />);

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

      render(<TestComponent />);

      expect(screen.getByRole('button', { name: '打开Modal' })).toBeInTheDocument();
      expect(screen.queryByText('内容')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: '打开Modal' }));

      expect(screen.getByText('内容')).toBeInTheDocument();
    });

    it('应该能够通过按钮关闭Modal', () => {
      const TestComponent = () => {
        const [isOpen, setIsOpen] = React.useState(true);

        return (
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <ModalHeader>
              <ModalTitle>标题</ModalTitle>
            </ModalHeader>
            <ModalContent>内容</ModalContent>
            <ModalFooter>
              <Button onClick={() => setIsOpen(false)}>关闭</Button>
            </ModalFooter>
          </Modal>
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
      const TestComponent = () => {
        return (
          <Grid cols={3}>
            <Card>
              <CardContent>卡片1</CardContent>
            </Card>
            <Card>
              <CardContent>卡片2</CardContent>
            </Card>
            <Card>
              <CardContent>卡片3</CardContent>
            </Card>
          </Grid>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('卡片1')).toBeInTheDocument();
      expect(screen.getByText('卡片2')).toBeInTheDocument();
      expect(screen.getByText('卡片3')).toBeInTheDocument();
    });

    it('应该能够在Grid中渲染多个Button', () => {
      const TestComponent = () => {
        return (
          <Grid cols={2}>
            <Button>按钮1</Button>
            <Button>按钮2</Button>
          </Grid>
        );
      };

      render(<TestComponent />);

      expect(screen.getByRole('button', { name: '按钮1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '按钮2' })).toBeInTheDocument();
    });
  });

  describe('Container集成', () => {
    it('应该能够在Container中渲染Card', () => {
      const TestComponent = () => {
        return (
          <Container>
            <Card>
              <CardContent>内容</CardContent>
            </Card>
          </Container>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('内容')).toBeInTheDocument();
    });

    it('应该能够在Container中渲染Grid', () => {
      const TestComponent = () => {
        return (
          <Container>
            <Grid cols={2}>
              <Card>
                <CardContent>卡片1</CardContent>
              </Card>
              <Card>
                <CardContent>卡片2</CardContent>
              </Card>
            </Grid>
          </Container>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('卡片1')).toBeInTheDocument();
      expect(screen.getByText('卡片2')).toBeInTheDocument();
    });
  });

  describe('复杂场景集成', () => {
    it('应该能够集成所有组件', () => {
      const TestComponent = () => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [value, setValue] = React.useState('');

        return (
          <Container>
            <Grid cols={2}>
              <Card>
                <CardHeader>
                  <CardTitle>表单卡片</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={value}
                    onChange={(e: any) => setValue(e.target.value)}
                    placeholder="请输入内容"
                  />
                </CardContent>
                <CardContent>
                  <Button onClick={() => setIsOpen(true)}>打开Modal</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>信息卡片</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>这是信息内容</p>
                </CardContent>
              </Card>
            </Grid>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <ModalHeader>
                <ModalTitle>Modal标题</ModalTitle>
              </ModalHeader>
              <ModalContent>
                <p>Modal内容</p>
              </ModalContent>
              <ModalFooter>
                <Button onClick={() => setIsOpen(false)}>关闭</Button>
              </ModalFooter>
            </Modal>
          </Container>
        );
      };

      render(<TestComponent />);

      expect(screen.getByText('表单卡片')).toBeInTheDocument();
      expect(screen.getByText('信息卡片')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('请输入内容')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '打开Modal' })).toBeInTheDocument();
      expect(screen.queryByText('Modal内容')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: '打开Modal' }));

      expect(screen.getByText('Modal内容')).toBeInTheDocument();
    });
  });

  describe('响应式布局集成', () => {
    it('应该能够在不同容器宽度下正确渲染', () => {
      const TestComponent = () => {
        return (
          <Container maxWidth="lg">
            <Grid cols={3}>
              <Card>
                <CardContent>卡片1</CardContent>
              </Card>
              <Card>
                <CardContent>卡片2</CardContent>
              </Card>
              <Card>
                <CardContent>卡片3</CardContent>
              </Card>
            </Grid>
          </Container>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByText('卡片1')).toBeInTheDocument();
      expect(screen.getByText('卡片2')).toBeInTheDocument();
      expect(screen.getByText('卡片3')).toBeInTheDocument();
    });
  });
});
