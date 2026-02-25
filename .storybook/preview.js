import React from "react";
import { ThemeProvider, useTheme } from "../src/theme/ThemeProvider";

const ThemeWrapper = ({ children }) => {
  const { mode } = useTheme();
  
  const backgroundColor = mode === 'dark' ? '#1a1a1a' : '#fbfbfc';
  const color = mode === 'dark' ? '#f0f0f0' : '#1a1a1a';

  return (
    <div style={{ 
      padding: "2rem", 
      background: backgroundColor, 
      color: color,
      minHeight: "100vh",
      transition: 'background 0.2s ease, color 0.2s ease'
    }}>
      {children}
    </div>
  );
};

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <ThemeWrapper>
        <Story />
      </ThemeWrapper>
    </ThemeProvider>
  )
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
  darkMode: {
    current: 'light',
    darkClass: 'dark',
    lightClass: 'light',
    stylePreview: false
  }
};
