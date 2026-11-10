import { Locator, type Page } from '@playwright/test';
import { BasePage } from '../../../core/BasePage.js';
import { DashboardElements } from '../elements/DashboardElements.js';

export class DashboardPage extends BasePage {
  readonly elements: DashboardElements;

  constructor(page: Page) {
    super(page);
    this.elements = new DashboardElements(page);
  }

  protected async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  async open(): Promise<void> {
    await this.visit('/web/index.php/dashboard/index');
  }

  async expectLoaded(): Promise<void> {
    await this.expectPath(/\/web\/index\.php\/dashboard\/index/);
    await this.expectVisible(this.elements.heading);
    await this.expectVisible(this.elements.sidebar);
  }

  async logout(): Promise<void> {
    await this.elements.userDropdown.click();
    await this.elements.logoutLink.click();
    await this.expectPath(/\/web\/index\.php\/auth\/login/);
  }

  async logoutIfAvailable(): Promise<void> {
    if (await this.elements.userDropdown.isVisible()) {
      await this.logout();
    }
  }
}
