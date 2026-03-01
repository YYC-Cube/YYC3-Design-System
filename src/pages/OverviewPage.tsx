/**
 * YYC³ Design System — Overview Page (Redesigned)
 *
 * Token Reference:
 *   hero:         background: linear-gradient(135deg, var(--primary) 0%, var(--primary-highlight) 100%)
 *   foreground:   var(--foreground), var(--muted-foreground), var(--primary-foreground)
 *   card:         var(--card), var(--card-foreground)
 *   shadow:       var(--shadow-md), var(--shadow-lg), var(--shadow-glow)
 *   spacing:      var(--spacing-1) ~ var(--spacing-8)
 *   animation:    var(--duration-fast) var(--easing-out)
 *   radius:       var(--radius-md), var(--radius-lg)
 *   a11y:         focus-visible:outline-ring/50, aria-label on all interactive elements
 *
 * Sections:
 *   1. Hero Banner (56vh desktop / 40vh mobile) — gradient + logo + tagline + CTAs
 *   2. Five-High Value Cards (3-col → 2-col → 1-col) — each with CTA "了解更多 →"
 *   3. Feature Grid (3×2) — 6 quick-access tiles
 *   4. News Carousel (auto-play, pause on hover)
 *   5. Five-Standards & Five-Implementations
 *   6. Color Palette Preview
 *   7. Scale System
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme, type ThemeStyle } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Accessibility,
  Palette,
  Zap,
  Layers,
  Puzzle,
  PaintBucket,
  Ruler,
  Image,
  FileText,
  Code2,
  Bot,
  Eye,
  Boxes,
  MousePointerClick,
  Settings2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Hammer,
  ShieldCheck,
  ClipboardCheck,
} from 'lucide-react';
import { Link } from 'react-router';
import { logo96 } from '../components/PWAProvider';

/* ─── News Carousel Data ─────────────────────── */
function useNewsCarousel(count: number, intervalMs = 4500) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setCurrent((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next, intervalMs]);

  return { current, next, prev, paused, setPaused };
}

