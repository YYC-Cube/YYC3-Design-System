import React, { useState } from 'react';
import { useTheme } from '../theme/useTheme';

interface TabsProps {
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
} | null>(null);

export const Tabs: React.FC<TabsProps> = ({
  defaultValue = '',
  children,
  className = '',
  'data-testid': dataTestId,
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className} data-testid={dataTestId}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabList: React.FC<TabListProps> = ({ children, className = '' }) => {
  const { tokens } = useTheme();

  const listStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    borderBottom: `1px solid ${(tokens['color.muted-foreground'] as string) || '#ccc'}`,
    marginBottom: '1rem',
  };

  return (
    <div style={listStyle} className={className} role="tablist">
      {children}
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ value, children, className = '' }) => {
  const { tokens } = useTheme();
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('Tab must be used within Tabs');
  }

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  const tabStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: `${(tokens['radius.md'] as string) || '0.25rem'} ${(tokens['radius.md'] as string) || '0.25rem'} 0 0`,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: isActive ? (tokens['color.primary'] as string) || '#d45a5f' : 'transparent',
    color: isActive
      ? (tokens['color.primary-foreground'] as string) || '#fff'
      : (tokens['color.foreground'] as string) || '#000',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.2s ease',
    fontFamily: (tokens['typography.font-sans'] as string) || 'system-ui',
    fontSize: (tokens['font-size.body'] as string) || '1rem',
  };

  return (
    <button
      style={tabStyle}
      onClick={() => setActiveTab(value)}
      className={className}
      role="tab"
      aria-selected={isActive}
    >
      {children}
    </button>
  );
};

export const TabPanel: React.FC<TabPanelProps> = ({ value, children, className = '' }) => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('TabPanel must be used within Tabs');
  }

  const { activeTab } = context;
  const isActive = activeTab === value;

  const panelStyle: React.CSSProperties = {
    display: isActive ? 'block' : 'none',
  };

  return (
    <div style={panelStyle} className={className} role="tabpanel" aria-hidden={!isActive}>
      {children}
    </div>
  );
};

export default Tabs;
