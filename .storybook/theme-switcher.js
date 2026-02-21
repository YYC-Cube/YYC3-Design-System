/**
 * @file Storybook 主题切换插件
 * @description YYC³ 设计系统 Storybook 主题切换插件，支持亮色/暗色主题切换
 * @module .storybook/theme-switcher
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import { addons, types } from '@storybook/addons';

const ADDON_ID = 'yyc3-theme-switcher';
const PANEL_ID = `${ADDON_ID}/panel`;
const PARAM_KEY = 'yyc3Theme';

const THEMES = {
  light: {
    id: 'light',
    name: '亮色主题',
    class: 'light',
    background: '#fbfbfc',
    foreground: '#1a1a1a',
    borderColor: '#e0e0e0',
  },
  dark: {
    id: 'dark',
    name: '暗色主题',
    class: 'dark',
    background: '#1a1a1a',
    foreground: '#f0f0f0',
    borderColor: '#333333',
  },
};

const ThemeSwitcherPanel = ({ active, api }) => {
  if (!active) return null;

  const currentTheme = api.getCurrentStoryData().yyc3Theme || 'light';
  const theme = THEMES[currentTheme];

  const handleThemeChange = (themeId) => {
    api.setStoryData({
      yyc3Theme: themeId,
    });
    api.getChannel().emit('yyc3/theme-change', themeId);
  };

  return (
    <div
      style={{
        padding: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
      }}
    >
      <div
        style={{
          marginBottom: '12px',
          fontWeight: '600',
          color: '#1a1a1a',
        }}
      >
        YYC³ 主题切换
      </div>
      <div
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        {Object.values(THEMES).map((themeOption) => (
          <button
            key={themeOption.id}
            onClick={() => handleThemeChange(themeOption.id)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: `2px solid ${currentTheme === themeOption.id ? '#d45a5f' : '#e0e0e0'}`,
              borderRadius: '6px',
              backgroundColor: currentTheme === themeOption.id ? '#d45a5f' : '#ffffff',
              color: currentTheme === themeOption.id ? '#ffffff' : '#1a1a1a',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d45a5f';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                currentTheme === themeOption.id ? '#d45a5f' : '#e0e0e0';
            }}
          >
            {themeOption.name}
          </button>
        ))}
      </div>
      <div
        style={{
          marginTop: '12px',
          padding: '8px',
          backgroundColor: '#f8f9ef',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#3d4a5c',
        }}
      >
        <div style={{ marginBottom: '4px' }}>
          <strong>当前主题：</strong> {theme.name}
        </div>
        <div>
          <strong>背景色：</strong>{' '}
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              backgroundColor: theme.background,
              border: '1px solid #e0e0e0',
              borderRadius: '2px',
              verticalAlign: 'middle',
              marginLeft: '4px',
            }}
          />
          {theme.background}
        </div>
      </div>
    </div>
  );
};

addons.register(ADDON_ID, (api) => {
  addons.addPanel(PANEL_ID, {
    type: types.PANEL,
    title: 'YYC³ 主题',
    paramKey: PARAM_KEY,
    render: ({ active }) => <ThemeSwitcherPanel active={active} api={api} />,
  });
});

export { THEMES, PARAM_KEY };
