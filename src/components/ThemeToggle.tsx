/**
 * YYC³ Design System — Theme Toggle
 *
 * Token Reference:
 *   border:     var(--border)
 *   card:       var(--card)
 *   foreground: var(--foreground)
 *   primary:    var(--primary), var(--primary-foreground) — active state
 *   muted:      var(--muted), var(--muted-foreground) — inactive state
 *   animation:  var(--duration-fast) var(--easing-default)
 *   a11y:       outline: 2px solid var(--ring) on focus
 */
import { Sun, Moon, Monitor, Sparkles, Zap, Briefcase } from 'lucide-react';
import { useTheme, type ThemeStyle } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export function ThemeToggle() {
  const { style, mode, setStyle, setMode, toggleMode } = useTheme();
  const { t } = useLanguage();

  const styleConfig: Record<ThemeStyle, { label: string; icon: React.ReactNode }> = {
    future: { label: t('theme.future'), icon: <Sparkles className="size-4" /> },
    cyber: { label: t('theme.cyber'), icon: <Zap className="size-4" /> },
    business: { label: t('theme.business'), icon: <Briefcase className="size-4" /> },
  };

  return (
    <div className="flex items-center gap-2">
      {/* Style selector */}
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
            aria-label={`${t('theme.switchTo').replace('{theme}', styleConfig[s].label)}`}
            aria-pressed={style === s}
            title={styleConfig[s].label}
          >
            {styleConfig[s].icon}
            <span className="hidden sm:inline text-xs">{styleConfig[s].label}</span>
          </button>
        ))}
      </div>

      {/* Mode toggle */}
      <button
        onClick={toggleMode}
        className="flex items-center justify-center size-9 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-all"
        aria-label={t('theme.toggleMode')}
        title={t('theme.currentMode').replace('{mode}', mode)}
      >
        {mode === 'dark' ? (
          <Moon className="size-4" />
        ) : mode === 'light' ? (
          <Sun className="size-4" />
        ) : (
          <Monitor className="size-4" />
        )}
      </button>
    </div>
  );
}
