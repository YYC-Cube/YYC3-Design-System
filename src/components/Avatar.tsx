import React, { useState } from 'react';
import { AvatarProps } from '../../types/tokens';
import { useTheme } from '../theme/useTheme';

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className = '',
  'data-testid': dataTestId,
}) => {
  const { tokens } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getSizeStyle = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { width: '2rem', height: '2rem', fontSize: '0.75rem' };
      case 'md':
        return { width: '2.5rem', height: '2.5rem', fontSize: '1rem' };
      case 'lg':
        return { width: '3rem', height: '3rem', fontSize: '1.25rem' };
      case 'xl':
        return { width: '4rem', height: '4rem', fontSize: '1.5rem' };
      default:
        return { width: '2.5rem', height: '2.5rem', fontSize: '1rem' };
    }
  };

  const sizeStyle = getSizeStyle();
  const radius = tokens['radius.lg'] as string || '0.5rem';

  const avatarStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius,
    backgroundColor: tokens['color.primary'] as string || '#d45a5f',
    color: tokens['color.primary-foreground'] as string || '#fff',
    overflow: 'hidden',
    ...sizeStyle,
    transition: 'all 0.2s ease',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: imageLoaded ? 'block' : 'none',
  };

  const fallbackStyle: React.CSSProperties = {
    fontSize: sizeStyle.fontSize,
    fontWeight: '600',
    userSelect: 'none',
  };

  const getFallbackText = (): string => {
    if (fallback) return fallback;
    if (alt) {
      const words = alt.split(' ');
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
      }
      return alt.slice(0, 2).toUpperCase();
    }
    return '??';
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div style={avatarStyle} className={className} role="img" aria-label={alt} data-testid={dataTestId}>
      {src && !imageError && (
        <img
          src={src}
          alt={alt}
          style={imageStyle}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      {(!src || imageError || !imageLoaded) && (
        <span style={fallbackStyle}>{getFallbackText()}</span>
      )}
    </div>
  );
};

export default Avatar;
