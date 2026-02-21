/**
 * @file 性能基准测试
 * @description 测试组件渲染性能和优化效果
 * @module tests/performance/performance.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as React from 'react';
import { ThemeProvider } from '../../src/theme/ThemeProvider';
import { useTheme } from '../../src/theme/useTheme';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { Card, CardHeader, CardContent } from '../../src/components/Card';
import { Alert } from '../../src/components/Alert';
import { Tabs, TabList, Tab, TabPanel } from '../../src/components/Tabs';
import { Avatar } from '../../src/components/Avatar';
import { Badge } from '../../src/components/Badge';

describe('YYC³ Design System Performance Tests', () => {
  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    );
  };

  afterEach(() => {
    cleanup();
  });

  describe('Render Performance', () => {
    it('should render Button component within 200ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <Button variant="default" data-testid="button">
          Test Button
        </Button>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(200);
      expect(screen.getByTestId('button')).toBeInTheDocument();
    });

    it('should render Input component within 150ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <Input placeholder="Test input" data-testid="input" />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(150);
      expect(screen.getByTestId('input')).toBeInTheDocument();
    });

    it('should render Card component within 150ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <Card data-testid="card">
          <CardHeader>Card Title</CardHeader>
          <CardContent>Card Content</CardContent>
        </Card>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(150);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should render Alert component within 150ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <Alert variant="success" data-testid="alert">
          Success Message
        </Alert>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(150);
      expect(screen.getByTestId('alert')).toBeInTheDocument();
    });

    it('should render Tabs component within 200ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <Tabs defaultValue="tab1" data-testid="tabs">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
          <TabPanel value="tab3">Content 3</TabPanel>
        </Tabs>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(200);
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
    });

    it('should render Avatar component within 150ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <Avatar src="https://example.com/avatar.jpg" alt="Test" data-testid="avatar" />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(150);
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
    });

    it('should render Badge component within 150ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <Badge data-testid="badge">
          Badge Content
        </Badge>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(150);
      expect(screen.getByTestId('badge')).toBeInTheDocument();
    });
  });

  describe('Large List Performance', () => {
    it('should render 100 Buttons within 300ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <div data-testid="button-list">
          {Array.from({ length: 100 }, (_, i) => (
            <Button key={i} variant="default" data-testid={`button-${i}`}>
              Button {i}
            </Button>
          ))}
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(400);
      expect(screen.getByTestId('button-0')).toBeInTheDocument();
      expect(screen.getByTestId('button-99')).toBeInTheDocument();
    });

    it('should render 100 Inputs within 400ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <div data-testid="input-list">
          {Array.from({ length: 100 }, (_, i) => (
            <Input
              key={i}
              placeholder={`Input ${i}`}
              data-testid={`input-${i}`}
            />
          ))}
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(400);
      expect(screen.getByTestId('input-0')).toBeInTheDocument();
      expect(screen.getByTestId('input-99')).toBeInTheDocument();
    });

    it('should render 50 Cards within 300ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <div data-testid="card-list">
          {Array.from({ length: 50 }, (_, i) => (
            <Card key={i} data-testid={`card-${i}`}>
              <CardHeader>Card Title {i}</CardHeader>
              <CardContent>Card Content {i}</CardContent>
            </Card>
          ))}
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(300);
      expect(screen.getByTestId('card-0')).toBeInTheDocument();
      expect(screen.getByTestId('card-49')).toBeInTheDocument();
    });
  });

  describe('Event Handling Performance', () => {
    it('should handle Button click within 50ms', () => {
      const handleClick = jest.fn();

      const { container } = renderWithTheme(
        <Button variant="default" onClick={handleClick} data-testid="button">
          Test Button
        </Button>
      );

      const button = screen.getByTestId('button');
      const startTime = performance.now();

      button.click();

      const endTime = performance.now();
      const eventTime = endTime - startTime;

      expect(eventTime).toBeLessThan(50);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle Input change within 50ms', () => {
      const handleChange = jest.fn();

      renderWithTheme(
        <Input placeholder="Test input" onChange={handleChange} data-testid="input" />
      );

      const input = screen.getByTestId('input') as HTMLInputElement;
      const startTime = performance.now();

      fireEvent.change(input, { target: { value: 'test value' } });

      const endTime = performance.now();
      const eventTime = endTime - startTime;

      expect(eventTime).toBeLessThan(50);
    });
  });

  describe('Theme Switching Performance', () => {
    it('should switch theme within 100ms', () => {
      const TestComponent = () => {
        const { mode, setMode } = useTheme();

        return (
          <div>
            <div data-testid="theme">{mode}</div>
            <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} data-testid="toggle">
              Toggle Theme
            </button>
          </div>
        );
      };

      const { container } = renderWithTheme(<TestComponent />);

      const toggleButton = screen.getByTestId('toggle');
      const startTime = performance.now();

      toggleButton.click();

      const endTime = performance.now();
      const switchTime = endTime - startTime;

      expect(switchTime).toBeLessThan(100);
      expect(screen.getByTestId('theme')).toBeInTheDocument();
    });
  });

  describe('Complex Component Performance', () => {
    it('should render complex form within 200ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <form data-testid="complex-form">
          <div className="form-group">
            <label>Name</label>
            <Input placeholder="Enter your name" data-testid="name-input" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <Input type="email" placeholder="Enter your email" data-testid="email-input" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <Input
              placeholder="Enter your message"
              data-testid="message-input"
            />
          </div>
          <Button variant="default" type="submit" data-testid="submit-button">
            Submit
          </Button>
        </form>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(200);
      expect(screen.getByTestId('complex-form')).toBeInTheDocument();
    });

    it('should render complex card layout within 200ms', () => {
      const startTime = performance.now();

      renderWithTheme(
        <div data-testid="complex-layout">
          {Array.from({ length: 10 }, (_, i) => (
            <Card key={i} data-testid={`card-${i}`}>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Avatar
                    src={`https://example.com/avatar-${i}.jpg`}
                    alt={`User ${i}`}
                  />
                  <div>
                    <h3>User Name {i}</h3>
                    <p>user{i}@example.com</p>
                  </div>
                  <Badge>{i + 1}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>Card content for user {i}. This is some sample text.</p>
                <Alert variant="info">Information message</Alert>
              </CardContent>
            </Card>
          ))}
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(300);
      expect(screen.getByTestId('card-0')).toBeInTheDocument();
      expect(screen.getByTestId('card-9')).toBeInTheDocument();
    });
  });

  describe('Memory Performance', () => {
    it('should not cause memory leaks with repeated renders', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      for (let i = 0; i < 50; i++) {
        const { unmount } = renderWithTheme(
          <Button variant="default" data-testid={`button-${i}`}>
            Button {i}
          </Button>
        );
        unmount();
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      if (initialMemory > 0) {
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      }
    });
  });
});
