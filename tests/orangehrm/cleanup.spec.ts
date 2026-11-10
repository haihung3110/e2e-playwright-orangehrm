import { expect, test } from '../../src/fixtures/authenticated.js';
import { createManualCaseData } from './support/manualCaseData.js';

test('CLEANUP-002: deletes only the employee created by this test @manual', async ({ authenticatedOrangeHrm }, testInfo) => {
  test.slow();
  const data = createManualCaseData(testInfo);
  let employee: Awaited<ReturnType<typeof authenticatedOrangeHrm.createEmployee>> | undefined;
  let employeeDeleted = false;

  try {
    const createdEmployee = await test.step('Create an employee for cleanup verification', () =>
      authenticatedOrangeHrm.createEmployee(data.employee),
    );
    employee = createdEmployee;
    await test.step('Delete and re-search the exact test employee', async () => {
      await authenticatedOrangeHrm.deleteEmployee(createdEmployee.fullName);
      employeeDeleted = true;
      await authenticatedOrangeHrm.expectEmployeeDeleted(createdEmployee.employeeId, createdEmployee.fullName);
    });
  } finally {
    if (employee && !employeeDeleted) {
      const employeeToCleanup = employee;
      await test.step('Cleanup an employee left by a failed assertion', () =>
        authenticatedOrangeHrm.deleteEmployee(employeeToCleanup.fullName),
      );
    }
  }
  expect(employee).toBeDefined();
});
