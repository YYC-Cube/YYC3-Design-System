/**
 * @file 图片懒加载组件
 * @description 提供基于 IntersectionObserver 的图片懒加载 React 组件
 * @module components/LazyImage
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  observeLazyImage,
  createProgressiveImageLoader,
  createLazyImageWithPlaceholder,
} from '../utils/image-lazy-loader';

export interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  placeholder?: string;
  errorPlaceholder?: string;
  className?: string;
  style?: React.CSSProperties;
  rootMargin?: string;
  threshold?: number;
  retryCount?: number;
  retryDelay?: number;
  progressive?: boolean;
  lowQualitySrc?: string;
  placeholderColor?: string;
  placeholderText?: string;
  onLoad?: () => void;
  onError?: () => void;
  onProgress?: (progress: number) => void;
  'data-testid'?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  placeholder,
  errorPlaceholder,
  className = '',
  style,
  rootMargin: _rootMargin,
  threshold: _threshold,
  retryCount,
  retryDelay,
  progressive = false,
  lowQualitySrc,
  placeholderColor,
  placeholderText,
  onLoad,
  onError,
  onProgress: _onProgress,
  'data-testid': dataTestId,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsLoading(false);
    setIsError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsError(true);
    setIsLoading(false);
    setIsLoaded(false);
    onError?.();
  }, [onError]);

  useEffect(() => {
    if (!imgRef.current) {
      return;
    }

    const img = imgRef.current;

    if (progressive && lowQualitySrc) {
      createProgressiveImageLoader(lowQualitySrc, src, img, {
        onLoad: handleLoad,
        onError: handleError,
      });
    } else if (placeholderColor || placeholderText) {
      createLazyImageWithPlaceholder(img, placeholderColor, placeholderText);
      img.setAttribute('data-src', src);
      observeLazyImage(img, {
        placeholder,
        errorPlaceholder,
        retryCount,
        retryDelay,
        onLoad: handleLoad,
        onError: handleError,
      });
    } else {
      img.setAttribute('data-src', src);
      observeLazyImage(img, {
        placeholder,
        errorPlaceholder,
        retryCount,
        retryDelay,
        onLoad: handleLoad,
        onError: handleError,
      });
    }

    return () => {
      const unobserve = () => {
        if (img) {
          img.removeEventListener('load', handleLoad);
          img.removeEventListener('error', handleError);
        }
      };
      unobserve();
    };
  }, [
    src,
    progressive,
    lowQualitySrc,
    placeholderColor,
    placeholderText,
    placeholder,
    errorPlaceholder,
    retryCount,
    retryDelay,
    handleLoad,
    handleError,
  ]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: width || '100%',
    height: height || 'auto',
    backgroundColor: placeholderColor || '#f0f0f0',
    ...style,
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: placeholderColor || '#f0f0f0',
    color: '#999',
    fontSize: '14px',
    opacity: isLoading ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  };

  const errorStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffcdcd',
    color: '#999',
    fontSize: '14px',
  };

  return (
    <div style={containerStyle} className={`lazy-image-container ${className}`} data-testid={dataTestId}>
      <img
        ref={imgRef}
        alt={alt}
        className="lazy-image"
        style={imageStyle}
        loading="lazy"
      />
      {isLoading && (
        <div className="lazy-image-placeholder" style={placeholderStyle}>
          {placeholderText || 'Loading...'}
        </div>
      )}
      {isError && (
        <div className="lazy-image-error" style={errorStyle}>
          加载失败
        </div>
      )}
    </div>
  );
};

export interface LazyImageGridProps {
  images: Array<{ src: string; alt: string; id?: string }>;
  columns?: number;
  gap?: number;
  className?: string;
  style?: React.CSSProperties;
  imageProps?: Partial<LazyImageProps>;
  'data-testid'?: string;
}

export const LazyImageGrid: React.FC<LazyImageGridProps> = ({
  images,
  columns = 3,
  gap = 16,
  className = '',
  style,
  imageProps = {},
  'data-testid': dataTestId,
}) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    ...style,
  };

  return (
    <div style={gridStyle} className={`lazy-image-grid ${className}`} data-testid={dataTestId}>
      {images.map((image, index) => (
        <LazyImage
          key={image.id || index}
          src={image.src}
          alt={image.alt}
          {...imageProps}
        />
      ))}
    </div>
  );
};

export interface LazyImageGalleryProps {
  images: Array<{ src: string; alt: string; id?: string; thumbnail?: string }>;
  className?: string;
  style?: React.CSSProperties;
  imageProps?: Partial<LazyImageProps>;
  onImageClick?: (index: number) => void;
  'data-testid'?: string;
}

export const LazyImageGallery: React.FC<LazyImageGalleryProps> = ({
  images,
  className = '',
  style,
  imageProps = {},
  onImageClick,
  'data-testid': dataTestId,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleImageClick = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      onImageClick?.(index);
    },
    [onImageClick]
  );

  const galleryStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    ...style,
  };

  const imageContainerStyle: React.CSSProperties = {
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  };

  return (
    <div style={galleryStyle} className={`lazy-image-gallery ${className}`} data-testid={dataTestId}>
      {images.map((image, index) => (
        <div
          key={image.id || index}
          style={imageContainerStyle}
          onClick={() => handleImageClick(index)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <LazyImage
            src={image.thumbnail || image.src}
            alt={image.alt}
            {...imageProps}
          />
        </div>
      ))}
      {selectedIndex !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedIndex(null)}
        >
          <LazyImage
            src={images[selectedIndex].src}
            alt={images[selectedIndex].alt}
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          />
        </div>
      )}
    </div>
  );
};

export default LazyImage;
