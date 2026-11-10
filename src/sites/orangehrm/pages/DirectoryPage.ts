import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../../core/BasePage.js';
import { DirectoryElements } from '../elements/DirectoryElements.js';

/** Directory UI behaviour and assertions. */
export class DirectoryPage extends BasePage {
  readonly elements: DirectoryElements;

  constructor(page: Page) {
    super(page);
    this.elements = new DirectoryElements(page);
  }

  async open(): Promise<void> {
    await this.elements.directoryMenuLink.click();
    await this.expectPath(/\/web\/index\.php\/directory\/viewDirectory/);
  }

  async searchEmployee(fullName: string): Promise<void> {
    await this.elements.inputFor('Employee Name').fill(fullName);
    await this.page.locator('.oxd-autocomplete-dropdown').getByText(fullName, { exact: true }).click();
    await this.elements.searchButton.click();
    await expect(this.elements.employeeCard(fullName)).toBeVisible();
  }

  async openEmployeeCard(fullName: string): Promise<void> {
    const employeeCard = this.elements.employeeCard(fullName);
    await employeeCard.click();
    await expect(employeeCard).toBeVisible();
  }
}
