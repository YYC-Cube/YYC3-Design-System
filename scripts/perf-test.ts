// path: src/qa/scripts/perf-test.ts
/**
 * YYC\u00b3 Design System \u2014 Performance Test Runner
 *
 * Equivalent to scripts/perf-test.sh but in TypeScript for cross-platform support.
 *
 * Steps:
 *   1. Start Vite preview server
 *   2. Wait for it to be ready
 *   3. Run Lighthouse CI
 *   4. Kill the server
 *
 * Usage:
 *   npx ts-node src/qa/scripts/perf-test.ts
 *
 * Five-High Alignment:
 *   - High Performance: FCP <= 1.5s, LCP <= 2.5s, JS <= 200KB
 *   - High Accessibility: Lighthouse a11y score >= 90
 */

import { execSync, spawn } from "child_process";

const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

const PREVIEW_PORT = 4173;
const PREVIEW_URL = `http://localhost:${PREVIEW_PORT}`;

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  const http = require("http");

  return new Promise((resolve, reject) => {
    const check = () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server at ${url} did not start within ${timeoutMs}ms`));
        return;
      }

      http
        .get(url, (res: any) => {
          if (res.statusCode === 200 || res.statusCode === 304) {
            resolve();
          } else {
            setTimeout(check, 500);
          }
        })
        .on("error", () => {
          setTimeout(check, 500);
        });
    };
    check();
  });
}

async function main(): Promise<void> {
  console.log(`\n${BOLD}YYC\u00b3 Design System \u2014 Performance Test${RESET}\n`);

  // Step 1: Build (if not already built)
  console.log(`${YELLOW}Step 1: Building application...${RESET}`);
  try {
    execSync("pnpm build", { stdio: "inherit" });
    console.log(`${GREEN}\u2705 Build complete.${RESET}\n`);
  } catch {
    console.error(`${RED}\u274c Build failed. Cannot run performance tests.${RESET}`);
    process.exit(1);
  }

  // Step 2: Start preview server
  console.log(`${YELLOW}Step 2: Starting preview server on port ${PREVIEW_PORT}...${RESET}`);
  const server = spawn("npx", ["vite", "preview", "--port", String(PREVIEW_PORT)], {
    stdio: "pipe",
    shell: true,
  });

  let serverPid = server.pid;

  try {
    // Step 3: Wait for server to be ready
    console.log(`${YELLOW}Step 3: Waiting for server...${RESET}`);
    await waitForServer(PREVIEW_URL);
    console.log(`${GREEN}\u2705 Server is ready at ${PREVIEW_URL}${RESET}\n`);

    // Step 4: Run Lighthouse CI
    console.log(`${YELLOW}Step 4: Running Lighthouse CI...${RESET}`);
    execSync(
      [
        "npx @lhci/cli autorun",
        `--collect.url=${PREVIEW_URL}`,
        "--collect.numberOfRuns=3",
        '--assert.assertions.categories:performance="error;minScore=0.85"',
        '--assert.assertions.categories:accessibility="error;minScore=0.90"',
        '--assert.assertions.first-contentful-paint="error;maxNumericValue=1500"',
        '--assert.assertions.largest-contentful-paint="error;maxNumericValue=2500"',
        '--assert.assertions.cumulative-layout-shift="error;maxNumericValue=0.1"',
        "--upload.target=temporary-public-storage",
      ].join(" "),
      { stdio: "inherit" }
    );

    console.log(`\n${GREEN}${BOLD}\u2705 Performance tests passed!${RESET}\n`);
  } catch (error) {
    console.error(`\n${RED}${BOLD}\u274c Performance tests failed!${RESET}`);
    console.error("Check the Lighthouse report for details.\n");
    process.exit(1);
  } finally {
    // Step 5: Kill server
    console.log(`${YELLOW}Stopping preview server (PID: ${serverPid})...${RESET}`);
    server.kill("SIGTERM");

    // Ensure cleanup on platforms where SIGTERM might not work
    try {
      if (process.platform === "win32") {
        execSync(`taskkill /PID ${serverPid} /T /F`, { stdio: "ignore" });
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}

main().catch((err) => {
  console.error(`${RED}\u274c Unexpected error:${RESET}`, err);
  process.exit(1);
});
