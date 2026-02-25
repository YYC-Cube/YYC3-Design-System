export function preloadResource(url: string, type: 'script' | 'style' | 'image' | 'font' = 'script'): void {
  if (typeof document === 'undefined') return;

  if (type === 'script') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = url;
    document.head.appendChild(link);
  } else if (type === 'style') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = url;
    document.head.appendChild(link);
  } else if (type === 'image') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  } else if (type === 'font') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = url;
    document.head.appendChild(link);
  }
}

export function preloadResources(resources: Array<{ url: string; type: 'script' | 'style' | 'image' | 'font' }>): void {
  resources.forEach(resource => {
    preloadResource(resource.url, resource.type);
  });
}

export function preloadCriticalResources(resources: Array<{ url: string; type: 'script' | 'style' | 'image' | 'font' }>): void {
  preloadResources(resources);
}

export function preconnect(url: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  document.head.appendChild(link);
}

export function preconnectOrigins(urls: string[]): void {
  urls.forEach(url => preconnect(url));
}

export function prefetch(url: string, type: 'script' | 'style' | 'image' | 'font' = 'script'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

export function prefetchResources(resources: Array<{ url: string; type: 'script' | 'style' | 'image' | 'font' }>): void {
  resources.forEach(resource => {
    prefetch(resource.url, resource.type);
  });
}

export function preloadScript(url: string): void {
  preloadResource(url, 'script');
}

export function preloadStyle(url: string): void {
  preloadResource(url, 'style');
}

export function preloadImage(url: string): void {
  preloadResource(url, 'image');
}

export function preloadFont(url: string): void {
  preloadResource(url, 'font');
}

export function isPreloaded(url: string): boolean {
  if (typeof document === 'undefined') return false;

  const links = document.querySelectorAll(`link[href="${url}"]`);
  return links.length > 0;
}

export function isPreconnected(url: string): boolean {
  if (typeof document === 'undefined') return false;

  const links = document.querySelectorAll(`link[href="${url}"][rel="preconnect"]`);
  return links.length > 0;
}

export function isPrefetched(url: string): boolean {
  if (typeof document === 'undefined') return false;

  const links = document.querySelectorAll(`link[href="${url}"][rel="prefetch"]`);
  return links.length > 0;
}

const preloadedResources = new Set<string>();

export function clearAllResources(): void {
  preloadedResources.clear();
}

export function getResourcePreloaderStats(): { count: number } {
  return {
    count: preloadedResources.size,
  };
}

export function generatePreloadHints(): string[] {
  return Array.from(preloadedResources);
}
