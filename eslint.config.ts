/**
 * @file YYC³ Design System — ESLint Configuration
 * @description ESLint 配置：TypeScript + React Hooks + JSX-A11y
 * @module config
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-27
 */

export const eslintConfig = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    project: "./tsconfig.json",
  },
  plugins: [
    "@typescript-eslint",
    "react-hooks",
    "jsx-a11y",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-role": "error",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-noninteractive-element-interactions": "warn",
    "jsx-a11y/label-has-associated-control": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": ["error", "always"],
    "sort-imports": ["warn", { ignoreDeclarationSort: true }],
  },
  settings: {
    react: { version: "detect" },
  },
  ignorePatterns: [
    "dist/",
    "node_modules/",
    "*.config.*",
    "*.d.ts",
  ],
};

export default eslintConfig;