export function OverviewPage() {
  const { style, resolvedMode } = useTheme();
  const { t } = useLanguage();

  /* ── News Carousel ── */
  const news = [
    {
      title: t('overview.newsTitle1'),
      date: t('overview.newsDate1'),
      blurb: t('overview.newsBlurb1'),
    },
    {
      title: t('overview.newsTitle2'),
      date: t('overview.newsDate2'),
      blurb: t('overview.newsBlurb2'),
    },
    {
      title: t('overview.newsTitle3'),
      date: t('overview.newsDate3'),
      blurb: t('overview.newsBlurb3'),
    },
  ];
  const { current, next, prev, paused, setPaused } = useNewsCarousel(news.length);

  /* ── Theme Info ── */
  const themeDescriptions: Record<ThemeStyle, { label: string; desc: string; accent: string }> = {
    future: { label: t('theme.future'), desc: t('overview.futureDesc'), accent: '#2563eb' },
    cyber: { label: t('theme.cyber'), desc: t('overview.cyberDesc'), accent: '#d946ef' },
    business: { label: t('theme.business'), desc: t('overview.businessDesc'), accent: '#1d4ed8' },
  };

  /* ── Five-High Goals ── */
  const fiveHighGoals = [
    {
      icon: Accessibility,
      title: t('overview.highAccessibility'),
      desc: t('overview.highAccessibilityDesc'),
      anchor: '#five-high',
    },
    {
      icon: Palette,
      title: t('overview.highCustomizability'),
      desc: t('overview.highCustomizabilityDesc'),
      anchor: '#five-high',
    },
    {
      icon: Zap,
      title: t('overview.highPerformance'),
      desc: t('overview.highPerformanceDesc'),
      anchor: '#five-high',
    },
    {
      icon: Layers,
      title: t('overview.highConsistency'),
      desc: t('overview.highConsistencyDesc'),
      anchor: '#five-high',
    },
    {
      icon: Puzzle,
      title: t('overview.highExtensibility'),
      desc: t('overview.highExtensibilityDesc'),
      anchor: '#five-high',
    },
  ];

  /* ── Feature Grid ── */
  const featureTiles = [
    {
      icon: Boxes,
      label: t('overview.featureComponents'),
      desc: t('overview.featureComponentsDesc'),
      to: '/components',
      ariaLabel: t('overview.featureComponents'),
    },
    {
      icon: Palette,
      label: t('overview.featurePlayground'),
      desc: t('overview.featurePlaygroundDesc'),
      to: '/playground',
      ariaLabel: t('overview.featurePlayground'),
    },
    {
      icon: Settings2,
      label: t('overview.featureTokenMgr'),
      desc: t('overview.featureTokenMgrDesc'),
      to: '/token-manager',
      ariaLabel: t('overview.featureTokenMgr'),
    },
    {
      icon: Hammer,
      label: t('overview.featureBuild'),
      desc: t('overview.featureBuildDesc'),
      to: '/build-settings',
      ariaLabel: t('overview.featureBuild'),
    },
    {
      icon: ShieldCheck,
      label: t('overview.featureQA'),
      desc: t('overview.featureQADesc'),
      to: '/qa',
      ariaLabel: t('overview.featureQA'),
    },
    {
      icon: ClipboardCheck,
      label: t('overview.featureAlignment'),
      desc: t('overview.featureAlignmentDesc'),
      to: '/alignment',
      ariaLabel: t('overview.featureAlignment'),
    },
  ];

  /* ── Five Standards ── */
  const fiveStandards = [
    { icon: PaintBucket, title: t('overview.colorSystem'), desc: t('overview.colorSystemDesc') },
    { icon: Ruler, title: t('overview.scaleSystem'), desc: t('overview.scaleSystemDesc') },
    { icon: Image, title: t('overview.identitySystem'), desc: t('overview.identitySystemDesc') },
    {
      icon: FileText,
      title: t('overview.annotationSystem'),
      desc: t('overview.annotationSystemDesc'),
    },
    { icon: Code2, title: t('overview.tokenSystem'), desc: t('overview.tokenSystemDesc') },
  ];

  /* ── Five Implementations ── */
  const fiveImplementations = [
    { icon: Settings2, title: t('overview.automation'), desc: t('overview.automationDesc') },
    { icon: Bot, title: t('overview.intelligence'), desc: t('overview.intelligenceDesc') },
    { icon: Eye, title: t('overview.visualization'), desc: t('overview.visualizationDesc') },
    { icon: Boxes, title: t('overview.modularization'), desc: t('overview.modularizationDesc') },
    {
      icon: MousePointerClick,
      title: t('overview.interactivity'),
      desc: t('overview.interactivityDesc'),
    },
  ];

  const themeInfo = themeDescriptions[style];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* ═══ 1. Hero Banner ═══════════════════════════════════════════════ */}
      <section
        aria-label="Hero"
        className="relative overflow-hidden flex items-center justify-center min-h-[40vh] lg:min-h-[56vh]"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-highlight) 100%)',
        }}
      >
        {/* subtle mesh overlay for texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), ' +
              'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
          }}
        />

        <div
          className="relative z-10 flex flex-col items-center text-center gap-5 px-6 py-14 sm:py-20"
          style={{ maxWidth: '56rem', margin: '0 auto' }}
        >
          {/* Logo */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <img src={logo96} alt="YYC³ YanYu Cloud" className="size-16 rounded-xl" />
          </div>

          {/* Title */}
          <h1
            className="tracking-tight"
            style={{
              color: 'var(--primary-foreground)',
              textShadow: '0 2px 8px rgba(0,0,0,0.25)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            YYC<sup>3</sup> {t('theme.designSystem')}
          </h1>

          {/* Tagline */}
          <p
            className="max-w-lg"
            style={{
              color: 'var(--primary-foreground)',
              opacity: 0.92,
              textShadow: '0 1px 4px rgba(0,0,0,0.2)',
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}
          >
            {t('overview.heroTagline')}
          </p>

          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs"
            style={{
              background: 'rgba(255,255,255,0.18)',
              color: 'var(--primary-foreground)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <span
              className="inline-block size-2 rounded-full animate-pulse"
              style={{ background: 'var(--success)' }}
              aria-hidden="true"
            />
            {t('overview.heroActive')}: {themeInfo.label} /{' '}
            {resolvedMode === 'dark' ? t('theme.dark') : t('theme.light')}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              to="/components"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all focus-visible:outline-none"
              style={{
                background: 'rgba(255,255,255,0.22)',
                color: 'var(--primary-foreground)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.35)',
                fontWeight: 600,
                textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                outline: '2px solid transparent',
                transition: `all var(--duration-fast) var(--easing-out)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.32)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.22)';
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = `2px solid var(--ring)`;
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = '2px solid transparent';
              }}
              aria-label={t('overview.exploreComponents')}
            >
              {t('overview.exploreComponents')} <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/playground"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all focus-visible:outline-none"
              style={{
                background: 'rgba(0,0,0,0.12)',
                color: 'var(--primary-foreground)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 500,
                outline: '2px solid transparent',
                transition: `all var(--duration-fast) var(--easing-out)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,0,0,0.22)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,0,0,0.12)';
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = `2px solid var(--ring)`;
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.outline = '2px solid transparent';
              }}
              aria-label={t('overview.tokenPlayground')}
            >
              {t('overview.tokenPlayground')}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Main Content ═��════════════════════════════════════════════════ */}
      <div className="mx-auto px-4 sm:px-6 py-10 space-y-12" style={{ maxWidth: '1400px' }}>
        {/* ─── 2. Five-High Value Cards ──────────────────────────────────── */}
        <section id="five-high" aria-labelledby="five-high-heading">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="size-7 rounded-lg flex items-center justify-center text-xs"
              style={{
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontWeight: 600,
              }}
            >
              1
            </div>
            <h2 id="five-high-heading" className="text-xl">
              {t('overview.fiveHighGoals')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {fiveHighGoals.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border p-5 flex flex-col gap-3 group transition-all"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  boxShadow: 'var(--shadow-md)',
                  transition: `all var(--duration-fast) var(--easing-out)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--primary)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                <item.icon
                  className="size-6"
                  style={{ color: 'var(--primary)' }}
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <h3 className="text-sm mb-1" style={{ fontWeight: 600 }}>
                    {item.title}
                  </h3>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--muted-foreground)', lineHeight: 1.5 }}
                  >
                    {item.desc}
                  </p>
                </div>
                <a
                  href={item.anchor}
                  className="inline-flex items-center gap-1 text-xs transition-all focus-visible:outline-none rounded"
                  style={{
                    color: 'var(--primary)',
                    fontWeight: 500,
                    outline: '2px solid transparent',
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.outline = `2px solid var(--ring)`;
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.outline = '2px solid transparent';
                  }}
                  aria-label={`${t('overview.learnMore')} — ${item.title}`}
                >
                  {t('overview.learnMore')} <ArrowRight className="size-3" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 3. Feature Grid ───────────────────────────────────────────── */}
        <section aria-labelledby="feature-grid-heading">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="size-7 rounded-lg flex items-center justify-center text-xs"
              style={{
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontWeight: 600,
              }}
            >
              2
            </div>
            <h2 id="feature-grid-heading" className="text-xl">
              {t('overview.featureGrid')}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {featureTiles.map((tile) => (
              <Link
                key={tile.to}
                to={tile.to}
                role="link"
                aria-label={tile.ariaLabel}
                className="rounded-xl p-5 flex flex-col gap-3 group focus-visible:outline-none transition-all"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  boxShadow: 'var(--shadow-sm)',
                  outline: '2px solid transparent',
                  transition: `all var(--duration-fast) var(--easing-out)`,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'var(--shadow-lg)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--primary)';
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    'translateY(-2px) scale(1.01)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'var(--shadow-sm)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0) scale(1)';
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = `2px solid var(--ring)`;
                  (e.currentTarget as HTMLAnchorElement).style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.outline = '2px solid transparent';
                }}
              >
                <div
                  className="size-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    boxShadow: 'var(--shadow-glow)',
                  }}
                >
                  <tile.icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p
                    className="text-sm mb-0.5"
                    style={{ fontWeight: 600, color: 'var(--foreground)' }}
                  >
                    {tile.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--muted-foreground)', lineHeight: 1.4 }}
                  >
                    {tile.desc}
                  </p>
                </div>
                <ArrowRight
                  className="size-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--primary)' }}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* ─── 4. Three Themes ───────────────────────────────────────────── */}
        <section aria-labelledby="themes-heading">
          <h2 id="themes-heading" className="text-xl mb-4">
            {t('overview.threeThemes')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              Object.entries(themeDescriptions) as [
                ThemeStyle,
                (typeof themeDescriptions)['future'],
              ][]
            ).map(([key, info]) => (
              <div
                key={key}
                className="rounded-xl p-5 transition-all"
                style={{
                  border: style === key ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background:
                    style === key
                      ? 'color-mix(in oklch, var(--primary) 8%, var(--card))'
                      : 'var(--card)',
                  boxShadow: style === key ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="size-4 rounded-full"
                    style={{ background: info.accent }}
                    aria-hidden="true"
                  />
                  <h3 className="text-sm" style={{ fontWeight: 600 }}>
                    {info.label}
                  </h3>
                  {style === key && (
                    <span
                      className="ml-auto text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                      aria-label={t('common.active')}
                    >
                      {t('common.active')}
                    </span>
                  )}
                </div>
                <p
                  className="text-xs"
                  style={{ color: 'var(--muted-foreground)', lineHeight: 1.5 }}
                >
                  {info.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 5. News Carousel ──────────────────────────────────────────── */}
        <section
          aria-labelledby="news-heading"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="size-7 rounded-lg flex items-center justify-center text-xs"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontWeight: 600,
                }}
              >
                3
              </div>
              <h2 id="news-heading" className="text-xl">
                {t('overview.latestUpdates')}
              </h2>
            </div>
            {/* Dot indicators */}
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label={t('overview.latestUpdates')}
            >
              {news.map((_, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={current === idx}
                  aria-controls={`news-slide-${idx}`}
                  onClick={() => {
                    /* setCurrent directly */
                  }}
                  className="rounded-full transition-all focus-visible:outline-none"
                  style={{
                    width: current === idx ? '1.5rem' : '0.5rem',
                    height: '0.5rem',
                    background: current === idx ? 'var(--primary)' : 'var(--border)',
                    outline: '2px solid transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: `all var(--duration-normal) var(--easing-out)`,
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline = `2px solid var(--ring)`;
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline = '2px solid transparent';
                  }}
                  aria-label={`${t('overview.updateBadge')} ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--card)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Slides */}
            <div className="overflow-hidden">
              {news.map((item, idx) => (
                <div
                  key={idx}
                  id={`news-slide-${idx}`}
                  role="tabpanel"
                  aria-hidden={current !== idx}
                  className="transition-all"
                  style={{
                    display: current === idx ? 'block' : 'none',
                    padding: 'var(--spacing-6) var(--spacing-7)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        background: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {t('overview.updateBadge')}
                    </span>
                    <time className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {item.date}
                    </time>
                  </div>
                  <h3
                    className="mb-2"
                    style={{ fontWeight: 600, fontSize: '1.125rem', color: 'var(--foreground)' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {item.blurb}
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                onClick={prev}
                className="flex items-center justify-center rounded-lg border transition-all focus-visible:outline-none"
                style={{
                  width: '2rem',
                  height: '2rem',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  cursor: 'pointer',
                  outline: '2px solid transparent',
                  transition: `all var(--duration-fast) var(--easing-out)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--muted)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--card)';
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = `2px solid var(--ring)`;
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = '2px solid transparent';
                }}
                aria-label={t('overview.prevUpdate')}
                aria-controls="news-carousel"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={next}
                className="flex items-center justify-center rounded-lg border transition-all focus-visible:outline-none"
                style={{
                  width: '2rem',
                  height: '2rem',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  cursor: 'pointer',
                  outline: '2px solid transparent',
                  transition: `all var(--duration-fast) var(--easing-out)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--muted)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--card)';
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = `2px solid var(--ring)`;
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.outline = '2px solid transparent';
                }}
                aria-label={t('overview.nextUpdate')}
                aria-controls="news-carousel"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ─── 6. Five-Standards ─────────────────────────────────────────── */}
        <section aria-labelledby="five-standards-heading">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="size-7 rounded-lg flex items-center justify-center text-xs"
              style={{
                background: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
                fontWeight: 600,
              }}
            >
              4
            </div>
            <h2 id="five-standards-heading" className="text-xl">
              {t('overview.fiveStandards')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {fiveStandards.map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-4 group transition-all"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  transition: `all var(--duration-fast) var(--easing-out)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    'color-mix(in oklch, var(--primary) 40%, var(--border))';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                }}
              >
                <item.icon
                  className="size-5 mb-2 transition-transform group-hover:scale-110"
                  style={{ color: 'var(--primary)' }}
                  aria-hidden="true"
                />
                <h3 className="text-sm mb-1" style={{ fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p
                  className="text-xs"
                  style={{ color: 'var(--muted-foreground)', lineHeight: 1.5 }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 7. Five-Implementations ───────────────────────────────────── */}
        <section aria-labelledby="five-impl-heading">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="size-7 rounded-lg flex items-center justify-center text-xs"
              style={{
                background: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
                fontWeight: 600,
              }}
            >
              5
            </div>
            <h2 id="five-impl-heading" className="text-xl">
              {t('overview.fiveImplementations')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {fiveImplementations.map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-4 group transition-all"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  transition: `all var(--duration-fast) var(--easing-out)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    'color-mix(in oklch, var(--primary) 40%, var(--border))';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                }}
              >
                <item.icon
                  className="size-5 mb-2 transition-transform group-hover:scale-110"
                  style={{ color: 'var(--primary)' }}
                  aria-hidden="true"
                />
                <h3 className="text-sm mb-1" style={{ fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p
                  className="text-xs"
                  style={{ color: 'var(--muted-foreground)', lineHeight: 1.5 }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 8. Color Palette Preview ──────────────────────────────────── */}
        <section aria-labelledby="palette-heading">
          <h2 id="palette-heading" className="text-xl mb-4">
            {t('overview.palettePreview')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { label: t('overview.primary'), cssVar: '--primary' },
              { label: t('overview.highlight'), cssVar: '--primary-highlight' },
              { label: t('overview.secondary'), cssVar: '--secondary' },
              { label: t('overview.muted'), cssVar: '--muted' },
              { label: t('overview.destructive'), cssVar: '--destructive' },
              { label: t('overview.successColor'), cssVar: '--success' },
              { label: t('overview.warningColor'), cssVar: '--warning' },
              { label: t('overview.background'), cssVar: '--background' },
            ].map((c) => (
              <div key={c.cssVar} className="space-y-1">
                <div
                  className="h-16 rounded-lg"
                  style={{
                    background: `var(${c.cssVar})`,
                    border: '1px solid var(--border)',
                  }}
                  aria-label={`${c.label}: var(${c.cssVar})`}
                />
                <p className="text-[10px] text-center" style={{ color: 'var(--muted-foreground)' }}>
                  {c.label}
                </p>
                <p
                  className="text-[9px] text-center"
                  style={{
                    color: 'var(--muted-foreground)',
                    fontFamily: 'var(--font-family-mono)',
                  }}
                >
                  {c.cssVar}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 9. Scale System ───────────────────────────────────────────── */}
        <section aria-labelledby="scale-heading">
          <h2 id="scale-heading" className="text-xl mb-4">
            {t('overview.scaleSystemTitle')}
          </h2>
          <div className="space-y-2">
            {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
              <div key={n} className="flex items-center gap-3">
                <code
                  className="text-xs w-24"
                  style={{
                    color: 'var(--muted-foreground)',
                    fontFamily: 'var(--font-family-mono)',
                  }}
                >
                  --spacing-{n}
                </code>
                <div
                  className="h-4 rounded"
                  style={{
                    width: `var(--spacing-${n})`,
                    background: 'color-mix(in oklch, var(--primary) 25%, transparent)',
                    border: '1px solid color-mix(in oklch, var(--primary) 40%, transparent)',
                  }}
                />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  {n * 4}px
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
