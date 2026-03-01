/**
 * YYC³ Design System — ThemeContext Unit Tests
 *
 * Covers: theme switching, mode toggle, persistence, keyboard shortcuts
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../../app/context/ThemeContext';

function TestConsumer() {
  const { style, mode, resolvedMode, setStyle, setMode, toggleMode, cycleStyle } = useTheme();
  return (
    <div>
      <span data-testid="style">{style}</span>
      <span data-testid="mode">{mode}</span>
      <span data-testid="resolved">{resolvedMode}</span>
      <button onClick={() => setStyle('cyber')}>Set Cyber</button>
      <button onClick={() => setMode('dark')}>Set Dark</button>
      <button onClick={toggleMode}>Toggle Mode</button>
      <button onClick={cycleStyle}>Cycle Style</button>
    </div>
  );
}

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <TestConsumer />
    </ThemeProvider>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  });

  it('provides default theme values', () => {
    renderWithTheme();
    expect(screen.getByTestId('style')).toHaveTextContent('future');
    expect(screen.getByTestId('mode')).toHaveTextContent('system');
  });

  it('sets visual theme style', () => {
    renderWithTheme();
    fireEvent.click(screen.getByText('Set Cyber'));
    expect(screen.getByTestId('style')).toHaveTextContent('cyber');
    expect(document.documentElement.getAttribute('data-theme')).toBe('cyber');
  });

  it('sets mode to dark', () => {
    renderWithTheme();
    fireEvent.click(screen.getByText('Set Dark'));
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('toggles mode between light and dark', () => {
    renderWithTheme();
    fireEvent.click(screen.getByText('Set Dark'));
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
    fireEvent.click(screen.getByText('Toggle Mode'));
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
  });

  it('cycles through themes: future -> cyber -> business -> future', () => {
    renderWithTheme();
    expect(screen.getByTestId('style')).toHaveTextContent('future');
    fireEvent.click(screen.getByText('Cycle Style'));
    expect(screen.getByTestId('style')).toHaveTextContent('cyber');
    fireEvent.click(screen.getByText('Cycle Style'));
    expect(screen.getByTestId('style')).toHaveTextContent('business');
    fireEvent.click(screen.getByText('Cycle Style'));
    expect(screen.getByTestId('style')).toHaveTextContent('future');
  });

  it('persists style to localStorage', () => {
    renderWithTheme();
    fireEvent.click(screen.getByText('Set Cyber'));
    expect(localStorage.getItem('yyc3-theme-style')).toBe('cyber');
  });

  it('responds to Ctrl+Alt+T keyboard shortcut', () => {
    renderWithTheme();
    act(() => {
      fireEvent.keyDown(window, { key: 't', ctrlKey: true, altKey: true });
    });
    expect(screen.getByTestId('style')).toHaveTextContent('cyber');
  });
});
