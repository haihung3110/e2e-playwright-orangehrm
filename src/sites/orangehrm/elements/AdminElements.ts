import type { Locator, Page } from '@playwright/test';

/** Locators that belong exclusively to OrangeHRM Admin / User Management. */
export class AdminElements {
  readonly adminMenuLink;
  readonly addButton;
  readonly saveButton;
  readonly searchButton;
  readonly successToast;
  readonly confirmDeleteButton;

  constructor(private readonly page: Page) {
    this.adminMenuLink = page.getByRole('link', { name: 'Admin' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.successToast = page.locator('.oxd-toast-content--success');
    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
  }

  inputFor(label: string): Locator {
    return this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.getByText(label, { exact: true }) })
      .locator('input')
      .last();
  }

  selectFor(label: string): Locator {
    return this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.getByText(label, { exact: true }) })
      .locator('.oxd-select-text');
  }

  userRow(username: string): Locator {
    return this.page.locator('.oxd-table-card').filter({ hasText: username });
  }
}
