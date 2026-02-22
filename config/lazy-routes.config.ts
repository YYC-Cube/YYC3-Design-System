/**
 * @file 路由懒加载配置
 * @description 演示如何实现路由级别的代码分割和懒加载
 * @module config/lazy-routes
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import { lazy, Suspense } from 'react';

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  preload?: () => void;
}

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#f8fafc',
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '5px solid #e2e8f0',
      borderTop: '5px solid #d45a5f',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
  </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div style={{
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    margin: '2rem',
  }}>
    <h2 style={{ color: '#991b1b', marginBottom: '1rem' }}>
      页面加载失败
    </h2>
    <p style={{ color: '#7f1d1d', marginBottom: '1rem' }}>
      {error.message}
    </p>
    <button
      onClick={resetErrorBoundary}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#dc2626',
        color: '#ffffff',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
      }}
    >
      重新加载
    </button>
  </div>
);

const LazyButton = lazy(() => import('../components/Button').then(m => ({ default: m.Button })));
const LazyCard = lazy(() => import('../components/Card').then(m => ({ default: m.Card })));
const LazyModal = lazy(() => import('../components/Modal').then(m => ({ default: m.Modal })));
const LazyInput = lazy(() => import('../components/Input').then(m => ({ default: m.Input })));
const LazyAlert = lazy(() => import('../components/Alert').then(m => ({ default: m.Alert })));
const LazyTabs = lazy(() => import('../components/Tabs').then(m => ({ default: m.Tabs })));
const LazyTokenPlayground = lazy(() => import('../components/TokenPlayground'));
const LazyAIColorRecommender = lazy(() => import('../components/AIColorRecommender'));
const LazyAIConsistencyChecker = lazy(() => import('../components/AIConsistencyChecker'));
const LazyAIUsageAnalyzer = lazy(() => import('../components/AIUsageAnalyzer'));
const LazyAIBestPractices = lazy(() => import('../components/AIBestPractices'));
const LazyAITokenGenerator = lazy(() => import('../components/AITokenGenerator'));
const LazyPerformanceDashboard = lazy(() => import('../components/PerformanceDashboard'));

export const lazyRoutes: RouteConfig[] = [
  {
    path: '/',
    component: lazy(() => import('../components/Button').then(m => ({ default: () => (
      <div style={{ padding: '2rem' }}>
        <h1>欢迎使用 YYC³ Design System</h1>
        <p>这是一个设计系统示例页面</p>
      </div>
    )})),
    exact: true,
    preload: () => {
      import('../components/Button');
    },
  },
  {
    path: '/components',
    component: lazy(() => import('../components/Button').then(m => ({ default: () => (
      <div style={{ padding: '2rem' }}>
        <h1>组件库</h1>
        <p>所有可用组件的列表</p>
      </div>
    )})),
  },
  {
    path: '/tokens',
    component: lazy(() => import('../components/TokenPlayground')),
    preload: () => {
      import('../components/TokenPlayground');
    },
  },
  {
    path: '/ai/colors',
    component: LazyAIColorRecommender,
    preload: () => {
      import('../components/AIColorRecommender');
    },
  },
  {
    path: '/ai/consistency',
    component: LazyAIConsistencyChecker,
    preload: () => {
      import('../components/AIConsistencyChecker');
    },
  },
  {
    path: '/ai/usage',
    component: LazyAIUsageAnalyzer,
    preload: () => {
      import('../components/AIUsageAnalyzer');
    },
  },
  {
    path: '/ai/best-practices',
    component: LazyAIBestPractices,
    preload: () => {
      import('../components/AIBestPractices');
    },
  },
  {
    path: '/ai/tokens',
    component: LazyAITokenGenerator,
    preload: () => {
      import('../components/AITokenGenerator');
    },
  },
  {
    path: '/performance',
    component: LazyPerformanceDashboard,
    preload: () => {
      import('../components/PerformanceDashboard');
    },
  },
];

export const createRouteComponent = (route: RouteConfig): React.ComponentType => {
  const RouteComponent = route.component;

  return () => (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <RouteComponent />
      </ErrorBoundary>
    </Suspense>
  );
};

export const preloadRoute = (path: string): void => {
  const route = lazyRoutes.find(r => r.path === path);
  if (route && route.preload) {
    route.preload();
  }
};

export const preloadAllRoutes = (): void => {
  lazyRoutes.forEach(route => {
    if (route.preload) {
      route.preload();
    }
  });
};

export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return lazyRoutes.find(route => {
    if (route.exact) {
      return route.path === path;
    }
    return path.startsWith(route.path);
  });
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; FallbackComponent: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>; onReset: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] 捕获到错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { FallbackComponent, onReset } = this.props;
      return <FallbackComponent error={this.state.error!} resetErrorBoundary={onReset} />;
    }

    return this.props.children;
  }
}

export default {
  lazyRoutes,
  createRouteComponent,
  preloadRoute,
  preloadAllRoutes,
  getRouteByPath,
};
