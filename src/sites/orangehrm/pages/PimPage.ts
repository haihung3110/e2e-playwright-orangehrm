import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../../core/BasePage.js';
import { PimElements } from '../elements/PimElements.js';

export type EmployeeDraft = {
  firstName: string;
  lastName: string;
  employeeId: string;
};

export type EmployeeRecord = EmployeeDraft & {
  employeeId: string;
  fullName: string;
};

/** PIM UI behaviour and assertions; test flows live in OrangeHrmSteps. */
export class PimPage extends BasePage {
  readonly elements: PimElements;

  constructor(page: Page) {
    super(page);
    this.elements = new PimElements(page);
  }

  async openAddEmployee(): Promise<void> {
    await this.elements.pimMenuLink.click();
    await this.elements.addEmployeeLink.click();
    await this.expectPath(/\/web\/index\.php\/pim\/addEmployee/);
  }

  async createEmployee(draft: EmployeeDraft): Promise<EmployeeRecord> {
    await this.elements.firstNameInput.fill(draft.firstName);
    await this.elements.lastNameInput.fill(draft.lastName);
    await this.elements.employeeIdInput.fill(draft.employeeId);

    const employeeId = await this.elements.employeeIdInput.inputValue();
    await this.elements.saveButton.click();
    await expect(this.elements.successToast).toBeVisible();
    await this.expectVisible(this.elements.personalDetailsHeading);

    return {
      ...draft,
      employeeId,
      fullName: `${draft.firstName} ${draft.lastName}`,
    };
  }

  async openEmployeeList(): Promise<void> {
    await this.elements.pimMenuLink.click();
    await this.elements.employeeListLink.click();
    await this.expectPath(/\/web\/index\.php\/pim\/viewEmployeeList/);
  }

  async searchEmployee(fullName: string): Promise<void> {
    const employeeNameInput = this.elements.inputFor('Employee Name');
    await employeeNameInput.fill(fullName);
    await this.page.locator('.oxd-autocomplete-dropdown').getByText(fullName, { exact: true }).click();
    await this.elements.searchButton.click();
    await expect(this.elements.employeeRow(fullName)).toBeVisible();
  }

  async openEmployee(fullName: string): Promise<void> {
    const [firstName] = fullName.split(' ');
    await this.elements.employeeRow(fullName).getByRole('cell', { name: firstName, exact: true }).click();
    await this.expectVisible(this.elements.personalDetailsHeading);
  }

  async updateOtherId(otherId: string): Promise<void> {
    await this.elements.inputFor('Other Id').fill(otherId);
    await this.elements.saveButton.click();
    await expect(this.elements.successToast).toBeVisible();
    await this.page.reload();
    await expect(this.elements.inputFor('Other Id')).toHaveValue(otherId);
  }

  async deleteEmployee(fullName: string): Promise<void> {
    const row = this.elements.employeeRow(fullName);
    await expect(row).toBeVisible();
    await row.getByRole('button').last().click();
    await this.elements.confirmDeleteButton.click();
    await expect(this.elements.successToast).toBeVisible();
    await expect(row).toHaveCount(0);
  }

  async expectEmployeeAbsent(employeeId: string, fullName: string): Promise<void> {
    await this.elements.inputFor('Employee Id').fill(employeeId);
    await this.elements.searchButton.click();
    await expect(this.elements.employeeRow(fullName)).toHaveCount(0);
  }
}
