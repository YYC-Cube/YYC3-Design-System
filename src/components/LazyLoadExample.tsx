/**
 * @file 懒加载组件示例
 * @description 演示如何使用懒加载工具函数
 * @module components/LazyLoadExample
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useState, useCallback } from 'react';
import { Button } from './Button';
import { Card, CardHeader, CardContent } from './Card';
import {
  createLazyWrapper,
  lazyLoadImage,
  lazyLoadScript,
  createResourcePreloader,
} from '../utils/lazy-loader';

const LazyModal = createLazyWrapper(() => import('./Modal'), {
  fallback: <div style={{ padding: '2rem', textAlign: 'center' }}>加载模态框组件...</div>,
});

const LazyTokenPlayground = createLazyWrapper(() => import('./TokenPlayground'), {
  fallback: <div style={{ padding: '2rem', textAlign: 'center' }}>加载令牌游乐场...</div>,
});

export interface LazyLoadExampleProps {
  className?: string;
}

export const LazyLoadExample: React.FC<LazyLoadExampleProps> = ({ className = '' }) => {
  const [showModal, setShowModal] = useState(false);
  const [showPlayground, setShowPlayground] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const preloader = createResourcePreloader();

  const handleLoadImage = useCallback(async () => {
    try {
      await lazyLoadImage('https://via.placeholder.com/400x300');
      setImageLoaded(true);
    } catch (error) {
      console.error('图片加载失败:', error);
    }
  }, []);

  const handleLoadScript = useCallback(async () => {
    try {
      await lazyLoadScript('https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js');
      setScriptLoaded(true);
    } catch (error) {
      console.error('脚本加载失败:', error);
    }
  }, []);

  const handlePreloadResources = useCallback(() => {
    preloader.preload(
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      'font'
    );
    preloader.preload('https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js', 'script');
  }, [preloader]);

  return (
    <div className={className} style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>组件懒加载示例</h2>
          </CardHeader>
          <CardContent>
            <div
              style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              }}
            >
              <div>
                <h3 style={{ marginBottom: '1rem' }}>懒加载模态框</h3>
                <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                  点击按钮动态加载 Modal 组件，减少初始包大小
                </p>
                <Button onClick={() => setShowModal(true)}>打开模态框</Button>
                {showModal && (
                  <LazyModal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>懒加载模态框</h2>
                    <p>这是一个懒加载的模态框组件</p>
                  </LazyModal>
                )}
              </div>

              <div>
                <h3 style={{ marginBottom: '1rem' }}>懒加载令牌游乐场</h3>
                <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                  点击按钮动态加载 TokenPlayground 组件
                </p>
                <Button onClick={() => setShowPlayground(true)}>打开令牌游乐场</Button>
                {showPlayground && <LazyTokenPlayground />}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>资源懒加载示例</h2>
          </CardHeader>
          <CardContent>
            <div
              style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              }}
            >
              <div>
                <h3 style={{ marginBottom: '1rem' }}>懒加载图片</h3>
                <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                  点击按钮懒加载图片，使用 IntersectionObserver
                </p>
                <Button onClick={handleLoadImage} disabled={imageLoaded}>
                  {imageLoaded ? '图片已加载' : '加载图片'}
                </Button>
              </div>

              <div>
                <h3 style={{ marginBottom: '1rem' }}>懒加载脚本</h3>
                <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                  点击按钮懒加载 Chart.js 脚本
                </p>
                <Button onClick={handleLoadScript} disabled={scriptLoaded}>
                  {scriptLoaded ? '脚本已加载' : '加载脚本'}
                </Button>
              </div>

              <div>
                <h3 style={{ marginBottom: '1rem' }}>预加载资源</h3>
                <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                  预加载字体和脚本，提升后续加载速度
                </p>
                <Button onClick={handlePreloadResources}>预加载资源</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>性能优化建议</h2>
        </CardHeader>
        <CardContent>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>
              <strong>组件懒加载</strong>：将大型组件或低频使用的组件设置为懒加载，减少初始包大小
            </li>
            <li>
              <strong>路由懒加载</strong>：使用 React.lazy 和 Suspense 实现路由级别的代码分割
            </li>
            <li>
              <strong>图片懒加载</strong>：使用 IntersectionObserver 实现图片的按需加载
            </li>
            <li>
              <strong>资源预加载</strong>：预加载关键资源，提升用户体验
            </li>
            <li>
              <strong>脚本懒加载</strong>：将非关键脚本延迟加载，提升首屏渲染速度
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LazyLoadExample;
