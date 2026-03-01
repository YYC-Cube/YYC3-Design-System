/**
 * @file YYC³ 主题切换组件
 * @description 三主题切换器：支持 future | cyber | business 样式切换和 light | dark | system 模式切换
 * @module components
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-27
 */

import { useTheme, type ThemeStyle } from '../theme/ThemeContext';

const IconSun = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const IconMoon = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const IconMonitor = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </svg>
);

const IconSparkles = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const IconZap = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconBriefcase = () => (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export function ThemeToggleEnhanced() {
  const { style, mode, setStyle, toggleMode } = useTheme();

  const styleConfig: Record<ThemeStyle, { label: string; icon: React.ReactNode }> = {
    future: { label: 'Future', icon: <IconSparkles /> },
    cyber: { label: 'Cyber', icon: <IconZap /> },
    business: { label: 'Business', icon: <IconBriefcase /> },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-lg border border-border bg-card p-0.5 gap-0.5">
        {(Object.keys(styleConfig) as ThemeStyle[]).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all ${
              style === s
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
            aria-label={`Switch to ${styleConfig[s].label} theme`}
            aria-pressed={style === s}
            title={styleConfig[s].label}
          >
            {styleConfig[s].icon}
            <span className="hidden sm:inline text-xs">{styleConfig[s].label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={toggleMode}
        className="flex items-center justify-center size-9 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-all"
        aria-label={`Toggle mode (current: ${mode})`}
        title={`Current mode: ${mode}`}
      >
        {mode === 'dark' ? <IconMoon /> : mode === 'light' ? <IconSun /> : <IconMonitor />}
      </button>
    </div>
  );
}
