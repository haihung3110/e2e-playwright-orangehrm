import { test } from '../../src/fixtures/authenticated.js';
import { env } from '../../src/config/env.js';
import { attemptCleanup, cleanupFailureMessage } from './support/cleanup.js';
import { createManualCaseData } from './support/manualCaseData.js';

test.describe('OrangeHRM Admin manual cases', () => {
  test('ADMIN-001: creates and finds an ESS user linked to an isolated employee @manual', async ({ authenticatedOrangeHrm }, testInfo) => {
    test.slow();
    const data = createManualCaseData(testInfo);
    let employee: Awaited<ReturnType<typeof authenticatedOrangeHrm.createEmployee>> | undefined;
    let userCreated = false;
    let primaryFailure: unknown;

    try {
      const createdEmployee = await test.step('Create the prerequisite employee', () =>
        authenticatedOrangeHrm.createEmployee(data.employee),
      );
      employee = createdEmployee;
      await test.step('Create a linked ESS user', async () => {
        await authenticatedOrangeHrm.createEssUser({ ...data.user, employeeName: createdEmployee.fullName });
        userCreated = true;
      });
      await test.step('Find the new user by its exact username', () =>
        authenticatedOrangeHrm.findUser(data.user.username),
      );
    } catch (error) {
      primaryFailure = error;
      throw error;
    } finally {
      const cleanupErrors: Error[] = [];
      let adminSessionRestored = !userCreated;

      if (userCreated) {
        await attemptCleanup(cleanupErrors, () =>
          test.step('Restore Admin before cleanup', async () => {
            await authenticatedOrangeHrm.restoreAdminSession(env.username(), env.password());
            adminSessionRestored = true;
          }),
        );
      }

      if (adminSessionRestored && userCreated) {
        await attemptCleanup(cleanupErrors, () =>
          test.step('Cleanup the user created by this test', () =>
            authenticatedOrangeHrm.deleteUser(data.user.username),
          ),
        );
      }
      if (adminSessionRestored && employee) {
        const employeeToCleanup = employee;
        await attemptCleanup(cleanupErrors, () =>
          test.step('Cleanup the employee created by this test', () =>
            authenticatedOrangeHrm.deleteEmployee(employeeToCleanup.fullName),
          ),
        );
      }
      if (!adminSessionRestored) {
        cleanupErrors.push(new Error('Admin session was not restored; administrative cleanup was not attempted.'));
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
  });

  test('ADMIN-002: logs in as an isolated ESS user and checks access @manual', async ({ authenticatedOrangeHrm }, testInfo) => {
    test.slow();
    const data = createManualCaseData(testInfo);
    let employee: Awaited<ReturnType<typeof authenticatedOrangeHrm.createEmployee>> | undefined;
    let userCreated = false;
    let primaryFailure: unknown;

    try {
      const createdEmployee = await test.step('Create the employee and linked ESS user prerequisites', async () => {
        const newEmployee = await authenticatedOrangeHrm.createEmployee(data.employee);
        await authenticatedOrangeHrm.createEssUser({ ...data.user, employeeName: newEmployee.fullName });
        userCreated = true;
        return newEmployee;
      });
      employee = createdEmployee;
      await test.step('Log in as the isolated ESS user', async () => {
        await authenticatedOrangeHrm.logout();
        await authenticatedOrangeHrm.loginAndExpectDashboard(data.user.username, data.user.password);
        await authenticatedOrangeHrm.expectAdminMenuUnavailable();
      });
      await test.step('Return to the admin session for cleanup', async () => {
        await authenticatedOrangeHrm.logout();
        await authenticatedOrangeHrm.loginAndExpectDashboard(env.username(), env.password());
      });
    } catch (error) {
      primaryFailure = error;
      throw error;
    } finally {
      const cleanupErrors: Error[] = [];
      let adminSessionRestored = !userCreated;

      if (userCreated) {
        await attemptCleanup(cleanupErrors, () =>
          test.step('Restore Admin before cleanup', async () => {
            await authenticatedOrangeHrm.restoreAdminSession(env.username(), env.password());
            adminSessionRestored = true;
          }),
        );
      }

      if (adminSessionRestored && userCreated) {
        await attemptCleanup(cleanupErrors, () =>
          test.step('Cleanup the user created by this test', () =>
            authenticatedOrangeHrm.deleteUser(data.user.username),
          ),
        );
      }
      if (adminSessionRestored && employee) {
        const employeeToCleanup = employee;
        await attemptCleanup(cleanupErrors, () =>
          test.step('Cleanup the employee created by this test', () =>
            authenticatedOrangeHrm.deleteEmployee(employeeToCleanup.fullName),
          ),
        );
      }
      if (!adminSessionRestored) {
        cleanupErrors.push(new Error('Admin session was not restored; administrative cleanup was not attempted.'));
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
  });
});

test('CLEANUP-001: deletes only the user created by this test @manual', async ({ authenticatedOrangeHrm }, testInfo) => {
  test.slow();
  const data = createManualCaseData(testInfo);
  let employee: Awaited<ReturnType<typeof authenticatedOrangeHrm.createEmployee>> | undefined;
  let userCreated = false;
  let primaryFailure: unknown;

  try {
    const createdEmployee = await test.step('Create an employee and user for cleanup verification', async () => {
      const createdEmployee = await authenticatedOrangeHrm.createEmployee(data.employee);
      await authenticatedOrangeHrm.createEssUser({ ...data.user, employeeName: createdEmployee.fullName });
      userCreated = true;
      return createdEmployee;
    });
    employee = createdEmployee;
    await test.step('Delete and re-search the exact test user', async () => {
      await authenticatedOrangeHrm.deleteUser(data.user.username);
      userCreated = false;
      await authenticatedOrangeHrm.expectUserDeleted(data.user.username);
    });
  } catch (error) {
    primaryFailure = error;
    throw error;
  } finally {
    const cleanupErrors: Error[] = [];
    let adminSessionRestored = !userCreated;

    if (userCreated) {
      await attemptCleanup(cleanupErrors, () =>
        test.step('Restore Admin before cleanup', async () => {
          await authenticatedOrangeHrm.restoreAdminSession(env.username(), env.password());
          adminSessionRestored = true;
        }),
      );
    }

    if (adminSessionRestored && userCreated) {
      await attemptCleanup(cleanupErrors, () =>
        test.step('Cleanup a user left by a failed assertion', () =>
          authenticatedOrangeHrm.deleteUser(data.user.username),
        ),
      );
    }
    if (adminSessionRestored && employee) {
      const employeeToCleanup = employee;
      await attemptCleanup(cleanupErrors, () =>
        test.step('Cleanup the employee created by this test', () =>
          authenticatedOrangeHrm.deleteEmployee(employeeToCleanup.fullName),
        ),
      );
    }
    if (!adminSessionRestored) {
      cleanupErrors.push(new Error('Admin session was not restored; administrative cleanup was not attempted.'));
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
});
