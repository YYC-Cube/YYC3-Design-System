/**
 * @file CSRF 防护模块
 * @description 提供跨站请求伪造防护功能
 * @module security/CSRFProtection
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

type CSRFRequestBody = string | Document | Blob | ArrayBuffer | FormData | URLSearchParams | null;

export interface CSRFToken {
  value: string;
  expires: number;
  headerName: string;
  parameterName: string;
}

export interface CSRFConfig {
  tokenName?: string;
  headerName?: string;
  parameterName?: string;
  tokenLength?: number;
  expirationTime?: number;
  storageType?: 'memory' | 'session' | 'local' | 'cookie';
  regenerateOnLoad?: boolean;
  doubleSubmitCookie?: boolean;
  requireSamesite?: 'strict' | 'lax' | 'none';
  requireSecure?: boolean;
  allowMethodOverride?: string[];
  ignorePaths?: string[];
  customValidator?: (token: string) => boolean;
  onTokenExpiry?: () => void;
  onValidationError?: (error: CSRFValidationError) => void;
}

export interface CSRFValidationError {
  type: 'missing_token' | 'invalid_token' | 'expired_token' | 'mismatch';
  token?: string;
  expected?: string;
  message: string;
  timestamp: number;
}

export interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: BodyInit | null;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal | null;
}

type BodyInit =
  | Blob
  | ArrayBuffer
  | ArrayBufferView
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | string;
type RequestCache =
  | 'default'
  | 'force-cache'
  | 'no-cache'
  | 'no-store'
  | 'only-if-cached'
  | 'reload';
type RequestCredentials = 'include' | 'omit' | 'same-origin';
type RequestMode = 'cors' | 'navigate' | 'no-cors' | 'same-origin';
type RequestRedirect = 'error' | 'follow' | 'manual';
type ReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

export interface CSRFContextType {
  token: string | null;
  generateToken: () => Promise<string>;
  validateToken: (token: string) => boolean;
  refreshTokens: () => void;
  clearTokens: () => void;
  addToRequest: (request: RequestConfig) => RequestConfig;
  addToForm: (form: HTMLFormElement) => void;
  addToURL: (url: string) => string;
  config: CSRFConfig;
}

const CSRFContext = createContext<CSRFContextType | undefined>(undefined);

const DEFAULT_CONFIG: CSRFConfig = {
  tokenName: 'csrf-token',
  headerName: 'X-CSRF-Token',
  parameterName: 'csrf_token',
  tokenLength: 32,
  expirationTime: 3600000,
  storageType: 'memory',
  regenerateOnLoad: true,
  doubleSubmitCookie: true,
  requireSamesite: 'strict',
  requireSecure: true,
  allowMethodOverride: ['GET', 'HEAD', 'OPTIONS', 'TRACE'],
  ignorePaths: [],
};

const generateRandomToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const CSRFProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<CSRFConfig>;
  serverEndpoint?: string;
}> = ({ children, config = {}, serverEndpoint }) => {
  const currentConfig = useRef<CSRFConfig>({ ...DEFAULT_CONFIG, ...config });
  const [token, setToken] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Map<string, CSRFToken>>(new Map());
  const tokenRef = useRef<string | null>(null);

  const generateToken = useCallback(async (): Promise<string> => {
    if (serverEndpoint) {
      try {
        const response = await fetch(serverEndpoint, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const newToken = data.token || data.csrf_token;
          setToken(newToken);
          tokenRef.current = newToken;
          return newToken;
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token from server:', error);
      }
    }

    const newToken = generateRandomToken(currentConfig.current.tokenLength);
    const expires = Date.now() + currentConfig.current.expirationTime!;

    setToken(newToken);
    tokenRef.current = newToken;

    const tokenData: CSRFToken = {
      value: newToken,
      expires,
      headerName: currentConfig.current.headerName!,
      parameterName: currentConfig.current.parameterName!,
    };

    setTokens((prev) => new Map(prev).set(newToken, tokenData));

    return newToken;
  }, [serverEndpoint]);

  const validateToken = useCallback(
    (inputToken: string): boolean => {
      if (!inputToken) {
        const error: CSRFValidationError = {
          type: 'missing_token',
          message: 'CSRF token is missing',
          timestamp: Date.now(),
        };
        currentConfig.current.onValidationError?.(error);
        return false;
      }

      const tokenData = tokens.get(inputToken);

      if (!tokenData) {
        const error: CSRFValidationError = {
          type: 'invalid_token',
          token: inputToken,
          message: 'CSRF token is invalid',
          timestamp: Date.now(),
        };
        currentConfig.current.onValidationError?.(error);
        return false;
      }

      if (Date.now() > tokenData.expires) {
        const error: CSRFValidationError = {
          type: 'expired_token',
          token: inputToken,
          message: 'CSRF token has expired',
          timestamp: Date.now(),
        };
        currentConfig.current.onValidationError?.(error);
        currentConfig.current.onTokenExpiry?.();
        return false;
      }

      if (tokenData.value !== inputToken) {
        const error: CSRFValidationError = {
          type: 'mismatch',
          token: inputToken,
          expected: tokenData.value,
          message: 'CSRF token does not match',
          timestamp: Date.now(),
        };
        currentConfig.current.onValidationError?.(error);
        return false;
      }

      if (currentConfig.current.customValidator) {
        return currentConfig.current.customValidator(inputToken);
      }

      return true;
    },
    [tokens]
  );

  const refreshTokens = useCallback(() => {
    generateToken();
  }, [generateToken]);

  const clearTokens = useCallback(() => {
    setToken(null);
    tokenRef.current = null;
    setTokens(new Map());
  }, []);

  const addToRequest = useCallback(
    (request: RequestConfig): RequestConfig => {
      const currentToken = tokenRef.current || token;
      if (!currentToken) return request;

      return {
        ...request,
        headers: {
          ...request.headers,
          [currentConfig.current.headerName!]: currentToken,
        },
      };
    },
    [token]
  );

  const addToForm = useCallback(
    (form: HTMLFormElement): void => {
      const currentToken = tokenRef.current || token;
      if (!currentToken) return;

      let input = form.querySelector(
        `input[name="${currentConfig.current.parameterName}"]`
      ) as HTMLInputElement;

      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = currentConfig.current.parameterName!;
        form.appendChild(input);
      }

      input.value = currentToken;
    },
    [token]
  );

  const addToURL = useCallback(
    (url: string): string => {
      const currentToken = tokenRef.current || token;
      if (!currentToken) return url;

      try {
        const urlObj = new URL(url, window.location.origin);
        urlObj.searchParams.set(currentConfig.current.parameterName!, currentToken);
        return urlObj.toString();
      } catch {
        return url;
      }
    },
    [token]
  );

  const contextValue: CSRFContextType = {
    token,
    generateToken,
    validateToken,
    refreshTokens,
    clearTokens,
    addToRequest,
    addToForm,
    addToURL,
    config: currentConfig.current,
  };

  useEffect(() => {
    if (currentConfig.current.regenerateOnLoad) {
      generateToken();
    }
  }, [generateToken]);

  useEffect(() => {
    if (currentConfig.current.storageType === 'session') {
      sessionStorage.setItem(currentConfig.current.tokenName!, token || '');
    } else if (currentConfig.current.storageType === 'local') {
      localStorage.setItem(currentConfig.current.tokenName!, token || '');
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let needsRefresh = false;

      tokens.forEach((tokenData, tokenKey) => {
        if (now > tokenData.expires) {
          setTokens((prev) => {
            const next = new Map(prev);
            next.delete(tokenKey);
            return next;
          });
          needsRefresh = true;
        }
      });

      if (needsRefresh) {
        generateToken();
      }
    }, currentConfig.current.expirationTime! / 2);

    return () => clearInterval(interval);
  }, [tokens, generateToken]);

  return <CSRFContext.Provider value={contextValue}>{children}</CSRFContext.Provider>;
};

export const useCSRF = (): CSRFContextType => {
  const context = useContext(CSRFContext);
  if (!context) {
    throw new Error('useCSRF must be used within a CSRFProvider');
  }
  return context;
};

export const CSRFProtectedForm: React.FC<
  {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    action?: string;
    className?: string;
  } & React.FormHTMLAttributes<HTMLFormElement>
> = ({ children, onSubmit, method = 'POST', action, className, ...props }) => {
  const { addToForm } = useCSRF();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      addToForm(formRef.current);
    }
  }, [addToForm]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit(e);
    },
    [onSubmit]
  );

  return (
    <form
      ref={formRef}
      method={method}
      action={action}
      onSubmit={handleSubmit}
      className={className}
      {...props}
    >
      {children}
    </form>
  );
};

export const CSRFProtectedFetch = async (
  url: string,
  options: RequestConfig = {},
  csrfContext: CSRFContextType
): Promise<Response> => {
  const protectedOptions = csrfContext.addToRequest(options);
  return fetch(url, protectedOptions as RequestInit);
};

export const withCSRFProtection = <P extends object>(
  Component: React.ComponentType<P>,
  config?: Partial<CSRFConfig>
) => {
  const WrappedComponent = (props: P) => (
    <CSRFProvider config={config}>
      <Component {...props} />
    </CSRFProvider>
  );

  WrappedComponent.displayName = `withCSRFProtection(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export const createCSRFMiddleware = (csrfContext: CSRFContextType) => {
  return {
    fetch: (url: string, options?: RequestConfig): Promise<Response> => {
      return CSRFProtectedFetch(url, options || {}, csrfContext);
    },
    XMLHttpRequest: () => {
      const xhr = new XMLHttpRequest();
      const originalOpen = xhr.open.bind(xhr);
      const originalSetRequestHeader = xhr.setRequestHeader.bind(xhr);

      xhr.open = function (
        method: string,
        url: string | URL,
        async?: boolean,
        user?: string | null,
        password?: string | null
      ) {
        let urlStr: string;
        if (typeof url === 'string') {
          urlStr = url;
        } else {
          urlStr = url.toString();
        }
        return originalOpen(method, urlStr, async ?? true, user ?? null, password ?? null);
      };

      xhr.setRequestHeader = function (name: string, value: string) {
        return originalSetRequestHeader(name, value);
      };

      const originalSend = xhr.send.bind(xhr);
      xhr.send = function (body?: CSRFRequestBody) {
        const token = csrfContext.token;
        if (token) {
          this.setRequestHeader(csrfContext.config.headerName!, token);
        }
        return originalSend(body ?? null);
      };

      return xhr;
    },
  };
};

export const validateCSRFToken = (
  request: Request,
  token: string | null,
  config: CSRFConfig
): boolean => {
  const method = request.method.toUpperCase();
  const safeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];

  if (safeMethods.includes(method)) {
    return true;
  }

  if (!token) {
    return false;
  }

  const headerToken = request.headers.get(config.headerName!);
  const url = new URL(request.url);
  const paramToken = url.searchParams.get(config.parameterName!);

  return headerToken === token || paramToken === token;
};

export const createStrictConfig = (): Partial<CSRFConfig> => ({
  tokenLength: 64,
  expirationTime: 1800000,
  requireSamesite: 'strict',
  requireSecure: true,
  doubleSubmitCookie: true,
  regenerateOnLoad: true,
  storageType: 'session',
});

export const createModerateConfig = (): Partial<CSRFConfig> => ({
  tokenLength: 32,
  expirationTime: 3600000,
  requireSamesite: 'lax',
  requireSecure: true,
  doubleSubmitCookie: true,
  regenerateOnLoad: false,
  storageType: 'memory',
});

export const createPermissiveConfig = (): Partial<CSRFConfig> => ({
  tokenLength: 16,
  expirationTime: 7200000,
  requireSamesite: 'lax',
  requireSecure: false,
  doubleSubmitCookie: false,
  regenerateOnLoad: false,
  storageType: 'local',
});

export default {
  CSRFProvider,
  useCSRF,
  CSRFProtectedForm,
  CSRFProtectedFetch,
  withCSRFProtection,
  createCSRFMiddleware,
  validateCSRFToken,
  createStrictConfig,
  createModerateConfig,
  createPermissiveConfig,
};
