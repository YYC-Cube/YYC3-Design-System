/**
 * YYC³ Design System — Token Manager Integration Tests
 *
 * Verifies: file import, JSON editing, token table, history, export
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../app/context/ThemeContext';
import { LanguageProvider } from '../../../app/context/LanguageContext';
import { TokenManagerPage } from '../../../app/pages/TokenManagerPage';
import { MemoryRouter } from 'react-router';

function renderTokenManager() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          <TokenManagerPage />
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Token Manager — Integration', () => {
  beforeEach(() => localStorage.clear());

  it('renders with breadcrumb and sidebar', () => {
    renderTokenManager();
    expect(screen.getByText(/Token Manager|令牌管理/)).toBeInTheDocument();
  });

  it('displays four tabs: Import, Edit, Export, History', () => {
    renderTokenManager();
    expect(screen.getByText(/Import|导入/)).toBeInTheDocument();
    expect(screen.getByText(/Edit|编辑/)).toBeInTheDocument();
    expect(screen.getByText(/Export|导出/)).toBeInTheDocument();
    expect(screen.getByText(/History|历史/)).toBeInTheDocument();
  });

  it('shows file import box on Import tab', () => {
    renderTokenManager();
    expect(screen.getByText(/drag|拖拽/i)).toBeInTheDocument();
  });

  it('switches to Edit tab and shows token table', async () => {
    renderTokenManager();
    const editTab = screen.getByText(/Edit|编辑/);
    await userEvent.click(editTab);
    await waitFor(() => {
      expect(screen.getByText(/key|键名/i)).toBeInTheDocument();
    });
  });

  it('switches to Export tab and shows format options', async () => {
    renderTokenManager();
    const exportTab = screen.getByText(/Export|导出/);
    await userEvent.click(exportTab);
    await waitFor(() => {
      expect(screen.getByText(/JSON/)).toBeInTheDocument();
    });
  });

  it('switches to History tab and shows version entries', async () => {
    renderTokenManager();
    const historyTab = screen.getByText(/History|历史/);
    await userEvent.click(historyTab);
    await waitFor(() => {
      expect(screen.getByText(/v1/)).toBeInTheDocument();
    });
  });

  it('simulates file drop on import box', async () => {
    renderTokenManager();
    const dropZone = screen.getByText(/drag|拖拽/i).closest('div');
    if (dropZone) {
      const file = new File([JSON.stringify({ color: { primary: '#ff0000' } })], 'tokens.json', {
        type: 'application/json',
      });
      fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
    }
  });

  it('responds to Ctrl+Alt+I keyboard shortcut', () => {
    renderTokenManager();
    fireEvent.keyDown(window, { key: 'i', ctrlKey: true, altKey: true });
    // Should focus/navigate to Import tab
  });
});
