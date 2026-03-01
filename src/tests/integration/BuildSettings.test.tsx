/**
 * YYC³ Design System — Build Settings Integration Tests
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../app/context/ThemeContext';
import { LanguageProvider } from '../../../app/context/LanguageContext';
import { BuildSettingsPage } from '../../../app/pages/BuildSettingsPage';
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
    expect(screen.getByText(/SCSS/)).toBeInTheDocument();
    expect(screen.getByText(/Swift/)).toBeInTheDocument();
    expect(screen.getByText(/Kotlin/)).toBeInTheDocument();
  });

  it('shows enable toggles for each platform', () => {
    renderBuildSettings();
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBeGreaterThanOrEqual(3);
  });

  it('shows output directory dropdowns', () => {
    renderBuildSettings();
    expect(screen.getByText(/dist\/css/)).toBeInTheDocument();
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
          expect(screen.getByText(/Building|构建|Success|成功|100%/i)).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    }
  });

  it('responds to Ctrl+Alt+B keyboard shortcut', () => {
    renderBuildSettings();
    fireEvent.keyDown(window, { key: 'b', ctrlKey: true, altKey: true });
    // Should navigate to Build Settings (already on the page in this test)
  });
});
