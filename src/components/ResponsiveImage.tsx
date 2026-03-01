/**
 * @file 响应式图片组件
 * @description 提供响应式图片 React 组件，支持多种格式和断点
 * @module components/ResponsiveImage
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  generateResponsiveImageAttributes,
  generatePictureSources,
  generateBlurPlaceholder,
  getOptimalFormat,
  type ResponsiveImageOptions,
} from '../utils/responsive-image';
import responsiveImageUtils from '../utils/responsive-image';
import { observeLazyImage } from '../utils/image-lazy-loader';

const { defaultBreakpoints, defaultFormats } = responsiveImageUtils;

export interface ResponsiveImageProps extends Omit<ResponsiveImageOptions, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  enableBlurPlaceholder?: boolean;
  blurSize?: number;
  onLoad?: () => void;
  onError?: () => void;
  'data-testid'?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  breakpoints = defaultBreakpoints,
  formats = defaultFormats,
  quality = 80,
  sizes,
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  className = '',
  style,
  placeholder,
  enableBlurPlaceholder = false,
  blurSize = 10,
  onLoad,
  onError,
  'data-testid': dataTestId,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  const attributes = generateResponsiveImageAttributes({
    src,
    alt,
    width,
    height,
    breakpoints,
    formats,
    quality,
    sizes,
    loading,
    fetchPriority,
    decoding,
  });

  const blurPlaceholder = enableBlurPlaceholder
    ? generateBlurPlaceholder(width || 400, height || 300, blurSize)
    : placeholder;

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
    if (loading === 'lazy' && imgRef.current) {
      const unobserve = observeLazyImage(imgRef.current, {
        placeholder: blurPlaceholder,
        onLoad: handleLoad,
        onError: handleError,
      });
      return unobserve;
    }
    return undefined;
  }, [loading, blurPlaceholder, handleLoad, handleError]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: width || '100%',
    height: height || 'auto',
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
    backgroundImage: blurPlaceholder ? `url(${blurPlaceholder})` : undefined,
    backgroundColor: blurPlaceholder ? undefined : '#f0f0f0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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
    <div
      style={containerStyle}
      className={`responsive-image-container ${className}`}
      data-testid={dataTestId}
    >
      {isLoading && <div className="responsive-image-placeholder" style={placeholderStyle} />}
      <img
        ref={imgRef}
        src={attributes.src}
        srcSet={attributes.srcSet}
        sizes={attributes.sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        className="responsive-image"
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
      />
      {isError && (
        <div className="responsive-image-error" style={errorStyle}>
          加载失败
        </div>
      )}
    </div>
  );
};

export interface PictureImageProps extends Omit<ResponsiveImageProps, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  enableBlurPlaceholder?: boolean;
  blurSize?: number;
  onLoad?: () => void;
  onError?: () => void;
  'data-testid'?: string;
}

export const PictureImage: React.FC<PictureImageProps> = ({
  src,
  alt,
  width,
  height,
  breakpoints = defaultBreakpoints,
  formats = defaultFormats,
  quality = 80,
  sizes,
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  className = '',
  style,
  placeholder,
  enableBlurPlaceholder = false,
  blurSize = 10,
  onLoad,
  onError,
  'data-testid': dataTestId,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  const sources = generatePictureSources(src, breakpoints, formats, quality);
  const blurPlaceholder = enableBlurPlaceholder
    ? generateBlurPlaceholder(width || 400, height || 300, blurSize)
    : placeholder;

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
    if (loading === 'lazy' && imgRef.current) {
      const unobserve = observeLazyImage(imgRef.current, {
        placeholder: blurPlaceholder,
        onLoad: handleLoad,
        onError: handleError,
      });
      return unobserve;
    }
    return undefined;
  }, [loading, blurPlaceholder, handleLoad, handleError]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: width || '100%',
    height: height || 'auto',
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
    backgroundImage: blurPlaceholder ? `url(${blurPlaceholder})` : undefined,
    backgroundColor: blurPlaceholder ? undefined : '#f0f0f0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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
    <div
      style={containerStyle}
      className={`picture-image-container ${className}`}
      data-testid={dataTestId}
    >
      {isLoading && <div className="picture-image-placeholder" style={placeholderStyle} />}
      <picture>
        {sources.map((source, index) => (
          <source key={index} srcSet={source.srcSet} type={source.type} media={source.media} />
        ))}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={decoding}
          className="picture-image"
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>
      {isError && (
        <div className="picture-image-error" style={errorStyle}>
          加载失败
        </div>
      )}
    </div>
  );
};

export interface ArtDirectionImageProps {
  sources: Array<{ maxWidth: number; src: string; media?: string }>;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  enableBlurPlaceholder?: boolean;
  blurSize?: number;
  onLoad?: () => void;
  onError?: () => void;
  'data-testid'?: string;
}

export const ArtDirectionImage: React.FC<ArtDirectionImageProps> = ({
  sources,
  alt,
  width,
  height,
  className = '',
  style,
  placeholder,
  enableBlurPlaceholder = false,
  blurSize = 10,
  onLoad,
  onError,
  'data-testid': dataTestId,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  const blurPlaceholder = enableBlurPlaceholder
    ? generateBlurPlaceholder(width || 400, height || 300, blurSize)
    : placeholder;

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
    if (imgRef.current) {
      const unobserve = observeLazyImage(imgRef.current, {
        placeholder: blurPlaceholder,
        onLoad: handleLoad,
        onError: handleError,
      });
      return unobserve;
    }
    return undefined;
  }, [blurPlaceholder, handleLoad, handleError]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: width || '100%',
    height: height || 'auto',
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
    backgroundImage: blurPlaceholder ? `url(${blurPlaceholder})` : undefined,
    backgroundColor: blurPlaceholder ? undefined : '#f0f0f0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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

  const fallbackSrc = sources[sources.length - 1]?.src || '';

  return (
    <div
      style={containerStyle}
      className={`art-direction-image-container ${className}`}
      data-testid={dataTestId}
    >
      {isLoading && <div className="art-direction-image-placeholder" style={placeholderStyle} />}
      <picture>
        {sources.map((source, index) => (
          <source
            key={index}
            srcSet={source.src}
            media={source.media || `(max-width: ${source.maxWidth}px)`}
          />
        ))}
        <img
          ref={imgRef}
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="art-direction-image"
          style={imageStyle}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>
      {isError && (
        <div className="art-direction-image-error" style={errorStyle}>
          加载失败
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;
