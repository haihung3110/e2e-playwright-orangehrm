export async function attemptCleanup(
  errors: Error[],
  action: () => Promise<void>,
): Promise<void> {
  try {
    await action();
  } catch (error) {
    errors.push(error instanceof Error ? error : new Error(String(error)));
  }
}

export function cleanupFailureMessage(errors: Error[]): string {
  return `Cleanup could not complete:\n${errors.map((error) => error.message).join('\n\n')}`;
}
