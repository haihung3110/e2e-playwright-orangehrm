import type {
  FullResult,
  Reporter,
  TestCase,
  TestResult,
  TestStep,
} from '@playwright/test/reporter';

/** Concise, step-oriented terminal output for local Playwright runs. */
class TerminalReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;

  onTestBegin(test: TestCase, result: TestResult): void {
    const retry = result.retry > 0 ? ` (retry ${result.retry})` : '';
    console.log(`\n▶ RUN  ${test.titlePath().slice(1).join(' › ')}${retry}`);
  }

  onStepBegin(_test: TestCase, _result: TestResult, step: TestStep): void {
    if (step.category !== 'test.step') return;

    console.log(`${this.indent(step)}↳ ${step.title}`);
  }

  onStepEnd(_test: TestCase, _result: TestResult, step: TestStep): void {
    if (step.category !== 'test.step') return;

    const icon = step.error ? '✖' : '✓';
    console.log(`${this.indent(step)}${icon} ${step.title} (${this.duration(step.duration)})`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const iconByStatus: Record<TestResult['status'], string> = {
      passed: '✓ PASS',
      failed: '✖ FAIL',
      timedOut: '✖ TIMEOUT',
      skipped: '– SKIP',
      interrupted: '✖ INTERRUPTED',
    };

    if (result.status === 'passed') this.passed += 1;
    else if (result.status === 'skipped') this.skipped += 1;
    else this.failed += 1;

    console.log(`${iconByStatus[result.status]} ${test.titlePath().slice(1).join(' › ')} (${this.duration(result.duration)})`);
    this.printFailureDetails(result);
  }

  onStdOut(chunk: string | Buffer): void {
    this.printOutput('LOG', chunk);
  }

  onStdErr(chunk: string | Buffer): void {
    this.printOutput('ERROR', chunk);
  }

  onEnd(result: FullResult): void {
    console.log(`\nResult: ${this.passed} passed, ${this.failed} failed, ${this.skipped} skipped (${this.duration(result.duration)})`);
  }

  private indent(step: TestStep): string {
    let depth = 1;
    let parent = step.parent;
    while (parent) {
      if (parent.category === 'test.step') depth += 1;
      parent = parent.parent;
    }
    return '  '.repeat(depth);
  }

  private duration(milliseconds: number): string {
    return `${(milliseconds / 1000).toFixed(1)}s`;
  }

  private printFailureDetails(result: TestResult): void {
    const error = result.error;
    if (!error) return;

    const details = error.message ?? error.value;
    if (!details) return;

    console.log('  Failure details:');
    for (const line of details.trim().split('\n')) {
      console.log(`    ${line}`);
    }

    if (error.snippet && !details.includes(error.snippet)) {
      console.log('  Source:');
      for (const line of error.snippet.trim().split('\n')) {
        console.log(`    ${line}`);
      }
    }
  }

  private printOutput(label: 'LOG' | 'ERROR', chunk: string | Buffer): void {
    const text = chunk.toString().trim();
    if (!text) return;

    for (const line of text.split('\n')) {
      const prefix = line.startsWith('API:') ? '' : `${label}: `;
      console.log(`  ${prefix}${line}`);
    }
  }
}

export default TerminalReporter;
