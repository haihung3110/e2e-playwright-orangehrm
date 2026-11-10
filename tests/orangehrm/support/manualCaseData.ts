import type { TestInfo } from '@playwright/test';
import type { EmployeeDraft, UserDraft } from '../../../src/sites/orangehrm/steps/OrangeHrmSteps.js';

export type ManualCaseData = {
  employee: EmployeeDraft;
  otherId: string;
  user: Omit<UserDraft, 'employeeName'>;
  leaveDate: string;
};

/**
 * Every automated manual case gets distinct data so cleanup never targets demo
 * records. The password is deliberately never interpolated into a test title.
 */
export function createManualCaseData(testInfo: TestInfo): ManualCaseData {
  const runId = `${Date.now().toString(36)}-${testInfo.workerIndex}-${testInfo.retry}`;
  const prefix = `E2E-MANUAL-${runId}`;

  return {
    employee: {
      firstName: prefix,
      lastName: 'Employee',
      // The demo's prefilled sequential ID can already belong to another record.
      employeeId: `${Date.now().toString().slice(-9)}${testInfo.workerIndex}`,
    },
    otherId: `OTHER-${runId}`,
    user: {
      username: `${prefix}-user`,
      password: `E2e!9${runId}a`,
    },
    leaveDate: nextWeekday(35),
  };
}

function nextWeekday(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }

  return date.toISOString().slice(0, 10);
}
