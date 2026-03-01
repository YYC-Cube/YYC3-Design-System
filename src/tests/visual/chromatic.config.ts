/**
 * YYC³ Design System — Chromatic Visual Regression Configuration
 *
 * Chromatic captures screenshots of every Storybook story and diffs them
 * against the baseline on every PR. This ensures visual consistency.
 *
 * Setup:
 *   1. Install: pnpm add -D chromatic
 *   2. Create a Chromatic project at https://www.chromatic.com
 *   3. Set CHROMATIC_PROJECT_TOKEN in GitHub Secrets
 *   4. Run: npx chromatic --project-token=<token>
 *
 * Five-High Alignment:
 *   - High Consistency: automated screenshot comparison
 *   - High Accessibility: can catch contrast/layout regressions visually
 */

export const chromaticConfig = {
  projectToken: process.env.CHROMATIC_PROJECT_TOKEN || 'YOUR_CHROMATIC_TOKEN',

  // ─── Build settings ───
  buildScriptName: 'build-storybook',
  storybookBuildDir: 'storybook-static',

  // ─── Snapshot settings ───
  delay: 300, // Wait 300ms for animations to settle
  diffThreshold: 0.063, // Pixel diff threshold (6.3%)
  pauseAnimationAtEnd: true, // Pause CSS animations for consistent screenshots

  // ─── Multi-theme snapshots ───
  // Each story should be captured in all 6 theme variants:
  //   future-light, future-dark, cyber-light, cyber-dark, business-light, business-dark
  modes: {
    'future-light': {
      theme: 'future',
      colorScheme: 'light',
      viewport: { width: 1280, height: 900 },
    },
    'future-dark': {
      theme: 'future',
      colorScheme: 'dark',
      viewport: { width: 1280, height: 900 },
    },
    'cyber-light': {
      theme: 'cyber',
      colorScheme: 'light',
      viewport: { width: 1280, height: 900 },
    },
    'cyber-dark': {
      theme: 'cyber',
      colorScheme: 'dark',
      viewport: { width: 1280, height: 900 },
    },
    'business-light': {
      theme: 'business',
      colorScheme: 'light',
      viewport: { width: 1280, height: 900 },
    },
    'business-dark': {
      theme: 'business',
      colorScheme: 'dark',
      viewport: { width: 1280, height: 900 },
    },
    mobile: {
      theme: 'future',
      colorScheme: 'light',
      viewport: { width: 375, height: 812 },
    },
  },

  // ─── CI settings ───
  exitZeroOnChanges: false, // Fail CI if visual changes detected without approval
  exitOnceUploaded: false, // Wait for build results
  onlyChanged: true, // Only test changed stories (faster)
  externals: ['**/*.css'], // Re-test when CSS changes
  skip: 'dependabot/**', // Skip bot PRs

  // ─── Turbosnap ───
  // Only re-render stories affected by code changes
  onlyStoryFiles: true,
};

/**
 * Storybook decorator for theme wrapping.
 * Add to .storybook/preview.tsx:
 *
 * ```tsx
 * import { ThemeProvider } from '../src/app/context/ThemeContext';
 * import { LanguageProvider } from '../src/app/context/LanguageContext';
 *
 * export const decorators = [
 *   (Story, context) => {
 *     const theme = context.globals.theme || 'future';
 *     const mode = context.globals.colorScheme || 'light';
 *     return (
 *       <ThemeProvider initialStyle={theme} initialMode={mode}>
 *         <LanguageProvider>
 *           <Story />
 *         </LanguageProvider>
 *       </ThemeProvider>
 *     );
 *   },
 * ];
 * ```
 */
export const storybookGlobals = {
  theme: {
    name: 'Theme',
    description: 'YYC³ visual theme',
    defaultValue: 'future',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'future', title: 'Future-Tech' },
        { value: 'cyber', title: 'Cyber-Punk' },
        { value: 'business', title: 'Business' },
      ],
    },
  },
  colorScheme: {
    name: 'Color Scheme',
    description: 'Light or Dark mode',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
    },
  },
};

export default chromaticConfig;
