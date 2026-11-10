import type { Page } from '@playwright/test';

/** Locators belonging exclusively to the OrangeHRM dashboard screen. */
export class DashboardElements {
  readonly heading;
  readonly sidebar;
  readonly userDropdown;
  readonly logoutLink;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.sidebar = page.locator('aside.oxd-sidepanel');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.getByRole('menuitem', { name: 'Logout' });
  }
}
