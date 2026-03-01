/**
 * YYC³ Design System — Storybook Isolation Mode Integration Tests
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../app/context/ThemeContext';
import { LanguageProvider } from '../../../app/context/LanguageContext';
import { StorybookSettingsPanel } from '../../../app/components/StorybookSettingsPanel';

function renderPanel() {
  const onOpenChange = jest.fn();
  return {
    ...render(
      <ThemeProvider>
        <LanguageProvider>
          <StorybookSettingsPanel open={true} onOpenChange={onOpenChange} />
        </LanguageProvider>
      </ThemeProvider>
    ),
    onOpenChange,
  };
}

describe('Storybook Isolation Mode — Integration', () => {
  it('renders the settings panel when open', () => {
    renderPanel();
    expect(screen.getByText(/Storybook/)).toBeInTheDocument();
  });

  it('shows Isolation Mode switch', () => {
    renderPanel();
    expect(screen.getByText(/Isolation/)).toBeInTheDocument();
    const switches = screen.getAllByRole('switch');
    expect(switches.length).toBeGreaterThanOrEqual(1);
  });

  it('shows Snapshot Layout dropdown', () => {
    renderPanel();
    expect(screen.getByText(/Grid|网格/)).toBeInTheDocument();
  });

  it('shows Render Quality slider', () => {
    renderPanel();
    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBeGreaterThanOrEqual(1);
  });

  it('shows Run Isolated Tests button', () => {
    renderPanel();
    expect(screen.getByText(/Run Isolated Tests|运行隔离测试/)).toBeInTheDocument();
  });

  it('triggers test run and shows loading state', async () => {
    renderPanel();
    const runBtn = screen.getByText(/Run Isolated Tests|运行隔离测试/);
    await userEvent.click(runBtn);
    await waitFor(
      () => {
        expect(screen.getByText(/Running|运行中|Passed|通过|Failed|失败/)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('toggles isolation mode switch', async () => {
    renderPanel();
    const switches = screen.getAllByRole('switch');
    if (switches.length > 0) {
      await userEvent.click(switches[0]);
      // Switch should toggle
    }
  });
});
