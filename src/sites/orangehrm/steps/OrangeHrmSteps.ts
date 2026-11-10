import { type Page } from '@playwright/test';
import { BaseSteps, type StepRunner } from '../../../core/BaseSteps.js';
import { AdminPage, type UserDraft } from '../pages/AdminPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { DirectoryPage } from '../pages/DirectoryPage.js';
import { LeavePage, type LeaveEntitlement } from '../pages/LeavePage.js';
import { LoginPage } from '../pages/LoginPage.js';
import { PimPage, type EmployeeDraft, type EmployeeRecord } from '../pages/PimPage.js';

export type { EmployeeDraft, EmployeeRecord } from '../pages/PimPage.js';
export type { LeaveEntitlement } from '../pages/LeavePage.js';
export type { UserDraft } from '../pages/AdminPage.js';

/** Reusable OrangeHRM business flows used directly by specs and global setup. */
export class OrangeHrmSteps extends BaseSteps {
  private readonly loginPage: LoginPage;
  private readonly dashboardPage: DashboardPage;
  private readonly pimPage: PimPage;
  private readonly adminPage: AdminPage;
  private readonly leavePage: LeavePage;
  private readonly directoryPage: DirectoryPage;

  constructor(page: Page, stepRunner?: StepRunner) {
    super(page, stepRunner);
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.pimPage = new PimPage(page);
    this.adminPage = new AdminPage(page);
    this.leavePage = new LeavePage(page);
    this.directoryPage = new DirectoryPage(page);
  }

  async openLoginPage(): Promise<void> {
    await this.runStep('Open the OrangeHRM login page', () => this.loginPage.open());
  }

  async expectLoginForm(): Promise<void> {
    await this.runStep('Verify the login form is displayed', () => this.loginPage.expectForm());
  }

  async submitCredentials(username: string, password: string): Promise<void> {
    await this.runStep('Submit login credentials', () => this.loginPage.submitCredentials(username, password));
  }

  async loginAndExpectDashboard(username: string, password: string): Promise<void> {
    await this.openLoginPage();
    await this.submitCredentials(username, password);
    await this.expectDashboardLoaded();
  }

  async expectInvalidLogin(): Promise<void> {
    await this.runStep('Verify invalid-login feedback', async () => {
      await this.loginPage.expectInvalidCredentials();
      await this.expectUrl(/\/auth\/login/);
    });
  }

  async openDashboard(): Promise<void> {
    await this.runStep('Open the dashboard', () => this.dashboardPage.open());
  }

  async expectDashboardLoaded(): Promise<void> {
    await this.runStep('Verify the dashboard is loaded', () => this.dashboardPage.expectLoaded());
  }

  async logout(): Promise<void> {
    await this.runStep('Log out of OrangeHRM', () => this.dashboardPage.logout());
  }

  async restoreAdminSession(username: string, password: string): Promise<void> {
    await this.runStep('Restore an admin session for cleanup', async () => {
      await this.dashboardPage.logoutIfAvailable();
      await this.loginPage.open();
      await this.loginPage.submitCredentials(username, password);
      await this.dashboardPage.expectLoaded();
    });
  }

  async createEmployee(draft: EmployeeDraft): Promise<EmployeeRecord> {
    await this.runStep('Open PIM Add Employee', () => this.pimPage.openAddEmployee());
    return this.runStep('Create the isolated test employee', () => this.pimPage.createEmployee(draft));
  }

  async findEmployee(fullName: string): Promise<void> {
    await this.runStep('Open the PIM employee list', () => this.pimPage.openEmployeeList());
    await this.runStep('Find the isolated test employee', () => this.pimPage.searchEmployee(fullName));
  }

  async updateEmployeeOtherId(fullName: string, otherId: string): Promise<void> {
    await this.findEmployee(fullName);
    await this.runStep('Open the isolated test employee', () => this.pimPage.openEmployee(fullName));
    await this.runStep('Update the employee Other Id', () => this.pimPage.updateOtherId(otherId));
  }

