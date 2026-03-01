/**
 * YYC³ Design System — PWA Provider
 *
 * Dynamically injects PWA meta tags, favicon, manifest link,
 * apple-touch-icon, theme-color, and registers service worker.
 *
 * Token Reference:
 *   theme-color: var(--primary) mapped to #3A9FFB (Future), #B20685 (Cyber), #0066CC (Business)
 */
import * as React from 'react';
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router';

const logo16 = '/pwa/icon-128x128.png';
const logo32 = '/pwa/icon-128x128.png';
const logo48 = '/pwa/icon-72x72.png';
const logo72 = '/pwa/icon-72x72.png';
const logo96 = '/pwa/icon-96x96.png';
const logo180 = '/pwa/icon-192x192.png';
const logo512 = '/pwa/icon-512x512.png';

const THEME_COLORS: Record<string, { light: string; dark: string }> = {
  future: { light: '#3A9FFB', dark: '#1a1a2e' },
  cyber: { light: '#B20685', dark: '#0d0d1a' },
  business: { light: '#0066CC', dark: '#1a2332' },
};

function upsertMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const selector = extra?.sizes
    ? `link[rel="${rel}"][sizes="${extra.sizes}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Generate PWA manifest as a Blob URL */
function generateManifest(lang: string): string {
  const manifest = {
    name:
      lang === 'zh'
        ? '\u8a00\u8bedCloud\u00b3 \u8bbe\u8ba1\u7cfb\u7edf'
        : 'YanYu Cloud\u00b3 Design System',
    short_name: 'YYC\u00b3',
    description:
      lang === 'zh'
        ? '\u8a00\u8bedCloud \u8bbe\u8ba1\u7cfb\u7edf \u2014 \u4e94\u9ad8\u4e94\u6807\u4e94\u5316\u7ef4\u5ea6\u6a21\u578b\uff0c\u652f\u6301\u4e09\u5957\u4e3b\u9898\u5207\u6362'
        : 'YanYu Cloud Design System \u2014 Five-High/Five-Standard/Five-Implementation framework with 3 switchable themes',
    start_url: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#ffffff',
    theme_color: '#3A9FFB',
    lang: lang === 'zh' ? 'zh-CN' : 'en',
    dir: 'ltr',
    categories: ['design', 'development', 'utilities'],
    icons: [
      { src: logo48, sizes: '48x48', type: 'image/png', purpose: 'any' },
      { src: logo72, sizes: '72x72', type: 'image/png', purpose: 'any' },
      { src: logo96, sizes: '96x96', type: 'image/png', purpose: 'any' },
      { src: logo180, sizes: '180x180', type: 'image/png', purpose: 'any' },
      { src: logo512, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: lang === 'zh' ? '\u7ec4\u4ef6\u5e93' : 'Components',
        url: '/components',
        icons: [{ src: logo96, sizes: '96x96' }],
      },
      {
        name: lang === 'zh' ? '\u4ee4\u724c\u7ba1\u7406' : 'Token Manager',
        url: '/token-manager',
        icons: [{ src: logo96, sizes: '96x96' }],
      },
      {
        name: lang === 'zh' ? '\u6784\u5efa\u8bbe\u7f6e' : 'Build Settings',
        url: '/build-settings',
        icons: [{ src: logo96, sizes: '96x96' }],
      },
      {
        name: 'QA Dashboard',
        url: '/qa',
        icons: [{ src: logo96, sizes: '96x96' }],
      },
    ],
  };
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/manifest+json' });
  return URL.createObjectURL(blob);
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const { style, resolvedMode } = useTheme();
  const { lang } = useLanguage();
  const location = useLocation();

  // Set page title based on current route
  useEffect(() => {
    const base = lang === 'zh' ? 'YYC\u00b3 \u8a00\u8bedCloud' : 'YYC\u00b3 YanYu Cloud';
    const routeTitles: Record<string, { zh: string; en: string }> = {
      '/': { zh: '\u603b\u89c8', en: 'Overview' },
      '/components': { zh: '\u7ec4\u4ef6', en: 'Components' },
      '/playground': { zh: '\u5b9e\u9a8c\u5ba4', en: 'Playground' },
      '/tokens': { zh: '\u4ee4\u724c', en: 'Tokens' },
      '/token-manager': { zh: '\u4ee4\u724c\u7ba1\u7406', en: 'Token Manager' },
      '/build-settings': { zh: '\u6784\u5efa\u8bbe\u7f6e', en: 'Build Settings' },
      '/qa': { zh: 'QA \u4eea\u8868\u76d8', en: 'QA Dashboard' },
      '/system-settings': { zh: '\u7cfb\u7edf\u8bbe\u7f6e', en: 'System Settings' },
      '/alignment': { zh: '\u5bf9\u9f50\u6982\u89c8', en: 'Alignment' },
    };
    const route = routeTitles[location.pathname];
    const suffix = route ? ` | ${route[lang]}` : '';
    document.title = `${base}${suffix}`;
  }, [lang, location.pathname]);

  // Set favicon and apple-touch-icon
  useEffect(() => {
    // Favicon
    upsertLink('icon', logo32, { type: 'image/png', sizes: '32x32' });
    upsertLink('icon', logo16, { type: 'image/png', sizes: '16x16' });
    // Apple touch icon
    upsertLink('apple-touch-icon', logo180, { sizes: '180x180' });
  }, []);

  // Set theme-color meta
  useEffect(() => {
    const colors = THEME_COLORS[style] || THEME_COLORS.future;
    const color = resolvedMode === 'dark' ? colors.dark : colors.light;
    upsertMeta('theme-color', color);
    upsertMeta('msapplication-navbutton-color', color);
    upsertMeta(
      'apple-mobile-web-app-status-bar-style',
      resolvedMode === 'dark' ? 'black-translucent' : 'default'
    );
  }, [style, resolvedMode]);

  // PWA meta tags
  useEffect(() => {
    upsertMeta('mobile-web-app-capable', 'yes');
    upsertMeta('apple-mobile-web-app-capable', 'yes');
    upsertMeta('apple-mobile-web-app-title', 'YYC\u00b3');
    upsertMeta('application-name', 'YYC\u00b3 Design System');
    upsertMeta('msapplication-TileColor', '#3A9FFB');
    upsertMeta(
      'description',
      lang === 'zh'
        ? '\u8a00\u8bedCloud \u8bbe\u8ba1\u7cfb\u7edf \u2014 \u4e94\u9ad8\u4e94\u6807\u4e94\u5316\u7ef4\u5ea6\u6a21\u578b'
        : 'YanYu Cloud Design System \u2014 Five-High Framework'
    );
    // Open Graph
    upsertMeta('og:title', 'YYC\u00b3 Design System', 'property');
    upsertMeta('og:type', 'website', 'property');
    upsertMeta('og:image', logo512, 'property');
    upsertMeta(
      'og:description',
      lang === 'zh'
        ? '\u8a00\u8bedCloud \u8bbe\u8ba1\u7cfb\u7edf \u2014 \u4e94\u9ad8\u4e94\u6807\u4e94\u5316'
        : 'YanYu Cloud Design System',
      'property'
    );
  }, [lang]);

  // Manifest link (regenerate when lang changes)
  useEffect(() => {
    const manifestUrl = generateManifest(lang);
    upsertLink('manifest', manifestUrl);
    return () => URL.revokeObjectURL(manifestUrl);
  }, [lang]);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const swCode = `
// YYC³ Design System — Service Worker (Cache-First + Network-Fallback)
const CACHE_NAME = 'yyc3-design-system-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
`;
      const blob = new Blob([swCode], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(blob);

      navigator.serviceWorker
        .register(swUrl, { scope: '/' })
        .then((reg) => {
          console.warn('YYC\u00b3 SW registered:', reg.scope);
        })
        .catch(() => {
          // SW registration may fail in some environments; silent fallback
        });
    }
  }, []);

  return <>{children}</>;
}

// Export logo assets for use across the app
export { logo16, logo32, logo48, logo72, logo96, logo180, logo512 };
