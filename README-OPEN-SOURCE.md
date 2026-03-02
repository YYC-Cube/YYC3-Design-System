<div align="center">

<!-- Project Logo -->
<img src="https://yyc3-design-system.vercel.app/logo.svg" alt="YYC³ Design System Logo" width="200" height="200">

# YYC³ Design System

<!-- Badges -->
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://github.com/YYC-Cube/YYC3-Design-System/workflows/CI%2FCD/badge.svg)](https://github.com/YYC-Cube/YYC3-Design-System/actions)
[![codecov](https://codecov.io/gh/YYC-Cube/YYC3-Design-System/branch/main/graph/badge.svg)](https://codecov.io/gh/YYC-Cube/YYC3-Design-System)
[![npm version](https://badge.fury.io/js/yyc3-design-system.svg)](https://badge.fury.io/js/yyc3-design-system)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/yyc3-design-system)](https://bundlephobia.com/result?p=yyc3-design-system)
[![GitHub stars](https://img.shields.io/github/stars/YYC-Cube/YYC3-Design-System?style=social)](https://github.com/YYC-Cube/YYC3-Design-System/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/YYC-Cube/YYC3-Design-System?style=social)](https://github.com/YYC-Cube/YYC3-Design-System/network/members)
[![npm downloads](https://img.shields.io/npm/dm/yyc3-design-system)](https://www.npmjs.com/package/yyc3-design-system)

---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

**[Live Demo](https://yyc3-design-system.vercel.app/)**
·
**[Documentation](https://yyc3-design-system.vercel.app/docs)**
·
**[Storybook](https://yyc3-design-system.vercel.app/storybook)**

</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🎯 Philosophy](#-philosophy)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🎨 Usage](#-usage)
- [🧩 Components](#-components)
- [🎭 Themes](#-themes)
- [🌍 Internationalization](#-internationalization)
- [🧪 Testing](#-testing)
- [⚡ Performance](#-performance)
- [🔒 Security](#-security)
- [♿ Accessibility](#-accessibility)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## ✨ Features

### 🎨 Design System
- **Three Theme System**: Future (Futuristic Tech), Cyber (Cyberpunk), Business (Professional Business)
- **OKLCH Color Space**: Perceptually uniform color space with HEX fallback
- **Semantic Tokens**: Consistent design tokens across all components
- **Responsive Design**: Mobile-first responsive design principles
- **Dark Mode Support**: Complete dark mode tokens and theme switching

### 🛠️ Development
- **TypeScript Support**: Full type definitions and type-safe token access
- **Component Library**: 50+ reusable UI components
- **Automated Build**: Style Dictionary for token transformation
- **Single Source of Truth**: `design/tokens.json` as the source of truth
- **Figma Integration**: Bi-directional sync between Figma and code

### 🧪 Quality & Testing
- **Comprehensive Testing**: 1000+ test cases with 80%+ coverage
- **Visual Regression**: Chromatic for automated visual testing
- **E2E Testing**: Playwright for end-to-end testing
- **Accessibility Testing**: Jest-axe for accessibility validation
- **Performance Monitoring**: Lighthouse CI for performance tracking

### ⚡ Performance
- **Bundle Size Optimized**: <200KB gzipped
- **Tree Shaking**: Support for tree-shaking with ESM
- **Code Splitting**: Automatic code splitting with React.lazy
- **Performance Budget**: Enforced performance budgets
- **Web Vitals**: Core Web Vitals monitoring

### 🌍 Internationalization
- **Bilingual Support**: Chinese (zh-CN) and English (en-US)
- **Locale Validation**: Automated locale validation
- **Date & Number Formatting**: Intl API for formatting
- **RTL Support**: Right-to-left language support

### 🔒 Security
- **XSS Protection**: DOMPurify integration for XSS prevention
- **CSP Headers**: Content Security Policy configuration
- **Security Auditing**: npm audit and Snyk security scanning
- **Dependency Management**: Automated dependency updates

### ♿ Accessibility
- **WCAG 2.1 AA**: WCAG 2.1 Level AA compliant
- **ARIA Support**: Complete ARIA attributes and roles
- **Keyboard Navigation**: Full keyboard navigation support
- **Screen Reader**: Optimized for screen readers

### 🚀 CI/CD
- **Automated Testing**: Automated testing on every commit
- **Multi-Environment**: Preview, staging, and production deployments
- **Performance Monitoring**: Continuous performance monitoring
- **Security Scanning**: Automated security scanning
- **Visual Regression**: Automated visual regression testing

---

## 🎯 Philosophy

### Five Highs (五高)

- **High Availability**: System stability and reliability
- **High Performance**: Optimized loading and response times
- **High Security**: Strict security measures for data protection
- **High Scalability**: Flexible architecture for rapid expansion
- **High Maintainability**: Clear code structure for maintenance

### Five Standards (五标)

- **Standardization**: Unified development standards
- **Normalization**: Strict code norms and processes
- **Automation**: Automated build, test, and deployment
- **Intelligence**: Intelligent tools and assistance systems
- **Visualization**: Clear monitoring and visualization interfaces

### Five Transformations (五化)

- **Processization**: Standardized development processes
- **Documentation**: Comprehensive documentation system
- **Toolization**: Rich development tools ecosystem
- **Digitalization**: Digital management approaches
- **Ecosystem**: Open and collaborative ecosystem

---

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install yyc3-design-system

# Using yarn
yarn add yyc3-design-system

# Using pnpm
pnpm add yyc3-design-system
```

### Basic Usage

```tsx
import { Button, Card, ThemeProvider } from 'yyc3-design-system';

function App() {
  return (
    <ThemeProvider theme="future" mode="light">
      <Card>
        <h1>Welcome to YYC³ Design System</h1>
        <Button variant="primary">Get Started</Button>
      </Card>
    </ThemeProvider>
  );
}
```

### Development

```bash
# Clone the repository
git clone https://github.com/YYC-Cube/YYC3-Design-System.git

# Navigate to the project
cd YYC3-Design-System

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Start Storybook
pnpm storybook

# Run tests
pnpm test

# Build for production
pnpm build
```

---

## 📦 Installation

### Peer Dependencies

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  }
}
```

### Optional Dependencies

```bash
# For internationalization
npm install i18next react-i18next

# For animations
npm install framer-motion

# For icons
npm install lucide-react

# For forms
npm install react-hook-form zod
```

---

## 🎨 Usage

### Theme Configuration

```tsx
import { ThemeProvider } from 'yyc3-design-system';

function App() {
  return (
    <ThemeProvider
      theme="future"
      mode="light"
      locale="zh-CN"
    >
      <YourApp />
    </ThemeProvider>
  );
}
```

### Component Usage

```tsx
import {
  Button,
  Card,
  Input,
  Select,
  Badge,
  Avatar,
  // ... and more
} from 'yyc3-design-system';

function MyComponent() {
  return (
    <Card>
      <Avatar src="/avatar.png" alt="User Avatar" />
      <Badge variant="success">Active</Badge>
      <Input placeholder="Enter your name" />
      <Button variant="primary" size="lg">
        Submit
      </Button>
    </Card>
  );
}
```

### Custom Styling

```tsx
import { Button } from 'yyc3-design-system';
import { cn } from 'yyc3-design-system/utils';

function CustomButton() {
  return (
    <Button
      className={cn(
        "bg-blue-500 hover:bg-blue-600",
        "text-white font-semibold py-2 px-4 rounded-lg"
      )}
    >
      Custom Button
    </Button>
  );
}
```

---

## 🧩 Components

### Layout Components

- **Container**: Responsive container component
- **Grid**: CSS Grid layout system
- **Section**: Section divider component
- **Divider**: Visual divider component

### UI Components

- **Button**: Button with multiple variants and sizes
- **Input**: Text input with validation
- **Select**: Dropdown select component
- **Checkbox**: Checkbox component
- **Radio**: Radio button component
- **Switch**: Toggle switch component
- **Slider**: Range slider component
- **Progress**: Progress bar component
- **Badge**: Badge component for status
- **Avatar**: User avatar component
- **Card**: Card component for content grouping
- **Tabs**: Tab navigation component
- **Tooltip**: Tooltip component
- **Modal**: Modal/Dialog component
- **Alert**: Alert banner component
- **Toast**: Toast notification component
- **Dropdown**: Dropdown menu component
- **Menu**: Menu component

### Data Display Components

- **Table**: Data table component
- **List**: List component
- **Tree**: Tree view component
- **Tag**: Tag/Chip component
- **Stat**: Statistics display component
- **Chart**: Chart component (using Recharts)

### Feedback Components

- **Spinner**: Loading spinner
- **Skeleton**: Skeleton loading state
- **Progress**: Progress indicator
- **Alert**: Alert message
- **Toast**: Toast notification
- **Modal**: Modal dialog
- **Dialog**: Confirmation dialog

### Navigation Components

- **Navbar**: Navigation bar
- **Sidebar**: Sidebar navigation
- **Breadcrumb**: Breadcrumb navigation
- **Pagination**: Pagination component
- **Tabs**: Tab navigation
- **Menu**: Dropdown menu

### Form Components

- **Form**: Form container
- **Input**: Text input
- **Select**: Dropdown select
- **Checkbox**: Checkbox input
- **Radio**: Radio button
- **Switch**: Toggle switch
- **Slider**: Range slider
- **DatePicker**: Date picker
- **TimePicker**: Time picker
- **Upload**: File upload component

### Advanced Components

- **AIColorRecommender**: AI-powered color recommendation
- **AITokenGenerator**: AI-powered token generation
- **AIBestPractices**: AI-powered best practices suggestion
- **ThemeEditor**: Interactive theme editor
- **TokenPlayground**: Interactive token playground

---

## 🎭 Themes

### Future Theme

Futuristic technology theme with neon colors and modern aesthetics.

```tsx
<ThemeProvider theme="future" mode="light">
  <YourApp />
</ThemeProvider>
```

### Cyber Theme

Cyberpunk theme with vibrant colors and bold aesthetics.

```tsx
<ThemeProvider theme="cyber" mode="dark">
  <YourApp />
</ThemeProvider>
```

### Business Theme

Professional business theme with neutral colors and clean aesthetics.

```tsx
<ThemeProvider theme="business" mode="light">
  <YourApp />
</ThemeProvider>
```

### Theme Switching

```tsx
import { ThemeToggle } from 'yyc3-design-system';

function App() {
  return (
    <ThemeProvider theme="future" mode="light">
      <ThemeToggle />
      <YourApp />
    </ThemeProvider>
  );
}
```

---

## 🌍 Internationalization

### Supported Languages

- 🇨🇳 Chinese (zh-CN)
- 🇺🇸 English (en-US)

### Usage

```tsx
import { LanguageProvider } from 'yyc3-design-system';
import { useTranslation } from 'yyc3-design-system/i18n';

function App() {
  return (
    <LanguageProvider locale="zh-CN">
      <YourApp />
    </LanguageProvider>
  );
}

function MyComponent() {
  const { t, changeLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => changeLanguage('en-US')}>
        English
      </button>
      <button onClick={() => changeLanguage('zh-CN')}>
        中文
      </button>
    </div>
  );
}
```

### Adding New Languages

1. Create a new locale file in `src/i18n/locales/[locale].json`
2. Update `src/i18n/config.ts` with the new locale
3. Run `pnpm validate:locales` to validate

---

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests for a specific component
pnpm test -- Button
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests in headless mode
pnpm test:e2e --headless

# Run E2E tests for a specific browser
pnpm test:e2e --project=chromium
```

### Visual Regression Tests

```bash
# Run Storybook and Chromatic
pnpm build-storybook
npx chromatic --project-token=<your-token>
```

---

## ⚡ Performance

### Bundle Size

```
Main Bundle: 120 KB gzipped
Vendor Bundle: 80 KB gzipped
Total: 200 KB gzipped
```

### Core Web Vitals

```
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1
```

### Performance Optimization

- **Code Splitting**: Automatic code splitting with React.lazy
- **Tree Shaking**: Support for tree-shaking with ESM
- **Lazy Loading**: Lazy loading for images and components
- **Caching**: Aggressive caching strategies
- **CDN**: CDN distribution for static assets

---

## 🔒 Security

### Security Measures

- **XSS Protection**: DOMPurify integration
- **CSRF Protection**: CSRF token validation
- **CSP Headers**: Content Security Policy configuration
- **Input Validation**: Client-side and server-side validation
- **Dependency Scanning**: Automated security scanning

### Security Best Practices

```tsx
import { SafeHTML } from 'yyc3-design-system/security';

function MyComponent({ content }: { content: string }) {
  // Safe HTML rendering with DOMPurify
  return <SafeHTML html={content} />;
}
```

---

## ♿ Accessibility

### Accessibility Features

- **WCAG 2.1 AA**: WCAG 2.1 Level AA compliant
- **ARIA Support**: Complete ARIA attributes and roles
- **Keyboard Navigation**: Full keyboard navigation support
- **Screen Reader**: Optimized for screen readers
- **Color Contrast**: WCAG AA color contrast ratios
- **Focus Management**: Proper focus management
- **Skip Links**: Skip to content links

### Accessibility Testing

```bash
# Run accessibility tests
pnpm test:a11y
```

---

## 🤝 Contributing

We ❤️ contributions! Here's how you can help:

### How to Contribute

1. **Fork the Repository**: Click the "Fork" button at the top of the repository
2. **Clone Your Fork**: `git clone https://github.com/YOUR_USERNAME/YYC3-Design-System.git`
3. **Create a Branch**: `git checkout -b feature/your-feature-name`
4. **Make Your Changes**: Commit your changes with a descriptive message
5. **Push to Your Fork**: `git push origin feature/your-feature-name`
6. **Open a Pull Request**: Click the "New Pull Request" button

### Contribution Guidelines

- **Follow the Code Style**: Use the project's ESLint and Prettier configuration
- **Write Tests**: Include tests for your changes
- **Update Documentation**: Update the README and other documentation
- **Commit Messages**: Use clear and descriptive commit messages
- **Pull Request Description**: Provide a clear description of your changes

### Code of Conduct

Please be respectful and considerate of others. Read our [Code of Conduct](CODE_OF_CONDUCT.md) for more details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/YYC-Cube/YYC3-Design-System.git

# Navigate to the project
cd YYC3-Design-System

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Reporting Bugs

1. **Check Existing Issues**: Search the [issues](https://github.com/YYC-Cube/YYC3-Design-System/issues) to see if the bug has already been reported
2. **Create a New Issue**: If not, create a new issue with the following information:
   - Title: A clear and descriptive title
   - Description: A detailed description of the bug
   - Steps to Reproduce: Steps to reproduce the bug
   - Expected Behavior: What you expected to happen
   - Actual Behavior: What actually happened
   - Screenshots: Screenshots or screen recordings if applicable
   - Environment: Browser, OS, and version information

### Feature Requests

1. **Check Existing Issues**: Search the [issues](https://github.com/YYC-Cube/YYC3-Design-System/issues) to see if the feature has already been requested
2. **Create a New Issue**: If not, create a new issue with the following information:
   - Title: A clear and descriptive title
   - Description: A detailed description of the feature
   - Use Case: Why this feature is needed
   - Alternatives: Alternative solutions you've considered
   - Additional Context: Any other context or screenshots

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 YYC³ Design System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Design System Community**: For inspiration and best practices
- **React Community**: For the amazing React ecosystem
- **Open Source Contributors**: For their valuable contributions
- **Figma Team**: For the excellent design tool
- **Vercel Team**: For the amazing deployment platform

---

## 📞 Support

### Get Help

- **Documentation**: [https://yyc3-design-system.vercel.app/docs](https://yyc3-design-system.vercel.app/docs)
- **Storybook**: [https://yyc3-design-system.vercel.app/storybook](https://yyc3-design-system.vercel.app/storybook)
- **Issues**: [GitHub Issues](https://github.com/YYC-Cube/YYC3-Design-System/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YYC-Cube/YYC3-Design-System/discussions)
- **Discord**: [Join our Discord](https://discord.gg/yyc3)

### Contact

- **Email**: support@yyc3.com
- **Twitter**: [@YYC3DesignSystem](https://twitter.com/YYC3DesignSystem)
- **GitHub**: [YYC-Cube/YYC3-Design-System](https://github.com/YYC-Cube/YYC3-Design-System)

---

## 📊 Project Status

<div align="center">

<!-- Status Badges -->
[![Build Status](https://github.com/YYC-Cube/YYC3-Design-System/workflows/CI%2FCD/badge.svg)](https://github.com/YYC-Cube/YYC3-Design-System/actions)
[![codecov](https://codecov.io/gh/YYC-Cube/YYC3-Design-System/branch/main/graph/badge.svg)](https://codecov.io/gh/YYC-Cube/YYC3-Design-System)
[![GitHub issues](https://img.shields.io/github/issues/YYC-Cube/YYC3-Design-System)](https://github.com/YYC-Cube/YYC3-Design-System/issues)
[![GitHub closed issues](https://img.shields.io/github/issues-closed/YYC-Cube/YYC3-Design-System)](https://github.com/YYC-Cube/YYC3-Design-System/issues?q=is%3Aissue+is%3Aclosed)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/YYC-Cube/YYC3-Design-System)](https://github.com/YYC-Cube/YYC3-Design-System/pulls)
[![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/YYC-Cube/YYC3-Design-System)](https://github.com/YYC-Cube/YYC3-Design-System/pulls?q=is%3Apr+is%3Aclosed)

**Version**: 2.0.0
**Status**: 🟢 Stable
**Last Updated**: March 3, 2026

</div>

---

<div align="center">

**Made with ❤️ by YYC³ Team**

[⬆ Back to Top](#yyc³-design-system)

</div>
