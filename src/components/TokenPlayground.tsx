import React, { useState, useMemo } from 'react';
import { useTheme } from '../theme/useTheme';
import { ColorToken } from '../../types/tokens';

interface TokenPlaygroundProps {
  className?: string;
}

export const getTokenValue = (tokens: Record<string, unknown>, path: string): unknown => {
  const keys = path.split('.');

  if (keys.length === 2) {
    const [category, tokenName] = keys;
    const flatKey = `${category}.${tokenName}`;
    if (flatKey in tokens) {
      return tokens[flatKey];
    }
  }

  let value: unknown = tokens;
  for (const key of keys) {
    if (value && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return value;
};

export const getTokenColor = (tokens: Record<string, unknown>, path: string): ColorToken | null => {
  const value = getTokenValue(tokens, path);
  if (typeof value === 'string') {
    return { hex: value, oklch: '', foreground: '#fff' };
  }
  if (value && typeof value === 'object' && 'hex' in value && 'oklch' in value) {
    return value as ColorToken;
  }
  return null;
};

export const getTokenString = (
  tokens: Record<string, unknown>,
  path: string,
  defaultValue: string
): string => {
  const value = getTokenValue(tokens, path);
  return typeof value === 'string' ? value : defaultValue;
};

export const TokenPlayground: React.FC<TokenPlaygroundProps> = ({ className = '' }) => {
  const { tokens: currentTokens } = useTheme();
  const [selectedToken, setSelectedToken] = useState<string>('color.primary');

  const tokenCategories = useMemo(() => {
    const categories: Record<string, string[]> = {
      color: [],
      radius: [],
      shadow: [],
      'font-size': [],
      'line-height': [],
    };

    Object.keys(currentTokens).forEach((key) => {
      const parts = key.split('.');
      if (parts.length === 2) {
        const [category, tokenName] = parts;
        if (categories[category]) {
          categories[category].push(tokenName);
        }
      }
    });

    return categories;
  }, [currentTokens]);

  const tokenValue = useMemo(() => {
    return getTokenValue(currentTokens, selectedToken);
  }, [selectedToken, currentTokens]);

  const displayValue = useMemo(() => {
    if (typeof tokenValue === 'object' && tokenValue !== null) {
      if ('hex' in tokenValue) {
        return (tokenValue as ColorToken).hex;
      }
      return JSON.stringify(tokenValue, null, 2);
    }
    return String(tokenValue);
  }, [tokenValue]);

  const containerStyle: React.CSSProperties = {
    padding: '2rem',
    backgroundColor: getTokenString(currentTokens, 'color.background', '#fbfbfc'),
    borderRadius: getTokenString(currentTokens, 'radius.lg', '0.5rem'),
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: getTokenString(currentTokens, 'color.foreground', '#000'),
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const sidebarStyle: React.CSSProperties = {
    backgroundColor: getTokenString(currentTokens, 'color.card', '#f8f9ef'),
    borderRadius: getTokenString(currentTokens, 'radius.md', '0.25rem'),
    padding: '1rem',
    maxHeight: '600px',
    overflowY: 'auto',
  };

  const categoryTitleStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: getTokenString(currentTokens, 'color.foreground', '#000'),
    marginTop: '1rem',
  };

  const tokenItemStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    borderRadius: getTokenString(currentTokens, 'radius.sm', '0.125rem'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '0.25rem',
    color: getTokenString(currentTokens, 'color.foreground', '#000'),
  };

  const previewStyle: React.CSSProperties = {
    backgroundColor: getTokenString(currentTokens, 'color.card', '#f8f9ef'),
    borderRadius: getTokenString(currentTokens, 'radius.lg', '0.5rem'),
    padding: '2rem',
    minHeight: '400px',
  };

  const previewTitleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: getTokenString(currentTokens, 'color.foreground', '#000'),
  };

  const tokenNameStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: getTokenString(currentTokens, 'color.primary', '#d45a5f'),
  };

  const tokenValueStyle: React.CSSProperties = {
    backgroundColor: getTokenString(currentTokens, 'color.background', '#fbfbfc'),
    padding: '1rem',
    borderRadius: getTokenString(currentTokens, 'radius.md', '0.25rem'),
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    wordBreak: 'break-all',
    color: getTokenString(currentTokens, 'color.foreground', '#000'),
  };

  const colorPreviewStyle: React.CSSProperties = {
    width: '100%',
    height: '100px',
    borderRadius: getTokenString(currentTokens, 'radius.md', '0.25rem'),
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '600',
  };

  const handleTokenClick = (tokenPath: string) => {
    setSelectedToken(tokenPath);
  };

  const handleTokenMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = getTokenString(
      currentTokens,
      'color.primary',
      '#d45a5f'
    );
    e.currentTarget.style.color = getTokenString(currentTokens, 'color.primary.foreground', '#fff');
  };

  const handleTokenMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = getTokenString(currentTokens, 'color.foreground', '#000');
  };

  const isColorToken = selectedToken.startsWith('color');
  const colorToken = getTokenColor(currentTokens, selectedToken);

  return (
    <div style={containerStyle} className={className}>
      <h1 style={headerStyle}>Token Playground</h1>

      <div style={gridStyle}>
        <div style={sidebarStyle}>
          {Object.entries(tokenCategories).map(([category, tokens]) => (
            <div key={category}>
              <h3 style={categoryTitleStyle}>{category}</h3>
              {tokens.map((token) => (
                <div
                  key={token}
                  style={tokenItemStyle}
                  onClick={() => handleTokenClick(`${category}.${token}`)}
                  onMouseEnter={handleTokenMouseEnter}
                  onMouseLeave={handleTokenMouseLeave}
                >
                  {token}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={previewStyle}>
          <h2 style={previewTitleStyle}>{selectedToken}</h2>
          <div style={tokenNameStyle}>Value</div>
          <div style={tokenValueStyle}>{displayValue}</div>

          {isColorToken && colorToken && (
            <>
              <div style={tokenNameStyle}>Color Preview</div>
              <div
                style={{
                  ...colorPreviewStyle,
                  backgroundColor: colorToken.hex || '#ccc',
                  color: colorToken.foreground || '#000',
                }}
              >
                {colorToken.hex || 'N/A'}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenPlayground;
