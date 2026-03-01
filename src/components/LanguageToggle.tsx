/**
 * @file YYC³ 语言切换组件
 * @description 提供中英文切换的UI组件
 * @module components
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-27
 */

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './Button';

const IconGlobe = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <Button variant="ghost" size="sm" onClick={toggleLang} className="gap-2">
      <IconGlobe />
      <span className="font-medium">{lang === 'zh' ? '中文' : 'EN'}</span>
    </Button>
  );
}
