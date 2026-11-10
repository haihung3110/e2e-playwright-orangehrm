import { expect, test } from '../../src/fixtures/authenticated.js';
import type { TestInfo } from '@playwright/test';
import { env } from '../../src/config/env.js';
import type { EmployeeRecord, OrangeHrmSteps } from '../../src/sites/orangehrm/steps/OrangeHrmSteps.js';
import { attemptCleanup, cleanupFailureMessage } from './support/cleanup.js';
import { createManualCaseData } from './support/manualCaseData.js';

type LeaveCleanupInput = {
  steps: OrangeHrmSteps;
  testInfo: TestInfo;
  primaryFailure: unknown;
  employee?: EmployeeRecord;
  username: string;
  userCreated: boolean;
  leaveSubmitted: boolean;
  entitlementMayExist: boolean;
  leaveType?: string;
};

async function cleanupLeaveCase({
  steps,
  testInfo,
  primaryFailure,
  employee,
  username,
  userCreated,
  leaveSubmitted,
  entitlementMayExist,
  leaveType,
}: LeaveCleanupInput): Promise<void> {
  const cleanupErrors: Error[] = [];
  let adminSessionRestored = !userCreated;

  if (userCreated) {
    await attemptCleanup(cleanupErrors, () =>
      test.step('Restore Admin before cleanup', async () => {
        await steps.restoreAdminSession(env.username(), env.password());
        adminSessionRestored = true;
      }),
    );
  }

  if (!adminSessionRestored) {
    cleanupErrors.push(new Error('Admin session was not restored; administrative cleanup was not attempted.'));
  } else {
    if (leaveSubmitted && employee) {
      const employeeWithOutstandingLeave = employee;
      await attemptCleanup(cleanupErrors, () =>
        test.step('Cancel a leave request left by a failed assertion', () =>
          steps.cancelLeaveRequest(employeeWithOutstandingLeave.fullName),
        ),
      );
    }
    if (entitlementMayExist && employee) {
      const employeeWithEntitlement = employee;
      await attemptCleanup(cleanupErrors, () =>
        test.step('Remove the isolated employee entitlement', () =>
          steps.deleteLeaveEntitlementIfPresent(employeeWithEntitlement.fullName, leaveType),
        ),
      );
    }
    if (userCreated) {
      await attemptCleanup(cleanupErrors, () =>
        test.step('Cleanup the user created by this test', () => steps.deleteUser(username)),
      );
    }
    if (employee) {
      const employeeToCleanup = employee;
      await attemptCleanup(cleanupErrors, () =>
        test.step('Cleanup the employee created by this test', () => steps.deleteEmployee(employeeToCleanup.fullName)),
      );
    }
  }

  if (cleanupErrors.length) {
    const message = cleanupFailureMessage(cleanupErrors);
    if (primaryFailure) {
      await testInfo.attach('cleanup-failures', { body: message, contentType: 'text/plain' });
      console.error(message);
    } else {
      throw new Error(message);
    }
  }
}

