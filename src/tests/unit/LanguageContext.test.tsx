/**
 * YYC³ Design System — LanguageContext Unit Tests
 *
 * Covers: locale switching, t() function (key-based + inline), persistence
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../../../app/context/LanguageContext';

function TestConsumer() {
  const { lang, toggleLang, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="key-based">{t('nav.home')}</span>
      <span data-testid="inline">{t('\u9996\u9875', 'Home')}</span>
      <span data-testid="missing">{t('nonexistent.key')}</span>
      <button onClick={toggleLang}>Toggle</button>
    </div>
  );
}

function renderWithLang() {
  return render(
    <LanguageProvider>
      <TestConsumer />
    </LanguageProvider>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to Chinese', () => {
    renderWithLang();
    expect(screen.getByTestId('lang')).toHaveTextContent('zh');
  });

  it('resolves key-based t() in Chinese', () => {
    renderWithLang();
    expect(screen.getByTestId('key-based')).toHaveTextContent('\u9996\u9875');
  });

  it('resolves inline t(zh, en) in Chinese', () => {
    renderWithLang();
    expect(screen.getByTestId('inline')).toHaveTextContent('\u9996\u9875');
  });

  it('returns key itself for missing keys', () => {
    renderWithLang();
    expect(screen.getByTestId('missing')).toHaveTextContent('nonexistent.key');
  });

  it('toggles to English', () => {
    renderWithLang();
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('key-based')).toHaveTextContent('Home');
    expect(screen.getByTestId('inline')).toHaveTextContent('Home');
  });

  it('persists language to localStorage', () => {
    renderWithLang();
    fireEvent.click(screen.getByText('Toggle'));
    expect(localStorage.getItem('yyc3-lang')).toBe('en');
  });

  it('sets html lang attribute', () => {
    renderWithLang();
    expect(document.documentElement.getAttribute('lang')).toBe('zh-CN');
    fireEvent.click(screen.getByText('Toggle'));
    expect(document.documentElement.getAttribute('lang')).toBe('en');
  });

  it('responds to Ctrl+Alt+L keyboard shortcut', () => {
    renderWithLang();
    act(() => {
      fireEvent.keyDown(window, { key: 'l', ctrlKey: true, altKey: true });
    });
    expect(screen.getByTestId('lang')).toHaveTextContent('en');
  });
});
