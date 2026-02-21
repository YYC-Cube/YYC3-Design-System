/**
 * @file CSP Provider 组件
 * @description 内容安全策略提供者，保护应用免受 XSS 攻击
 * @module security/CSPProvider
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';

interface ExtendedSecurityPolicyViolationEvent extends SecurityPolicyViolationEvent {
  sourceFile?: string;
  sourceURI?: string;
}

export interface CSPConfig {
  'default-src'?: string;
  'script-src'?: string;
  'style-src'?: string;
  'img-src'?: string;
  'font-src'?: string;
  'connect-src'?: string;
  'media-src'?: string;
  'object-src'?: string;
  'frame-src'?: string;
  'base-uri'?: string;
  'form-action'?: string;
  'frame-ancestors'?: string;
  'report-uri'?: string;
  'report-to'?: string;
  'require-trusted-types-for'?: string;
  'trusted-types'?: string;
  'upgrade-insecure-requests'?: boolean;
  'block-all-mixed-content'?: boolean;
  [key: string]: string | boolean | undefined;
}

export interface CSPProviderProps {
  children: React.ReactNode;
  config?: Partial<CSPConfig>;
  nonce?: string;
  reportOnly?: boolean;
  enabled?: boolean;
  onViolation?: (violation: CSPViolationReport) => void;
}

export interface SecurityPolicyViolationEvent extends Event {
  blockedURI?: string;
  columnNumber?: number;
  disposition?: string;
  documentURI?: string;
  effectiveDirective?: string;
  lineNumber?: number;
  originalPolicy?: string;
  referrer?: string;
  sample?: string;
  statusCode?: number;
  violatedDirective?: string;
}

export interface CSPViolationReport {
  'csp-report': {
    'document-uri'?: string;
    'referrer'?: string;
    'blocked-uri'?: string;
    'violated-directive'?: string;
    'effective-directive'?: string;
    'original-policy'?: string;
    'disposition'?: string;
    'script-sample'?: string;
    'status-code'?: number;
    'source-file'?: string;
    'line-number'?: number;
    'column-number'?: number;
  };
}

interface CSPContextType {
  nonce?: string;
  config: CSPConfig;
  enabled: boolean;
  updateConfig: (config: Partial<CSPConfig>) => void;
}

const CSPContext = createContext<CSPContextType | undefined>(undefined);

const DEFAULT_CSP_CONFIG: CSPConfig = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https:",
  'style-src': "'self' 'unsafe-inline' https:",
  'img-src': "'self' data: https: http:",
  'font-src': "'self' data: https:",
  'connect-src': "'self' https: wss:",
  'media-src': "'self' https:",
  'object-src': "'none'",
  'frame-src': "'self' https:",
  'base-uri': "'self'",
  'form-action': "'self'",
  'frame-ancestors': "'none'",
  'require-trusted-types-for': "'script'",
  'trusted-types': '*'
};

const generateCSPMetaTag = (config: CSPConfig, nonce?: string): string => {
  const directives: string[] = [];
  
  for (const [directive, value] of Object.entries(config)) {
    if (value === true) {
      directives.push(directive);
    } else if (value !== undefined && value !== false) {
      directives.push(`${directive} ${value}`);
    }
  }
  
  if (nonce) {
    directives.push(`script-src 'nonce-${nonce}'`);
  }
  
  return directives.join('; ');
};

export const CSPProvider: React.FC<CSPProviderProps> = ({
  children,
  config = {},
  nonce,
  reportOnly = false,
  enabled = true,
  onViolation
}) => {
  const [currentConfig, setCurrentConfig] = React.useState<CSPConfig>({ ...DEFAULT_CSP_CONFIG, ...config });
  
  const updateConfig = useCallback((newConfig: Partial<CSPConfig>) => {
    setCurrentConfig(prev => ({ ...prev, ...newConfig }));
  }, []);
  
  const contextValue = useMemo(() => ({
    nonce,
    config: currentConfig,
    enabled,
    updateConfig
  }), [nonce, currentConfig, enabled, updateConfig]);
  
  useEffect(() => {
    if (!enabled) return;
    
    const cspContent = generateCSPMetaTag(currentConfig, nonce);
    const httpEquiv = reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
    
    let metaTag: HTMLMetaElement | null = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('http-equiv', httpEquiv);
      document.head.appendChild(metaTag);
    }
    
    metaTag.setAttribute('content', cspContent);
    
    return () => {
      if (metaTag && metaTag.parentNode) {
        metaTag.parentNode.removeChild(metaTag);
      }
    };
  }, [currentConfig, nonce, reportOnly, enabled]);
  
  useEffect(() => {
    if (!onViolation || !enabled) return;
    
    const handleViolation = (event: Event) => {
      const violation = event as SecurityPolicyViolationEvent;
      
      const report: CSPViolationReport = {
        'csp-report': {
          'document-uri': violation.documentURI,
          'referrer': violation.referrer,
          'blocked-uri': violation.blockedURI,
          'violated-directive': violation.violatedDirective,
          'effective-directive': violation.effectiveDirective,
          'original-policy': violation.originalPolicy,
          'disposition': violation.disposition,
          'script-sample': violation.sample,
          'status-code': violation.statusCode,
          'source-file': (violation as ExtendedSecurityPolicyViolationEvent).sourceFile || (violation as ExtendedSecurityPolicyViolationEvent).sourceURI || '',
          'line-number': violation.lineNumber,
          'column-number': violation.columnNumber,
        },
      };
      
      onViolation(report);
      
      console.warn('CSP Violation detected:', violation);
    };
    
    document.addEventListener('securitypolicyviolation', handleViolation);
    
    return () => {
      document.removeEventListener('securitypolicyviolation', handleViolation);
    };
  }, [onViolation, enabled]);
  
  return (
    <CSPContext.Provider value={contextValue}>
      {children}
    </CSPContext.Provider>
  );
};

export const useCSP = (): CSPContextType => {
  const context = useContext(CSPContext);
  if (!context) {
    throw new Error('useCSP must be used within a CSPProvider');
  }
  return context;
};

export const CSPScript: React.FC<React.HTMLAttributes<HTMLScriptElement>> = ({ children, ...props }) => {
  const { nonce, enabled } = useCSP();
  
  if (!enabled || !nonce) {
    return <script {...props}>{children}</script>;
  }
  
  return (
    <script nonce={nonce} {...props}>
      {children}
    </script>
  );
};

export const CSPStyle: React.FC<React.HTMLAttributes<HTMLStyleElement>> = ({ children, ...props }) => {
  const { nonce, enabled } = useCSP();
  
  if (!enabled || !nonce) {
    return <style {...props}>{children}</style>;
  }
  
  return (
    <style nonce={nonce} {...props}>
      {children}
    </style>
  );
};

export const CSPImg: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ ...props }) => {
  const { config, enabled } = useCSP();
  
  if (!enabled) {
    return <img {...props} />;
  }
  
  const imgSrc = props.src;
  const allowedDomains = config['img-src'] || '';
  
  if (imgSrc && !isURLAllowed(imgSrc, allowedDomains)) {
    console.warn(`Image source ${imgSrc} may not be allowed by CSP`);
  }
  
  return <img {...props} />;
};

const isURLAllowed = (url: string, cspDirective: string): boolean => {
  if (cspDirective.includes("'self'") && (url.startsWith('/') || url.startsWith(window.location.origin))) {
    return true;
  }
  
  if (cspDirective.includes('data:') && url.startsWith('data:')) {
    return true;
  }
  
  const httpsAllowed = cspDirective.includes('https:');
  const httpAllowed = cspDirective.includes('http:');
  
  if ((httpsAllowed && url.startsWith('https://')) || (httpAllowed && url.startsWith('http://'))) {
    return true;
  }
  
  return false;
};

export const createStrictCSPConfig = (): CSPConfig => ({
  'default-src': "'self'",
  'script-src': "'self' 'nonce-{nonce}'",
  'style-src': "'self' 'nonce-{nonce}'",
  'img-src': "'self' data: https:",
  'font-src': "'self' data: https:",
  'connect-src': "'self' https: wss:",
  'media-src': "'self'",
  'object-src': "'none'",
  'frame-src': "'none'",
  'base-uri': "'self'",
  'form-action': "'self'",
  'frame-ancestors': "'none'",
  'upgrade-insecure-requests': true,
  'block-all-mixed-content': true
});

export const createModerateCSPConfig = (): CSPConfig => ({
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https:",
  'style-src': "'self' 'unsafe-inline' https:",
  'img-src': "'self' data: https: http:",
  'font-src': "'self' data: https:",
  'connect-src': "'self' https: wss:",
  'media-src': "'self' https:",
  'object-src': "'none'",
  'frame-src': "'self' https:",
  'base-uri': "'self'",
  'form-action': "'self'",
  'frame-ancestors': "'self'"
});

export const createPermissiveCSPConfig = (): CSPConfig => ({
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https: http:",
  'style-src': "'self' 'unsafe-inline' https: http:",
  'img-src': "'self' data: https: http: blob:",
  'font-src': "'self' data: https: http:",
  'connect-src': "'self' https: http: wss: ws:",
  'media-src': "'self' https: http:",
  'object-src': "'none'",
  'frame-src': "'self' https: http:",
  'base-uri': "'self'",
  'form-action': "'self'"
});

export const generateNonce = (): string => {
  return window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
};

export const withCSP = <P extends object>(
  Component: React.ComponentType<P>,
  config?: Partial<CSPConfig>
) => {
  const WrappedComponent = (props: P) => (
    <CSPProvider config={config}>
      <Component {...props} />
    </CSPProvider>
  );
  
  WrappedComponent.displayName = `withCSP(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default {
  CSPProvider,
  useCSP,
  CSPScript,
  CSPStyle,
  CSPImg,
  createStrictCSPConfig,
  createModerateCSPConfig,
  createPermissiveCSPConfig,
  generateNonce,
  withCSP
};
