# YYC³ Design System — Agent Guide

> This document helps AI agents work effectively in this repository.

## Project Overview

YYC³ Design System is an enterprise-level, open-source design system built on the "Five-High, Five-Standard, Five-Implementation" philosophy. It provides a complete design solution with three switchable themes, bilingual support (Chinese/English), and comprehensive testing infrastructure.

**Key Characteristics:**
- Multi-framework design system (React 18.3.1, Vue 3, Svelte)
- Three theme presets: Future (tech), Cyber (punk), Business (professional)
- Each theme supports light/dark modes
- OKLCH color space with HEX fallback
- Bilingual support (zh/en) with real-time switching
- PWA capabilities (offline, push notifications, installable)
- AI-powered features (token generation, color recommendations, consistency checking)
- Complete testing coverage (unit, integration, E2E, a11y, performance)

## Essential Commands

### Development

```bash
# Start development server (port 3200)
npm run dev

# Start Storybook (port 6006)
npm run storybook

# Build Storybook
npm run build-storybook
```

### Build & Tokens

```bash
# Build the project
npm run build

# Build design tokens (from design/tokens.json)
npm run build:tokens

# Watch tokens for changes
npm run watch:tokens
```

### Testing

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit          # Unit tests (Jest)
npm run test:integration    # Integration tests
npm run test:e2e           # E2E tests (Playwright)
npm run test:a11y         # Accessibility tests
npm run test:perf         # Performance tests
npm run test:oklch        # OKLCH color conversion validation

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Code Quality

```bash
# TypeScript type checking
npm run typecheck

# ESLint
npm run lint              # Check
npm run lint:fix          # Fix auto-fixable issues

# Prettier
npm run format            # Format code
npm run format:check      # Check formatting

# Validation scripts
npm run validate:locales  # Validate i18n files
npm run validate:tokens   # Validate design tokens
npm run validate:types    # Validate TypeScript types
```

### Complete QA

```bash
# Run full quality check (typecheck + lint + test + e2e)
npm run qa
```

### Git Hooks

```bash
# Pre-commit check (runs automatically)
npm run precommit

# Pre-push check (runs automatically)
npm run prepush
```

## Project Structure

```
yyc3-Design-System/
├── design/                    # Design token source files
│   ├── tokens.json           # Single source of truth for all themes
│   ├── tokens.dark.json      # Dark mode tokens
│   └── tokens-schema.json   # Token validation schema
│
├── src/
│   ├── components/           # React components
│   │   ├── ui/            # Shadcn-style components (Radix UI based)
│   │   ├── __tests__/      # Component tests
│   │   ├── AIColorRecommender.tsx
│   │   ├── AITokenGenerator.tsx
│   │   └── ...
│   ├── vue/                 # Vue 3 component ports
│   ├── svelte/              # Svelte component ports
│   ├── theme/               # Theme system (ThemeProvider, useTheme)
│   ├── i18n/               # Internationalization (LanguageProvider, t())
│   ├── stores/              # Zustand state management
│   ├── utils/               # Utility functions
│   ├── ai/                  # AI feature modules
│   ├── security/            # Security components (XSS, CSP, CSRF)
│   ├── performance/          # Performance monitoring
│   ├── collaboration/       # Real-time collaboration features
│   ├── pwa/                 # Service worker and PWA logic
│   ├── pages/               # Page components (Overview, Components, etc.)
│   ├── stories/             # Storybook stories
│   └── types/               # TypeScript type definitions
│
├── types/                   # Global type definitions
├── public/                  # Static assets
│   ├── pwa/               # PWA manifest and icons
│   └── android/            # Android app icons
│
├── docs/                    # Extensive documentation
├── scripts/                 # Build and automation scripts
├── tests/                   # Standalone tests (oklch, performance)
├── e2e/                    # Playwright E2E tests
├── .github/workflows/       # CI/CD workflows
├── .storybook/              # Storybook configuration
├── .husky/                 # Git hooks
└── design/                  # Design tokens and schemas
```

