/**
 * YYC³ Design System — Layout Component
 *
 * Token Reference:
 *   background:   var(--background)
 *   foreground:   var(--foreground)
 *   card:         var(--card) / bg-card/80
 *   border:       var(--border)
 *   primary:      var(--primary)
 *   muted:        var(--muted)
 *   font-mono:    var(--font-family-mono)
 *   transition:   var(--duration-fast) var(--easing-default)
 */
import {
  LayoutDashboard,
  Component,
  Palette,
  FileCode2,
  Hammer,
  Menu,
  X,
  ShieldCheck,
  Settings2,
  Github,
  BookOpen,
} from 'lucide-react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { logo32 } from './PWAProvider';

export function Layout() {
  const { style } = useTheme();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: t('nav.overview'), icon: LayoutDashboard },
    { to: '/components', label: t('nav.components'), icon: Component },
    { to: '/playground', label: t('nav.playground'), icon: Palette },
    { to: '/tokens', label: t('nav.tokens'), icon: FileCode2 },
    { to: '/build-settings', label: t('nav.build'), icon: Hammer },
    { to: '/qa', label: t('qa.title'), icon: ShieldCheck },
    { to: '/system-settings', label: t('themeCustomizer.title'), icon: Settings2 },
    { to: '/route-guide', label: t('nav.routeApiGuide'), icon: BookOpen },
  ];

  // Keyboard shortcut: Ctrl+Alt+Q → navigate to QA Dashboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        navigate('/qa');
      }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        navigate('/system-settings');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header — Token: bg-card/80, border-border, backdrop-blur */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-1.5 rounded-md hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={t('nav.toggleMenu')}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <div className="flex items-center gap-2">
              {/* Logo — YanYu Cloud 言语云 */}
              <img src={logo32} alt="YYC³ YanYu Cloud" className="size-8 rounded-lg" />
              <div>
                <h1 className="text-sm" style={{ lineHeight: 1.2 }}>
                  YYC<sup>3</sup> {t('theme.designSystem')}
                </h1>
                <p
                  className="text-[10px] text-muted-foreground capitalize"
                  style={{ lineHeight: 1 }}
                >
                  {t('theme.label')}-{style}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop nav — Token: text-primary on active, text-muted-foreground default */}
          <nav
            className="hidden md:flex items-center gap-1"
            role="navigation"
            aria-label={t('nav.mainNav')}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center justify-center size-8 rounded-md transition-all"
              style={{
                color: 'var(--muted-foreground)',
                outline: '2px solid transparent',
                transition: `all var(--duration-fast) var(--easing-out)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--muted)';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted-foreground)';
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = `2px solid var(--ring)`;
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = '2px solid transparent';
              }}
              aria-label={t('nav.github')}
            >
              <Github className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden border-t border-border bg-card p-2"
            role="navigation"
            aria-label={t('nav.mobileNav')}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer — Token: border-border, text-muted-foreground */}
      <footer className="border-t border-border py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={logo32} alt="YYC³" className="size-4 rounded" />
            <span>{t('footer.version')}</span>
          </div>
          <span>{t('footer.features')}</span>
        </div>
      </footer>
    </div>
  );
}
