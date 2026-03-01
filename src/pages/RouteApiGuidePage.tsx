/**
 * YYC\u00b3 Design System \u2014 Route API & Extension Guide Page
 *
 * Token Reference:
 *   background:   var(--background)
 *   foreground:   var(--foreground), var(--muted-foreground)
 *   card:         var(--card), var(--card-foreground)
 *   primary:      var(--primary), var(--primary-foreground)
 *   border:       var(--border)
 *   muted:        var(--muted)
 *   success:      var(--success)
 *   destructive:  var(--destructive)
 *   shadow:       var(--shadow-md)
 *   spacing:      var(--spacing-2) ~ var(--spacing-6)
 *   radius:       var(--radius-md), var(--radius-lg)
 *   animation:    var(--duration-fast) var(--easing-out)
 *   a11y:         focus-visible:outline-ring/50, aria-label on all interactive elements
 */
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Map,
  Network,
  Keyboard,
  PlusCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  BookOpen,
  Palette,
  Component,
  FileCode2,
  Code2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

/* ---- Collapsible Section ---- */
function Section({
  icon: Icon,
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-lg border border-border overflow-hidden"
      style={{
        background: 'var(--card)',
        transition: `all var(--duration-fast) var(--easing-out)`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50"
        style={{
          transition: `background var(--duration-fast) var(--easing-out)`,
          outline: '2px solid transparent',
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid var(--ring)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = '2px solid transparent';
        }}
        aria-expanded={open}
        aria-label={title}
      >
        <Icon className="size-5 text-primary shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm text-card-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        </div>
        {open ? (
          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && <div className="border-t border-border px-4 py-4 space-y-4">{children}</div>}
    </div>
  );
}

/* ---- Code Block ---- */
function CodeBlock({ code, lang = 'tsx' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-md border border-border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border-b border-border">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded"
          style={{
            transition: `color var(--duration-fast) var(--easing-out)`,
            outline: '2px solid transparent',
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid var(--ring)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = '2px solid transparent';
          }}
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className="p-3 overflow-x-auto text-xs"
        style={{
          background: 'var(--muted)',
          color: 'var(--foreground)',
          lineHeight: '1.6',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ---- Kbd ---- */
function Kbd({ children }: { children: string }) {
  return (
    <kbd
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] border border-border bg-muted text-muted-foreground"
      style={{ fontFamily: 'var(--font-family-mono)' }}
    >
      {children}
    </kbd>
  );
}

/* ---- Main Page ---- */
export function RouteApiGuidePage() {
  const { t } = useLanguage();
  const { style } = useTheme();

  /* Route table data */
  const routes = [
    {
      path: '/',
      component: 'OverviewPage',
      desc: t('routeGuide.routeOverview'),
      shortcut: t('routeGuide.none'),
    },
    {
      path: '/components',
      component: 'ComponentsPage',
      desc: t('routeGuide.routeComponents'),
      shortcut: t('routeGuide.none'),
    },
    {
      path: '/playground',
      component: 'PlaygroundPage',
      desc: t('routeGuide.routePlayground'),
      shortcut: t('routeGuide.none'),
    },
    {
      path: '/tokens',
      component: 'TokensPage',
      desc: t('routeGuide.routeTokens'),
      shortcut: t('routeGuide.none'),
    },
    {
      path: '/token-manager',
      component: 'TokenManagerPage',
      desc: t('routeGuide.routeTokenManager'),
      shortcut: 'Ctrl+Alt+I',
    },
    {
      path: '/build-settings',
      component: 'BuildSettingsPage',
      desc: t('routeGuide.routeBuild'),
      shortcut: 'Ctrl+Alt+B',
    },
    {
      path: '/qa',
      component: 'QADashboardPage',
      desc: t('routeGuide.routeQA'),
      shortcut: 'Ctrl+Alt+Q',
    },
    {
      path: '/system-settings',
      component: 'ThemeCustomizerPage',
      desc: t('routeGuide.routeSettings'),
      shortcut: 'Ctrl+Alt+C',
    },
    {
      path: '/alignment',
      component: 'AlignmentPage',
      desc: t('routeGuide.routeAlignment'),
      shortcut: t('routeGuide.none'),
    },
    {
      path: '/route-guide',
      component: 'RouteApiGuidePage',
      desc: t('routeGuide.routeApiGuide'),
      shortcut: t('routeGuide.none'),
    },
  ];

  /* Theme API table data */
  const themeApi = [
    {
      prop: 'style',
      type: 'ThemeStyle',
      desc: t('routeGuide.themeApiStyle'),
    },
    { prop: 'mode', type: 'ThemeMode', desc: t('routeGuide.themeApiMode') },
    {
      prop: 'resolvedMode',
      type: "'light' | 'dark'",
      desc: t('routeGuide.themeApiResolved'),
    },
    {
      prop: 'setStyle',
      type: '(s: ThemeStyle) => void',
      desc: t('routeGuide.themeApiSetStyle'),
    },
    {
      prop: 'setMode',
      type: '(m: ThemeMode) => void',
      desc: t('routeGuide.themeApiSetMode'),
    },
    {
      prop: 'toggleMode',
      type: '() => void',
      desc: t('routeGuide.themeApiToggle'),
    },
    {
      prop: 'cycleStyle',
      type: '() => void',
      desc: t('routeGuide.themeApiCycle'),
    },
  ];

  /* Language API table */
  const langApi = [
    { prop: 'lang', type: 'Language', desc: t('routeGuide.langApiLang') },
    {
      prop: 'setLang',
      type: '(l: Language) => void',
      desc: t('routeGuide.langApiSetLang'),
    },
    {
      prop: 'toggleLang',
      type: '() => void',
      desc: t('routeGuide.langApiToggle'),
    },
    { prop: 't', type: 'TFunction', desc: t('routeGuide.langApiT') },
  ];

  /* Keyboard shortcuts */
  const shortcuts = [
    {
      keys: 'Ctrl+Alt+T',
      action: t('routeGuide.actionCycleTheme'),
      scope: t('routeGuide.scopeGlobal'),
    },
    {
      keys: 'Ctrl+Alt+L',
      action: t('routeGuide.actionToggleLang'),
      scope: t('routeGuide.scopeGlobal'),
    },
    {
      keys: 'Ctrl+Alt+C',
      action: t('routeGuide.actionOpenSettings'),
      scope: t('routeGuide.scopeGlobal'),
    },
    {
      keys: 'Ctrl+Alt+Q',
      action: t('routeGuide.actionOpenQA'),
      scope: t('routeGuide.scopeGlobal'),
    },
    {
      keys: 'Ctrl+Alt+B',
      action: t('routeGuide.actionOpenBuild'),
      scope: t('routeGuide.scopeGlobal'),
    },
    {
      keys: 'Ctrl+Alt+I',
      action: t('routeGuide.actionOpenImport'),
      scope: t('routeGuide.scopeTokenMgr'),
    },
  ];

  /* Five-High checklist */
  const fiveHighItems = [
    t('routeGuide.checkA11y'),
    t('routeGuide.checkCustom'),
    t('routeGuide.checkPerf'),
    t('routeGuide.checkConsist'),
    t('routeGuide.checkExtend'),
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BookOpen className="size-6 text-primary" aria-hidden="true" />
          <h1 className="text-2xl text-foreground">{t('routeGuide.title')}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{t('routeGuide.subtitle')}</p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px]"
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            {t('theme.' + style)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            react-router v7 \u00b7 Data Mode \u00b7 createBrowserRouter
          </span>
        </div>
      </div>

      {/* 1. Route Map */}
      <Section
        icon={Map}
        title={t('routeGuide.routeMap')}
        subtitle={t('routeGuide.routeMapDesc')}
        defaultOpen={true}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-muted-foreground" style={{ fontWeight: 600 }}>
                  {t('routeGuide.path')}
                </th>
                <th className="pb-2 pr-4 text-muted-foreground" style={{ fontWeight: 600 }}>
                  {t('routeGuide.component')}
                </th>
                <th
                  className="pb-2 pr-4 text-muted-foreground hidden md:table-cell"
                  style={{ fontWeight: 600 }}
                >
                  {t('routeGuide.description')}
                </th>
                <th className="pb-2 text-muted-foreground" style={{ fontWeight: 600 }}>
                  {t('routeGuide.shortcut')}
                </th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr
                  key={r.path}
                  className="border-b border-border/50 hover:bg-muted/30"
                  style={{
                    transition: `background var(--duration-fast) var(--easing-out)`,
                  }}
                >
                  <td className="py-2 pr-4">
                    <code
                      className="text-xs px-1.5 py-0.5 rounded bg-muted text-primary"
                      style={{ fontFamily: 'var(--font-family-mono)' }}
                    >
                      {r.path}
                    </code>
                  </td>
                  <td className="py-2 pr-4 text-xs text-foreground">{r.component}</td>
                  <td className="py-2 pr-4 text-xs text-muted-foreground hidden md:table-cell">
                    {r.desc}
                  </td>
                  <td className="py-2 text-xs">
                    {r.shortcut !== t('routeGuide.none') ? (
                      <Kbd>{r.shortcut}</Kbd>
                    ) : (
                      <span className="text-muted-foreground">{r.shortcut}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 2. Route Architecture */}
      <Section
        icon={Network}
        title={t('routeGuide.routeArch')}
        subtitle={t('routeGuide.routeArchDesc')}
      >
        <p className="text-xs text-muted-foreground mb-3">{t('routeGuide.routeArchTree')}</p>
        <CodeBlock
          lang="text"
          code={`createBrowserRouter([
  {
    Component: RootProviders,        // LanguageProvider > ThemeProvider > PWAProvider > <Outlet />
    children: [
      {
        path: "/",
        Component: Layout,           // Header + Nav + <Outlet /> + Footer
        children: [
          { index: true, Component: OverviewPage },
          { path: "components", Component: ComponentsPage },
          { path: "playground", Component: PlaygroundPage },
          { path: "tokens", Component: TokensPage },
          { path: "alignment", Component: AlignmentPage },
          { path: "token-manager", Component: TokenManagerPage },
          { path: "build-settings", Component: BuildSettingsPage },
          { path: "qa", Component: QADashboardPage },
          { path: "system-settings", Component: ThemeCustomizerPage },
          { path: "route-guide", Component: RouteApiGuidePage },
          { path: "*", Component: NotFound },
        ],
      },
    ],
  },
])`}
        />
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-2">{t('routeGuide.routeConfigExample')}</p>
          <CodeBlock
            code={`// src/app/routes.tsx
import { MyNewPage } from "./pages/MyNewPage";

// Add to children array:
{ path: "my-new-page", Component: MyNewPage },`}
          />
        </div>
      </Section>

      {/* 3. Context API */}
      <Section
        icon={Code2}
        title={t('routeGuide.contextApi')}
        subtitle={t('routeGuide.contextApiDesc')}
      >
        {/* ThemeContext */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Palette className="size-4 text-primary" aria-hidden="true" />
            <h4 className="text-sm text-foreground">{t('routeGuide.themeContextTitle')}</h4>
          </div>
          <p className="text-xs text-muted-foreground">{t('routeGuide.themeContextDesc')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" role="table">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-4 text-muted-foreground" style={{ fontWeight: 600 }}>
                    {t('routeGuide.property')}
                  </th>
                  <th className="pb-2 pr-4 text-muted-foreground" style={{ fontWeight: 600 }}>
                    {t('routeGuide.typeLabel')}
                  </th>
                  <th className="pb-2 text-muted-foreground" style={{ fontWeight: 600 }}>
                    {t('routeGuide.descLabel')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {themeApi.map((row) => (
                  <tr key={row.prop} className="border-b border-border/50">
                    <td className="py-1.5 pr-4">
                      <code
                        className="text-primary"
                        style={{ fontFamily: 'var(--font-family-mono)' }}
                      >
                        {row.prop}
                      </code>
                    </td>
                    <td
                      className="py-1.5 pr-4 text-muted-foreground"
                      style={{ fontFamily: 'var(--font-family-mono)' }}
                    >
                      {row.type}
                    </td>
                    <td className="py-1.5 text-foreground">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span>
              {t('routeGuide.hookUsage')}:{' '}
              <code className="text-primary" style={{ fontFamily: 'var(--font-family-mono)' }}>
                useTheme()
              </code>
            </span>
            <span>
              {t('routeGuide.storageKey')}:{' '}
              <code style={{ fontFamily: 'var(--font-family-mono)' }}>
                yyc3-theme-style / yyc3-theme-mode
              </code>
            </span>
          </div>
        </div>

        <div className="border-t border-border/50 my-4" />

        {/* LanguageContext */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileCode2 className="size-4 text-primary" aria-hidden="true" />
            <h4 className="text-sm text-foreground">{t('routeGuide.langContextTitle')}</h4>
          </div>
          <p className="text-xs text-muted-foreground">{t('routeGuide.langContextDesc')}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" role="table">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-4 text-muted-foreground" style={{ fontWeight: 600 }}>
                    {t('routeGuide.property')}
                  </th>
                  <th className="pb-2 pr-4 text-muted-foreground" style={{ fontWeight: 600 }}>
                    {t('routeGuide.typeLabel')}
                  </th>
                  <th className="pb-2 text-muted-foreground" style={{ fontWeight: 600 }}>
                    {t('routeGuide.descLabel')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {langApi.map((row) => (
                  <tr key={row.prop} className="border-b border-border/50">
                    <td className="py-1.5 pr-4">
                      <code
                        className="text-primary"
                        style={{ fontFamily: 'var(--font-family-mono)' }}
                      >
                        {row.prop}
                      </code>
                    </td>
                    <td
                      className="py-1.5 pr-4 text-muted-foreground"
                      style={{ fontFamily: 'var(--font-family-mono)' }}
                    >
                      {row.type}
                    </td>
                    <td className="py-1.5 text-foreground">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span>
              {t('routeGuide.hookUsage')}:{' '}
              <code className="text-primary" style={{ fontFamily: 'var(--font-family-mono)' }}>
                useLanguage()
              </code>
            </span>
            <span>
              {t('routeGuide.storageKey')}:{' '}
              <code style={{ fontFamily: 'var(--font-family-mono)' }}>yyc3-lang</code>
            </span>
          </div>
        </div>

        <div className="border-t border-border/50 my-4" />

        {/* Context Usage Example */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            {t('routeGuide.contextUsageExample')}
          </p>
          <CodeBlock
            code={`import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

function MyComponent() {
  const { style, resolvedMode, setStyle, toggleMode } = useTheme();
  const { lang, t } = useLanguage();

  return (
    <div>
      <h1>{t("myPage.title")}</h1>
      <p>{t("myPage.currentTheme")}: {style} / {resolvedMode}</p>
      <button onClick={toggleMode}>{t("theme.toggleMode")}</button>
      <button onClick={() => setStyle("cyber")}>{t("theme.cyber")}</button>
    </div>
  );
}`}
          />
        </div>
      </Section>

      {/* 4. Keyboard Shortcuts */}
      <Section
        icon={Keyboard}
        title={t('routeGuide.keyboardShortcuts')}
        subtitle={t('routeGuide.keyboardShortcutsDesc')}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-muted-foreground" style={{ fontWeight: 600 }}>
                  {t('routeGuide.shortcut')}
                </th>
                <th className="pb-2 pr-4 text-muted-foreground" style={{ fontWeight: 600 }}>
                  {t('routeGuide.shortcutAction')}
                </th>
                <th className="pb-2 text-muted-foreground" style={{ fontWeight: 600 }}>
                  {t('routeGuide.shortcutScope')}
                </th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((s) => (
                <tr
                  key={s.keys}
                  className="border-b border-border/50 hover:bg-muted/30"
                  style={{
                    transition: `background var(--duration-fast) var(--easing-out)`,
                  }}
                >
                  <td className="py-2 pr-4">
                    <Kbd>{s.keys}</Kbd>
                  </td>
                  <td className="py-2 pr-4 text-xs text-foreground">{s.action}</td>
                  <td className="py-2">
                    <span
                      className="inline-flex px-1.5 py-0.5 rounded text-[10px]"
                      style={{
                        background:
                          s.scope === t('routeGuide.scopeGlobal')
                            ? 'var(--primary)'
                            : 'var(--muted)',
                        color:
                          s.scope === t('routeGuide.scopeGlobal')
                            ? 'var(--primary-foreground)'
                            : 'var(--muted-foreground)',
                      }}
                    >
                      {s.scope}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 5. Extension Guide */}
      <Section
        icon={PlusCircle}
        title={t('routeGuide.extensionGuide')}
        subtitle={t('routeGuide.extensionGuideDesc')}
      >
        {/* Add New Page */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-primary" aria-hidden="true" />
            <h4 className="text-sm text-foreground">{t('routeGuide.addNewPage')}</h4>
          </div>
          <div className="bg-muted/30 rounded-md p-3">
            <pre
              className="text-xs text-foreground whitespace-pre-wrap"
              style={{ lineHeight: '1.8' }}
            >
              {t('routeGuide.addNewPageSteps')}
            </pre>
          </div>
          <CodeBlock
            code={`// 1. src/app/pages/MyPage.tsx
export function MyPage() {
  const { t } = useLanguage();
  return <div><h1>{t("myPage.title")}</h1></div>;
}

// 2. src/app/routes.tsx
import { MyPage } from "./pages/MyPage";
// Add to children:
{ path: "my-page", Component: MyPage },

// 3. src/app/components/Layout.tsx navItems:
{ to: "/my-page", label: t("nav.myPage"), icon: FileCode2 },

// 4. zh.json: { "nav": { "myPage": "\u6211\u7684\u9875\u9762" }, "myPage": { "title": "\u6211\u7684\u9875\u9762" } }
// 5. en.json: { "nav": { "myPage": "My Page" }, "myPage": { "title": "My Page" } }`}
          />
        </div>

        <div className="border-t border-border/50 my-4" />

        {/* Add New Theme */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="size-4 text-primary" aria-hidden="true" />
            <h4 className="text-sm text-foreground">{t('routeGuide.addNewTheme')}</h4>
          </div>
          <div className="bg-muted/30 rounded-md p-3">
            <pre
              className="text-xs text-foreground whitespace-pre-wrap"
              style={{ lineHeight: '1.8' }}
            >
              {t('routeGuide.addNewThemeSteps')}
            </pre>
          </div>
          <CodeBlock
            code={`/* 1. src/styles/theme.css */
[data-theme="nature"] {
  --primary: #2d7d46;
  --primary-foreground: #ffffff;
  --primary-highlight: #34a853;
  /* ... Light/Dark complete variable sets ... */
}
[data-theme="nature"].dark {
  --primary: #34a853;
  --background: #0a1f0e;
  /* ... */
}

/* 2. src/app/context/ThemeContext.tsx */
export type ThemeStyle = "future" | "cyber" | "business" | "nature";

/* 3. Update cycleStyle */
const styles: ThemeStyle[] = ["future", "cyber", "business", "nature"];

/* 4. Locale keys */
// zh.json: "theme": { "nature": "\u81ea\u7136\u98ce\u5149" }
// en.json: "theme": { "nature": "Nature" }`}
          />
        </div>

        <div className="border-t border-border/50 my-4" />

        {/* Add New Component */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Component className="size-4 text-primary" aria-hidden="true" />
            <h4 className="text-sm text-foreground">{t('routeGuide.addNewComponent')}</h4>
          </div>
          <div className="bg-muted/30 rounded-md p-3">
            <pre
              className="text-xs text-foreground whitespace-pre-wrap"
              style={{ lineHeight: '1.8' }}
            >
              {t('routeGuide.addNewComponentSteps')}
            </pre>
          </div>
          <CodeBlock
            code={`/**
 * YYC\u00b3 Design System \u2014 MyWidget Component
 *
 * Token Reference:
 *   background:   var(--card)
 *   foreground:   var(--card-foreground)
 *   border:       var(--border)
 *   primary:      var(--primary)
 *   a11y:         focus-visible:outline-ring/50
 */
import React from "react";

interface MyWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined";
}

function MyWidget({ variant = "default", className, ...props }: MyWidgetProps) {
  return (
    <div
      className={\`rounded-md p-4 \${className ?? ""}\`}
      style={{
        background: variant === "default" ? "var(--card)" : "transparent",
        border: "1px solid var(--border)",
        color: "var(--card-foreground)",
        transition: "all var(--duration-fast) var(--easing-out)",
      }}
      {...props}
    />
  );
}

export { MyWidget };`}
          />
        </div>
      </Section>

      {/* 6. Standards & Conventions */}
      <Section
        icon={ShieldCheck}
        title={t('routeGuide.fiveHighChecklist')}
        subtitle={t('routeGuide.fiveHighChecklistDesc')}
      >
        {/* Five-High Checklist */}
        <div className="space-y-2">
          {fiveHighItems.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-xs text-foreground">{item}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 my-4" />

        {/* Locale Key Convention */}
        <div className="space-y-2">
          <h4 className="text-sm text-foreground">{t('routeGuide.localeKeyFormat')}</h4>
          <p className="text-xs text-muted-foreground">{t('routeGuide.localeKeyFormatDesc')}</p>
          <div className="bg-muted/30 rounded-md p-3">
            <pre
              className="text-xs text-foreground whitespace-pre-wrap"
              style={{ lineHeight: '1.8' }}
            >
              {t('routeGuide.localeKeyFormatRules')}
            </pre>
          </div>
        </div>

        <div className="border-t border-border/50 my-4" />

        {/* CSS Variable Standard */}
        <div className="space-y-2">
          <h4 className="text-sm text-foreground">{t('routeGuide.cssVarUsage')}</h4>
          <p className="text-xs text-muted-foreground">{t('routeGuide.cssVarUsageDesc')}</p>
          <div className="bg-muted/30 rounded-md p-3">
            <pre
              className="text-xs text-foreground whitespace-pre-wrap"
              style={{ lineHeight: '1.8' }}
            >
              {t('routeGuide.cssVarRules')}
            </pre>
          </div>
        </div>

        <div className="border-t border-border/50 my-4" />

        {/* Token Reference Standard */}
        <div className="space-y-2">
          <h4 className="text-sm text-foreground">{t('routeGuide.tokenRefStandard')}</h4>
          <p className="text-xs text-muted-foreground">{t('routeGuide.tokenRefStandardDesc')}</p>
          <CodeBlock
            lang="tsx"
            code={`/**
 * YYC\u00b3 Design System \u2014 ComponentName
 *
 * Token Reference:
 *   background:   var(--card)
 *   foreground:   var(--foreground), var(--muted-foreground)
 *   border:       var(--border)
 *   primary:      var(--primary)
 *   shadow:       var(--shadow-md)
 *   spacing:      var(--spacing-2) ~ var(--spacing-6)
 *   radius:       var(--radius-md)
 *   animation:    var(--duration-fast) var(--easing-out)
 *   a11y:         focus-visible:outline-ring/50, aria-label
 */`}
          />
        </div>
      </Section>
    </div>
  );
}
