/**
 * @file 性能测试
 * @description 测试组件渲染性能
 * @module __tests__/performance
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/Card';
import { Grid } from '../components/Grid';

describe('性能测试', () => {
  describe('Button组件性能', () => {
    it('应该快速渲染单个Button', () => {
      const startTime = performance.now();
      render(
        <ThemeProvider>
          <Button>按钮</Button>
        </ThemeProvider>
      );
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(20);
    });

    it('应该快速渲染多个Button', () => {
      const buttons = Array.from({ length: 100 }, (_, i) => <Button key={i}>按钮{i}</Button>);

      const startTime = performance.now();
      render(
        <ThemeProvider>
          <div>{buttons}</div>
        </ThemeProvider>
      );
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
    });

    it('应该快速处理点击事件', () => {
      const handleClick = jest.fn();
      render(
        <ThemeProvider>
          <Button onClick={handleClick}>按钮</Button>
        </ThemeProvider>
      );

      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        screen.getByRole('button').click();
      }
      const endTime = performance.now();
      const clickTime = endTime - startTime;

      expect(clickTime).toBeLessThan(60);
      expect(handleClick).toHaveBeenCalledTimes(100);
    });
  });

  describe('Input组件性能', () => {
    it('应该快速渲染单个Input', () => {
      const startTime = performance.now();
      render(
        <ThemeProvider>
          <Input />
        </ThemeProvider>
      );
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(10);
    });

    it('应该快速处理输入事件', () => {
      const handleChange = jest.fn();
      render(
        <ThemeProvider>
          <Input onChange={handleChange} />
        </ThemeProvider>
      );

      const input = screen.getByRole('textbox');
      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        fireEvent.change(input, { target: { value: `测试${i}` } });
      }
      const endTime = performance.now();
      const inputTime = endTime - startTime;

      expect(inputTime).toBeLessThan(100);
      expect(handleChange).toHaveBeenCalledTimes(100);
    });
  });

  describe('Card组件性能', () => {
    it('应该快速渲染单个Card', () => {
      const startTime = performance.now();
      render(
        <ThemeProvider>
          <Card>
            <CardContent>内容</CardContent>
          </Card>
        </ThemeProvider>
      );
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(10);
    });

    it('应该快速渲染多个Card', () => {
      const cards = Array.from({ length: 50 }, (_, i) => (
        <Card key={i}>
          <CardContent>卡片{i}</CardContent>
        </Card>
      ));

      const startTime = performance.now();
      render(
        <ThemeProvider>
          <div>{cards}</div>
        </ThemeProvider>
      );
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
    });
  });

  describe('Grid组件性能', () => {
    it('应该快速渲染Grid', () => {
      const items = Array.from({ length: 12 }, (_, i) => <div key={i}>项目{i}</div>);

      const startTime = performance.now();
      render(
        <ThemeProvider>
          <Grid cols={4}>{items}</Grid>
        </ThemeProvider>
      );
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(50);
    });

    it('应该快速渲染大量Grid项目', () => {
      const items = Array.from({ length: 100 }, (_, i) => <div key={i}>项目{i}</div>);

      const startTime = performance.now();
      render(
        <ThemeProvider>
          <Grid cols={10}>{items}</Grid>
        </ThemeProvider>
      );
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(200);
    });
  });

  describe('复杂场景性能', () => {
    it('应该快速渲染复杂表单', () => {
      const TestComponent = () => {
        const [values, setValues] = React.useState(Array.from({ length: 10 }, () => ''));

        return (
          <Card>
            <CardHeader>
              <CardTitle>复杂表单</CardTitle>
            </CardHeader>
            <CardContent>
              {values.map((value, index) => (
                <Input
                  key={index}
                  value={value}
                  onChange={(e: any) => {
                    const newValues = [...values];
                    newValues[index] = e.target.value;
                    setValues(newValues);
                  }}
                  placeholder={`输入框${index + 1}`}
                />
              ))}
            </CardContent>
            <CardFooter>
              <Button>提交</Button>
            </CardFooter>
          </Card>
        );
      };

      const startTime = performance.now();
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
    });

    it('应该快速渲染卡片网格', () => {
      const cards = Array.from({ length: 20 }, (_, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>卡片{i}</CardTitle>
          </CardHeader>
          <CardContent>内容{i}</CardContent>
        </Card>
      ));

      const startTime = performance.now();
      render(
        <ThemeProvider>
          <Grid cols={4}>{cards}</Grid>
        </ThemeProvider>
      );
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(200);
    });
  });

  describe('内存性能', () => {
    it('应该正确清理组件', () => {
      const { unmount } = render(
        <ThemeProvider>
          <Card>
            <CardContent>内容</CardContent>
          </Card>
        </ThemeProvider>
      );

      unmount();

      expect(screen.queryByText('内容')).not.toBeInTheDocument();
    });

    it('应该正确清理多个组件', () => {
      const cards = Array.from({ length: 50 }, (_, i) => (
        <Card key={i}>
          <CardContent>卡片{i}</CardContent>
        </Card>
      ));

      const { unmount } = render(
        <ThemeProvider>
          <div>{cards}</div>
        </ThemeProvider>
      );

      unmount();

      expect(screen.queryByText('卡片0')).not.toBeInTheDocument();
    });
  });

  describe('重渲染性能', () => {
    it('应该快速重渲染Button', () => {
      const TestComponent = () => {
        const [count, setCount] = React.useState(0);
        return <Button onClick={() => setCount(count + 1)}>点击次数: {count}</Button>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const startTime = performance.now();
      for (let i = 0; i < 50; i++) {
        screen.getByRole('button').click();
      }
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(200);
    });

    it('应该快速重渲染Input', () => {
      const TestComponent = () => {
        const [value, setValue] = React.useState('');
        return <Input value={value} onChange={setValue} placeholder="输入框" />;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const input = screen.getByPlaceholderText('输入框');
      const startTime = performance.now();
      for (let i = 0; i < 50; i++) {
        fireEvent.change(input, { target: { value: `测试${i}` } });
      }
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(200);
    });
  });

  describe('响应性能', () => {
    it('应该快速响应主题切换', () => {
      const TestComponent = () => {
        const { mode, setMode } = useTheme();
        return (
          <div>
            <Button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>切换主题</Button>
            <div>当前主题: {mode}</div>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const startTime = performance.now();
      for (let i = 0; i < 20; i++) {
        screen.getByRole('button').click();
      }
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100);
    });
  });
});
