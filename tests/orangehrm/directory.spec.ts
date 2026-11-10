import { test } from '../../src/fixtures/authenticated.js';
import { createManualCaseData } from './support/manualCaseData.js';

test('DIR-001: finds an isolated active employee in Directory @manual', async ({ authenticatedOrangeHrm }, testInfo) => {
  test.slow();
  const data = createManualCaseData(testInfo);
  let employee: Awaited<ReturnType<typeof authenticatedOrangeHrm.createEmployee>> | undefined;

  try {
    const createdEmployee = await test.step('Create the prerequisite active employee', () =>
      authenticatedOrangeHrm.createEmployee(data.employee),
    );
    employee = createdEmployee;
    await test.step('Search and open the employee in Directory', () =>
      authenticatedOrangeHrm.searchDirectory(createdEmployee.fullName),
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
