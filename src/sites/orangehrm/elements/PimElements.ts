import type { Locator, Page } from '@playwright/test';

/** Locators that belong exclusively to OrangeHRM PIM screens. */
export class PimElements {
  readonly pimMenuLink;
  readonly addEmployeeLink;
  readonly employeeListLink;
  readonly firstNameInput;
  readonly lastNameInput;
  readonly employeeIdInput;
  readonly saveButton;
  readonly searchButton;
  readonly personalDetailsHeading;
  readonly successToast;
  readonly confirmDeleteButton;

  constructor(private readonly page: Page) {
    this.pimMenuLink = page.getByRole('link', { name: 'PIM' });
    this.addEmployeeLink = page.getByRole('link', { name: 'Add Employee' });
    this.employeeListLink = page.getByRole('link', { name: 'Employee List' });
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = this.inputFor('Employee Id');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
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

  employeeRow(fullName: string): Locator {
    return this.page.locator('.oxd-table-card').filter({ hasText: fullName });
  }
}