test.describe('OrangeHRM Leave manual cases', () => {
  test('LEAVE-001: adds entitlement to an isolated employee @manual', async ({ authenticatedOrangeHrm }, testInfo) => {
    test.slow();
    const data = createManualCaseData(testInfo);
    let employee: Awaited<ReturnType<typeof authenticatedOrangeHrm.createEmployee>> | undefined;
    let entitlementMayExist = false;
    let leaveType: string | undefined;
    let primaryFailure: unknown;

    try {
      const createdEmployee = await test.step('Create the prerequisite employee', () =>
        authenticatedOrangeHrm.createEmployee(data.employee),
      );
      employee = createdEmployee;
      entitlementMayExist = true;
      const entitlement = await test.step('Add a one-day leave entitlement', () =>
        authenticatedOrangeHrm.addLeaveEntitlement(createdEmployee.fullName, '1'),
      );
      leaveType = entitlement.leaveType;
      expect(entitlement.amount).toBe('1');
      expect(entitlement.leaveType).not.toBe('');
    } catch (error) {
      primaryFailure = error;
      throw error;
    } finally {
      await cleanupLeaveCase({
        steps: authenticatedOrangeHrm,
        testInfo,
        primaryFailure,
        employee,
        username: data.user.username,
        userCreated: false,
        leaveSubmitted: false,
        entitlementMayExist,
        leaveType,
      });
    }
  });

  test('LEAVE-002: applies then cancels leave for an isolated ESS user @manual', async ({ authenticatedOrangeHrm }, testInfo) => {
    test.slow();
    const data = createManualCaseData(testInfo);
    let employee: Awaited<ReturnType<typeof authenticatedOrangeHrm.createEmployee>> | undefined;
    let userCreated = false;
    let leaveSubmitted = false;
    let entitlementMayExist = false;
    let leaveType: string | undefined;
    let primaryFailure: unknown;

    try {
      const readyData = await test.step('Create an employee, ESS user, and entitlement', async () => {
        const createdEmployee = await authenticatedOrangeHrm.createEmployee(data.employee);
        await authenticatedOrangeHrm.createEssUser({ ...data.user, employeeName: createdEmployee.fullName });
        userCreated = true;
        entitlementMayExist = true;
        const entitlement = await authenticatedOrangeHrm.addLeaveEntitlement(createdEmployee.fullName, '1');
        return { createdEmployee, entitlement };
      });
      employee = readyData.createdEmployee;
      leaveType = readyData.entitlement.leaveType;
      await test.step('Log in as the employee and submit leave', async () => {
        await authenticatedOrangeHrm.logout();
        await authenticatedOrangeHrm.loginAndExpectDashboard(data.user.username, data.user.password);
        await authenticatedOrangeHrm.applyLeave(readyData.entitlement.leaveType, data.leaveDate);
        leaveSubmitted = true;
      });
      await test.step('Return to admin and clean the leave request', async () => {
        await authenticatedOrangeHrm.logout();
        await authenticatedOrangeHrm.loginAndExpectDashboard(env.username(), env.password());
        await authenticatedOrangeHrm.cancelLeaveRequest(readyData.createdEmployee.fullName);
        leaveSubmitted = false;
      });
    } catch (error) {
      primaryFailure = error;
      throw error;
    } finally {
      await cleanupLeaveCase({
        steps: authenticatedOrangeHrm,
        testInfo,
        primaryFailure,
        employee,
        username: data.user.username,
        userCreated,
        leaveSubmitted,
        entitlementMayExist,
        leaveType,
      });
    }
  });

  test('LEAVE-003: approves then cancels an isolated leave request @manual', async ({ authenticatedOrangeHrm }, testInfo) => {
    test.slow();
    const data = createManualCaseData(testInfo);
    let employee: Awaited<ReturnType<typeof authenticatedOrangeHrm.createEmployee>> | undefined;
    let userCreated = false;
    let leaveSubmitted = false;
    let entitlementMayExist = false;
    let leaveType: string | undefined;
    let primaryFailure: unknown;

    try {
      const readyData = await test.step('Create the employee, ESS user, and entitlement prerequisites', async () => {
        const createdEmployee = await authenticatedOrangeHrm.createEmployee(data.employee);
        await authenticatedOrangeHrm.createEssUser({ ...data.user, employeeName: createdEmployee.fullName });
        userCreated = true;
        entitlementMayExist = true;
        const entitlement = await authenticatedOrangeHrm.addLeaveEntitlement(createdEmployee.fullName, '1');
        return { createdEmployee, entitlement };
      });
      employee = readyData.createdEmployee;
      leaveType = readyData.entitlement.leaveType;
      await test.step('Submit a leave request as the isolated ESS user', async () => {
        await authenticatedOrangeHrm.logout();
        await authenticatedOrangeHrm.loginAndExpectDashboard(data.user.username, data.user.password);
        await authenticatedOrangeHrm.applyLeave(readyData.entitlement.leaveType, data.leaveDate);
        leaveSubmitted = true;
      });
      await test.step('Approve and then cancel the exact leave request as admin', async () => {
        await authenticatedOrangeHrm.logout();
        await authenticatedOrangeHrm.loginAndExpectDashboard(env.username(), env.password());
        await authenticatedOrangeHrm.approveLeaveRequest(readyData.createdEmployee.fullName);
        await authenticatedOrangeHrm.cancelLeaveRequest(readyData.createdEmployee.fullName);
        leaveSubmitted = false;
      });
    } catch (error) {
      primaryFailure = error;
      throw error;
    } finally {
      await cleanupLeaveCase({
        steps: authenticatedOrangeHrm,
        testInfo,
        primaryFailure,
        employee,
        username: data.user.username,
        userCreated,
        leaveSubmitted,
        entitlementMayExist,
        leaveType,
      });
    }
  });
});
