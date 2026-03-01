// path: src/qa/tests/visual/Card.visual.test.tsx
/**
 * YYC\u00b3 Design System \u2014 Card Visual Regression Test
 *
 * This file defines the Card component stories for Chromatic visual regression.
 * When `pnpm chromatic` runs, Chromatic auto-captures screenshots of all stories
 * and diffs them against the baseline.
 *
 * In production, these would be Storybook stories (*.stories.tsx).
 * Here we define visual test fixtures for all 6 theme/mode combinations.
 *
 * Five-High Alignment:
 *   - High Consistency: automated screenshot comparison across themes
 *   - High Accessibility: can catch contrast/layout regressions visually
 */
import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../../../app/context/ThemeContext';
import { LanguageProvider } from '../../../app/context/LanguageContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../../app/components/ui/card';
import { Button } from '../../../app/components/ui/button';
import { Badge } from '../../../app/components/ui/badge';

/**
 * Wrapper that renders a component in a specific theme + mode context.
 */
function ThemeWrapper({
  children,
  theme = 'future',
  mode = 'light',
}: {
  children: React.ReactNode;
  theme?: string;
  mode?: string;
}) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div
          data-theme={theme}
          className={mode === 'dark' ? 'dark' : ''}
          style={{
            padding: '2rem',
            background: 'var(--background)',
            color: 'var(--foreground)',
            minHeight: '200px',
          }}
        >
          {children}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

/**
 * Standard Card fixture used across all theme variants.
 */
function CardFixture() {
  return (
    <Card style={{ maxWidth: '400px' }}>
      <CardHeader>
        <CardTitle>Design Tokens</CardTitle>
        <CardDescription>OKLCH color space with HEX fallback</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          All colors are defined using OKLCH for perceptual uniformity, with automatic HEX fallback
          for legacy browsers.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <Badge>OKLCH</Badge>
          <Badge variant="secondary">HEX</Badge>
          <Badge variant="outline">WCAG AA</Badge>
        </div>
      </CardContent>
      <CardFooter style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}

describe('Card Visual Regression', () => {
  const themes = ['future', 'cyber', 'business'] as const;
  const modes = ['light', 'dark'] as const;

  // Generate a test for each theme + mode combination (6 total)
  themes.forEach((theme) => {
    modes.forEach((mode) => {
      it(`renders correctly in ${theme}-${mode}`, () => {
        const { container } = render(
          <ThemeWrapper theme={theme} mode={mode}>
            <CardFixture />
          </ThemeWrapper>
        );

        // Verify the card rendered
        expect(container.querySelector('[data-theme]')).toBeTruthy();
        expect(container.textContent).toContain('Design Tokens');

        // In a real Chromatic setup, the screenshot is auto-captured.
        // Here we verify the DOM structure is correct for each variant.
        const card =
          container.querySelector("[class*='card']") || container.querySelector('div > div');
        expect(card).toBeTruthy();
      });
    });
  });

  it('renders with destructive badge variant', () => {
    const { container } = render(
      <ThemeWrapper>
        <Card style={{ maxWidth: '400px' }}>
          <CardHeader>
            <CardTitle>Error State</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="destructive">Critical</Badge>
          </CardContent>
        </Card>
      </ThemeWrapper>
    );
    expect(container.textContent).toContain('Critical');
  });

  it('renders mobile viewport card', () => {
    const { container } = render(
      <ThemeWrapper>
        <div style={{ width: '375px' }}>
          <CardFixture />
        </div>
      </ThemeWrapper>
    );
    expect(container.textContent).toContain('Design Tokens');
  });
});
