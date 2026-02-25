import * as React from 'react';
import { useState, useCallback } from 'react';
import { useTheme } from '../theme/useTheme';
import { ThemePreset, themePresets, createCustomPreset } from '../theme/ThemePresets';
import { Button } from './Button';
import { Card } from './Card';
import { DesignTokens, ColorToken, ShadowToken, TypographyTokens } from '../../types/tokens';

interface ThemeEditorProps {
  onSave?: (preset: ThemePreset) => void;
  className?: string;
  'data-testid'?: string;
}

interface TokenEditorProps {
  tokenKey: string;
  value: string | number | ColorToken | ShadowToken | TypographyTokens | Record<string, string | number>;
  onChange: (value: string) => void;
  type?: 'text' | 'color' | 'number';
}

const TokenEditor: React.FC<TokenEditorProps> = ({ tokenKey, value, onChange, type = 'text' }) => {
  const inputType = type === 'color' ? 'color' : type === 'number' ? 'number' : 'text';
  let inputValue: string;

  if (typeof value === 'number') {
    inputValue = value.toString();
  } else if (typeof value === 'string') {
    inputValue = value;
  } else if (value && typeof value === 'object' && 'hex' in value) {
    inputValue = (value as ColorToken).hex;
  } else if (typeof value === 'object' && value !== null) {
    inputValue = JSON.stringify(value);
  } else {
    inputValue = String(value);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
      <label style={{ flex: 1, fontSize: '13px', fontWeight: 500 }}>
        {tokenKey}
      </label>
      <input
        type={inputType}
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '120px',
          padding: '4px 8px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          fontSize: '13px',
        }}
      />
    </div>
  );
};

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  onSave,
  className = '',
  'data-testid': dataTestId,
}) => {
  const { tokens, setTokens } = useTheme();
  const [currentPreset, setCurrentPreset] = useState<ThemePreset>(themePresets[0]);
  const [customTokens, setCustomTokens] = useState<DesignTokens>(() => ({ ...tokens }));
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'shadows'>('colors');

  const handlePresetChange = useCallback((presetId: string) => {
    const preset = themePresets.find(p => p.id === presetId);
    if (preset) {
      setCurrentPreset(preset);
      const newTokens = { ...preset.tokens };
      setCustomTokens(newTokens);
      setTokens(newTokens);
    }
  }, [setTokens]);

  const handleTokenChange = useCallback((tokenKey: string, value: string) => {
    setCustomTokens(prev => {
      const newTokens = { ...prev };
      newTokens[tokenKey] = value;
      return newTokens;
    });
  }, []);

  const handlePreview = useCallback(() => {
    setTokens(customTokens);
  }, [customTokens, setTokens]);

  const handleReset = useCallback(() => {
    const newTokens = { ...currentPreset.tokens };
    setCustomTokens(newTokens);
    setTokens(newTokens);
  }, [currentPreset, setTokens]);

  const handleSave = useCallback(() => {
    const customPreset = createCustomPreset(
      `custom-${Date.now()}`,
      `Custom Theme`,
      'User created custom theme',
      currentPreset
    );
    customPreset.tokens = customTokens;
    onSave?.(customPreset);
  }, [customTokens, currentPreset, onSave]);

  const colorTokens = Object.entries(customTokens)
    .filter(([key]) => key.startsWith('color.'))
    .sort(([a], [b]) => a.localeCompare(b));

  const typographyTokens = Object.entries(customTokens)
    .filter(([key]) => key.startsWith('font-size.') || key.startsWith('typography.'))
    .sort(([a], [b]) => a.localeCompare(b));

  const spacingTokens = Object.entries(customTokens)
    .filter(([key]) => key.startsWith('radius.'))
    .sort(([a], [b]) => a.localeCompare(b));

  const shadowTokens = Object.entries(customTokens)
    .filter(([key]) => key.startsWith('shadow.'))
    .sort(([a], [b]) => a.localeCompare(b));

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '900px',
    margin: '0 auto',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '8px',
  };

  const tabStyle: React.CSSProperties = {
    padding: '8px 16px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontSize: '14px',
    fontWeight: 500,
    color: '#6b7280',
    transition: 'all 0.2s',
  };

  const activeTabStyle: React.CSSProperties = {
    ...tabStyle,
    color: '#3b82f6',
    borderBottom: '2px solid #3b82f6',
  };

  const tokenSectionStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    marginTop: '16px',
  };

  return (
    <div className={className} data-testid={dataTestId} style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
          Theme Editor
        </h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: 500 }}>Preset:</label>
          <select
            value={currentPreset.id}
            onChange={(e) => handlePresetChange(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '150px',
            }}
          >
            {themePresets.map(preset => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={tabsStyle}>
        <button
          type="button"
          style={activeTab === 'colors' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('colors')}
        >
          Colors
        </button>
        <button
          type="button"
          style={activeTab === 'typography' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('typography')}
        >
          Typography
        </button>
        <button
          type="button"
          style={activeTab === 'spacing' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('spacing')}
        >
          Spacing
        </button>
        <button
          type="button"
          style={activeTab === 'shadows' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('shadows')}
        >
          Shadows
        </button>
      </div>

      {activeTab === 'colors' && (
        <Card>
          <div style={tokenSectionStyle}>
            {colorTokens.map(([key, value]) => (
              <TokenEditor
                key={key}
                tokenKey={key}
                value={value}
                onChange={(val) => handleTokenChange(key, val)}
                type="color"
              />
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'typography' && (
        <Card>
          <div style={tokenSectionStyle}>
            {typographyTokens.map(([key, value]) => (
              <TokenEditor
                key={key}
                tokenKey={key}
                value={value}
                onChange={(val) => handleTokenChange(key, val)}
                type="text"
              />
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'spacing' && (
        <Card>
          <div style={tokenSectionStyle}>
            {spacingTokens.map(([key, value]) => (
              <TokenEditor
                key={key}
                tokenKey={key}
                value={value}
                onChange={(val) => handleTokenChange(key, val)}
                type="text"
              />
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'shadows' && (
        <Card>
          <div style={tokenSectionStyle}>
            {shadowTokens.map(([key, value]) => (
              <TokenEditor
                key={key}
                tokenKey={key}
                value={value}
                onChange={(val) => handleTokenChange(key, val)}
                type="text"
              />
            ))}
          </div>
        </Card>
      )}

      <div style={actionsStyle}>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="secondary" onClick={handlePreview}>
          Preview
        </Button>
        <Button onClick={handleSave}>
          Save Theme
        </Button>
      </div>
    </div>
  );
};

ThemeEditor.displayName = 'ThemeEditor';
