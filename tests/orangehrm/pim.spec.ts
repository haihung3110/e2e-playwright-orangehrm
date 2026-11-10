import { expect, test } from '../../src/fixtures/authenticated.js';
import { createManualCaseData } from './support/manualCaseData.js';

test.describe('OrangeHRM PIM manual cases', () => {
  test('PIM-001: creates an isolated employee @manual', async ({ authenticatedOrangeHrm }, testInfo) => {
    test.slow();
    const data = createManualCaseData(testInfo);
    let employee: Awaited<ReturnType<typeof authenticatedOrangeHrm.createEmployee>> | undefined;

    try {
      const createdEmployee = await test.step('Create a new employee with generated data', () =>
        authenticatedOrangeHrm.createEmployee(data.employee),
      );
      employee = createdEmployee;
      await test.step('Verify the employee can be found in PIM', () =>
        authenticatedOrangeHrm.findEmployee(createdEmployee.fullName),
      );
      expect(createdEmployee.employeeId).not.toBe('');
    } finally {
      if (employee) {
        const employeeToCleanup = employee;
        await test.step('Cleanup the employee created by this test', () =>
          authenticatedOrangeHrm.deleteEmployee(employeeToCleanup.fullName),
        );
      }
    }
  });

  test('PIM-002: finds and updates an isolated employee @manual', async ({ authenticatedOrangeHrm }, testInfo) => {
    test.slow();
    const data = createManualCaseData(testInfo);
    let employee: Awaited<ReturnType<typeof authenticatedOrangeHrm.createEmployee>> | undefined;

    try {
      const createdEmployee = await test.step('Create the prerequisite employee', () =>
        authenticatedOrangeHrm.createEmployee(data.employee),
      );
      employee = createdEmployee;
      await test.step('Update Other Id and verify it after reload', () =>
        authenticatedOrangeHrm.updateEmployeeOtherId(createdEmployee.fullName, data.otherId),
      );
      await test.step('Find the updated employee again', () =>
        authenticatedOrangeHrm.findEmployee(createdEmployee.fullName),
      );
    } finally {
      if (employee) {
        const employeeToCleanup = employee;
        await test.step('Cleanup the employee created by this test', () =>
          authenticatedOrangeHrm.deleteEmployee(employeeToCleanup.fullName),
        );
      }
    }
  });
});
