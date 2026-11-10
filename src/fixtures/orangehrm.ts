import { test as base } from '@playwright/test';
import { OrangeHrmSteps } from '../sites/orangehrm/steps/OrangeHrmSteps.js';

type OrangeHrmFixtures = {
  orangeHrm: OrangeHrmSteps;
};

/** Supplies page-bound OrangeHRM flows to specs without global state. */
export const test = base.extend<OrangeHrmFixtures>({
  orangeHrm: async ({ page }, use) => {
    await use(new OrangeHrmSteps(page, (title, action) => test.step(title, action)));
  },
});

export { expect } from '@playwright/test';
