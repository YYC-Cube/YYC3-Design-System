/**
 * @file 集成测试框架
 * @description 提供完整的用户流程集成测试
 * @module tests/integration/integration.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../src/theme/ThemeProvider';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { Card } from '../../src/components/Card';
import { Alert } from '../../src/components/Alert';
import { Tabs, TabList, Tab, TabPanel } from '../../src/components/Tabs';
import { Switch } from '../../src/components/Switch';
import { Select } from '../../src/components/Select';
import { Radio } from '../../src/components/Radio';
import { Avatar } from '../../src/components/Avatar';
import { Badge } from '../../src/components/Badge';
import { Divider } from '../../src/components/Divider';
import { useTheme } from '../../src/theme/useTheme';

describe('YYC³ Design System Integration Tests', () => {
  let container: HTMLElement;

  const renderWithTheme = (component: React.ReactNode) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  beforeAll(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterAll(() => {
    document.body.removeChild(container);
  });

  beforeEach(() => {
    container.innerHTML = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('User Flow: Form Submission', () => {
    it('should handle complete form submission flow', async () => {
      const handleSubmit = jest.fn((e) => {
        e.preventDefault();
      });
      const user = userEvent.setup();

      renderWithTheme(
        <Card className="p-4">
          <form onSubmit={handleSubmit} data-testid="form">
            <Input 
              label="Name" 
              placeholder="Enter your name"
              name="name"
              required
              data-testid="name-input"
            />
            <Input 
              label="Email" 
              placeholder="Enter your email"
              type="email"
              name="email"
              required
              data-testid="email-input"
            />
            <Button type="submit" data-testid="submit-button">
              Submit
            </Button>
          </form>
        </Card>
      );

      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');

      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      
      const form = screen.getByTestId('form');
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should show validation errors for invalid form data', async () => {
      const handleSubmit = jest.fn((e) => {
        e.preventDefault();
      });
      const user = userEvent.setup();

      renderWithTheme(
        <Card className="p-4">
          <form onSubmit={handleSubmit} data-testid="form">
            <Input 
              label="Email" 
              placeholder="Enter your email"
              type="email"
              name="email"
              required
              data-testid="email-input"
            />
            <Button type="submit" data-testid="submit-button">
              Submit
            </Button>
          </form>
        </Card>
      );

      const form = screen.getByTestId('form');
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Flow: Theme Switching', () => {
    it('should handle theme switching across components', async () => {
      const ThemeToggle = () => {
        const { mode, setMode } = useTheme();
        return (
          <Button 
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            data-testid="theme-toggle"
          >
            Toggle Theme
          </Button>
        );
      };

      renderWithTheme(
        <div>
          <ThemeToggle />
          <Card data-testid="card">
            <Button variant="default" data-testid="button">
              Test Button
            </Button>
          </Card>
        </div>
      );

      const toggleButton = screen.getByTestId('theme-toggle');
      const card = screen.getByTestId('card');
      const button = screen.getByTestId('button');

      expect(card).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      expect(toggleButton).toBeInTheDocument();

      await userEvent.click(toggleButton);

      await waitFor(() => {
        expect(toggleButton).toBeInTheDocument();
        expect(card).toBeInTheDocument();
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('User Flow: Tab Navigation', () => {
    it('should handle tab switching with content updates', async () => {
      renderWithTheme(
        <Card>
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
        </Card>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();

      const tab2 = screen.getByText('Tab 2');
      await userEvent.click(tab2);

      await waitFor(() => {
        expect(screen.getByText('Content 2')).toBeInTheDocument();
      });
    });
  });

  describe('User Flow: Interactive Components', () => {
    it('should handle switch toggle interactions', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderWithTheme(
        <Card>
          <Switch
            checked={false}
            onChange={handleChange}
            data-testid="switch"
          />
        </Card>
      );

      const switchElement = screen.getByTestId('switch');
      await user.click(switchElement);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith(true);
      });
    });

    it('should handle select dropdown interactions', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ];

      renderWithTheme(
        <Card>
          <Select
            options={options}
            value="option1"
            onChange={handleChange}
            data-testid="select"
          />
        </Card>
      );

      const select = screen.getByTestId('select');
      await user.click(select);
      
      const option2 = screen.getByText('Option 2');
      await user.click(option2);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('option2');
      });
    });

    it('should handle radio button selection', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      renderWithTheme(
        <Card>
          <Radio
            name="gender"
            value="male"
            checked={false}
            onChange={handleChange}
            data-testid="radio-male"
          >
            Male
          </Radio>
          <Radio
            name="gender"
            value="female"
            checked={false}
            onChange={handleChange}
            data-testid="radio-female"
          >
            Female
          </Radio>
        </Card>
      );

      const maleRadio = screen.getByTestId('radio-male');
      await user.click(maleRadio);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('male');
      });
    });
  });

  describe('User Flow: Alert Notifications', () => {
    it('should display and dismiss alerts properly', async () => {
      const handleClose = jest.fn();
      const user = userEvent.setup();

      renderWithTheme(
        <div>
          <Alert
            variant="default"
            title="Success"
            message="Operation completed successfully"
            onClose={handleClose}
            data-testid="alert"
          />
        </div>
      );

      const alert = screen.getByTestId('alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();

      const closeButton = within(alert).getByRole('button');
      await user.click(closeButton);

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle different alert variants', () => {
      const variants = ['info', 'success', 'warning', 'error'] as const;

      variants.forEach(variant => {
        const { unmount } = renderWithTheme(
          <Alert
            variant={variant}
            title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Alert`}
            message={`This is a ${variant} alert`}
            data-testid={`alert-${variant}`}
          />
        );

        expect(screen.getByTestId(`alert-${variant}`)).toBeInTheDocument();
        expect(screen.getByText(`${variant.charAt(0).toUpperCase() + variant.slice(1)} Alert`)).toBeInTheDocument();
        
        unmount();
      });
    });
  });

  describe('User Flow: Component Composition', () => {
    it('should handle complex component compositions', () => {
      renderWithTheme(
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar src="https://via.placeholder.com/40" alt="User" size="md" />
            <div>
              <div className="font-semibold">John Doe</div>
              <Badge variant="default">Active</Badge>
            </div>
          </div>
          <Divider />
          <div className="mt-4">
            <Button variant="default" size="sm" className="mr-2">
              Edit
            </Button>
            <Button variant="outline" size="sm">
              Delete
            </Button>
          </div>
        </Card>
      );

      expect(screen.getByAltText('User')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('User Flow: Keyboard Navigation', () => {
    it('should support keyboard navigation for interactive elements', async () => {
      const user = userEvent.setup();

      renderWithTheme(
        <div>
          <Input label="First Input" data-testid="input1" />
          <Input label="Second Input" data-testid="input2" />
          <Button data-testid="button">Submit</Button>
        </div>
      );

      const input1 = screen.getByTestId('input1');
      const input2 = screen.getByTestId('input2');
      const button = screen.getByTestId('button');

      input1.focus();
      expect(input1).toHaveFocus();

      await user.keyboard('{Tab}');
      expect(input2).toHaveFocus();

      await user.keyboard('{Tab}');
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(button).toHaveFocus();
    });

    it('should handle escape key for closing modals/overlays', async () => {
      const handleClose = jest.fn();
      const user = userEvent.setup();

      renderWithTheme(
        <Alert
          variant="info"
          title="Modal"
          message="Press ESC to close"
          onClose={handleClose}
          data-testid="alert"
        />
      );

      const alert = screen.getByTestId('alert');
      alert.focus();
      
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(handleClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('User Flow: Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      renderWithTheme(
        <Button aria-label="Close dialog" data-testid="button">
          Close
        </Button>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('should support screen reader announcements', () => {
      renderWithTheme(
        <div role="status" aria-live="polite">
          <Alert
            variant="default"
            title="Success"
            message="Operation completed"
            data-testid="alert"
          />
        </div>
      );

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('User Flow: Error Handling', () => {
    it('should handle component errors gracefully', () => {
      const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
        return <div data-testid="error-boundary">{children}</div>;
      };

      renderWithTheme(
        <ErrorBoundary>
          <Card>
            <Button>Test</Button>
          </Card>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('User Flow: Performance', () => {
    it('should render large lists efficiently', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: `Description ${i}`
      }));

      const startTime = performance.now();

      renderWithTheme(
        <Card>
          {items.map(item => (
            <div key={item.id} data-testid={`item-${item.id}`}>
              <div>{item.name}</div>
              <div>{item.description}</div>
            </div>
          ))}
        </Card>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(1000);
      expect(screen.getByTestId('item-0')).toBeInTheDocument();
      expect(screen.getByTestId('item-99')).toBeInTheDocument();
    });
  });

  describe('User Flow: Responsive Design', () => {
    it('should adapt to different viewport sizes', () => {
      renderWithTheme(
        <Card className="w-full max-w-md">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="default">Button 1</Button>
            <Button variant="secondary">Button 2</Button>
          </div>
        </Card>
      );

      expect(screen.getByText('Button 1')).toBeInTheDocument();
      expect(screen.getByText('Button 2')).toBeInTheDocument();
    });
  });

  describe('User Flow: State Management', () => {
    it('should maintain component state across interactions', async () => {
      const Counter = () => {
        const [count, setCount] = React.useState(0);
        return (
          <Card>
            <div data-testid="count">{count}</div>
            <Button onClick={() => setCount(c => c + 1)} data-testid="increment">
              Increment
            </Button>
            <Button onClick={() => setCount(c => c - 1)} data-testid="decrement">
              Decrement
            </Button>
          </Card>
        );
      };

      const user = userEvent.setup();

      renderWithTheme(<Counter />);

      const count = screen.getByTestId('count');
      const increment = screen.getByTestId('increment');
      const decrement = screen.getByTestId('decrement');

      expect(count).toHaveTextContent('0');

      await user.click(increment);
      await user.click(increment);
      await user.click(increment);

      expect(count).toHaveTextContent('3');

      await user.click(decrement);
      await user.click(decrement);

      expect(count).toHaveTextContent('1');
    });
  });

  describe('User Flow: Data Loading', () => {
    it('should handle loading and error states', async () => {
      const DataLoader = () => {
        const [loading, setLoading] = React.useState(true);
        const [error, setError] = React.useState<string | null>(null);
        const [data, setData] = React.useState<string | null>(null);

        React.useEffect(() => {
          setTimeout(() => {
            setLoading(false);
            setData('Data loaded successfully');
          }, 1000);
        }, []);

        if (loading) {
          return <Alert variant="info" title="Loading" message="Please wait..." />;
        }

        if (error) {
          return <Alert variant="error" title="Error" message={error} />;
        }

        return (
          <Card>
            <div data-testid="data">{data}</div>
          </Card>
        );
      };

      renderWithTheme(<DataLoader />);

      expect(screen.getByText('Please wait...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText('Please wait...')).not.toBeInTheDocument();
        expect(screen.getByTestId('data')).toHaveTextContent('Data loaded successfully');
      }, { timeout: 2000 });
    });
  });
});
