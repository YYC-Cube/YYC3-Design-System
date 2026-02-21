import React, { useState, useMemo } from 'react';
import { useTheme } from '../theme/useTheme';

interface ColorContrastCheckerProps {
  className?: string;
}

export const ColorContrastChecker: React.FC<ColorContrastCheckerProps> = ({ className = '' }) => {
  const { tokens: currentTokens } = useTheme();
  const [foregroundColor, setForegroundColor] = useState<string>('#000000');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  const hexToRgb = (hex: string): [number, number, number] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  };

  const contrastRatio = useMemo(() => {
    const getLuminance = (hex: string): number => {
      const rgb = hexToRgb(hex);
      if (!rgb) return 0;
      const [r, g, b] = rgb.map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(foregroundColor);
    const lum2 = getLuminance(backgroundColor);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }, [foregroundColor, backgroundColor]);

  const wcagRating = useMemo(() => {
    if (contrastRatio >= 7) return { level: 'AAA', small: true, large: true, graphics: true };
    if (contrastRatio >= 4.5) return { level: 'AA', small: true, large: true, graphics: false };
    if (contrastRatio >= 3) return { level: 'AA Large', small: false, large: true, graphics: false };
    return { level: 'Fail', small: false, large: false, graphics: false };
  }, [contrastRatio]);

  const containerStyle: React.CSSProperties = {
    padding: '2rem',
    backgroundColor: currentTokens['color.background'] as string || '#fbfbfc',
    borderRadius: currentTokens['radius.lg'] as string || '0.5rem',
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
  };

  const headerStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: currentTokens['color.foreground'] as string || '#000',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '1rem',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: currentTokens['color.foreground'] as string || '#000',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: currentTokens['radius.md'] as string || '0.25rem',
    border: `1px solid ${currentTokens['color.muted-foreground'] as string || '#ccc'}`,
    backgroundColor: currentTokens['color.background'] as string || '#fbfbfc',
    color: currentTokens['color.foreground'] as string || '#000',
    fontSize: '1rem',
    fontFamily: 'monospace',
  };

  const previewStyle: React.CSSProperties = {
    padding: '2rem',
    borderRadius: currentTokens['radius.lg'] as string || '0.5rem',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: '400',
  };

  const largeTextStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: '600',
  };

  const resultsStyle: React.CSSProperties = {
    backgroundColor: currentTokens['color.card'] as string || '#f8f9ef',
    borderRadius: currentTokens['radius.lg'] as string || '0.5rem',
    padding: '2rem',
  };

  const ratioStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: wcagRating.level === 'Fail' ? '#e05a3f' : '#10b981',
  };

  const ratingStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: currentTokens['color.foreground'] as string || '#000',
  };

  const checklistStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const checklistItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    color: currentTokens['color.foreground'] as string || '#000',
  };

  return (
    <div style={containerStyle} className={className}>
      <h1 style={headerStyle}>Color Contrast Checker</h1>
      
      <div style={gridStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Foreground Color</label>
          <input
            type="color"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
            style={{ ...inputStyle, height: '50px', cursor: 'pointer' }}
          />
          <input
            type="text"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
            style={inputStyle}
            placeholder="#000000"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Background Color</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            style={{ ...inputStyle, height: '50px', cursor: 'pointer' }}
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            style={inputStyle}
            placeholder="#ffffff"
          />
        </div>
      </div>

      <div
        style={{
          ...previewStyle,
          backgroundColor,
          color: foregroundColor,
        }}
      >
        <div style={textStyle}>
          This is normal text size (16px)
        </div>
        <div style={largeTextStyle}>
          This is large text size (24px)
        </div>
        <div style={textStyle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </div>

      <div style={resultsStyle}>
        <div style={ratioStyle}>
          Contrast Ratio: {contrastRatio.toFixed(2)}:1
        </div>
        <div style={ratingStyle}>
          WCAG Rating: {wcagRating.level}
        </div>
        <div style={checklistStyle}>
          <div style={checklistItemStyle}>
            <span>{wcagRating.small ? '✅' : '❌'}</span>
            <span>Normal text (AA)</span>
          </div>
          <div style={checklistItemStyle}>
            <span>{wcagRating.large ? '✅' : '❌'}</span>
            <span>Large text (AA)</span>
          </div>
          <div style={checklistItemStyle}>
            <span>{wcagRating.graphics ? '✅' : '❌'}</span>
            <span>Graphics and UI components (AAA)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorContrastChecker;