## Code Patterns & Conventions

### Component Structure

**React Components:**
```typescript
// Standard pattern: memo + displayName
export const Button = memo<ButtonProps>(
  ({ children, variant = 'default', onClick, ...props }) => {
    // Implementation
  }
);

Button.displayName = 'Button';
export default Button;
```

**Shadcn UI Components:**
```typescript
// Radix-based components use forwardRef and class-variance-authority
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return <button ref={ref} className={cn(buttonVariants({ variant, className }))} {...props} />
  }
);
Button.displayName = 'Button';
```

**Testing Pattern:**
```typescript
describe('ComponentName', () => {
  describe('Feature Group', () => {
    it('should do something', () => {
      // Arrange
      render(<ComponentUnderTest />);
      // Act
      // Assert
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
```

### Styling Approaches

**Two Coexisting Patterns:**

1. **Style-based components** (legacy/custom): Use inline styles with theme tokens
   ```typescript
   const { tokens } = useTheme();
   const style = { color: tokens['color.primary'] as string };
   ```

2. **Class-based components** (modern/Shadcn): Use Tailwind + CSS variables
   ```typescript
   import { cn } from '@/components/ui/utils';
   <div className={cn('base-styles', variantStyles)} />
   ```

**Tailwind Configuration:**
- All theme values reference CSS variables (`var(--primary)`, `var(--spacing-1)`, etc.)
- See `tailwind.config.ts` for variable mappings
- Use `cn()` utility from `src/components/ui/utils.ts` for class merging

### File Naming

