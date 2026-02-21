import React from 'react';
import { CardProps } from '../../types/tokens';
import { useTheme } from '../theme/useTheme';

export const Card: React.FC<CardProps> = ({ children, className = '', 'data-testid': dataTestId }) => {
  const { tokens } = useTheme();
  const radius = tokens['radius.lg'] as string || '0.5rem';
  const cardShadowValue = tokens['shadow.card'] as string;
  const cardShadow = cardShadowValue ? cardShadowValue.split(' ') : ['0px', '6px', '20px', '-4px', '#d6cbd0'];
  const shadowString = `${cardShadow[0]} ${cardShadow[1]} ${cardShadow[2]} ${cardShadow[3]} ${cardShadow[4] || '#d6cbd0'}`;

  const cardStyle: React.CSSProperties = {
    backgroundColor: tokens['color.card'] as string || '#f8f9ef',
    borderRadius: radius,
    boxShadow: shadowString,
    padding: '1.5rem',
    border: `1px solid ${tokens['color.muted-foreground'] as string || '#ccc'}`,
    transition: 'all 0.2s ease',
  };

  return (
    <div style={cardStyle} className={className} data-testid={dataTestId}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const { tokens } = useTheme();
  
  const headerStyle: React.CSSProperties = {
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: `1px solid ${tokens['color.muted-foreground'] as string || '#ccc'}`,
  };

  return (
    <div style={headerStyle} className={className}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const { tokens } = useTheme();
  
  const titleStyle: React.CSSProperties = {
    fontSize: tokens['font-size.heading-2'] as string || '1.5rem',
    fontWeight: '600',
    margin: '0',
    color: tokens['color.foreground'] as string || '#000',
  };

  return (
    <h3 style={titleStyle} className={className}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const { tokens } = useTheme();
  
  const contentStyle: React.CSSProperties = {
    fontSize: tokens['font-size.body'] as string || '1rem',
    lineHeight: tokens['line-height.body'] as string || '1.5',
  };

  return (
    <div style={contentStyle} className={className}>
      {children}
    </div>
  );
};

export default Card;
