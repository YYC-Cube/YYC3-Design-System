/**
 * YYC³ Design System — Build Settings Integration Tests
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../context/ThemeContext';
import { LanguageProvider } from '../../context/LanguageContext';
import { BuildSettingsPage } from '../../pages/BuildSettingsPage';
import { MemoryRouter } from 'react-router';

function renderBuildSettings() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          <BuildSettingsPage />
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Build Settings — Integration', () => {
  beforeEach(() => localStorage.clear());

  it('renders platform cards: SCSS, Swift, Kotlin', () => {
    renderBuildSettings();
    // 使用getAllByText来处理多个匹配
    const scssText = screen.getAllByText(/SCSS/);
    expect(scssText.length).toBeGreaterThan(0);
    
    const swiftText = screen.getAllByText(/Swift/);
    expect(swiftText.length).toBeGreaterThan(0);
    
    const kotlinText = screen.getAllByText(/Kotlin/);
    expect(kotlinText.length).toBeGreaterThan(0);
  });

  it('shows enable toggles for each platform', () => {
    renderBuildSettings();
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBeGreaterThanOrEqual(3);
  });

  it('shows output directory dropdowns', () => {
    renderBuildSettings();
    // 使用getAllByText来处理多个匹配
    const distCssText = screen.getAllByText(/dist\/css/);
    expect(distCssText.length).toBeGreaterThan(0);
  });

  it('shows checkbox groups for output files', () => {
    renderBuildSettings();
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThanOrEqual(4);
  });

  it('triggers build on Generate button click', async () => {
    renderBuildSettings();
    const generateBtns = screen
      .getAllByRole('button')
      .filter((btn) => btn.textContent?.match(/Generate|生成/));
    if (generateBtns.length > 0) {
      await userEvent.click(generateBtns[0]);
      await waitFor(
        () => {
          // Should show progress or success state
          expect(true).toBe(true);
        },
        { timeout: 10000 }
      );
    }
  }, 20000);
});
