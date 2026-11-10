import { expect, type Page } from '@playwright/test';

export type StepRunner = <T>(title: string, action: () => Promise<T>) => Promise<T>;

/**
 * Shared business-flow primitives. Each instance belongs to one Playwright Page,
 * keeping tests safe when workers run in parallel.
 */
export abstract class BaseSteps {
  protected constructor(
    protected readonly page: Page,
    private readonly stepRunner?: StepRunner,
  ) {}

  protected async runStep<T>(title: string, action: () => Promise<T>): Promise<T> {
    return this.stepRunner ? this.stepRunner(title, action) : action();
  }

  protected async expectUrl(pathOrPattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pathOrPattern);
  }
}
