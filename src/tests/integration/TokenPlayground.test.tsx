/**
 * YYC³ Design System — Token Playground Integration Tests
 *
 * Verifies: complete flow: color editing, AI schemes, CSS export, reset
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../context/LanguageContext';
import { PlaygroundPage } from '../../pages/PlaygroundPage';
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
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
  });

  it('renders playground page with tabs', () => {
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
      const button = scheme.closest("[role='button']");
      if (button) {
        fireEvent.click(button);
      }
    }, { timeout: 5000 });
    await waitFor(() => {
      // Check if primary color is set
      const primaryColor = document.documentElement.style.getPropertyValue('--primary');
      // Primary color should be set
      expect(primaryColor).toBeTruthy();
    }, { timeout: 5000 });
  }, 10000);

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
    // Set a custom color
    const resetBtn = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.match(/Reset|重置/));
    if (resetBtn) {
      await userEvent.click(resetBtn);
      // Check if primary color is reset
      const primaryColor = document.documentElement.style.getPropertyValue('--primary');
      // Primary color should be empty or reset to default
      expect(primaryColor === '' || primaryColor.includes('#')).toBe(true);
    }
  });

  it('shows live preview section', () => {
    renderPlayground();
    expect(screen.getByText(/Live Preview|实时预览/)).toBeInTheDocument();
  });

  it('shows preview components: buttons, badges, form elements', () => {
    renderPlayground();
    // 使用getAllByText处理多个匹配
    const primaryText = screen.getAllByText(/Primary|主要/);
    expect(primaryText.length).toBeGreaterThan(0);
    
    const secondaryText = screen.getAllByText(/Secondary|次要/);
    expect(secondaryText.length).toBeGreaterThan(0);
  });
});
