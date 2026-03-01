/**
 * YYC³ Design System — Accessibility Tests
 *
 * Uses jest-axe to audit all interactive components for:
 *   - Color contrast >= 4.5:1 (WCAG AA)
 *   - ARIA attributes
 *   - Keyboard navigability
 *   - Focus management
 *
 * Install: pnpm add -D jest-axe @types/jest-axe
 */
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeProvider } from '../../../app/context/ThemeContext';
import { LanguageProvider } from '../../../app/context/LanguageContext';
import { Button } from '../../../app/components/ui/button';
import { Input } from '../../../app/components/ui/input';
import { Badge } from '../../../app/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '../../../app/components/ui/alert';
import { Progress } from '../../../app/components/ui/progress';
import { Switch } from '../../../app/components/ui/switch';
import { Checkbox } from '../../../app/components/ui/checkbox';
import { Label } from '../../../app/components/ui/label';

expect.extend(toHaveNoViolations);

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}

describe('Accessibility (jest-axe)', () => {
  // ─── Button ───
  it('Button has no a11y violations', async () => {
    const { container } = render(
      <Wrapper>
        <Button>Submit</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="outline">Cancel</Button>
        <Button disabled>Disabled</Button>
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── Input ───
  it('Input with label has no a11y violations', async () => {
    const { container } = render(
      <Wrapper>
        <div>
          <Label htmlFor="email-input">Email</Label>
          <Input id="email-input" type="email" placeholder="you@example.com" />
        </div>
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── Badge ───
  it('Badge has no a11y violations', async () => {
    const { container } = render(
      <Wrapper>
        <Badge>Default</Badge>
        <Badge variant="destructive">Error</Badge>
        <Badge variant="outline">Outline</Badge>
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── Alert ───
  it('Alert has no a11y violations', async () => {
    const { container } = render(
      <Wrapper>
        <Alert>
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>This is an informational message.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong.</AlertDescription>
        </Alert>
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── Progress ───
  it('Progress has no a11y violations', async () => {
    const { container } = render(
      <Wrapper>
        <Progress value={72} aria-label="Upload progress" />
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── Switch ───
  it('Switch with label has no a11y violations', async () => {
    const { container } = render(
      <Wrapper>
        <div className="flex items-center gap-2">
          <Switch id="dark-mode" aria-label="Toggle dark mode" />
          <Label htmlFor="dark-mode">Dark Mode</Label>
        </div>
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── Checkbox ───
  it('Checkbox with label has no a11y violations', async () => {
    const { container } = render(
      <Wrapper>
        <div className="flex items-center gap-2">
          <Checkbox id="terms" aria-label="Accept terms" />
          <Label htmlFor="terms">Accept terms</Label>
        </div>
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ─── Combined Form ───
  it('Complex form has no a11y violations', async () => {
    const { container } = render(
      <Wrapper>
        <form aria-label="Settings form">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="newsletter" aria-label="Subscribe to newsletter" />
            <Label htmlFor="newsletter">Subscribe</Label>
          </div>
          <Button type="submit">Save</Button>
        </form>
      </Wrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
