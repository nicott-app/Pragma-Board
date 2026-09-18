import * as Sentry from "@sentry/react";

/**
 * LoggerService
 * Centralized logging service for the application.
 * This wraps console methods but provides a single integration point
 * for external monitoring tools (e.g. Sentry).
 */
export class LoggerService {
  /**
   * Logs informational messages.
   * In production, this might be disabled or sent to a low-priority stream.
   */
  public static info(message: unknown, ...optionalParams: unknown[]): void {
    if (import.meta.env.DEV) {
      console.log(`[INFO]:`, message, ...optionalParams);
    }
  }

  /**
   * Logs warnings that don't block execution but should be noted.
   */
  public static warn(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(`[WARN]:`, message, ...optionalParams);
    if (!import.meta.env.DEV && import.meta.env.VITE_SENTRY_DSN) {
      Sentry.captureMessage(typeof message === 'string' ? message : String(message), 'warning');
    }
  }

  /**
   * Logs errors and sends them to Sentry.
   */
  public static error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(`[ERROR]:`, message, ...optionalParams);
    
    if (!import.meta.env.DEV && import.meta.env.VITE_SENTRY_DSN) {
      if (message instanceof Error) {
        Sentry.captureException(message, { extra: { optionalParams } });
      } else {
        Sentry.captureMessage(String(message), {
          level: 'error',
          extra: { optionalParams }
        });
      }
    }
  }
}
