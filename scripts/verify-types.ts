// path: src/qa/scripts/verify-types.ts
/**
 * YYC\u00b3 Design System \u2014 TypeScript Type Verification Script
 *
 * Runs `tsc --noEmit` as a standalone CI step to ensure all types are correct.
 *
 * Usage:
 *   npx ts-node src/qa/scripts/verify-types.ts
 *   OR in CI:
 *   pnpm typecheck
 *
 * Five-High Alignment:
 *   - High Consistency: enforces type safety across the entire codebase
 *   - High Extensibility: ensures component Props are correctly typed
 */

import { execSync } from "child_process";

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

function verifyTypes(): void {
  console.log(`\n${BOLD}YYC\u00b3 Design System \u2014 Type Verification${RESET}\n`);
  console.log("Running tsc --noEmit...\n");

  try {
    execSync("npx tsc --noEmit", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    console.log(`\n${GREEN}\u2705 Type check passed! All types are valid.${RESET}\n`);

    // Additional checks
    console.log("Verifying type definition files exist...");
    const requiredFiles = [
      "src/types/tokens.d.ts",
      "src/types/theme.d.ts",
      "src/types/language.d.ts",
      "src/types/components.d.ts",
      "src/types/animation.d.ts",
      "src/types/index.d.ts",
    ];

    const fs = require("fs");
    let allExist = true;
    for (const file of requiredFiles) {
      const exists = fs.existsSync(file);
      console.log(`  ${exists ? "\u2705" : "\u274c"} ${file}`);
      if (!exists) allExist = false;
    }

    if (!allExist) {
      console.error(`\n${RED}\u274c Some type definition files are missing!${RESET}`);
      process.exit(1);
    }

    console.log(`\n${GREEN}\u2705 All type definitions present.${RESET}\n`);
  } catch (error) {
    console.error(`\n${RED}\u274c Type check failed!${RESET}`);
    console.error("Fix the above TypeScript errors before committing.\n");
    process.exit(1);
  }
}

verifyTypes();
