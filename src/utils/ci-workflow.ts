/**
 * YYC³ Design System — CI/CD Workflow Definition (GitHub Actions)
 *
 * Pipeline: typecheck → lint → test → coverage → build → performance → visual-regression → deploy
 *
 * Five-High / Five-Standard / Five-Implementation Coverage:
 *   ✅ 自动化 (Automation)       — Full CI pipeline
 *   ✅ 高可访问性 (A11y)         — jest-axe + Lighthouse accessibility audit
 *   ✅ 高一致性 (Consistency)    — ESLint + Prettier + locale validation
 *   ✅ 高性能 (Performance)      — Lighthouse CI + bundle size budget
 *   ✅ 高可扩展性 (Extensibility) — Matrix builds, modular pipeline
 *   ✅ 可视化 (Visualization)    — Chromatic visual regression
 */

export const workflowYaml = `
name: YYC³ Design System CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '9'

concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ═══════════════════════════════════════════════
  # Stage 1: Typecheck + Lint + Format
  # ═══════════════════════════════════════════════
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: \${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile

      - name: TypeScript Check
        run: pnpm exec tsc --noEmit

      - name: ESLint
        run: pnpm lint

      - name: Prettier Check
        run: pnpm format:check

      - name: Locale Validation
        run: pnpm validate:locales

  # ═══════════════════════════════════════════════
  # Stage 2: Unit + Integration + A11y Tests
  # ═══════════════════════════════════════════════
  test:
    name: Tests
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: \${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile

      - name: Unit + Integration Tests
        run: pnpm test -- --coverage --ci --reporters=default --reporters=jest-junit
        env:
          JEST_JUNIT_OUTPUT_DIR: test-results

      - name: Upload Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
          retention-days: 14

      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/
          retention-days: 14

      - name: Coverage Threshold Check
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          echo "Line coverage: \${COVERAGE}%"
          if (( $(echo "\$COVERAGE < 80" | bc -l) )); then
            echo "::error::Coverage \${COVERAGE}% is below 80% threshold"
            exit 1
          fi

  # ═══════════════════════════════════════════════
  # Stage 3: Build + Bundle Analysis
  # ═══════════════════════════════════════════════
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: \${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile

      - name: Build Application
        run: pnpm build

      - name: Build Tokens
        run: node build-tokens.mjs

      - name: Bundle Size Check
        run: |
          JS_SIZE=$(du -sk dist/assets/*.js 2>/dev/null | awk '{sum+=$1} END {print sum+0}')
          CSS_SIZE=$(du -sk dist/assets/*.css 2>/dev/null | awk '{sum+=$1} END {print sum+0}')
          TOTAL_SIZE=$((JS_SIZE + CSS_SIZE))
          echo "JS: \${JS_SIZE}KB | CSS: \${CSS_SIZE}KB | Total: \${TOTAL_SIZE}KB"

          if [ "\$JS_SIZE" -gt 200 ]; then
            echo "::error::JS bundle \${JS_SIZE}KB exceeds 200KB budget"
            exit 1
          fi
          if [ "\$TOTAL_SIZE" -gt 500 ]; then
            echo "::error::Total bundle \${TOTAL_SIZE}KB exceeds 500KB budget"
            exit 1
          fi
          echo "✅ Bundle size within budget"

      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

  # ═══════════════════════════════════════════════
  # Stage 4: E2E Tests (Playwright)
  # ═══════════════════════════════════════════════
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: \${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium

      - name: Download Build
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Run E2E Tests
        run: pnpm test:e2e --project=chromium
        env:
          CI: true

      - name: Upload E2E Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: e2e-results
          path: |
            test-results/
            playwright-report/
          retention-days: 14

  # ═══════════════════════════════════════════════
  # Stage 5: Performance Audit (Lighthouse CI)
  # ═══════════════════════════════════════════════
  performance:
    name: Performance Audit
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: \${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile

      - name: Download Build
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Run Lighthouse CI
        run: |
          npx @lhci/cli autorun \\
            --collect.staticDistDir=dist \\
            --assert.assertions.categories:performance=error \\
            --assert.assertions.categories:accessibility=error \\
            --assert.assertions.first-contentful-paint="error;maxNumericValue=1500" \\
            --assert.assertions.largest-contentful-paint="error;maxNumericValue=2500" \\
            --assert.assertions.cumulative-layout-shift="error;maxNumericValue=0.1"

  # ═══════════════════════════════════════════════
  # Stage 6: Visual Regression (Chromatic)
  # ═══════════════════════════════════════════════
  visual:
    name: Visual Regression
    runs-on: ubuntu-latest
    needs: quality
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Needed for TurboSnap
      - uses: pnpm/action-setup@v4
        with:
          version: \${{ env.PNPM_VERSION }}
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile

      - name: Build Storybook
        run: pnpm build-storybook

      - name: Run Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: \${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          exitZeroOnChanges: false
          exitOnceUploaded: true
          onlyChanged: true

  # ═══════════════════════════════════════════════
  # Stage 7: Deploy (on main only)
  # ═══════════════════════════════════════════════
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    needs: [test, build, e2e, performance]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4

      - name: Download Build
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Deploy to Production
        run: echo "🚀 Deploy step — configure your deployment target here"
        # Examples:
        # - Vercel: npx vercel --prod --token=\${{ secrets.VERCEL_TOKEN }}
        # - Netlify: npx netlify deploy --prod --dir=dist
        # - AWS S3: aws s3 sync dist/ s3://your-bucket/
        # - GitHub Pages: uses: peaceiris/actions-gh-pages@v4
`;

