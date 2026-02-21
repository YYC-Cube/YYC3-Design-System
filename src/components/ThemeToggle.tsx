import React from 'react';
import { useTheme } from '../theme/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { mode, setMode } = useTheme();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <button
      style={buttonStyle}
      onClick={toggleTheme}
      className={className}
      aria-label={mode === 'light' ? '切换到深色模式' : '切换到浅色模式'}
      title={mode === 'light' ? '深色模式' : '浅色模式'}
    >
      <div style={iconStyle}>
        {mode === 'light' ? '🌙' : '☀️'}
      </div>
    </button>
  );
};

export default ThemeToggle;
