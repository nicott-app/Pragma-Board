/**
 * LoggerService
 * Centralized logging service for the application.
 * This wraps console methods but provides a single integration point
 * for external monitoring tools (e.g. Firebase Crashlytics, Sentry) in the future.
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
  }

  /**
   * Logs errors.
   * TODO: Connect this to Firebase Crashlytics or external error tracker.
   */
  public static error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(`[ERROR]:`, message, ...optionalParams);
    
    // Example of future integration:
    // if (!import.meta.env.DEV) {
    //   Crashlytics.recordError(message, optionalParams);
    // }
  }
}
