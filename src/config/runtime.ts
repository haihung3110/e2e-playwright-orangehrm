function booleanFromEnv(name: string, fallback: boolean): boolean {
  const value = process.env[name];

  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
}

function nonNegativeIntegerFromEnv(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value >= 0 ? value : fallback;
}

/** Runtime switches shared by the Playwright config and global setup. */
export const runtime = {
  headless: booleanFromEnv('PW_HEADLESS', Boolean(process.env.CI)),
  fullyParallel: booleanFromEnv('PW_FULLY_PARALLEL', false),
  workers: Math.max(1, nonNegativeIntegerFromEnv('PW_WORKERS', 1)),
  retries: nonNegativeIntegerFromEnv('PW_RETRIES', process.env.CI ? 2 : 0),
} as const;
