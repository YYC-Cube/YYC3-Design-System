/**
 * @file XSS 防护模块
 * @description 提供 XSS 攻击防护和 HTML 清理功能
 * @module security/XSSProtection
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import React, { useMemo, useCallback, useRef } from 'react';

declare global {
  interface Window {
    DOMPurify?: {
      sanitize: (source: string, options?: object) => string;
      addHook: (hookName: string, callback: () => void) => void;
      removeHook: (hookName: string, callback: () => void) => void;
    };
  }
}

export interface XSSProtectionConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowedSchemes?: string[];
  allowedScriptHostnames?: string[];
  allowedScriptDomains?: string[];
  forceSafeDomain?: boolean;
  addTags?: string[];
  addAttributes?: Record<string, string[]>;
  removeAttributes?: string[];
  forbidTags?: string[];
  forbidAttributes?: string[];
  allowCustomElements?: boolean;
  allowComments?: boolean;
  allowUnknownMarkup?: boolean;
  forbidElements?: string[];
  ignoreMarkup?: string[];
}

export interface XSSContextType {
  sanitize: (html: string, config?: Partial<XSSProtectionConfig>) => Promise<string>;
  sanitizeDOM: (element: Element, config?: Partial<XSSProtectionConfig>) => Promise<void>;
  isSafe: (html: string) => Promise<boolean>;
  config: XSSProtectionConfig;
}

const DEFAULT_CONFIG: XSSProtectionConfig = {
  allowedTags: [
    'a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio',
    'b', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'canvas', 'caption',
    'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del',
    'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset',
    'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'header', 'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd',
    'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem',
    'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output',
    'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby',
    's', 'samp', 'section', 'select', 'small', 'source', 'span', 'strong',
    'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea',
    'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'u', 'ul', 'var', 'video',
    'wbr'
  ],
  allowedAttributes: {
    '*': ['class', 'id', 'style', 'title', 'lang', 'dir', 'aria-*', 'data-*'],
    'a': ['href', 'target', 'rel', 'type', 'hreflang', 'download', 'referrerpolicy'],
    'img': ['src', 'alt', 'width', 'height', 'loading', 'decoding', 'srcset', 'sizes'],
    'video': ['src', 'poster', 'preload', 'autoplay', 'loop', 'muted', 'controls', 'playsinline'],
    'audio': ['src', 'preload', 'autoplay', 'loop', 'muted', 'controls'],
    'iframe': ['src', 'width', 'height', 'name', 'allow', 'allowfullscreen', 'sandbox'],
    'input': ['type', 'name', 'value', 'placeholder', 'required', 'disabled', 'readonly', 'min', 'max', 'step', 'pattern'],
    'button': ['type', 'name', 'value', 'disabled', 'form'],
    'form': ['action', 'method', 'enctype', 'target', 'autocomplete'],
    'select': ['name', 'required', 'disabled', 'multiple', 'form'],
    'textarea': ['name', 'rows', 'cols', 'placeholder', 'required', 'disabled', 'readonly', 'form'],
    'link': ['rel', 'href', 'type', 'media', 'sizes', 'hreflang'],
    'meta': ['name', 'content', 'http-equiv', 'charset'],
    'source': ['src', 'type', 'media', 'sizes'],
    'track': ['src', 'kind', 'srclang', 'label', 'default'],
    'object': ['data', 'type', 'width', 'height', 'name'],
    'embed': ['src', 'type', 'width', 'height'],
    'col': ['span'],
    'colgroup': ['span'],
    'td': ['colspan', 'rowspan', 'headers'],
    'th': ['colspan', 'rowspan', 'scope', 'headers'],
    'time': ['datetime'],
    'data': ['value']
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data', 'sms', 'app', 'blob'],
  allowCustomElements: false,
  allowComments: false,
  allowUnknownMarkup: false
};

const loadDOMPurify = async (): Promise<Window['DOMPurify'] | null> => {
  if (typeof window !== 'undefined' && window.DOMPurify) {
    return window.DOMPurify;
  }
  
  try {
    const dompurify = await import('dompurify');
    const purify = (dompurify as { default?: Window['DOMPurify'] }).default || (dompurify as Window['DOMPurify']);
    return purify;
  } catch (error) {
    console.error('Failed to load DOMPurify:', error);
    return null;
  }
};

export const XSSContext = React.createContext<XSSContextType | undefined>(undefined);

export const XSSProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<XSSProtectionConfig>;
}> = ({ children, config = {} }) => {
  const currentConfig = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...config
  }), [config]);

  const purifyCache = useRef<Window['DOMPurify'] | null>(null);

  const getPurify = useCallback(async () => {
    if (!purifyCache.current) {
      purifyCache.current = await loadDOMPurify();
    }
    return purifyCache.current;
  }, []);

  const sanitize = useCallback(async (
    html: string,
    customConfig?: Partial<XSSProtectionConfig>
  ): Promise<string> => {
    const purify = await getPurify();
    if (!purify) {
      console.warn('DOMPurify not available, returning original HTML');
      return html;
    }

    const mergedConfig = customConfig ? {
      ...currentConfig,
      ...customConfig,
      allowedTags: [...currentConfig.allowedTags!, ...(customConfig.allowedTags || [])],
      allowedAttributes: {
        ...currentConfig.allowedAttributes,
        ...(customConfig.allowedAttributes || {})
      }
    } : currentConfig;

    return purify.sanitize(html, {
      ALLOWED_TAGS: mergedConfig.allowedTags,
      ALLOWED_ATTR: Object.values(mergedConfig.allowedAttributes!).flat(),
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data|app|blob):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
      WHOLE_DOCUMENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM_IMPORT: false,
      SANITIZE_DOM: true,
      SAFE_FOR_TEMPLATES: false,
      SAFE_FOR_JQUERY: true,
      KEEP_CONTENT: true,
      USE_PROFILES: { html: true, svg: true, svgFilters: true, mathMl: true },
      ADD_ATTR: mergedConfig.addAttributes ? Object.values(mergedConfig.addAttributes).flat() : [],
      ADD_TAGS: mergedConfig.addTags || [],
      FORBID_ATTR: mergedConfig.removeAttributes || [],
      FORBID_TAGS: mergedConfig.forbidTags || [],
      ALLOW_DATA_ATTR: true,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      SAFE_JQUERY: true,
      SANITIZE_NAMED_PROPS: true,
      HOOKS: {}
    });
  }, [currentConfig, getPurify]);

  const sanitizeDOM = useCallback(async (
    element: Element,
    customConfig?: Partial<XSSProtectionConfig>
  ): Promise<void> => {
    const purify = await getPurify();
    if (!purify) {
      console.warn('DOMPurify not available');
      return;
    }

    const html = element.outerHTML;
    const sanitized = await sanitize(html, customConfig);
    element.outerHTML = sanitized;
  }, [getPurify, sanitize]);

  const isSafe = useCallback(async (html: string): Promise<boolean> => {
    const sanitized = await sanitize(html);
    return sanitized === html;
  }, [sanitize]);

  const value = useMemo(() => ({
    sanitize,
    sanitizeDOM,
    isSafe,
    config: currentConfig
  }), [sanitize, sanitizeDOM, isSafe, currentConfig]);

  return (
    <XSSContext.Provider value={value}>
      {children}
    </XSSContext.Provider>
  );
};

export const useXSS = (): XSSContextType => {
  const context = React.useContext(XSSContext);
  if (!context) {
    throw new Error('useXSS must be used within an XSSProvider');
  }
  return context;
};

export const SafeHTML: React.FC<{
  html: string;
  className?: string;
  config?: Partial<XSSProtectionConfig>;
  as?: React.ElementType;
}> = ({ html, className, config, as: Component = 'div' }) => {
  const { sanitize } = useXSS();
  const [sanitizedHTML, setSanitizedHTML] = React.useState('');

  React.useEffect(() => {
    sanitize(html, config).then(setSanitizedHTML);
  }, [html, config, sanitize]);

  return React.createElement(Component, {
    className,
    dangerouslySetInnerHTML: { __html: sanitizedHTML }
  });
};

export const SafeInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  sanitizeOnInput?: boolean;
  maxLength?: number;
  allowedPattern?: RegExp;
}> = ({ value, onChange, sanitizeOnInput = true, maxLength, allowedPattern }) => {
  const { sanitize } = useXSS();
  const [localValue, setLocalValue] = React.useState(value);

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value;

    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.substring(0, maxLength);
    }

    if (allowedPattern && !allowedPattern.test(newValue)) {
      return;
    }

    if (sanitizeOnInput) {
      const sanitized = await sanitize(newValue);
      setLocalValue(sanitized);
      onChange(sanitized);
    } else {
      setLocalValue(newValue);
      onChange(newValue);
    }
  }, [sanitize, sanitizeOnInput, maxLength, allowedPattern, onChange]);

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      maxLength={maxLength}
    />
  );
};

export const createSafeURL = (url: string, allowedSchemes: string[] = ['http', 'https']): string | null => {
  try {
    const parsed = new URL(url);
    if (!allowedSchemes.includes(parsed.protocol.replace(':', ''))) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeURL = (url: string): string => {
  const safeURL = createSafeURL(url);
  return safeURL || 'about:blank';
};

export const escapeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

export const unescapeHTML = (html: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

export const sanitizeAttributeValue = (_attribute: string, value: string): string => {
  const dangerousPatterns = [
    /javascript:/i,
    /data:\s*text\/html/i,
    /vbscript:/i,
    /on\w+\s*=/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(value)) {
      return '';
    }
  }

  return value;
};

export const createXSSHook = () => {
  const originalCreateElement = document.createElement.bind(document);
  const originalSetAttribute = Element.prototype.setAttribute.bind(Element.prototype);

  return {
    enable: () => {
      document.createElement = function(tagName: string, options?: { is?: string }) {
        const element = originalCreateElement(tagName, options);
        
        if (tagName.toLowerCase() === 'script') {
          element.addEventListener('beforescriptexecute', (e: Event) => {
            e.preventDefault();
            console.warn('Blocked inline script execution');
          });
        }
        
        return element;
      };

      Element.prototype.setAttribute = function(this: Element, name: string, value: string) {
        const sanitized = sanitizeAttributeValue(name, value);
        originalSetAttribute.call(this, name, sanitized);
      };
    },
    disable: () => {
      document.createElement = originalCreateElement;
      Element.prototype.setAttribute = originalSetAttribute;
    }
  };
};

export const withXSSProtection = <P extends object>(
  Component: React.ComponentType<P>,
  config?: Partial<XSSProtectionConfig>
) => {
  const WrappedComponent = (props: P) => (
    <XSSProvider config={config}>
      <Component {...props} />
    </XSSProvider>
  );
  
  WrappedComponent.displayName = `withXSSProtection(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export const createStrictConfig = (): XSSProtectionConfig => ({
  ...DEFAULT_CONFIG,
  allowedTags: [
    'p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'
  ],
  allowedAttributes: {
    'a': ['href']
  },
  allowedSchemes: ['https', 'mailto']
});

export const createModerateConfig = (): XSSProtectionConfig => DEFAULT_CONFIG;

export const createPermissiveConfig = (): XSSProtectionConfig => ({
  ...DEFAULT_CONFIG,
  allowCustomElements: true,
  allowComments: true,
  allowUnknownMarkup: true
});

export default {
  XSSProvider,
  useXSS,
  SafeHTML,
  SafeInput,
  createSafeURL,
  validateURL,
  sanitizeURL,
  escapeHTML,
  unescapeHTML,
  sanitizeAttributeValue,
  createXSSHook,
  withXSSProtection,
  createStrictConfig,
  createModerateConfig,
  createPermissiveConfig
};
