/**
 * @file 资源预加载示例组件
 * @description 演示资源预加载、预连接和预取的使用
 * @module components/ResourcePreloadingExample
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';
import {
  preloadResource,
  preloadResources,
  preloadCriticalResources,
  preconnect,
  preconnectOrigins,
  prefetch,
  prefetchResources,
  preloadScript,
  preloadStyle,
  preloadImage,
  preloadFont,
  preloadDocument,
  preloadFetch,
  preloadWorker,
  isPreloaded,
  isPreconnected,
  isPrefetched,
  isLoading,
  clearAllResources,
  getResourcePreloaderStats,
  generatePreloadHints,
} from '../utils/resource-preloader';

export interface ResourcePreloadingExampleProps {
  className?: string;
}

export const ResourcePreloadingExample: React.FC<ResourcePreloadingExampleProps> = ({
  className = '',
}) => {
  const [preloading, setPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState({ loaded: 0, total: 0 });
  const [resourceStats, setResourceStats] = useState({
    preloadedCount: 0,
    preconnectedCount: 0,
    prefetchedCount: 0,
    loadingCount: 0,
  });
  const [preloadHints, setPreloadHints] = useState('');
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [resourceStatus, setResourceStatus] = useState<{
    preloaded: boolean;
    preconnected: boolean;
    prefetched: boolean;
    loading: boolean;
  }>({
    preloaded: false,
    preconnected: false,
    prefetched: false,
    loading: false,
  });

  const sampleResources = [
    {
      url: 'https://cdn.example.com/js/app.js',
      type: 'script' as const,
      priority: 'high' as const,
      critical: true,
    },
    {
      url: 'https://cdn.example.com/css/styles.css',
      type: 'style' as const,
      priority: 'high' as const,
      critical: true,
    },
    {
      url: 'https://cdn.example.com/images/logo.png',
      type: 'image' as const,
      priority: 'auto' as const,
      critical: false,
    },
    {
      url: 'https://cdn.example.com/fonts/inter.woff2',
      type: 'font' as const,
      priority: 'high' as const,
      critical: true,
    },
    {
      url: 'https://cdn.example.com/data/config.json',
      type: 'fetch' as const,
      priority: 'low' as const,
      critical: false,
    },
    {
      url: 'https://cdn.example.com/worker/service-worker.js',
      type: 'worker' as const,
      priority: 'low' as const,
      critical: false,
    },
  ];

  const sampleOrigins = [
    { href: 'https://cdn.example.com', crossOrigin: 'anonymous' as const },
    { href: 'https://api.example.com', crossOrigin: 'anonymous' as const },
    { href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' as const },
  ];

  useEffect(() => {
    const stats = getResourcePreloaderStats();
    setResourceStats(stats);

    const hints = generatePreloadHints(sampleResources, sampleOrigins);
    setPreloadHints(hints);
  }, []);

  const handlePreloadSingle = useCallback(async () => {
    setPreloading(true);
    try {
      await preloadResource(sampleResources[0].url, sampleResources[0].type, {
        priority: sampleResources[0].priority,
        timeout: 10000,
      });
      const stats = getResourcePreloaderStats();
      setResourceStats(stats);
    } catch (error) {
      console.error('资源预加载失败:', error);
    } finally {
      setPreloading(false);
    }
  }, []);

  const handlePreloadBatch = useCallback(async () => {
    setPreloading(true);
    try {
      await preloadResources(sampleResources, {
        concurrent: 3,
      });
      const stats = getResourcePreloaderStats();
      setResourceStats(stats);
    } catch (error) {
      console.error('批量资源预加载失败:', error);
    } finally {
      setPreloading(false);
    }
  }, []);

  const handlePreloadCritical = useCallback(async () => {
    setPreloading(true);
    try {
      await preloadCriticalResources(sampleResources);
      const stats = getResourcePreloaderStats();
      setResourceStats(stats);
    } catch (error) {
      console.error('关键资源预加载失败:', error);
    } finally {
      setPreloading(false);
    }
  }, []);

  const handlePreloadWithProgress = useCallback(async () => {
    setPreloading(true);
    setPreloadProgress({ loaded: 0, total: sampleResources.length });
    try {
      await preloadResources(sampleResources, {
        concurrent: 2,
        onProgress: (loaded, total) => {
          setPreloadProgress({ loaded, total });
        },
      });
      const stats = getResourcePreloaderStats();
      setResourceStats(stats);
    } catch (error) {
      console.error('带进度资源预加载失败:', error);
    } finally {
      setPreloading(false);
    }
  }, []);

  const handlePreconnect = useCallback(() => {
    preconnect(sampleOrigins[0].href, {
      crossOrigin: sampleOrigins[0].crossOrigin,
    });
    const stats = getResourcePreloaderStats();
    setResourceStats(stats);
  }, []);

  const handlePreconnectBatch = useCallback(() => {
    preconnectOrigins(sampleOrigins);
    const stats = getResourcePreloaderStats();
    setResourceStats(stats);
  }, []);

  const handlePrefetch = useCallback(async () => {
    try {
      await prefetch(sampleResources[0].url, {
        priority: 'low',
        timeout: 10000,
      });
      const stats = getResourcePreloaderStats();
      setResourceStats(stats);
    } catch (error) {
      console.error('资源预取失败:', error);
    }
  }, []);

  const handlePrefetchBatch = useCallback(async () => {
    try {
      await prefetchResources(
        sampleResources.map((r) => ({
          url: r.url,
          type: r.type,
          priority: r.priority,
        })),
        {
          concurrent: 3,
        }
      );
      const stats = getResourcePreloaderStats();
      setResourceStats(stats);
    } catch (error) {
      console.error('批量资源预取失败:', error);
    }
  }, []);

  const handleClearAll = useCallback(() => {
    clearAllResources();
    const stats = getResourcePreloaderStats();
    setResourceStats(stats);
  }, []);

  const handleRefreshStats = useCallback(() => {
    const stats = getResourcePreloaderStats();
    setResourceStats(stats);
  }, []);

  const handleCheckResourceStatus = useCallback(() => {
    if (!selectedResource) return;

    setResourceStatus({
      preloaded: isPreloaded(selectedResource),
      preconnected: isPreconnected(new URL(selectedResource).origin),
      prefetched: isPrefetched(selectedResource),
      loading: isLoading(selectedResource),
    });
  }, [selectedResource]);

  return (
    <div className={className} style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>资源预加载统计</h2>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>预加载统计</h3>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.875rem' }}>
                  <li>已预加载: {resourceStats.preloadedCount}</li>
                  <li>已预连接: {resourceStats.preconnectedCount}</li>
                  <li>已预取: {resourceStats.prefetchedCount}</li>
                  <li>加载中: {resourceStats.loadingCount}</li>
                </ul>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>资源状态检查</h3>
                <select
                  value={selectedResource || ''}
                  onChange={(e) => setSelectedResource(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="">选择资源</option>
                  {sampleResources.map((resource) => (
                    <option key={resource.url} value={resource.url}>
                      {resource.url}
                    </option>
                  ))}
                </select>
                <Button onClick={handleCheckResourceStatus} disabled={!selectedResource}>
                  检查状态
                </Button>
                {selectedResource && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    <p>已预加载: {resourceStatus.preloaded ? '✅' : '❌'}</p>
                    <p>已预连接: {resourceStatus.preconnected ? '✅' : '❌'}</p>
                    <p>已预取: {resourceStatus.prefetched ? '✅' : '❌'}</p>
                    <p>加载中: {resourceStatus.loading ? '✅' : '❌'}</p>
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Button onClick={handleRefreshStats}>刷新统计</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>资源预加载</h2>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>单张预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载单个资源，适用于关键资源
                </p>
                <Button onClick={handlePreloadSingle} disabled={preloading}>
                  {preloading ? '预加载中...' : '预加载单张资源'}
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>批量预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  批量预加载多个资源，适用于页面初始化
                </p>
                <Button onClick={handlePreloadBatch} disabled={preloading}>
                  {preloading ? '预加载中...' : '批量预加载'}
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>关键资源预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  只预加载标记为关键的资源
                </p>
                <Button onClick={handlePreloadCritical} disabled={preloading}>
                  {preloading ? '预加载中...' : '预加载关键资源'}
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>带进度预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载并显示进度，适用于大量资源
                </p>
                <Button onClick={handlePreloadWithProgress} disabled={preloading}>
                  {preloading ? '预加载中...' : '带进度预加载'}
                </Button>
                {preloading && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    进度: {preloadProgress.loaded} / {preloadProgress.total}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>预连接和预取</h2>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>预连接</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预先连接到源，减少延迟
                </p>
                <Button onClick={handlePreconnect}>预连接单个源</Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>批量预连接</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  批量预连接多个源
                </p>
                <Button onClick={handlePreconnectBatch}>批量预连接</Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>预取</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预取资源，用于未来导航
                </p>
                <Button onClick={handlePrefetch}>预取单个资源</Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>批量预取</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  批量预取多个资源
                </p>
                <Button onClick={handlePrefetchBatch}>批量预取</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>资源类型预加载</h2>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>脚本预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载 JavaScript 文件
                </p>
                <Button onClick={() => preloadScript(sampleResources[0].url)}>
                  预加载脚本
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>样式预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载 CSS 文件
                </p>
                <Button onClick={() => preloadStyle(sampleResources[1].url)}>
                  预加载样式
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>图片预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载图片文件
                </p>
                <Button onClick={() => preloadImage(sampleResources[2].url)}>
                  预加载图片
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>字体预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载字体文件
                </p>
                <Button onClick={() => preloadFont(sampleResources[3].url)}>
                  预加载字体
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>文档预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载文档资源
                </p>
                <Button onClick={() => preloadDocument(sampleResources[4].url)}>
                  预加载文档
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Fetch 预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载 Fetch 请求
                </p>
                <Button onClick={() => preloadFetch(sampleResources[4].url)}>
                  预加载 Fetch
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Worker 预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载 Web Worker
                </p>
                <Button onClick={() => preloadWorker(sampleResources[5].url)}>
                  预加载 Worker
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>缓存管理</h2>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>清空所有缓存</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  清空所有预加载、预连接和预取的缓存
                </p>
                <Button onClick={handleClearAll}>清空所有缓存</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>生成的预加载提示</h2>
        </CardHeader>
        <CardContent>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>HTML 预加载提示</h3>
            <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
              可以将这些标签添加到 HTML 的 &lt;head&gt; 部分以实现资源预加载
            </p>
            <pre
              style={{
                backgroundColor: '#f0f0f0',
                padding: '1rem',
                borderRadius: '0.25rem',
                overflow: 'auto',
                fontSize: '0.875rem',
                maxHeight: '300px',
              }}
            >
              {preloadHints}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcePreloadingExample;
