import { test } from '../../src/fixtures/orangehrm.js';
import { env } from '../../src/config/env.js';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('OrangeHRM login', () => {
  test('TEST-0001:renders the login form @smoke', async ({ orangeHrm }) => {
    await test.step('Open and verify the login form', async () => {
      await orangeHrm.openLoginPage();
      await orangeHrm.expectLoginForm();
    });
  });

  test('TEST-0002: logs in with valid environment credentials @smoke', async ({ orangeHrm }) => {
    await test.step('Log in with valid credentials', async () => {
      await orangeHrm.loginAndExpectDashboard(env.username(), env.password());
    });
  });

  test('TEST-0003: rejects invalid credentials @smoke', async ({ orangeHrm }) => {
    await test.step('Reject invalid credentials', async () => {
      await orangeHrm.openLoginPage();
      await orangeHrm.submitCredentials('invalid-user', 'invalid-password');
      await orangeHrm.expectInvalidLogin();
    });
  });
});
