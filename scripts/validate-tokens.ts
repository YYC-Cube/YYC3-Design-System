// path: src/qa/scripts/validate-tokens.ts
/**
 * YYC\u00b3 Design System \u2014 Token JSON Validation Script
 *
 * Validates `design/tokens.json` against the expected schema.
 * Uses a lightweight schema validation approach (no external deps).
 *
 * Usage:
 *   npx ts-node src/qa/scripts/validate-tokens.ts
 *
 * Five-High Alignment:
 *   - High Consistency: ensures tokens.json matches the expected structure
 *   - High Customizability: validates all themes have required color tokens
 */

import * as fs from "fs";
import * as path from "path";

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

interface ValidationError {
  path: string;
  message: string;
  severity: "error" | "warning";
}

const REQUIRED_COLOR_KEYS = [
  "primary",
  "primary-foreground",
  "background",
  "foreground",
  "destructive",
  "success",
  "warning",
];

const REQUIRED_SHARED_KEYS = ["spacing", "radius", "shadow", "animation", "icon"];

const THEME_NAMES = ["future", "cyber", "business"] as const;
const MODE_NAMES = ["light", "dark"] as const;

function validateTokens(tokensPath: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check file exists
  if (!fs.existsSync(tokensPath)) {
    errors.push({
      path: tokensPath,
      message: "File does not exist",
      severity: "error",
    });
    return errors;
  }

  // Parse JSON
  let tokens: any;
  try {
    const content = fs.readFileSync(tokensPath, "utf-8");
    tokens = JSON.parse(content);
  } catch (e) {
    errors.push({
      path: tokensPath,
      message: `Invalid JSON: ${(e as Error).message}`,
      severity: "error",
    });
    return errors;
  }

  // Check top-level structure
  if (!tokens.$schema) {
    errors.push({ path: "$schema", message: "Missing $schema field", severity: "warning" });
  }
  if (!tokens.version) {
    errors.push({ path: "version", message: "Missing version field", severity: "warning" });
  }
  if (!tokens.themes) {
    errors.push({ path: "themes", message: "Missing themes object", severity: "error" });
    return errors;
  }

  // Validate each theme
  for (const theme of THEME_NAMES) {
    if (!tokens.themes[theme]) {
      errors.push({
        path: `themes.${theme}`,
        message: `Missing theme "${theme}"`,
        severity: "error",
      });
      continue;
    }

    for (const mode of MODE_NAMES) {
      if (!tokens.themes[theme][mode]) {
        errors.push({
          path: `themes.${theme}.${mode}`,
          message: `Missing mode "${mode}" in theme "${theme}"`,
          severity: "error",
        });
        continue;
      }

      const colorSet = tokens.themes[theme][mode].color;
      if (!colorSet) {
        errors.push({
          path: `themes.${theme}.${mode}.color`,
          message: `Missing color object in ${theme}.${mode}`,
          severity: "error",
        });
        continue;
      }

      // Check required color keys
      for (const key of REQUIRED_COLOR_KEYS) {
        if (!colorSet[key]) {
          errors.push({
            path: `themes.${theme}.${mode}.color.${key}`,
            message: `Missing required color "${key}"`,
            severity: "error",
          });
        } else {
          // Validate color has oklch + hex
          const color = colorSet[key];
          if (typeof color === "object") {
            if (!color.oklch) {
              errors.push({
                path: `themes.${theme}.${mode}.color.${key}.oklch`,
                message: `Missing OKLCH value`,
                severity: "warning",
              });
            }
            if (!color.hex) {
              errors.push({
                path: `themes.${theme}.${mode}.color.${key}.hex`,
                message: `Missing HEX fallback`,
                severity: "error",
              });
            }
          }
        }
      }
    }
  }

  // Validate shared tokens
  if (tokens.themes.shared) {
    for (const key of REQUIRED_SHARED_KEYS) {
      if (!tokens.themes.shared[key]) {
        errors.push({
          path: `themes.shared.${key}`,
          message: `Missing shared token group "${key}"`,
          severity: "error",
        });
      }
    }

    // Validate spacing has 1-8
    if (tokens.themes.shared.spacing) {
      for (let i = 1; i <= 8; i++) {
        if (!tokens.themes.shared.spacing[String(i)]) {
          errors.push({
            path: `themes.shared.spacing.${i}`,
            message: `Missing spacing-${i}`,
            severity: "warning",
          });
        }
      }
    }

    // Validate animation has duration + easing
    if (tokens.themes.shared.animation) {
      if (!tokens.themes.shared.animation.duration) {
        errors.push({
          path: "themes.shared.animation.duration",
          message: "Missing animation duration tokens",
          severity: "error",
        });
      }
      if (!tokens.themes.shared.animation.easing) {
        errors.push({
          path: "themes.shared.animation.easing",
          message: "Missing animation easing tokens",
          severity: "error",
        });
      }
    }
  } else {
    errors.push({
      path: "themes.shared",
      message: "Missing shared tokens section",
      severity: "error",
    });
  }

  return errors;
}

function main(): void {
  console.log(`\n${BOLD}YYC\u00b3 Design System \u2014 Token Validation${RESET}\n`);

  const tokensPath = path.resolve(process.cwd(), "design/tokens.json");
  console.log(`Validating: ${tokensPath}\n`);

  const errors = validateTokens(tokensPath);
  const errorCount = errors.filter((e) => e.severity === "error").length;
  const warningCount = errors.filter((e) => e.severity === "warning").length;

  for (const err of errors) {
    const icon = err.severity === "error" ? `${RED}\u274c` : `${YELLOW}\u26a0\ufe0f`;
    console.log(`  ${icon} ${err.path}: ${err.message}${RESET}`);
  }

  console.log("");
  if (errorCount > 0) {
    console.log(`${RED}${BOLD}\u274c Validation failed: ${errorCount} error(s), ${warningCount} warning(s)${RESET}\n`);
    process.exit(1);
  } else if (warningCount > 0) {
    console.log(`${YELLOW}${BOLD}\u26a0\ufe0f Validation passed with ${warningCount} warning(s)${RESET}\n`);
  } else {
    console.log(`${GREEN}${BOLD}\u2705 Token validation passed! All checks OK.${RESET}\n`);
  }
}

main();
