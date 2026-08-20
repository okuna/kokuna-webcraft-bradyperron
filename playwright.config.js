/** @type {import('@playwright/test').PlaywrightTestConfig} */
const E2E_PORT = 4173;
const E2E_BASE_URL = `http://127.0.0.1:${E2E_PORT}`;
const E2E_SERVER_COMMAND = [
  "set -eu",
  `E2E_WORKDIR="/tmp/bradyperron-e2e-${E2E_PORT}"`,
  'rm -rf "$E2E_WORKDIR"',
  'mkdir -p "$E2E_WORKDIR"',
  'trap \'rm -rf "$E2E_WORKDIR"\' EXIT',
  'cp -a package.json next.config.ts next-env.d.ts postcss.config.mjs tsconfig.json public src "$E2E_WORKDIR/"',
  'cp -a --reflink=auto node_modules "$E2E_WORKDIR/"',
  'cd "$E2E_WORKDIR"',
  "npm run build",
  `npm run start -- -H 127.0.0.1 -p ${E2E_PORT}`,
].join(" && ");

const config = {
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 45_000,
  expect: {
    timeout: 8_000,
  },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: E2E_BASE_URL,
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: E2E_SERVER_COMMAND,
    url: E2E_BASE_URL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
};

module.exports = config;
