/**
 * @file 图片优化示例组件
 * @description 演示图片懒加载、预加载和响应式图片的使用
 * @module components/ImageOptimizationExample
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useState, useCallback, useEffect } from 'react';
import { LazyImage, LazyImageGrid, LazyImageGallery } from './LazyImage';
import { ResponsiveImage, PictureImage, ArtDirectionImage } from './ResponsiveImage';
import {
  preloadImage,
  preloadImageBatch,
  preloadImageWithProgress,
  getImagePreloaderStats,
  clearImageCache,
} from '../utils/image-preloader';
import {
  analyzeImageUsage,
  getSupportedImageFormats,
  getOptimalFormat,
  generateResponsiveImageUrl,
} from '../utils/responsive-image';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';

export interface ImageOptimizationExampleProps {
  className?: string;
}

export const ImageOptimizationExample: React.FC<ImageOptimizationExampleProps> = ({
  className = '',
}) => {
  const [preloading, setPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState({ loaded: 0, total: 0 });
  const [imageStats, setImageStats] = useState({
    totalImages: 0,
    responsiveImages: 0,
    lazyLoadedImages: 0,
    nonResponsiveImages: 0,
    averageSize: 0,
    formats: {} as Record<string, number>,
  });
  const [supportedFormats, setSupportedFormats] = useState<string[]>([]);
  const [optimalFormat, setOptimalFormat] = useState('');

  const sampleImages = [
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      alt: 'Mountain landscape',
      id: '1',
    },
    {
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      alt: 'Nature scene',
      id: '2',
    },
    {
      src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800',
      alt: 'Forest path',
      id: '3',
    },
    {
      src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
      alt: 'Waterfall',
      id: '4',
    },
    {
      src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
      alt: 'Lake view',
      id: '5',
    },
    {
      src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
      alt: 'Misty mountains',
      id: '6',
    },
  ];

  const galleryImages = sampleImages.map((img) => ({
    ...img,
    thumbnail: img.src.replace('w=800', 'w=200'),
  }));

  const artDirectionSources = [
    {
      maxWidth: 640,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640',
      media: '(max-width: 640px)',
    },
    {
      maxWidth: 1024,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024',
      media: '(max-width: 1024px)',
    },
    {
      maxWidth: 1920,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
      media: '(max-width: 1920px)',
    },
  ];

  useEffect(() => {
    const stats = analyzeImageUsage();
    setImageStats(stats);

    const formats = getSupportedImageFormats();
    setSupportedFormats(formats);

    const optimal = getOptimalFormat();
    setOptimalFormat(optimal);
  }, []);

  const handlePreloadSingle = useCallback(async () => {
    setPreloading(true);
    try {
      await preloadImage(sampleImages[0].src, {
        priority: 'high',
        timeout: 10000,
      });
    } catch (error) {
      console.error('预加载失败:', error);
    } finally {
      setPreloading(false);
    }
  }, []);

  const handlePreloadBatch = useCallback(async () => {
    setPreloading(true);
    try {
      await preloadImageBatch(
        sampleImages.map((img) => ({
          src: img.src,
          options: { priority: 'auto' },
        }))
      );
    } catch (error) {
      console.error('批量预加载失败:', error);
    } finally {
      setPreloading(false);
    }
  }, []);

  const handlePreloadWithProgress = useCallback(async () => {
    setPreloading(true);
    setPreloadProgress({ loaded: 0, total: sampleImages.length });
    try {
      await preloadImageWithProgress(
        sampleImages.map((img) => ({
          src: img.src,
          options: { priority: 'low' },
        })),
        (loaded, total) => {
          setPreloadProgress({ loaded, total });
        }
      );
    } catch (error) {
      console.error('带进度预加载失败:', error);
    } finally {
      setPreloading(false);
    }
  }, []);

  const handleClearCache = useCallback(() => {
    clearImageCache();
    const stats = analyzeImageUsage();
    setImageStats(stats);
  }, []);

  const handleRefreshStats = useCallback(() => {
    const stats = analyzeImageUsage();
    setImageStats(stats);
    const preloaderStats = getImagePreloaderStats();
    console.log('预加载器统计:', preloaderStats);
  }, []);

  return (
    <div className={className} style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>图片优化统计</h2>
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
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>页面图片统计</h3>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.875rem' }}>
                  <li>总图片数: {imageStats.totalImages}</li>
                  <li>响应式图片: {imageStats.responsiveImages}</li>
                  <li>懒加载图片: {imageStats.lazyLoadedImages}</li>
                  <li>非响应式图片: {imageStats.nonResponsiveImages}</li>
                  <li>平均尺寸: {Math.round(imageStats.averageSize / 1000)}KB</li>
                </ul>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>支持的图片格式</h3>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.875rem' }}>
                  {supportedFormats.map((format) => (
                    <li key={format}>
                      {format.toUpperCase()} {format === optimalFormat && '(推荐)'}
                    </li>
                  ))}
                </ul>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                  最优格式: {optimalFormat.toUpperCase()}
                </p>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>图片格式分布</h3>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.875rem' }}>
                  {Object.entries(imageStats.formats).map(([format, count]) => (
                    <li key={format}>
                      {format.toUpperCase()}: {count} 张
                    </li>
                  ))}
                </ul>
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
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>图片预加载</h2>
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
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>单张预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载单张高优先级图片，适用于关键内容
                </p>
                <Button onClick={handlePreloadSingle} disabled={preloading}>
                  {preloading ? '预加载中...' : '预加载单张图片'}
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>批量预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  批量预加载多张图片，适用于页面初始化
                </p>
                <Button onClick={handlePreloadBatch} disabled={preloading}>
                  {preloading ? '预加载中...' : '批量预加载'}
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>带进度预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载并显示进度，适用于大量图片
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
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>缓存管理</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  清理图片缓存，释放内存
                </p>
                <Button onClick={handleClearCache}>清空缓存</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>懒加载图片</h2>
          </CardHeader>
          <CardContent>
            <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
              以下图片使用懒加载，只有滚动到可视区域时才会加载
            </p>
            <LazyImageGrid
              images={sampleImages}
              columns={3}
              gap={16}
              imageProps={{
                width: '100%',
                height: 200,
                placeholderColor: '#f0f0f0',
                placeholderText: '加载中...',
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>响应式图片</h2>
          </CardHeader>
          <CardContent>
            <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
              以下图片根据屏幕尺寸自动选择合适的分辨率和格式
            </p>
            <div
              style={{
                display: 'grid',
                gap: '1rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              }}
            >
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>基础响应式图片</h3>
                <ResponsiveImage
                  src={sampleImages[0].src}
                  alt={sampleImages[0].alt}
                  width={800}
                  height={200}
                  breakpoints={[320, 640, 768, 1024, 1200, 1920]}
                  formats={['webp', 'avif', 'jpeg']}
                  quality={80}
                  enableBlurPlaceholder={true}
                  blurSize={10}
                />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Picture 元素</h3>
                <PictureImage
                  src={sampleImages[1].src}
                  alt={sampleImages[1].alt}
                  width={800}
                  height={200}
                  breakpoints={[320, 640, 768, 1024, 1200, 1920]}
                  formats={['webp', 'avif', 'jpeg']}
                  quality={80}
                  enableBlurPlaceholder={true}
                  blurSize={10}
                />
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>艺术指导</h3>
                <ArtDirectionImage
                  sources={artDirectionSources}
                  alt="Mountain landscape with art direction"
                  width={800}
                  height={200}
                  enableBlurPlaceholder={true}
                  blurSize={10}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>图片画廊</h2>
          </CardHeader>
          <CardContent>
            <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
              点击图片查看大图，支持懒加载和响应式图片
            </p>
            <LazyImageGallery
              images={galleryImages}
              imageProps={{
                width: '100%',
                height: 200,
                placeholderColor: '#f0f0f0',
                placeholderText: '加载中...',
              }}
              onImageClick={(index) => {
                console.log('点击了图片:', index);
              }}
            />
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
              <strong>懒加载</strong>：使用 IntersectionObserver 实现图片懒加载，减少初始加载时间
            </li>
            <li>
              <strong>预加载</strong>：预加载关键图片，提升用户体验
            </li>
            <li>
              <strong>响应式图片</strong>：使用 srcset 和 sizes 属性，根据设备加载合适尺寸的图片
            </li>
            <li>
              <strong>现代格式</strong>：优先使用 WebP 和 AVIF 格式，减少文件大小
            </li>
            <li>
              <strong>占位符</strong>：使用模糊占位符或骨架屏，提升加载体验
            </li>
            <li>
              <strong>缓存管理</strong>：合理使用缓存，避免重复加载
            </li>
            <li>
              <strong>艺术指导</strong>：针对不同屏幕尺寸提供不同的图片裁剪
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageOptimizationExample;
