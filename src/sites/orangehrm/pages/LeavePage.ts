import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../../../core/BasePage.js';
import { LeaveElements } from '../elements/LeaveElements.js';

export type LeaveEntitlement = {
  leaveType: string;
  amount: string;
};

/** Leave UI behaviour and assertions for the isolated manual-case flows. */
export class LeavePage extends BasePage {
  readonly elements: LeaveElements;

  constructor(page: Page) {
    super(page);
    this.elements = new LeaveElements(page);
  }

  async openAddEntitlement(): Promise<void> {
    await this.elements.leaveMenuLink.click();
    await this.elements.entitlementsTab.click();
    await this.elements.addEntitlementLink.click();
    await this.expectPath(/\/web\/index\.php\/leave\/addLeaveEntitlement/);
  }

  async addEntitlement(employeeName: string, amount: string): Promise<LeaveEntitlement> {
    await this.elements.inputFor('Employee Name').fill(employeeName);
    await this.page.locator('.oxd-autocomplete-dropdown').getByText(employeeName, { exact: true }).click();
    const leaveType = await this.chooseFirstOption(this.elements.selectFor('Leave Type'));
    await this.elements.inputFor('Entitlement').fill(amount);
    await this.elements.saveButton.click();
    await expect(this.elements.successToast).toBeVisible();
    return { leaveType, amount };
  }

  async deleteEntitlementIfPresent(employeeName: string, leaveType?: string): Promise<void> {
    await this.elements.leaveMenuLink.click();
    await this.elements.entitlementsTab.click();
    await this.elements.employeeEntitlementsLink.click();
    await this.expectPath(/\/web\/index\.php\/leave\/viewLeaveEntitlements/);
    await this.elements.inputFor('Employee Name').fill(employeeName);
    await this.page.locator('.oxd-autocomplete-dropdown').getByText(employeeName, { exact: true }).click();
    if (leaveType) {
      await this.chooseOption(this.elements.selectFor('Leave Type'), leaveType);
    }
    await this.elements.searchButton.click();

    const entitlementRow = leaveType
      ? this.page.locator('.oxd-table-card').filter({ hasText: leaveType })
      : this.page.locator('.oxd-table-card');
    if (!(await entitlementRow.count())) {
      return;
    }

    await entitlementRow.first().getByRole('button').last().click();
    await this.elements.confirmDeleteButton.click();
    await expect(this.elements.successToast).toBeVisible();
  }

  async openApplyLeave(): Promise<void> {
    await this.elements.leaveMenuLink.click();
    await this.elements.applyLeaveLink.click();
    await this.expectPath(/\/web\/index\.php\/leave\/applyLeave/);
  }

  async applyLeave(leaveType: string, leaveDate: string): Promise<void> {
    await this.chooseOption(this.elements.selectFor('Leave Type'), leaveType);
    await this.elements.inputFor('From Date').fill(leaveDate);
    await this.elements.inputFor('To Date').fill(leaveDate);
    await this.elements.applyButton.click();
    await expect(this.elements.successToast).toBeVisible();
    await expect(this.page.getByText('Pending Approval', { exact: true })).toBeVisible();
  }

  async openLeaveList(): Promise<void> {
    await this.elements.leaveMenuLink.click();
    await this.expectPath(/\/web\/index\.php\/leave\/viewLeaveList/);
  }

  async searchLeaveRequest(employeeName: string): Promise<void> {
    await this.elements.inputFor('Employee Name').fill(employeeName);
    await this.page.locator('.oxd-autocomplete-dropdown').getByText(employeeName, { exact: true }).click();
    await this.elements.searchButton.click();
    await expect(this.elements.leaveRow(employeeName)).toBeVisible();
  }

  async approveLeaveRequest(employeeName: string): Promise<void> {
    const row = this.elements.leaveRow(employeeName);
    await row.locator('button[title="Approve"]').click();
    await expect(this.elements.successToast).toBeVisible();
    await expect(row).not.toContainText('Pending Approval');
  }

  async cancelLeaveRequest(employeeName: string): Promise<void> {
    const row = this.elements.leaveRow(employeeName);
    const cancelButton = row.locator('button[title="Cancel"]');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    await this.elements.confirmDeleteButton.click();
    await expect(this.elements.successToast).toBeVisible();
  }

  private async chooseOption(select: Locator, optionName: string): Promise<void> {
    await select.click();
    await this.page.getByRole('option', { name: optionName, exact: true }).click();
  }

  private async chooseFirstOption(select: Locator): Promise<string> {
    await select.click();
    const firstOption = this.page.getByRole('option').first();
    await expect(firstOption).toBeVisible();
    const optionName = (await firstOption.innerText()).trim();
    await firstOption.click();
    return optionName;
  }
}
