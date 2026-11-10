import type { Locator, Page } from '@playwright/test';

/** Locators that belong exclusively to OrangeHRM Leave screens. */
export class LeaveElements {
  readonly leaveMenuLink;
  readonly entitlementsTab;
  readonly addEntitlementLink;
  readonly employeeEntitlementsLink;
  readonly applyLeaveLink;
  readonly searchButton;
  readonly saveButton;
  readonly applyButton;
  readonly successToast;
  readonly confirmDeleteButton;

  constructor(private readonly page: Page) {
    this.leaveMenuLink = page.getByRole('link', { name: 'Leave' });
    this.entitlementsTab = page.getByRole('button', { name: 'Entitlements' });
    this.addEntitlementLink = page.getByRole('menuitem', { name: 'Add Entitlements' });
    this.employeeEntitlementsLink = page.getByRole('menuitem', { name: 'Employee Entitlements' });
    this.applyLeaveLink = page.getByRole('link', { name: 'Apply' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.applyButton = page.getByRole('button', { name: 'Apply' });
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

  leaveRow(fullName: string): Locator {
    return this.page.locator('.oxd-table-card').filter({ hasText: fullName });
  }
}
