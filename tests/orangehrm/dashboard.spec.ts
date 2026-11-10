import { test } from '../../src/fixtures/authenticated.js';

test('logs in and loads the dashboard @smoke', async ({ authenticatedOrangeHrm }) => {
  await authenticatedOrangeHrm.expectDashboardLoaded();
});
