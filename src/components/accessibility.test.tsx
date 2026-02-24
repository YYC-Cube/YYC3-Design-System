import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';
import { Input } from './Input';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Badge } from './Badge';
import { Avatar } from './Avatar';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../theme/ThemeProvider';

expect.extend(toHaveNoViolations as unknown as jest.ExpectExtendMap);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}

describe('Accessibility Tests', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  describe('Button', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations when disabled', async () => {
      const { container } = renderWithTheme(<Button disabled>Disabled</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Input', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(<Input placeholder="Enter text" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations when disabled', async () => {
      const { container } = renderWithTheme(<Input disabled placeholder="Disabled input" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Card', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>Card content goes here</CardContent>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Badge', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(<Badge>Badge</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations for all variants', async () => {
      const variants: Array<'default' | 'secondary' | 'destructive' | 'outline'> = ['default', 'secondary', 'destructive', 'outline'];
      
      for (const variant of variants) {
        const { container } = renderWithTheme(<Badge variant={variant}>{variant}</Badge>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });

  describe('Avatar', () => {
    it('should not have accessibility violations with image', async () => {
      const { container } = renderWithTheme(
        <Avatar src="https://example.com/avatar.jpg" alt="User avatar" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have accessibility violations with fallback', async () => {
      const { container } = renderWithTheme(<Avatar fallback="AB" alt="User avatar" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ThemeToggle', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(<ThemeToggle />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
