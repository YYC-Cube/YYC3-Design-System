/**
 * @file 语言切换组件
 * @description 语言切换组件
 * @component LanguageSwitcher
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export interface LanguageSwitcherProps {
  className?: string;
  'data-testid'?: string;
}

const languages: LanguageOption[] = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
];

export const LanguageSwitcher = memo<LanguageSwitcherProps>(
  ({ className = '', 'data-testid': dataTestId }) => {
    const { i18n } = useTranslation();
    const { tokens } = useTheme();

    const currentLanguage = i18n.language;

    const handleLanguageChange = (languageCode: string) => {
      i18n.changeLanguage(languageCode);
    };

    const containerStyles = {
      display: 'flex',
      alignItems: 'center' as const,
      gap: '8px',
    };

    const buttonStyles = {
      display: 'flex',
      alignItems: 'center' as const,
      gap: '4px',
      padding: '8px 12px',
      borderRadius: '4px',
      border: `1px solid ${(tokens['color.border'] as string) || '#e0e0e0'}`,
      backgroundColor: (tokens['color.background'] as string) || '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '14px',
      color: (tokens['color.text.primary'] as string) || '#333',
    };

    const buttonHoverStyles = {
      ...buttonStyles,
      backgroundColor: (tokens['color.hover'] as string) || '#f5f5f5',
    };

    const flagStyles = {
      fontSize: '16px',
    };

    const nameStyles = {
      fontSize: '14px',
    };

    const currentLanguageData = languages.find((lang) => lang.code === currentLanguage);

    return (
      <div className={className} style={containerStyles} data-testid={dataTestId}>
        {languages.map((language) => {
          const isCurrent = language.code === currentLanguage;
          const styles = isCurrent ? buttonHoverStyles : buttonStyles;

          return (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              style={styles}
              title={language.name}
              aria-label={`Switch to ${language.name}`}
              aria-current={isCurrent ? 'true' : undefined}
            >
              <span style={flagStyles}>{language.flag}</span>
              <span style={nameStyles}>{language.name}</span>
            </button>
          );
        })}
      </div>
    );
  }
);

LanguageSwitcher.displayName = 'LanguageSwitcher';
