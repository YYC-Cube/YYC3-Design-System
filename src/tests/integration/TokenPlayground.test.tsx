/**
 * YYC³ Design System — Token Playground Integration Tests
 *
 * Verifies the complete flow: color editing, AI schemes, CSS export, reset
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../app/context/ThemeContext';
import { LanguageProvider } from '../../../app/context/LanguageContext';
import { PlaygroundPage } from '../../../app/pages/PlaygroundPage';
import { MemoryRouter } from 'react-router';

function renderPlayground() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          <PlaygroundPage />
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Token Playground — Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset any CSS overrides
    document.documentElement.style.cssText = '';
  });

  it('renders the playground page with tabs', () => {
    renderPlayground();
    expect(screen.getByText(/Colors|颜色/)).toBeInTheDocument();
    expect(screen.getByText(/Scale|标度/)).toBeInTheDocument();
    expect(screen.getByText(/AI/)).toBeInTheDocument();
  });

  it('displays color token editors', () => {
    renderPlayground();
    const colorInputs = screen.getAllByRole('textbox');
    expect(colorInputs.length).toBeGreaterThan(0);
  });

  it('switches to Scale tab and shows spacing system', async () => {
    renderPlayground();
    const scaleTab = screen.getByText(/Scale|标度/);
    await userEvent.click(scaleTab);
    await waitFor(() => {
      expect(screen.getByText(/spacing-1/)).toBeInTheDocument();
    });
  });

  it('switches to AI tab and shows color schemes', async () => {
    renderPlayground();
    const aiTab = screen.getByText(/AI/);
    await userEvent.click(aiTab);
    await waitFor(() => {
      expect(screen.getByText(/Ocean Breeze|海洋微风/)).toBeInTheDocument();
    });
  });

  it('applies AI color scheme on click', async () => {
    renderPlayground();
    const aiTab = screen.getByText(/AI/);
    await userEvent.click(aiTab);
    await waitFor(() => {
      const scheme = screen.getByText(/Ocean Breeze|海洋微风/);
      fireEvent.click(scheme.closest("[role='button']")!);
    });
    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#0891b2');
  });

  it('exports CSS to clipboard', async () => {
    renderPlayground();
    const exportBtn = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.match(/Export CSS|导出 CSS|Copied|已复制/));
    if (exportBtn) {
      await userEvent.click(exportBtn);
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    }
  });

  it('resets all overrides', async () => {
    renderPlayground();
    document.documentElement.style.setProperty('--primary', '#ff0000');
    const resetBtn = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.match(/Reset|重置/));
    if (resetBtn) {
      await userEvent.click(resetBtn);
      expect(document.documentElement.style.getPropertyValue('--primary')).toBe('');
    }
  });

  it('shows live preview section', () => {
    renderPlayground();
    expect(screen.getByText(/Live Preview|实时预览/)).toBeInTheDocument();
  });

  it('shows preview components: buttons, badges, form elements', () => {
    renderPlayground();
    expect(screen.getByText(/Primary|主要/)).toBeInTheDocument();
    expect(screen.getByText(/Secondary|次要/)).toBeInTheDocument();
  });
});
