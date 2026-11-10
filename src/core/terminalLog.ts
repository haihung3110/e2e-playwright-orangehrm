export enum LogLevel {
  VERBOSE = 'verbose',
}

const sensitiveValuePatterns = [
  /(authorization\s*[:=]\s*)(?:bearer\s+)?[^\s,;]+/gi,
  /((?:access[_-]?token|refresh[_-]?token|api[_-]?key|password|token)\s*[:=]\s*["']?)[^"'\s,;}]+/gi,
];

/** Removes common credential values before a message reaches the terminal or report. */
export function scrubMessage(message: string): string {
  return sensitiveValuePatterns.reduce(
    (scrubbedMessage, pattern) => scrubbedMessage.replace(pattern, '$1[REDACTED]'),
    message,
  );
}

/**
 * Emits a consistently formatted API log. TerminalReporter recognizes the `API:`
 * prefix and renders it as a dedicated API log line during Playwright runs.
 */
export function printPrettyDescription(
  description: string,
  loggingEnabled = true,
  url?: string,
): string {
  const cleanedDescription = scrubMessage(description);
  const verboseLogging = process.env.LOG_LEVEL?.toLowerCase() === LogLevel.VERBOSE;

  if (loggingEnabled || verboseLogging) {
    const message = url
      ? `API: ${cleanedDescription} :: ${url}`
      : `API: ${cleanedDescription}`;
    console.log(message);
  }

  return cleanedDescription;
}
