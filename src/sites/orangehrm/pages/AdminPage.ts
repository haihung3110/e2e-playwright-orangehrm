import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../../../core/BasePage.js';
import { AdminElements } from '../elements/AdminElements.js';

export type UserDraft = {
  username: string;
  password: string;
  employeeName: string;
};

/** Admin UI behaviour and assertions for test-only users. */
export class AdminPage extends BasePage {
  readonly elements: AdminElements;

  constructor(page: Page) {
    super(page);
    this.elements = new AdminElements(page);
  }

  async openUserManagement(): Promise<void> {
    await this.elements.adminMenuLink.click();
    await this.expectPath(/\/web\/index\.php\/admin\/viewSystemUsers/);
  }

  async openAddUser(): Promise<void> {
    await this.elements.addButton.click();
    await this.expectPath(/\/web\/index\.php\/admin\/saveSystemUser/);
  }

  async createEssUser(draft: UserDraft): Promise<void> {
    await this.chooseOption(this.elements.selectFor('User Role'), 'ESS');
    await this.elements.inputFor('Employee Name').fill(draft.employeeName);
    await this.page.locator('.oxd-autocomplete-dropdown').getByText(draft.employeeName, { exact: true }).click();
    await this.chooseOption(this.elements.selectFor('Status'), 'Enabled');
    await this.elements.inputFor('Username').fill(draft.username);
    await this.elements.inputFor('Password').fill(draft.password);
    await this.elements.inputFor('Confirm Password').fill(draft.password);
    await this.elements.saveButton.click();
    await expect(this.elements.successToast).toBeVisible();
  }

  async searchUser(username: string): Promise<void> {
    await this.elements.inputFor('Username').fill(username);
    await this.elements.searchButton.click();
    await expect(this.elements.userRow(username)).toBeVisible();
  }

  async expectUserVisible(username: string): Promise<void> {
    await expect(this.elements.userRow(username)).toBeVisible();
  }

  async deleteUser(username: string): Promise<void> {
    const row = this.elements.userRow(username);
    await expect(row).toBeVisible();
    await row.getByRole('button').last().click();
    await this.elements.confirmDeleteButton.click();
    await expect(this.elements.successToast).toBeVisible();
    await expect(row).toHaveCount(0);
  }

  async expectUserAbsent(username: string): Promise<void> {
    await this.elements.inputFor('Username').fill(username);
    await this.elements.searchButton.click();
    await expect(this.elements.userRow(username)).toHaveCount(0);
  }

  async expectAdminMenuUnavailable(): Promise<void> {
    await expect(this.elements.adminMenuLink).toHaveCount(0);
  }

  private async chooseOption(select: Locator, optionName: string): Promise<void> {
    await select.click();
    await this.page.getByRole('option', { name: optionName, exact: true }).click();
  }
}