/**
 * Recommended package.json scripts
 */
export const packageScripts = {
  lint: 'eslint src/ --max-warnings 0',
  'lint:fix': 'eslint src/ --fix',
  typecheck: 'tsc --noEmit',
  format: "prettier --write 'src/**/*.{ts,tsx,css,json}'",
  'format:check': "prettier --check 'src/**/*.{ts,tsx,css,json}'",
  test: 'jest --passWithNoTests',
  'test:watch': 'jest --watch',
  'test:coverage': 'jest --coverage',
  'test:a11y': 'jest --testPathPattern=a11y',
  'test:e2e': 'playwright test',
  'test:e2e:ui': 'playwright test --ui',
  'validate:locales': 'ts-node src/qa/locale-validation.ts',
  'build:tokens': 'node build-tokens.mjs',
  'build-storybook': 'storybook build',
  qa: 'pnpm typecheck && pnpm lint && pnpm test -- --coverage && pnpm format:check',
  'qa:fix': 'pnpm lint:fix && pnpm format',
  chromatic: 'chromatic --project-token=$CHROMATIC_PROJECT_TOKEN',
};

/**
 * Recommended devDependencies
 */
export const devDependencies = {
  // Testing
  jest: '^29.7.0',
  'ts-jest': '^29.2.0',
  '@jest/types': '^29.6.0',
  'jest-environment-jsdom': '^29.7.0',
  'jest-junit': '^16.0.0',
  '@testing-library/react': '^16.0.0',
  '@testing-library/jest-dom': '^6.5.0',
  '@testing-library/user-event': '^14.5.0',
  'jest-axe': '^9.0.0',
  '@types/jest-axe': '^3.5.0',
  'identity-obj-proxy': '^3.0.0',

  // E2E
  '@playwright/test': '^1.48.0',

  // Linting & Formatting
  eslint: '^9.0.0',
  '@typescript-eslint/eslint-plugin': '^8.0.0',
  '@typescript-eslint/parser': '^8.0.0',
  'eslint-plugin-react-hooks': '^5.0.0',
  'eslint-plugin-jsx-a11y': '^6.10.0',
  prettier: '^3.4.0',
  'prettier-plugin-tailwindcss': '^0.6.0',

  // Git hooks
  husky: '^9.1.0',
  'lint-staged': '^15.2.0',

  // Performance & Visual
  '@lhci/cli': '^0.14.0',
  chromatic: '^11.0.0',
};
