import * as React from 'react';
import { useTheme } from '../theme/useTheme';

const { memo } = React;

interface CardProps {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

export const Card = memo<CardProps>(({ children, className = '', 'data-testid': dataTestId }) => {
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
});

Card.displayName = 'Card';

export const CardHeader = memo<{ children: React.ReactNode; className?: string }>(({ children, className }) => {
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
});

CardHeader.displayName = 'CardHeader';

export const CardTitle = memo<{ children: React.ReactNode; className?: string }>(({ children, className }) => {
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
});

CardTitle.displayName = 'CardTitle';

export const CardContent = memo<{ children: React.ReactNode; className?: string }>(({ children, className }) => {
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
});

CardContent.displayName = 'CardContent';

export const CardFooter = memo<{ children: React.ReactNode; className?: string }>(({ children, className }) => {
  const { tokens } = useTheme();
  
  const footerStyle: React.CSSProperties = {
    marginTop: '1rem',
    paddingTop: '0.75rem',
    borderTop: `1px solid ${tokens['color.muted-foreground'] as string || '#ccc'}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  };

  return (
    <div style={footerStyle} className={className}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

const CardWithSubcomponents = Card as typeof Card & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};

CardWithSubcomponents.Header = CardHeader;
CardWithSubcomponents.Title = CardTitle;
CardWithSubcomponents.Content = CardContent;
CardWithSubcomponents.Footer = CardFooter;

export default CardWithSubcomponents;
