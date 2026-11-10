import { expect, type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async visit(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  protected async expectPath(path: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(path);
  }

  protected async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  protected async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }
}
