/**
 * @file 响应式图片工具
 * @description 提供响应式图片生成、srcset 和 sizes 配置功能
 * @module utils/responsive-image
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import * as React from 'react';

export interface ResponsiveImageConfig {
  baseUrl: string;
  breakpoints?: number[];
  formats?: Array<'webp' | 'avif' | 'jpeg' | 'png'>;
  quality?: number;
  enableLazyLoading?: boolean;
  enablePlaceholder?: boolean;
  placeholderSize?: number;
}

export interface ResponsiveImageSource {
  src: string;
  width: number;
  format?: string;
  media?: string;
  type?: string;
}

export interface ResponsiveImageOptions {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  breakpoints?: number[];
  formats?: Array<'webp' | 'avif' | 'jpeg' | 'png'>;
  quality?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'sync' | 'async' | 'auto';
  className?: string;
  style?: React.CSSProperties;
}

export interface ImageSize {
  width: number;
  height: number;
  aspectRatio: number;
}

const defaultBreakpoints = [320, 480, 640, 768, 1024, 1200, 1440, 1920];

const defaultFormats: Array<'webp' | 'avif' | 'jpeg' | 'png'> = ['webp', 'avif', 'jpeg'];

export const generateResponsiveImageUrl = (
  baseUrl: string,
  width: number,
  format: string = 'webp',
  quality: number = 80
): string => {
  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set('w', width.toString());
  url.searchParams.set('f', format);
  url.searchParams.set('q', quality.toString());
  return url.toString();
};

export const generateSrcSet = (
  baseUrl: string,
  breakpoints: number[] = defaultBreakpoints,
  format: string = 'webp',
  quality: number = 80
): string => {
  return breakpoints
    .map((width) => `${generateResponsiveImageUrl(baseUrl, width, format, quality)} ${width}w`)
    .join(', ');
};

export const generateSizes = (
  breakpoints: number[] = defaultBreakpoints,
  containerWidth?: string
): string => {
  if (containerWidth) {
    return containerWidth;
  }

  const sizes = breakpoints.map((width, index) => {
    const maxWidth = index === breakpoints.length - 1 ? width : breakpoints[index + 1] - 1;
    return `(max-width: ${maxWidth}px) ${width}px`;
  });

  return sizes.join(', ');
};

export const generateResponsiveImageSources = (
  baseUrl: string,
  breakpoints: number[] = defaultBreakpoints,
  formats: Array<'webp' | 'avif' | 'jpeg' | 'png'> = defaultFormats,
  quality: number = 80
): ResponsiveImageSource[] => {
  const sources: ResponsiveImageSource[] = [];

  formats.forEach((format) => {
    breakpoints.forEach((width) => {
      sources.push({
        src: generateResponsiveImageUrl(baseUrl, width, format, quality),
        width,
        format,
        type: `image/${format}`,
      });
    });
  });

  return sources;
};

export const generatePictureSources = (
  baseUrl: string,
  breakpoints: number[] = defaultBreakpoints,
  formats: Array<'webp' | 'avif' | 'jpeg' | 'png'> = defaultFormats,
  quality: number = 80
): Array<{ srcSet: string; type: string; media?: string }> => {
  const sources: Array<{ srcSet: string; type: string; media?: string }> = [];

  formats.forEach((format) => {
    const srcSet = generateSrcSet(baseUrl, breakpoints, format, quality);
    sources.push({
      srcSet,
      type: `image/${format}`,
    });
  });

  return sources;
};

export const calculateImageDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight?: number
): ImageSize => {
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = height * ratio;
  }

  if (maxHeight && height > maxHeight) {
    const ratio = maxHeight / height;
    height = maxHeight;
    width = width * ratio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
    aspectRatio: width / height,
  };
};

export const getOptimalImageSize = (
  containerWidth: number,
  devicePixelRatio: number = window.devicePixelRatio || 1,
  maxScale: number = 2
): number => {
  const optimalWidth = containerWidth * Math.min(devicePixelRatio, maxScale);
  return Math.round(optimalWidth);
};

export const findClosestBreakpoint = (
  targetWidth: number,
  breakpoints: number[] = defaultBreakpoints
): number => {
  return breakpoints.reduce((prev, curr) => {
    return Math.abs(curr - targetWidth) < Math.abs(prev - targetWidth) ? curr : prev;
  });
};

export const generateArtDirectionSources = (
  breakpoints: Array<{ maxWidth: number; src: string }>,
  formats: Array<'webp' | 'avif' | 'jpeg' | 'png'> = defaultFormats
): Array<{ srcSet: string; media: string; type?: string }> => {
  const sources: Array<{ srcSet: string; media: string; type?: string }> = [];

  breakpoints.forEach(({ maxWidth, src }) => {
    formats.forEach((format) => {
      sources.push({
        srcSet: generateResponsiveImageUrl(src, maxWidth, format),
        media: `(max-width: ${maxWidth}px)`,
        type: `image/${format}`,
      });
    });
  });

  return sources;
};

export const createResponsiveImageConfig = (
  overrides?: Partial<ResponsiveImageConfig>
): ResponsiveImageConfig => ({
  baseUrl: '',
  breakpoints: defaultBreakpoints,
  formats: defaultFormats,
  quality: 80,
  enableLazyLoading: true,
  enablePlaceholder: true,
  placeholderSize: 10,
  ...overrides,
});

export const getSupportedImageFormats = (): Array<'webp' | 'avif' | 'jpeg' | 'png'> => {
  const formats: Array<'webp' | 'avif' | 'jpeg' | 'png'> = [];

  if (typeof document === 'undefined') {
    return formats;
  }

  const canvas = document.createElement('canvas');

  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    formats.push('webp');
  }

  if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    formats.push('avif');
  }

  formats.push('jpeg', 'png');

  return formats;
};

export const getOptimalFormat = (
  preferredFormats: Array<'webp' | 'avif' | 'jpeg' | 'png'> = defaultFormats
): string => {
  const supportedFormats = getSupportedImageFormats();

  for (const format of preferredFormats) {
    if (supportedFormats.includes(format)) {
      return format;
    }
  }

  return 'jpeg';
};

export const generatePlaceholderUrl = (
  baseUrl: string,
  size: number = 10,
  quality: number = 30
): string => {
  return generateResponsiveImageUrl(baseUrl, size, 'jpeg', quality);
};

export const generateBlurPlaceholder = (
  width: number,
  height: number,
  blur: number = 10
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.filter = `blur(${blur}px)`;
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL('image/jpeg', 0.3);
};

export const generateResponsiveImageAttributes = (
  options: ResponsiveImageOptions
): {
  src: string;
  srcSet: string;
  sizes: string;
  loading: 'lazy' | 'eager';
  fetchPriority: 'high' | 'low' | 'auto';
  decoding: 'sync' | 'async' | 'auto';
} => {
  const {
    src,
    breakpoints = defaultBreakpoints,
    formats = defaultFormats,
    quality = 80,
    sizes,
    loading = 'lazy',
    fetchPriority = 'auto',
    decoding = 'async',
  } = options;

  const optimalFormat = getOptimalFormat(formats);

  return {
    src: generateResponsiveImageUrl(src, breakpoints[0], optimalFormat, quality),
    srcSet: generateSrcSet(src, breakpoints, optimalFormat, quality),
    sizes: sizes || generateSizes(breakpoints),
    loading,
    fetchPriority,
    decoding,
  };
};

export const createResponsiveImageElement = (options: ResponsiveImageOptions): HTMLImageElement => {
  const { alt, width, height, className, style } = options;
  const attributes = generateResponsiveImageAttributes(options);

  const img = document.createElement('img');
  img.src = attributes.src;
  img.srcset = attributes.srcSet;
  img.sizes = attributes.sizes;
  img.alt = alt;
  img.loading = attributes.loading;
  if (attributes.fetchPriority) {
    img.setAttribute('fetchpriority', attributes.fetchPriority);
  }
  img.decoding = attributes.decoding;

  if (width) img.width = width;
  if (height) img.height = height;
  if (className) img.className = className;
  if (style) Object.assign(img.style, style);

  return img;
};

export const createPictureElement = (options: ResponsiveImageOptions): HTMLPictureElement => {
  const { src, alt, width, height, breakpoints, formats, quality, className, style } = options;
  const picture = document.createElement('picture');

  const sources = generatePictureSources(src, breakpoints, formats, quality);

  sources.forEach(({ srcSet, type }) => {
    const source = document.createElement('source');
    source.srcset = srcSet;
    source.type = type;
    picture.appendChild(source);
  });

  const img = document.createElement('img');
  img.src = generateResponsiveImageUrl(
    src,
    breakpoints?.[0] || defaultBreakpoints[0],
    formats?.[0] || 'webp',
    quality
  );
  img.alt = alt;

  if (width) img.width = width;
  if (height) img.height = height;
  if (className) img.className = className;
  if (style) Object.assign(img.style, style);

  picture.appendChild(img);

  return picture;
};

export const analyzeImageUsage = (): {
  totalImages: number;
  responsiveImages: number;
  lazyLoadedImages: number;
  nonResponsiveImages: number;
  averageSize: number;
  formats: Record<string, number>;
} => {
  const images = document.querySelectorAll('img');
  const totalImages = images.length;
  let responsiveImages = 0;
  let lazyLoadedImages = 0;
  let totalSize = 0;
  const formats: Record<string, number> = {};

  images.forEach((img) => {
    if (img.srcset) responsiveImages++;
    if (img.loading === 'lazy') lazyLoadedImages++;

    const format = img.src.split('.').pop()?.toLowerCase() || 'unknown';
    formats[format] = (formats[format] || 0) + 1;

    if (img.naturalWidth && img.naturalHeight) {
      totalSize += img.naturalWidth * img.naturalHeight;
    }
  });

  return {
    totalImages,
    responsiveImages,
    lazyLoadedImages,
    nonResponsiveImages: totalImages - responsiveImages,
    averageSize: totalImages > 0 ? totalSize / totalImages : 0,
    formats,
  };
};

export default {
  generateResponsiveImageUrl,
  generateSrcSet,
  generateSizes,
  generateResponsiveImageSources,
  generatePictureSources,
  calculateImageDimensions,
  getOptimalImageSize,
  findClosestBreakpoint,
  generateArtDirectionSources,
  createResponsiveImageConfig,
  getSupportedImageFormats,
  getOptimalFormat,
  generatePlaceholderUrl,
  generateBlurPlaceholder,
  generateResponsiveImageAttributes,
  createResponsiveImageElement,
  createPictureElement,
  analyzeImageUsage,
  defaultBreakpoints,
  defaultFormats,
};
