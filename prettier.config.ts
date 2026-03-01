/**
 * @file YYC³ Design System — Prettier Configuration
 * @description Prettier 配置：统一代码风格，支持 Tailwind CSS 类排序
 * @module config
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-27
 */

export const prettierConfig = {
  semi: true,
  singleQuote: false,
  trailingComma: "es5" as const,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always" as const,
  endOfLine: "lf" as const,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "cn", "cva"],
  overrides: [
    {
      files: "*.json",
      options: { tabWidth: 2, printWidth: 80 },
    },
    {
      files: "*.css",
      options: { singleQuote: false },
    },
  ],
};

export default prettierConfig;