  async deleteEmployee(fullName: string): Promise<void> {
    await this.findEmployee(fullName);
    await this.runStep('Delete only the isolated test employee', () => this.pimPage.deleteEmployee(fullName));
  }

  async expectEmployeeDeleted(employeeId: string, fullName: string): Promise<void> {
    await this.runStep('Open the PIM employee list', () => this.pimPage.openEmployeeList());
    await this.runStep('Verify the deleted employee cannot be found', () =>
      this.pimPage.expectEmployeeAbsent(employeeId, fullName),
    );
  }

  async createEssUser(draft: UserDraft): Promise<void> {
    await this.runStep('Open Admin User Management', () => this.adminPage.openUserManagement());
    await this.runStep('Open the Add User form', () => this.adminPage.openAddUser());
    await this.runStep('Create the isolated ESS user', () => this.adminPage.createEssUser(draft));
  }

  async findUser(username: string): Promise<void> {
    await this.runStep('Open Admin User Management', () => this.adminPage.openUserManagement());
    await this.runStep('Find the isolated test user', () => this.adminPage.searchUser(username));
  }

  async deleteUser(username: string): Promise<void> {
    await this.findUser(username);
    await this.runStep('Delete only the isolated test user', () => this.adminPage.deleteUser(username));
  }

  async expectUserDeleted(username: string): Promise<void> {
    await this.runStep('Open Admin User Management', () => this.adminPage.openUserManagement());
    await this.runStep('Verify the deleted user cannot be found', () => this.adminPage.expectUserAbsent(username));
  }

  async expectAdminMenuUnavailable(): Promise<void> {
    await this.runStep('Verify the ESS user has no Admin menu', () => this.adminPage.expectAdminMenuUnavailable());
  }

  async addLeaveEntitlement(employeeName: string, amount: string): Promise<LeaveEntitlement> {
    await this.runStep('Open Add Leave Entitlement', () => this.leavePage.openAddEntitlement());
    return this.runStep('Add leave entitlement for the isolated employee', () =>
      this.leavePage.addEntitlement(employeeName, amount),
    );
  }

  async deleteLeaveEntitlementIfPresent(employeeName: string, leaveType?: string): Promise<void> {
    await this.runStep('Remove the isolated employee leave entitlement if present', () =>
      this.leavePage.deleteEntitlementIfPresent(employeeName, leaveType),
    );
  }

  async applyLeave(leaveType: string, leaveDate: string): Promise<void> {
    await this.runStep('Open Apply Leave', () => this.leavePage.openApplyLeave());
    await this.runStep('Submit the isolated leave request', () => this.leavePage.applyLeave(leaveType, leaveDate));
  }

  async findLeaveRequest(employeeName: string): Promise<void> {
    await this.runStep('Open the Leave List', () => this.leavePage.openLeaveList());
    await this.runStep('Find the isolated leave request', () => this.leavePage.searchLeaveRequest(employeeName));
  }

  async approveLeaveRequest(employeeName: string): Promise<void> {
    await this.findLeaveRequest(employeeName);
    await this.runStep('Approve the isolated leave request', () => this.leavePage.approveLeaveRequest(employeeName));
  }

  async cancelLeaveRequest(employeeName: string): Promise<void> {
    await this.findLeaveRequest(employeeName);
    await this.runStep('Cancel the isolated leave request', () => this.leavePage.cancelLeaveRequest(employeeName));
  }

  async searchDirectory(fullName: string): Promise<void> {
    await this.runStep('Open the employee directory', () => this.directoryPage.open());
    await this.runStep('Find the isolated employee in Directory', () => this.directoryPage.searchEmployee(fullName));
    await this.runStep('Open the Directory employee result', () => this.directoryPage.openEmployeeCard(fullName));
  }
}
