import * as React from "react";
import { ThemeProvider } from "../src/theme/ThemeProvider";

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
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
    stylePreview: true
  },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#fbfbfc' },
      { name: 'dark', value: '#1a1a1a' }
    ]
  }
};
