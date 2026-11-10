import type { Locator, Page } from '@playwright/test';

/** Locators that belong exclusively to the OrangeHRM Directory screen. */
export class DirectoryElements {
  readonly directoryMenuLink;
  readonly searchButton;

  constructor(private readonly page: Page) {
    this.directoryMenuLink = page.getByRole('link', { name: 'Directory' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
  }

  inputFor(label: string): Locator {
    return this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.getByText(label, { exact: true }) })
      .locator('input')
      .last();
  }

  employeeCard(fullName: string): Locator {
    return this.page.locator('.oxd-grid-item').filter({ hasText: fullName });
  }
}
