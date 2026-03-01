/**
 * YYC³ Design System — Button Unit Tests
 *
 * Covers: rendering, variants, sizes, states, accessibility
 * Framework: Jest + React Testing Library
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../../app/components/ui/button';

describe('Button', () => {
  // ─── Rendering ───
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('bg-primary');
  });

  // ─── Variants ───
  const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
  variants.forEach((variant) => {
    it(`renders ${variant} variant`, () => {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // ─── Sizes ───
  const sizes = ['default', 'sm', 'lg', 'icon'] as const;
  sizes.forEach((size) => {
    it(`renders ${size} size`, () => {
      render(<Button size={size}>Btn</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // ─── Interaction ───
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Submit
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // ─── Accessibility ───
  it('has correct disabled attribute', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('supports custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('supports aria-label', () => {
    render(<Button aria-label="Close dialog">X</Button>);
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });

  // ─── Focus ───
  it('is focusable via keyboard', () => {
    render(<Button>Focus me</Button>);
    const btn = screen.getByRole('button');
    btn.focus();
    expect(btn).toHaveFocus();
  });
});
