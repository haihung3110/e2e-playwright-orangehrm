import { env } from '../config/env.js';
import { OrangeHrmSteps } from '../sites/orangehrm/steps/OrangeHrmSteps.js';
import { test as base } from './orangehrm.js';

type E2EFixtures = {
  authenticatedOrangeHrm: OrangeHrmSteps;
};

export const test = base.extend<E2EFixtures>({
  authenticatedOrangeHrm: async ({ orangeHrm }, use) => {
    await orangeHrm.loginAndExpectDashboard(env.username(), env.password());
    await use(orangeHrm);
  },
});

export { expect } from '@playwright/test';