- **Components**: `PascalCase.tsx` (e.g., `Button.tsx`, `AIColorRecommender.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `token-utils.ts`, `theme-persistence.ts`)
- **Tests**: `*.test.tsx` (adjacent to component) or `__tests__/ComponentName.test.tsx`
- **Stories**: `*.stories.tsx` (adjacent to component)
- **Types**: `*.d.ts` or `*.ts` in types/ directory

### Imports

Use path alias `@/` for src directory:
```typescript
import { Button } from '@/components/ui/button';
import { useTheme } from '@/theme/useTheme';
import { cn } from '@/components/ui/utils';
```

## Theme System

### Architecture

Three themes × Two modes = Six combinations:
- **Future**: Blue/tech aesthetic (default)
- **Cyber**: Pink/purple cyberpunk aesthetic
- **Business**: Blue/gray professional aesthetic

Each has light/dark modes.

### Usage

```typescript
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

// Wrap app with provider
<ThemeProvider defaultTheme="future" defaultMode="dark">
  <App />
</ThemeProvider>

// Access theme in components
const { tokens, mode, setMode, theme } = useTheme();
```

### Token Structure

Single source: `design/tokens.json`

```json
{
  "themes": {
    "future": {
      "light": {
        "color": {
          "primary": { "oklch": "oklch(0.55 0.18 260)", "hex": "#2563eb" }
        }
      }
    }
  }
}
```

**Important:**
- OKLCH is primary format for color perception
- HEX is fallback for browser compatibility
- Tokens are built via `npm run build:tokens` into CSS variables and TypeScript types

### Theme Switching

Keyboard shortcuts:
- `Ctrl/Cmd + K`: Switch theme (Future ↔ Cyber ↔ Business)
- `Ctrl/Cmd + Shift + K`: Toggle mode (light ↔ dark)

## Internationalization (i18n)

### Architecture

Bilingual support: Chinese (zh) and English (en)

### Usage

```typescript
import { LanguageProvider, useLanguage } from '@/i18n/LanguageProvider';

// Wrap app
<LanguageProvider defaultLanguage="zh">
  <App />
</LanguageProvider>

// Access in components
const { lang, setLang, toggleLang, t } = useLanguage();

// Translation patterns
t('nav.home')                          // Key-based lookup
t('欢迎', 'Welcome')                    // Direct translation
```

### Translation Files

Located in `src/locales/`:
- `zh.json` - Chinese translations
- `en.json` - English translations

**Validation:** Run `npm run validate:locales` to check completeness and consistency

### Language Switching

Keyboard shortcut: `Ctrl/Cmd + Alt + L`

## Testing Strategy

### Coverage Requirements

- **Minimum**: 80% across all metrics (lines, branches, functions, statements)
- **Target**: 85%+
- **Enforced**: CI/CD pipeline fails if below 80%

### Test Types

| Type | Framework | Location | Command |
|------|-----------|-----------|---------|
| Unit | Jest | `**/__tests__/**/*.{ts,tsx}`, `**/*.test.{ts,tsx}` | `npm run test:unit` |
| Integration | Jest | Same as unit | `npm run test:integration` |
| E2E | Playwright | `src/tests/e2e/` | `npm run test:e2e` |
| Accessibility | axe-core | `src/tests/a11y/` | `npm run test:a11y` |
| Performance | Lighthouse | N/A | `npm run test:perf` |

### Test Writing Guidelines

1. **Arrange-Act-Assert pattern**
2. **Test user behavior, not implementation details**
3. **Use `screen` queries from @testing-library/dom**
4. **Mock external dependencies**
5. **Test error states and edge cases**
6. **Add data-testid attributes for test selection**

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should render', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle interaction', () => {
    const handleClick = jest.fn();
    render(<Component onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## AI Features

### Available AI Modules

Located in `src/ai/`:

- **AIAccessibilityChecker**: WCAG compliance checks
- **AIColorRecommender**: Color palette suggestions
- **AIComponentRecommender**: Component usage suggestions
- **AIConsistencyChecker**: Design consistency validation
- **AITokenGenerator**: Design token generation
- **AIPerformanceOptimizer**: Performance improvement suggestions
- **AIUsageAnalyzer**: Usage pattern analysis
- **AIBestPractices**: Best practice recommendations

### Using AI Features

```typescript
import { AITokenGenerator } from '@/components/AITokenGenerator';
import { AIColorRecommender } from '@/components/AIColorRecommender';

// Components include AI functionality
<AITokenGenerator />
<AIColorRecommender />
```

## Security Features

### Security Components

Located in `src/security/`:

- **XSSProtection**: XSS attack prevention
- **CSPProvider**: Content Security Policy
- **CSRFProtection**: CSRF token management

### Security Testing

```bash
# Run security-focused tests
npm run test:a11y  # Includes security checks
```

**Best Practices:**
- Never trust user input
- Sanitize all HTML (DOMPurify available)
- Validate all props
- Use `data-testid` for testing instead of class names

## Performance Optimization

### Optimization Strategies

1. **Code Splitting**: Automatic vendor chunking (React, Radix, etc.)
2. **Tree Shaking**: Unused code removal
3. **Compression**: Gzip and Brotli
4. **Image Optimization**: Lazy loading, responsive images
5. **Font Optimization**: Preloading, subsetting, display optimization
6. **Resource Preloading**: Critical resources prioritized

### Performance Budgets

| Metric | Budget | Current |
|--------|---------|---------|
| JS Bundle Size | ≤200KB | ~180KB |
| Total Resources | ≤512KB | ~450KB |
| LCP | ≤2.5s | ~2.0s |
| FCP | ≤1.5s | ~1.2s |
| CLS | ≤0.1 | ~0.05 |
| FID | ≤100ms | ~80ms |

### Monitoring

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Built-in performance monitoring
```

## PWA Features

### PWA Architecture

- **Service Worker**: `src/pwa/service-worker.ts`
- **Manifest**: `public/pwa/manifest.json`
- **Offline Support**: Cache-first strategy

### PWA Usage

```typescript
import { PWAProvider } from '@/components/PWAProvider';

<PWAProvider
  appName="YYC³ Design System"
  appShortName="YYC³"
  themeColor="#3A9FFB"
>
  <App />
</PWAProvider>
```

### PWA Features

- Offline access
- Installable as native app
- Push notifications
- Background sync
- Dynamic manifest generation based on theme

## CI/CD Pipeline

### Workflow Structure

Located in `.github/workflows/ci-cd.yml`:

| Job | Purpose | Dependencies |
|-----|---------|---------------|
| quality | Code quality checks (lint, typecheck, format) | None |
| test | Unit + integration tests + coverage | quality |
| build | Production build + bundle size check | quality |
| e2e | End-to-end tests | build |
| performance | Lighthouse CI performance tests | build |
| visual | Chromatic visual regression (PRs only) | quality |
| preview | Netlify preview deployment (PRs) | build |
| deploy | GitHub Pages production deploy | test, build, e2e, performance |

### Quality Gates

- **TypeScript**: Must pass typecheck
- **ESLint**: Must pass (warnings allowed)
- **Prettier**: Must pass formatting check
- **Tests**: Must pass with ≥80% coverage
- **Build**: Must succeed
- **Bundle Size**: Must not exceed 200KB
- **Lighthouse**: Must score ≥85 (performance), ≥90 (accessibility)

### Deployment

**Triggers:**
- `main` branch → Deploy to GitHub Pages (production)
- PRs → Deploy to Netlify preview

**Artifacts:**
- Coverage reports (14-day retention)
- E2E test results (14-day retention)
- Build artifacts (7-day retention)

## Code Style & Linting

### ESLint Configuration

Located in `eslint.config.js`:

**Key Rules:**
- React hooks: Strict enforcement
- TypeScript: Type safety with `no-explicit-any` as warning
- Unused variables: Warn, allow underscore prefix (`_`)
- Console: Warn (allow warn/error/log)
- Import/export: Enforce proper module structure

### Prettier Configuration

Located in `prettier.config.ts`:

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Tailwind Plugin:** Automatically sorts Tailwind classes

### Type Checking

```bash
npm run typecheck  # tsc --noEmit
```

**TypeScript Configuration:**
- Strict mode enabled
- Path aliases: `@/*` → `./src/*`
- Target: ES2020
- Module: ESNext with bundler resolution

## Important Gotchas

### Theme System

1. **Two styling patterns coexist**: Some components use inline styles with tokens, others use Tailwind classes. When adding new components, prefer the Tailwind/CSS variable pattern (Shadcn style).

2. **Token building**: After modifying `design/tokens.json`, always run `npm run build:tokens` to regenerate CSS variables and TypeScript types.

3. **Theme switching**: Some components may not update immediately when theme changes. Ensure components use the `useTheme` hook to access theme tokens reactively.

### Testing

1. **Test isolation**: Each test should be independent. Use `beforeEach` and `afterEach` for cleanup.

2. **Mocking**: Mock external dependencies, especially API calls and localStorage. Use `jest.clearAllMocks()` between tests.

3. **Coverage enforcement**: CI/CD will fail if coverage drops below 80%. Run `npm run test:coverage` locally before pushing.

4. **Test location**: Tests should be adjacent to components (`Component.test.tsx`) or in `__tests__/` directories.

### Internationalization

1. **Translation completeness**: Always add translations for both languages. Run `npm run validate:locales` to check.

2. **Keys vs direct translations**: Use key-based (`t('nav.home')`) for repeated text, direct translations (`t('中文', 'English')`) for one-off text.

3. **Language switching**: Components using `useLanguage` hook will update automatically. Hardcoded strings won't update.

### Build & Deployment

1. **Bundle size**: Watch bundle size closely. If it exceeds 200KB, CI/CD will fail. Use code splitting and lazy loading to manage size.

2. **Environment variables**: Never commit `.env` files. Use GitHub Secrets for sensitive data.

3. **Static assets**: Images and fonts in `public/` are served as-is. Optimize before committing.

### Git Workflow

1. **Pre-commit hook**: Runs `npm run precommit` automatically. Includes linting and type checking. If it fails, commit will be blocked.

2. **Conventional commits**: Use conventional commit format: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`, `ci:`, `build:`.

3. **Branch strategy**:
   - `main`: Production
   - `develop`: Development
   - `feature/*`: Feature branches
   - `hotfix/*`: Emergency fixes

### Dependencies

1. **Radix UI**: Used for accessible primitives. Import from `@radix-ui/react-*` packages.

2. **Lucide React**: Icon library. Import from `lucide-react`.

3. **Zustand**: State management. Stores in `src/stores/`.

4. **Class Variance Authority (CVA)**: For variant-based styling in Shadcn components.

5. **Tailwind Merge**: For merging Tailwind classes without conflicts (`cn()` utility).

### Type Safety

1. **Any types**: Avoid `any`. Use `unknown` for truly unknown types. `any` is allowed in tests.

2. **Type definitions**: Global types in `types/` directory, component-specific types inline or in adjacent `types.ts` files.

3. **Token types**: Design tokens have strict type definitions. Always use `tokens['color.primary'] as string` pattern when accessing tokens.

### Performance

1. **Re-renders**: Use `React.memo` for expensive components. Use `useCallback` and `useMemo` for optimization.

2. **Lazy loading**: Use `React.lazy()` for code splitting large components.

3. **Image optimization**: Use `LazyImage` component for images below the fold.

### Accessibility

1. **ARIA attributes**: Always include appropriate ARIA attributes (`aria-label`, `aria-describedby`, etc.).

2. **Keyboard navigation**: Ensure all interactive elements are keyboard accessible.

3. **Color contrast**: Use the built-in `ColorContrastChecker` to verify WCAG AA compliance (4.5:1 for normal text, 3:1 for large text).

4. **Testing**: Run `npm run test:a11y` before merging.

### Documentation

1. **File headers**: All files should include JSDoc-style file headers with `@file`, `@description`, `@module`, `@author`, `@version`, `@created`, `@updated`.

2. **Component documentation**: Use Storybook for component documentation. Include `.stories.tsx` files for all components.

3. **API documentation**: Document public APIs with JSDoc comments.

4. **README**: Keep `README.md` updated with current features and commands.

## Common Tasks

### Adding a New Component

1. Create component file in `src/components/` or `src/components/ui/`
2. Use memo + displayName pattern
3. Add TypeScript props interface
4. Create test file (`ComponentName.test.tsx`)
5. Create Storybook story (`ComponentName.stories.tsx`)
6. Export from `src/components/index.ts` (if in root components/)

### Updating Design Tokens

1. Edit `design/tokens.json` (single source of truth)
2. Run `npm run build:tokens` to regenerate
3. Verify changes in development mode
4. Update affected tests

### Adding Translations

1. Edit `src/locales/zh.json` and `src/locales/en.json`
2. Run `npm run validate:locales` to check completeness
3. Update components to use new keys

### Running Tests

```bash
# All tests
npm test

# Watch mode during development
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm test -- Button.test.tsx
```

### Debugging

1. **Component rendering**: Use React DevTools
2. **Theme issues**: Check `design/tokens.json` and run `npm run build:tokens`
3. **Build errors**: Run `npm run typecheck` first, then check specific error messages
4. **Test failures**: Run specific test with verbose output: `npm test -- --verbose ComponentName.test.tsx`

## Resources

- **Documentation**: `docs/` directory (extensive project documentation)
- **Team Standards**: `.trae/rules/yyc3.md` (YYC³ coding standards and practices)
- **Storybook**: `npm run storybook` (port 6006)
- **Online Docs**: https://yyc3-design-system.netlify.app/
- **GitHub**: https://github.com/YYC-Cube/YYC3-Design-System

## Version Information

- **Current Version**: 2.0.0
- **Node Version**: ≥20.0.0
- **NPM Version**: ≥10.0.0
- **React**: 18.3.1
- **TypeScript**: 5.9.3
- **Vite**: 5.4.21
- **Tailwind CSS**: 4.2.0

## Support

For questions or issues:
- Check `docs/` directory first
- Review `.trae/rules/yyc3.md` for coding standards
- Create an issue on GitHub
- Contact: admin@0379.email

---

**Last Updated**: 2026-03-03
**Maintained By**: YYC³ Team
